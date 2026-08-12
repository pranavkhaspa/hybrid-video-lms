import io
import sys
import wave
from pathlib import Path

# Add talking-head-service root to sys.path for repo-root execution
SERVICE_DIR = Path(__file__).resolve().parent.parent
if str(SERVICE_DIR) not in sys.path:
    sys.path.insert(0, str(SERVICE_DIR))

import cv2  # noqa: E402
import numpy as np  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from src.main import app, jobs_db  # noqa: E402
from src.pipeline import (  # noqa: E402
    run_talking_head_pipeline,
    validate_video_output,
)

client = TestClient(app)


def get_valid_image_bytes() -> bytes:
    """Generates a small valid PNG image in memory using OpenCV."""
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    cv2.putText(
        img,
        "Test Face",
        (10, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.4,
        (255, 255, 255),
        1,
    )
    _, encoded = cv2.imencode(".png", img)
    return encoded.tobytes()


def get_valid_wav_bytes() -> bytes:
    """Generates a small valid WAV audio file in memory."""
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(16000)
        wav_file.writeframes(b"\x00\x00" * 3200)  # 0.1 second of silence
    return buf.getvalue()


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "AI Talking Head Service"
    assert data["status"] == "healthy"


def test_generate_avatar_success_job_creation():
    img_bytes = get_valid_image_bytes()
    wav_bytes = get_valid_wav_bytes()

    files = {
        "face_image": ("portrait.png", img_bytes, "image/png"),
        "audio": ("speech.wav", wav_bytes, "audio/wav"),
    }
    data = {"model": "latentsync", "enhancer": "true"}

    response = client.post("/api/v1/avatar/generate", files=files, data=data)
    assert response.status_code == 202

    body = response.json()
    assert "job_id" in body
    assert body["status"] == "queued"
    assert "created_at" in body
    assert body["message"] == "Avatar rendering job successfully queued."

    # Check job status query
    job_id = body["job_id"]
    status_resp = client.get(f"/api/v1/avatar/jobs/{job_id}")
    assert status_resp.status_code == 200
    status_body = status_resp.json()
    assert status_body["job_id"] == job_id
    assert status_body["status"] in ["queued", "processing", "failed"]


def test_generate_missing_image():
    wav_bytes = get_valid_wav_bytes()
    files = {"audio": ("speech.wav", wav_bytes, "audio/wav")}
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 422
    assert "error_code" in response.json()


def test_generate_missing_audio():
    img_bytes = get_valid_image_bytes()
    files = {"face_image": ("portrait.png", img_bytes, "image/png")}
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 422
    assert "error_code" in response.json()


def test_generate_empty_image():
    wav_bytes = get_valid_wav_bytes()
    files = {
        "face_image": ("portrait.png", b"", "image/png"),
        "audio": ("speech.wav", wav_bytes, "audio/wav"),
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "EMPTY_FILE"


def test_generate_empty_audio():
    img_bytes = get_valid_image_bytes()
    files = {
        "face_image": ("portrait.png", img_bytes, "image/png"),
        "audio": ("speech.wav", b"", "audio/wav"),
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "EMPTY_FILE"


def test_generate_corrupted_image():
    wav_bytes = get_valid_wav_bytes()
    files = {
        "face_image": ("portrait.png", b"not an image data", "image/png"),
        "audio": ("speech.wav", wav_bytes, "audio/wav"),
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "CORRUPTED_IMAGE"


def test_generate_corrupted_audio():
    img_bytes = get_valid_image_bytes()
    files = {
        "face_image": ("portrait.png", img_bytes, "image/png"),
        "audio": ("speech.wav", b"invalid audio bytes data", "audio/wav"),
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "CORRUPTED_AUDIO"


def test_generate_unsupported_image_format():
    wav_bytes = get_valid_wav_bytes()
    files = {
        "face_image": ("portrait.txt", b"hello world", "text/plain"),
        "audio": ("speech.wav", wav_bytes, "audio/wav"),
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "UNSUPPORTED_IMAGE_FORMAT"


def test_generate_unsupported_audio_format():
    img_bytes = get_valid_image_bytes()
    files = {
        "face_image": ("portrait.png", img_bytes, "image/png"),
        "audio": ("speech.txt", b"hello audio", "text/plain"),
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "UNSUPPORTED_AUDIO_FORMAT"


def test_generate_unsupported_model():
    img_bytes = get_valid_image_bytes()
    files = {
        "face_image": ("portrait.png", img_bytes, "image/png"),
        "audio": ("speech.wav", get_valid_wav_bytes(), "audio/wav"),
    }
    data = {"model": "sad_talker"}
    response = client.post("/api/v1/avatar/generate", files=files, data=data)
    assert response.status_code == 400
    assert response.json()["error_code"] == "UNSUPPORTED_MODEL"


def test_generate_oversized_image():
    oversized_bytes = b"0" * (26 * 1024 * 1024)
    files = {
        "face_image": ("huge.png", oversized_bytes, "image/png"),
        "audio": ("speech.wav", get_valid_wav_bytes(), "audio/wav"),
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "FILE_TOO_LARGE"


def test_get_job_status_nonexistent():
    response = client.get("/api/v1/avatar/jobs/nonexistent_job_12345")
    assert response.status_code == 404
    assert response.json()["error_code"] == "JOB_NOT_FOUND"


def test_pipeline_controlled_failure_state():
    """Verifies pipeline transitions to failed when inference engine is absent.

    This test:
    - Submits a valid generation request
    - Directly invokes run_talking_head_pipeline (simulating background task)
    - Confirms PipelineError is raised due to missing inference engine
    - Confirms job transitions to failed with a populated error_message
    - Confirms no completed state is reached
    - Confirms no fake output_url is returned
    """
    img_bytes = get_valid_image_bytes()
    wav_bytes = get_valid_wav_bytes()

    files = {
        "face_image": ("portrait.png", img_bytes, "image/png"),
        "audio": ("speech.wav", wav_bytes, "audio/wav"),
    }
    # POST creates a queued job; TestClient runs background tasks synchronously
    # so the pipeline may have already run by the time we check. Capture job_id.
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 202
    job_id = response.json()["job_id"]
    assert job_id in jobs_db

    # Re-run the pipeline directly to ensure we observe its behaviour in test
    # (idempotent: even if already failed, this proves the contract)
    job_dir = f"storage/jobs/{job_id}/inputs"
    run_talking_head_pipeline(
        job_id,
        f"{job_dir}/image_portrait.png",
        f"{job_dir}/audio_speech.wav",
        "latentsync",
        True,
        jobs_db,
    )

    # Verify controlled failure lifecycle
    assert (
        jobs_db[job_id]["status"] == "failed"
    ), f"Expected 'failed', got '{jobs_db[job_id]['status']}'"
    assert (
        jobs_db[job_id]["error_message"] is not None
    ), "error_message must be populated on pipeline failure"
    assert len(jobs_db[job_id]["error_message"]) > 0

    # Verify the error describes the missing inference engine
    error_msg = jobs_db[job_id]["error_message"].lower()
    assert (
        "not implemented" in error_msg or "inference" in error_msg
    ), f"error_message should describe missing inference: {error_msg}"

    # Verify no completed state or fake output was produced
    assert (
        jobs_db[job_id]["status"] != "completed"
    ), "Job must not be falsely marked completed without real inference"
    assert (
        jobs_db[job_id]["output_url"] is None
    ), "output_url must be None: no real video was generated"

    # Verify completed_at records the failure timestamp
    assert (
        jobs_db[job_id]["completed_at"] is not None
    ), "completed_at should record the failure timestamp"


def test_validate_video_output_nonexistent():
    assert validate_video_output("nonexistent_file_xyz.mp4") is False


def test_validate_video_output_empty_file(tmp_path):
    empty_file = tmp_path / "empty.mp4"
    empty_file.write_bytes(b"")
    assert validate_video_output(str(empty_file)) is False
