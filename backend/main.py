"""FastAPI entry point for the Consent Drift APK analyzer.

This file connects an uploaded APK file to the analyzer logic in
analyzer.py by saving the uploaded file to the backend uploads folder,
passing the saved path to analyze_apk(), and then returning the JSON result.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

# Import the APK analysis function from the analyzer module.
# The route below passes the saved APK path into this function.
from analyzer import analyze_apk


# Set up the backend folder locations.
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "output"

# Make sure the required folders exist before saving files.
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Consent Drift APK Analyzer")

# Configure CORS so the frontend can connect without browser origin errors.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> Dict[str, str]:
    """Simple health check endpoint for the backend."""
    return {"message": "Consent Drift APK Analyzer is running"}


@app.post("/analyze")
async def analyze_apk_endpoint(file: UploadFile = File(...)) -> Dict[str, Any]:
    """Upload an APK, analyze it, save the result, and return the JSON."""
    if file is None or file.filename in (None, ""):
        raise HTTPException(status_code=400, detail="No APK file was uploaded.")

    # A basic file check to reject obvious non-APK uploads early.
    filename = Path(file.filename).name
    if not filename.lower().endswith(".apk"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a valid Android APK file.",
        )

    temp_apk_path = UPLOAD_DIR / filename

    try:
        # Save the uploaded file into the temporary uploads folder.
        with open(temp_apk_path, "wb") as uploaded_file:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                uploaded_file.write(chunk)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save uploaded APK: {exc}",
        ) from exc

    try:
        # This is the key connection between the uploaded file and the analyzer:
        # we pass the saved APK path to analyze_apk(), which reads the manifest
        # and returns the required dictionary data.
        result = analyze_apk(str(temp_apk_path))
    except (FileNotFoundError, ValueError, ImportError) as exc:
        raise HTTPException(
            status_code=400,
            detail=f"APK analysis failed: {exc}",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected APK analysis error: {exc}",
        ) from exc
    finally:
        # Clean up the temporary upload after analysis so the uploads folder does
        # not keep unnecessary files.
        try:
            if temp_apk_path.exists():
                temp_apk_path.unlink()
        except Exception:
            # Do not fail the request just because cleanup is not possible.
            pass

    # Save the analysis result in valid JSON format in the backend output folder.
    output_path = OUTPUT_DIR / "permissions.json"
    try:
        with open(output_path, "w", encoding="utf-8") as output_file:
            json.dump(result, output_file, indent=2, ensure_ascii=False)
            output_file.write("\n")
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save analysis output JSON: {exc}",
        ) from exc

    # Return the same JSON data to the API caller.
    return result
