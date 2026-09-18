def normalize_permissions(permissions):
    if not permissions:
        return []
    return sorted(list(set(p.strip().upper() for p in permissions)))
