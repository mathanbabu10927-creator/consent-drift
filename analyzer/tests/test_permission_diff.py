from analyzer.app.permission_diff import compare_permissions

def test_add_permission():
    old = {'permissions': ['INTERNET', 'CAMERA']}
    new = {'permissions': ['INTERNET', 'CAMERA', 'LOCATION']}
    res = compare_permissions(old, new)
    assert res['added_permissions'] == ['LOCATION']
    assert res['removed_permissions'] == []

def test_remove_permission():
    old = {'permissions': ['INTERNET', 'CAMERA', 'LOCATION']}
    new = {'permissions': ['INTERNET', 'CAMERA']}
    res = compare_permissions(old, new)
    assert res['added_permissions'] == []
    assert res['removed_permissions'] == ['LOCATION']

def test_no_changes():
    old = {'permissions': ['INTERNET']}
    new = {'permissions': ['INTERNET']}
    res = compare_permissions(old, new)
    assert res['added_permissions'] == []
    assert res['removed_permissions'] == []
