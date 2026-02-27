import { useState, useEffect } from 'react';
import './FacilityHub.css';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function FacilityHub() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportingIssue, setReportingIssue] = useState(null); // Stores court being reported
  const [issueDesc, setIssueDesc] = useState('');


  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courts`);
      const data = await res.json();
      setCourts(data);
    } catch (err) {
      console.error("Error fetching courts:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (courtId, currentStatus) => {
    const newStatus = currentStatus === 'Available' ? 'Maintenance' : 'Available';
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courts/${courtId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: newStatus }),
      });
      if (res.ok) fetchCourts(); // Refresh list
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };
const handleReportIssue = async (e) => {
  e.preventDefault();
  
  // 1. Get the current staff member's data from localStorage
  const savedUser = JSON.parse(localStorage.getItem('user'));
  const staffId = savedUser?.id; // This is the ID you need!

  try {
    const res = await fetch('`${import.meta.env.VITE_API_BASE_URL}/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Court_ID: reportingIssue._id,
        Description: issueDesc,
        Staff_ID: staffId // 2. Send the staff ID here
      }),
    });

    if (res.ok) {
      alert("Issue reported by staff member " + savedUser.User_Name);
      setReportingIssue(null);
      setIssueDesc('');
      fetchCourts();
    }
  } catch (err) {
    console.error("Reporting error:", err);
  }
};

  if (loading) return <div className="modern-loader"></div>;

  return (
    <div className="facility-hub-wrapper">
      <header className="staff-header">
        <h1>Facility <span className="neon-text">Management</span></h1>
        <p>Monitor arena health and report maintenance requirements.</p>
      </header>

      <div className="courts-management-grid">
        {courts.map(court => (
          <div key={court._id} className={`management-card ${court.Status.toLowerCase()}`}>
            <div className="card-top">
              <span className="arena-label">{court.Sports_ID?.Sports_Name} - {court.Court_Number}</span>
              <div className="status-badge">{court.Status}</div>
            </div>

            <div className="management-actions">
              <button 
                className="toggle-btn"
                onClick={() => toggleStatus(court._id, court.Status)}
              >
                Set to {court.Status === 'Available' ? 'Maintenance' : 'Available'}
              </button>
              
              <button 
                className="report-btn"
                onClick={() => setReportingIssue(court)}
              >
                Report Issue
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Issue Modal */}
      {reportingIssue && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <button className="close-modal" onClick={() => setReportingIssue(null)}>&times;</button>
            <h2>Report Issue: {reportingIssue.Court_Number}</h2>
            <form onSubmit={handleReportIssue}>
              <textarea 
                className="dark-date-input" 
                placeholder="Describe the problem (e.g. Broken net, AC failure...)"
                rows="4"
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                required
              />
              <button type="submit" className="pay-now-btn" style={{marginTop: '20px'}}>
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}