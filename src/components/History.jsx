import { useState, useEffect } from 'react';
import './History.css';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchHistory = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/user/${userData.id}`);
        const data = await response.json();
        if (Array.isArray(data)) setBookings(data);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="history-loader"><span></span></div>;

  return (
    <div className="history-wrapper">
      <div className="history-container">
        <header className="history-header">
          <h1>Activity <span className="neon-text">History</span></h1>
          <p>Your professional arena reservation records.</p>
        </header>

        <div className="history-grid">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking._id} className="history-ticket">
                <div className="ticket-left">
                  <div className="sport-tag">{booking.Court_ID?.Sports_ID?.Sports_Name}</div>
                  <h3>{booking.Court_ID?.Court_Number}</h3>
                  <p className="description-text">{booking.Court_ID?.Description?.substring(0, 60)}...</p>
                </div>
                
                <div className="ticket-right">
                  <div className="booking-meta">
                    <span className="date-label">{new Date(booking.Date).toLocaleDateString()}</span>
                    <span className="time-label">{booking.Start_Time}</span>
                  </div>
                  <div className={`status-badge ${booking.Booking_Status?.toLowerCase()}`}>
                    {booking.Booking_Status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">No reservations found yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}