import uuid
from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import BackgroundTasks, FastAPI, File, Form, UploadFile, status
from src.exceptions import JobNotFoundError, register_exception_handlers
from src.logging_config import get_logger
from src.pipeline import run_talking_head_pipeline
from src.schemas import GenerateAvatarResponse, JobStatusResponse
from src.storage import save_job_inputs
from src.validation import (
    validate_audio_file,
    validate_image_file,
    validate_model,
)

logger = get_logger("main")

app = FastAPI(
    title="AI Talking Head Service",
    description="REST API for generating lip-synced talking head avatars",
    version="1.0.0",
)

# Register custom exception handlers for consistent JSON errors & logging
register_exception_handlers(app)

# In-memory job state store
jobs_db: Dict[str, Dict[str, Any]] = {}


@app.get("/")
def read_root():
    logger.info("Health check endpoint 'GET /' called.")
    return {"name": "AI Talking Head Service", "status": "healthy"}


@app.post(
    "/api/v1/avatar/generate",
    response_model=GenerateAvatarResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def generate_avatar(
    background_tasks: BackgroundTasks,
    face_image: UploadFile = File(...),
    audio: UploadFile = File(...),
    model: str = Form("latentsync"),
    enhancer: bool = Form(True),
):
    logger.info(
        f"Received avatar generation request: "
        f"image='{face_image.filename if face_image else None}', "
        f"audio='{audio.filename if audio else None}', "
        f"model='{model}', enhancer={enhancer}"
    )

    # Step 1: Request parameter validation
    validated_model = validate_model(model)
    img_bytes = await validate_image_file(face_image)
    audio_bytes = await validate_audio_file(audio)

    # Step 2: Generate unique job ID & timestamp
    job_id = f"job_{uuid.uuid4().hex[:12]}"
    created_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    # Step 3: Safe file persistence before request completes
    saved_paths = save_job_inputs(
        job_id=job_id,
        image_filename=face_image.filename or "face.jpg",
        image_bytes=img_bytes,
        audio_filename=audio.filename or "voice.wav",
        audio_bytes=audio_bytes,
    )

    # Step 4: Record initial job state in jobs_db
    jobs_db[job_id] = {
        "job_id": job_id,
        "status": "queued",
        "progress": 0.0,
        "estimated_time_remaining": 30.0,
        "created_at": created_at,
        "completed_at": None,
        "output_url": None,
        "error_message": None,
    }

    # Step 5: Dispatch background task (using saved file paths, not UploadFile)
    background_tasks.add_task(
        run_talking_head_pipeline,
        job_id,
        saved_paths["image_path"],
        saved_paths["audio_path"],
        validated_model,
        enhancer,
        jobs_db,
    )

    logger.info(f"Successfully queued job {job_id}")

    return GenerateAvatarResponse(
        job_id=job_id,
        status="queued",
        created_at=created_at,
        message="Avatar rendering job successfully queued.",
    )


@app.get("/api/v1/avatar/jobs/{job_id}", response_model=JobStatusResponse)
def get_job_status(job_id: str):
    logger.info(f"Querying job status for job_id='{job_id}'")
    if job_id not in jobs_db:
        logger.warning(f"Job status query failed: job '{job_id}' not found.")
        raise JobNotFoundError(job_id)

    return JobStatusResponse(**jobs_db[job_id])
