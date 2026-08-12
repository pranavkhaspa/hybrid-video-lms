import re
from pathlib import Path

from src.config import STORAGE_DIR
from src.exceptions import StorageError
from src.logging_config import get_logger

logger = get_logger("storage")


def sanitize_filename(filename: str) -> str:
    """Sanitizes filename to prevent path traversal and unsafe characters."""
    # Extract basename only
    base_name = Path(filename).name
    # Remove any dangerous path traversal characters
    safe_name = re.sub(r"[^a-zA-Z0-9_.-]", "_", base_name)
    if not safe_name or safe_name in [".", ".."]:
        safe_name = "upload_file"
    return safe_name


def prepare_job_storage(job_id: str) -> Path:
    """Creates directory structure: storage/jobs/{job_id}/inputs/"""
    job_dir = STORAGE_DIR / job_id / "inputs"
    try:
        job_dir.mkdir(parents=True, exist_ok=True)
        return job_dir
    except Exception as e:
        logger.error(f"Failed to create job storage directory for job {job_id}: {e}")
        raise StorageError(
            f"Failed to initialize storage directory for job '{job_id}'."
        )


def save_job_inputs(
    job_id: str,
    image_filename: str,
    image_bytes: bytes,
    audio_filename: str,
    audio_bytes: bytes,
) -> dict:
    """Safely persists validated image and audio files to disk for a job."""
    inputs_dir = prepare_job_storage(job_id)

    safe_img_name = f"image_{sanitize_filename(image_filename)}"
    safe_audio_name = f"audio_{sanitize_filename(audio_filename)}"

    img_path = inputs_dir / safe_img_name
    audio_path = inputs_dir / safe_audio_name

    try:
        with open(img_path, "wb") as f_img:
            f_img.write(image_bytes)

        with open(audio_path, "wb") as f_audio:
            f_audio.write(audio_bytes)

        logger.info(
            f"Saved job inputs for {job_id}: "
            f"image='{img_path}' ({len(image_bytes)} bytes), "
            f"audio='{audio_path}' ({len(audio_bytes)} bytes)"
        )

        return {
            "image_path": str(img_path.resolve()),
            "audio_path": str(audio_path.resolve()),
        }
    except Exception as e:
        logger.error(f"Failed writing input files for job {job_id}: {e}")
        raise StorageError(f"Failed to save input files for job '{job_id}'.")
