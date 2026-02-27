import { useState, useEffect } from 'react';
import './Buddies.css'; 
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Buddies() {
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user'));


  useEffect(() => {
    if (currentUser?.id) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${currentUser.id}/buddies`)
        .then(res => res.json())
        .then(data => {
          setBuddies(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching buddies:", err);
          setLoading(false);
        });
    }
  }, [currentUser]);

  if (loading) return <div className="modern-loader"></div>;

  return (
    <div className="buddies-page-wrapper">
      <header className="buddies-hero">
        <h1 className="reveal-title">Your Sports <span className="neon-text">Buddies</span></h1>
        <p className="hero-subtitle">Connect with athletes who share your passion.</p>
      </header>

      <div className="buddies-container">
        {buddies.length > 0 ? (
          <div className="buddies-grid">
            {buddies.map(buddy => (
              <div key={buddy._id} className="buddy-card">
                {/* Change buddy.Profile_Image to buddy.Profile_Picture */}
                <div className="buddy-avatar-wrapper">
                {buddy.Profile_Picture ? (
                    <img 
                    src={`${import.meta.env.VITE_API_BASE_URL}/uploads/profiles/${buddy.Profile_Picture}`} 
                    alt={buddy.User_Name} 
                    className="buddy-avatar" 
                    />
                ) : (
                    <div className="buddy-avatar placeholder">
                    {buddy.User_Name.charAt(0).toUpperCase()}
                    </div>
                )}
                </div>
                
                <h3 className="buddy-name">{buddy.User_Name}</h3>
                
                <div className="buddy-interests">
                  {buddy.Interests.map((interest, index) => {
                    // Highlight the interest if it matches the current user's interests
                    // (Assuming currentUser.Interests is available, if not, we highlight all for now)
                    return (
                      <span key={index} className="interest-tag">
                        {interest}
                      </span>
                    );
                  })}
                </div>

                <div 
                    style={{ 
                        marginTop: 'auto', 
                        width: '100%', 
                        textAlign: 'center', 
                        padding: '12px', 
                        backgroundColor: 'rgba(57, 255, 20, 0.05)', 
                        border: '1px solid rgba(57, 255, 20, 0.2)', 
                        borderRadius: '8px',
                        color: '#ccc',
                        fontSize: '0.9rem'
                    }}
                    >
                    {buddy.User_Email}
                    </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-buddies-state">
            <h2>No perfect matches yet!</h2>
            <p>Try updating your profile interests to find more players.</p>
          </div>
        )}
      </div>
    </div>
  );
}