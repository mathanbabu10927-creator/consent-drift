interface PermissionTableProps {
  permissions: string[];
}

export function PermissionTable({ permissions }: PermissionTableProps) {
  return (
    <div className="table-wrap section">
      <div className="table-header">
        <h3>Permission delta</h3>
      </div>

      <table>
        <thead>
          <tr>
            <th>Permission</th>
            <th>Status</th>
            <th>Old</th>
            <th>New</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr key={permission}>
              <td colSpan={5}>{permission}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
