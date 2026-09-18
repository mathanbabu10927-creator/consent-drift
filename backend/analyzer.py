"""Android APK analyzer for the Consent Drift hackathon project.

This module is responsible only for reading APK metadata and Android
permissions. It does not create API routes or frontend code.
"""

from __future__ import annotations

import os
from typing import Any, Dict, Iterable, List

# Try the modern Androguard API first. Some older installs use a different
# import pattern, so we keep a compatibility fallback below.
try:
    from androguard.core.apk import APK
except ImportError:  # pragma: no cover
    APK = None

try:
    from androguard.misc import AnalyzeAPK
except ImportError:  # pragma: no cover
    AnalyzeAPK = None


# A fixed list of sensitive or privacy-related Android permissions.
# The values are stored using the full Android permission name format.
SENSITIVE_PERMISSIONS = {
    "android.permission.RECORD_AUDIO",
    "android.permission.CAMERA",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.ACCESS_COARSE_LOCATION",
    "android.permission.ACCESS_BACKGROUND_LOCATION",
    "android.permission.READ_CONTACTS",
    "android.permission.WRITE_CONTACTS",
    "android.permission.READ_CALL_LOG",
    "android.permission.WRITE_CALL_LOG",
    "android.permission.READ_SMS",
    "android.permission.SEND_SMS",
    "android.permission.READ_PHONE_STATE",
    "android.permission.CALL_PHONE",
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.WRITE_EXTERNAL_STORAGE",
}


def _safe_string(value: Any) -> str:
    """Convert values to strings without failing when the data is missing."""
    if value is None:
        return ""
    try:
        return str(value)
    except (TypeError, ValueError):
        return ""


def _safe_list(value: Any) -> List[str]:
    """Normalize permission-like values and guard against invalid input."""
    if value is None:
        return []

    try:
        if isinstance(value, (list, tuple, set)):
            return [str(item) for item in value if item is not None]
        if isinstance(value, str):
            return [value]
        if isinstance(value, Iterable):
            return [str(item) for item in value if item is not None]
    except (TypeError, ValueError):
        return []

    return []


def _load_apk_object(apk_path: str) -> Any:
    """Open the APK and return the Androguard APK object.

    We support both the newer direct constructor style and the older
    AnalyzeAPK-style flow to keep the code compatible with different
    installed Androguard versions.
    """
    if not apk_path:
        raise ValueError("APK path is required.")

    # A quick file check so the error is clear before trying to parse.
    if not os.path.isfile(apk_path):
        raise FileNotFoundError(f"APK file not found: {apk_path}")

    # Modern Androguard API: APK(path)
    if APK is not None:
        try:
            return APK(apk_path)
        except Exception:
            # Fall back to legacy-compatible behavior in case the APK cannot be
            # loaded with the direct constructor in some older installs.
            pass

    # Legacy/fallback flow for older Androguard installations.
    if AnalyzeAPK is not None:
        try:
            a, _, _ = AnalyzeAPK(apk_path)
            return a
        except Exception as exc:
            raise ValueError(f"Unable to analyze APK at '{apk_path}': {exc}") from exc

    raise ImportError(
        "Androguard is not available or does not expose a supported APK API. "
        "Please install a compatible version of androguard."
    )


def _extract_apk_metadata(apk: Any) -> Dict[str, str]:
    """Safely read metadata fields that may be missing in some APKs."""
    metadata: Dict[str, str] = {
        "app_name": "",
        "package_name": "",
        "version_name": "",
        "version_code": "",
    }

    try:
        metadata["app_name"] = _safe_string(getattr(apk, "get_app_name", lambda: "")())
    except Exception:
        metadata["app_name"] = ""

    try:
        metadata["package_name"] = _safe_string(getattr(apk, "get_package", lambda: "")())
    except Exception:
        metadata["package_name"] = ""

    try:
        metadata["version_name"] = _safe_string(
            getattr(apk, "get_androidversion_name", lambda: "")()
        )
    except Exception:
        metadata["version_name"] = ""

    try:
        metadata["version_code"] = _safe_string(
            getattr(apk, "get_androidversion_code", lambda: "")()
        )
    except Exception:
        metadata["version_code"] = ""

    return metadata


def analyze_apk(apk_path: str) -> Dict[str, Any]:
    """Analyze an Android APK and return structured metadata and permissions.

    Args:
        apk_path: Path to the APK file on disk.

    Returns:
        A dictionary with app metadata, all permissions, sensitive permissions,
        and summary counts.

    Raises:
        ValueError: If the APK cannot be parsed or opened.
        FileNotFoundError: If the file does not exist.
    """
    try:
        apk = _load_apk_object(apk_path)
    except (FileNotFoundError, ImportError, ValueError):
        # Re-raise known errors so callers can see exactly what went wrong.
        raise
    except Exception as exc:
        raise ValueError(f"Unable to analyze APK at '{apk_path}': {exc}") from exc

    # Extract basic app details directly from the APK metadata.
    # These are the values Androguard reads from AndroidManifest.xml.
    metadata = _extract_apk_metadata(apk)

    # Pull the requested Android permissions from the manifest.
    # Some versions expose them as get_permissions(), and older ones may use a
    # slightly different method name. We handle both gracefully.
    permissions: List[str] = []
    try:
        get_permissions = getattr(apk, "get_permissions", None)
        if callable(get_permissions):
            permissions = _safe_list(get_permissions())
        else:
            declared_permissions = getattr(apk, "get_declared_permissions", None)
            if callable(declared_permissions):
                permissions = _safe_list(declared_permissions())
    except Exception:
        permissions = []

    # Keep the permission names exactly as they appear in the manifest, such as
    # 'android.permission.RECORD_AUDIO'.
    permissions = [str(permission) for permission in permissions]
    permissions = list(dict.fromkeys(permissions))

    # Separate the requested permissions into all permissions and only the ones
    # classified as sensitive/privacy-related for this project.
    sensitive_permissions = [
        permission for permission in permissions if permission in SENSITIVE_PERMISSIONS
    ]

    result = {
        "apk_info": {
            "app_name": metadata.get("app_name", ""),
            "package_name": metadata.get("package_name", ""),
            "version_name": metadata.get("version_name", ""),
            "version_code": metadata.get("version_code", ""),
        },
        "permissions": {
            "all": permissions,
            "sensitive": sensitive_permissions,
        },
        "analysis": {
            "total_permissions": len(permissions),
            "sensitive_permission_count": len(sensitive_permissions),
        },
    }

    return result
