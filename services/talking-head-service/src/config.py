from pathlib import Path

# Base directory for the talking head service
BASE_DIR = Path(__file__).resolve().parent.parent

# Storage configuration
STORAGE_DIR = BASE_DIR / "storage" / "jobs"

# File validation constraints
MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB
MAX_AUDIO_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
ALLOWED_IMAGE_MIME_TYPES = {"image/jpeg", "image/png"}

ALLOWED_AUDIO_EXTENSIONS = {".wav", ".mp3", ".ogg", ".flac", ".m4a"}
ALLOWED_AUDIO_MIME_TYPES = {
    "audio/wav",
    "audio/x-wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/ogg",
    "audio/flac",
    "audio/x-m4a",
    "audio/m4a",
}

# Models recognized by the service configuration in this repository.
# Note: latentsync is the target model referenced by the existing contract.
# No other model implementations exist in this repository.
SUPPORTED_MODELS = {"latentsync"}
