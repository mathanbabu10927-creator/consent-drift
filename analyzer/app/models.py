from dataclasses import dataclass, field
from typing import Any, Iterable


def normalize_permissions(permissions: Any) -> list[str]:
    """Normalize a permission list into a deterministic, deduplicated list."""
    if permissions is None:
        return []
    if isinstance(permissions, str):
        permissions = [permissions]

    normalized = []
    seen = set()
    for permission in permissions:
        if permission is None:
            continue
        value = str(permission).strip()
        if not value or value in seen:
            continue
        seen.add(value)
        normalized.append(value)

    return sorted(normalized)


@dataclass(frozen=True)
class ApkAnalysis:
    app_name: str = ""
    package_name: str = ""
    version_name: str = ""
    version_code: int = 0
    permissions: list[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        object.__setattr__(self, "permissions", normalize_permissions(self.permissions))

    def to_dict(self) -> dict:
        return {
            "app_name": self.app_name,
            "package_name": self.package_name,
            "version_name": self.version_name,
            "version_code": self.version_code,
            "permissions": list(self.permissions),
        }
