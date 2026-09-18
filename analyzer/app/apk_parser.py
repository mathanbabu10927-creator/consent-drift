# Consent Drift APK Analyzer

The Analyzer package focuses on the first phase of the Consent Drift project: scanning Android APK files and comparing permission changes between versions.

## How it works

The analyzer module is intentionally small and modular so future phases can add capability detection, risk scoring, and privacy changelog generation without needing to rework the parsing layer.

- `analyzer/app/apk_parser.py` validates the APK file path, reads the APK, and extracts metadata using Androguard.
- `analyzer/app/models.py` defines a clean `ApkAnalysis` data structure that represents a single analyzed APK.
- `analyzer/app/permission_diff.py` compares two APK analysis results and produces deterministic permission lists:
  - `added_permissions`
  - `removed_permissions`
  - `unchanged_permissions`

## Installation

From the repository root:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r analyzer/requirements.txt
```

## Example output

```python
from analyzer.app.apk_parser import analyze_apk

result = analyze_apk("/path/to/app.apk")
print(result.to_dict())
```

Example:

```json
{
  "app_name": "Example App",
  "package_name": "com.example.app",
  "version_name": "2.0",
  "version_code": 20,
  "permissions": [
    "android.permission.INTERNET",
    "android.permission.CAMERA"
  ]
}
```

## Permission diff example

```python
from analyzer.app.permission_diff import compare_permissions

old_version = {
    "permissions": ["android.permission.INTERNET", "android.permission.CAMERA"]
}
new_version = {
    "permissions": ["android.permission.INTERNET", "android.permission.CAMERA", "android.permission.ACCESS_FINE_LOCATION"]
}

print(compare_permissions(old_version, new_version))
```

Example output:

```json
{
  "added_permissions": ["android.permission.ACCESS_FINE_LOCATION"],
  "removed_permissions": [],
  "unchanged_permissions": [
    "android.permission.CAMERA",
    "android.permission.INTERNET"
  ]
}
```

## Running tests

```bash
pytest analyzer/tests
```

## Error handling

The analyzer handles the following cases clearly:

- invalid APK path
- unreadable APK file
- APK parsing failure

These cases raise explicit exceptions instead of failing silently.
