import { useState, useEffect } from 'react';
import './StaffDashboard.css';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function StaffDashboard() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  
  // State for the Image Viewer Modal
  const [viewSlip, setViewSlip] = useState(null);

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/pending`);
      const data = await response.json();
      setPendingBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    // Confirm before rejecting
    if (newStatus === 'Cancelled' && !window.confirm("Are you sure you want to reject this booking? The time slot will be freed up.")) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Remove the processed booking from the screen instantly
        setPendingBookings(prev => prev.filter(b => b._id !== bookingId));
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  if (loading) return <div className="modern-loader"></div>;

  return (
    <div className="staff-dashboard-wrapper">
      <header className="staff-header">
        <h1>Staff <span className="neon-text">Verification</span> Dashboard</h1>
        <p>You have {pendingBookings.length} booking(s) awaiting payment verification.</p>
      </header>

      <div className="pending-grid">
        {pendingBookings.length === 0 ? (
          <div className="empty-queue">
            <h3>🎉 All caught up!</h3>
            <p>No pending bookings require verification right now.</p>
          </div>
        ) : (
          pendingBookings.map((booking) => (
            <div key={booking._id} className="staff-card">
              <div className="card-header">
                <span className="sport-badge">{booking.Court_ID?.Sports_ID?.Sports_Name}</span>
                <span className="court-id">{booking.Court_ID?.Court_Number}</span>
              </div>
              
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">Customer:</span>
                  <span className="info-value">{booking.User_ID?.User_Name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Date & Time:</span>
                  <span className="info-value">
                    {new Date(booking.Date).toLocaleDateString()} @ {booking.Start_Time}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{booking.Duration} Hour(s)</span>
                </div>
                <div className="info-row amount-row">
                  <span className="info-label">Total Paid:</span>
                  <span className="info-value highlight-amount">${(25 * booking.Duration).toFixed(2)}</span>
                </div>
              </div>

              <div className="card-actions">
                <button 
                  className="view-slip-btn"
                  onClick={() => setViewSlip(booking.Payment_Slip)}
                >
                  View Transfer Slip
                </button>
                <div className="decision-buttons">
                  <button 
                    className="reject-btn"
                    onClick={() => handleUpdateStatus(booking._id, 'Cancelled')}
                  >
                    Reject
                  </button>
                  <button 
                    className="approve-btn"
                    onClick={() => handleUpdateStatus(booking._id, 'Confirmed')}
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Slip Viewer Modal */}
      {viewSlip && (
        <div className="modal-overlay" onClick={() => setViewSlip(null)}>
          <div className="slip-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setViewSlip(null)}>&times;</button>
            <h3>Payment Verification</h3>
            <div className="slip-image-container">
              {/* Load the image directly from the backend uploads folder */}
              <img 
                src={`${import.meta.env.VITE_API_BASE_URL}/uploads/slips/${viewSlip}`} 
                alt="Payment Slip" 
                className="slip-img"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}