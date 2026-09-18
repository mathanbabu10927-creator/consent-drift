from typing import Any
from .models import normalize_permissions

def _extract_permissions(analysis: Any) -> set[str]:
    if isinstance(analysis, dict):
        permissions = analysis.get('permissions', [])
    elif hasattr(analysis, 'permissions'):
        permissions = analysis.permissions
    elif isinstance(analysis, (list, tuple, set)):
        permissions = analysis
    else:
        raise TypeError('Permission comparison requires an analysis object, dict, or list.')
    return set(normalize_permissions(permissions))

def compare_permissions(old_version: Any, new_version: Any) -> dict:
    old_permissions = _extract_permissions(old_version)
    new_permissions = _extract_permissions(new_version)
    return {
        'added_permissions': sorted(new_permissions - old_permissions),
        'removed_permissions': sorted(old_permissions - new_permissions),
        'unchanged_permissions': sorted(old_permissions & new_permissions),
    }
