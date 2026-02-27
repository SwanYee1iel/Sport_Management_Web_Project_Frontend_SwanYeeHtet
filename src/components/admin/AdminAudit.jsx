import { useState, useEffect } from 'react';
import './AdminAudit.css';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Fetching from the backend route that populates Staff and Court details
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/audit-log`)
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Audit fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader"></div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>System <span className="neon-text">Audit Log</span></h1>
        <p>Monitor staff activity and facility maintenance history.</p>
      </header>

      <div className="stat-card table-section">
        <h3>Maintenance & Activity History</h3>
        <div className="table-wrapper">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Staff Member</th>
                <th>Action / Issue Reported</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id}>
                    <td>{new Date(log.createdAt).toLocaleDateString()}</td>
                    {/* Safely check if Staff_ID exists, otherwise show System */}
                    <td className="staff-name-cell">
                      {log.Staff_ID?.Staff_Name || 'System / Unknown'}
                    </td>
                    <td>{log.Description}</td>
                    {/* Safely check if Court exists */}
                    <td>{log.Court_ID?.Court_Number || 'General Facility'}</td>
                    <td>
                      <span className={`status-pill ${log.Issue_Status?.toLowerCase() || 'open'}`}>
                        {log.Issue_Status || 'Open'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                    No audit logs found. System is running smoothly.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}