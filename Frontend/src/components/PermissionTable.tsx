import type { PermissionRow } from '../data/mockData';

interface PermissionTableProps {
  rows: PermissionRow[];
}

export function PermissionTable({ rows }: PermissionTableProps) {
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
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>
                <span className={`status-pill ${row.status.toLowerCase()}`}>{row.status}</span>
              </td>
              <td>{row.oldValue}</td>
              <td>{row.newValue}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
