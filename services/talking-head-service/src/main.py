import os
import shutil
import subprocess
import tempfile
import uuid
from datetime import datetime
from typing import Dict, Optional

from fastapi import BackgroundTasks, FastAPI, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from src.ffmpeg_service import concatenate_videos

app = FastAPI(
    title="AI Talking Head Service",
    description="REST API for generating lip-synced talking head avatars",
    version="1.0.0",
)

# In-memory job state store
jobs_db: Dict[str, dict] = {}


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    progress: float
    estimated_time_remaining: float
    created_at: str
    completed_at: Optional[str] = None
    output_url: Optional[str] = None


def rendering_task(job_id: str, audio_path: str):
    jobs_db[job_id]["status"] = "rendering"
    jobs_db[job_id]["progress"] = 10.0

    try:
        # Simulate latentsync avatar generation creating a silent video clip
        silent_video = os.path.join(tempfile.gettempdir(), f"{job_id}_silent.mp4")

        # Create a dummy silent video using ffmpeg from a black screen (just for demonstration)
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-f",
                "lavfi",
                "-i",
                "color=c=black:s=1920x1080:r=25:d=5",
                "-c:v",
                "libx264",
                silent_video,
            ],
            check=True,
            capture_output=True,
        )

        jobs_db[job_id]["progress"] = 50.0

        output_path = os.path.join(tempfile.gettempdir(), f"{job_id}_final.mp4")

        # Call our new ffmpeg service to multiplex the audio and optimize the output
        concatenate_videos([silent_video], audio_path, output_path)

        jobs_db[job_id]["status"] = "completed"
        jobs_db[job_id]["progress"] = 100.0
        jobs_db[job_id]["output_url"] = f"/outputs/{os.path.basename(output_path)}"
        jobs_db[job_id]["completed_at"] = datetime.utcnow().isoformat() + "Z"

    except Exception as e:
        jobs_db[job_id]["status"] = "failed"

    finally:
        # Cleanup temp audio
        if os.path.exists(audio_path):
            os.remove(audio_path)


@app.get("/")
def read_root():
    return {"name": "AI Talking Head Service", "status": "healthy"}


@app.post("/api/v1/avatar/generate", status_code=202)
def generate_avatar(
    background_tasks: BackgroundTasks,
    face_image: UploadFile = File(...),
    audio: UploadFile = File(...),
    model: str = Form("latentsync"),
    enhancer: bool = Form(True),
):
    job_id = f"job_{uuid.uuid4().hex[:12]}"

    # Store initial state
    jobs_db[job_id] = {
        "job_id": job_id,
        "status": "queued",
        "progress": 0.0,
        "estimated_time_remaining": 30.0,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "completed_at": None,
        "output_url": None,
    }

    # Save uploaded audio to temp directory
    temp_dir = tempfile.gettempdir()
    audio_path = os.path.join(temp_dir, f"{job_id}_{audio.filename}")
    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    # Trigger background work with actual logic
    background_tasks.add_task(rendering_task, job_id, audio_path)

    return {
        "job_id": job_id,
        "status": "queued",
        "created_at": jobs_db[job_id]["created_at"],
        "message": "Avatar rendering job successfully queued.",
    }


@app.get("/api/v1/avatar/jobs/{job_id}", response_model=JobStatusResponse)
def get_job_status(job_id: str):
    if job_id not in jobs_db:
        raise HTTPException(status_code=404, detail="Job not found")

    return jobs_db[job_id]
