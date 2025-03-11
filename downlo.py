from fastapi import APIRouter
from fastapi.responses import FileResponse
import os
import logging

router = APIRouter()

REPORTS_DIR = "reports"

@router.get("/download_report/{filename}")
async def download_report(filename: str):
    """Provides an endpoint for downloading generated reports."""
    file_path = os.path.join(REPORTS_DIR, filename)
    
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    
    logging.info(f"Serving report: {file_path}")
    return FileResponse(file_path, media_type='text/csv', filename=filename)
