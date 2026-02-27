import { useState, useEffect } from 'react';
import './Facilities.css';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Facilities() {
  const [facilities, setFacilities] = useState([]); // Start with empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function runs automatically when the page loads
    const fetchFacilities = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/facilities`);
        const data = await response.json();
        setFacilities(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []); // The empty array [] means "run once on load"

  if (loading) return <div className="loading">Loading Courts...</div>;

  return (
    // ... rest of your return code stays exactly the same!
    <div className="facilities-page">
      <div className="facilities-header">
        <h2>Explore Our <span className="highlight">Facilities</span></h2>
        <p>Book premium courts and pitches for your next match.</p>
      </div>

      <div className="facilities-grid">
        {facilities.map((facility) => (
          <div key={facility._id} className="facility-card">
            <div className="facility-image">
              <img src={facility.Image_URL} alt={facility.Facility_Name} />
              <span className={`status-badge ${facility.Status.toLowerCase()}`}>
                {facility.Status}
              </span>
            </div>
            
            <div className="facility-info">
              <div className="facility-title-row">
                <h3>{facility.Facility_Name}</h3>
                <span className="sport-tag">{facility.Sport_Type}</span>
              </div>
              
              <div className="facility-details">
                <p className="price">${facility.Price_Per_Hour}<span>/hr</span></p>
              </div>

              <button 
                className="book-btn" 
                disabled={facility.Status !== 'Available'}
              >
                {facility.Status === 'Available' ? 'Book Now' : 'Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}