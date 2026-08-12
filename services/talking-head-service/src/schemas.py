from typing import Optional

from pydantic import BaseModel, Field


class GenerateAvatarResponse(BaseModel):
    job_id: str = Field(..., description="Unique job identifier")
    status: str = Field(..., description="Initial job status (e.g. queued)")
    created_at: str = Field(..., description="ISO timestamp of job creation")
    message: str = Field(..., description="Human readable job creation status message")


class JobStatusResponse(BaseModel):
    job_id: str = Field(..., description="Unique job identifier")
    status: str = Field(
        ...,
        description="Current job status (queued, processing, completed, failed)",
    )
    progress: float = Field(
        0.0, description="Job completion progress percentage (0-100)"
    )
    estimated_time_remaining: float = Field(
        0.0, description="Estimated time remaining in seconds"
    )
    created_at: str = Field(..., description="ISO timestamp of job creation")
    completed_at: Optional[str] = Field(
        None, description="ISO timestamp of job completion or failure"
    )
    output_url: Optional[str] = Field(
        None, description="URL of generated video output if completed"
    )
    error_message: Optional[str] = Field(
        None, description="Details of failure if job failed"
    )


class ErrorResponse(BaseModel):
    detail: str = Field(..., description="User facing error details")
    error_code: str = Field(..., description="Machine readable error code")
    timestamp: str = Field(..., description="ISO timestamp of when the error occurred")
