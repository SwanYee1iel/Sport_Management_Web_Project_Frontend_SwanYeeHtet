/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-undef */
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    setUser(savedUser ? JSON.parse(savedUser) : null);
  }, [location]);

  // NEW: Handle clicking outside to close the menu
  useEffect(() => {
    const closeMenu = () => setIsDropdownOpen(false);
    if (isDropdownOpen) {
      window.addEventListener('click', closeMenu);
    }
    return () => window.removeEventListener('click', closeMenu);
  }, [isDropdownOpen]);

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevents the window click listener from closing it instantly
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="global-nav">
      <div className="logo-section">
        <Link to="/" className="brand-logo">Sport<span>Connect</span></Link>
      </div>
      
      <div className="nav-menu">
  {/* ALWAYS VISIBLE */}
  <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
  
  {/* USER-ONLY LINKS: Hidden if Admin to keep the management view clean */}
  {(!user || user.role === 'user') && (
    <>
      <Link to="/bookings" className={location.pathname === "/bookings" ? "active" : ""}>Booking</Link>
      <Link to="/buddies" className={location.pathname === "/buddies" ? "active" : ""}>Sports buddies</Link>
      <Link to="/history" className={location.pathname === "/history" ? "active" : ""}>History</Link>
    </>
  )}

  {/* ADMIN-ONLY LINKS: Management & Business Intelligence */}
  {user?.role === 'admin' && (
    <>
      <Link to="/admin/dashboard" className={`admin-tab ${location.pathname === "/admin/dashboard" ? "active" : ""}`}>
        <span className="pulse-dot" style={{ backgroundColor: '#bb86fc', boxShadow: '0 0 8px #bb86fc' }}></span>
        Analytics
      </Link>
      <Link to="/admin/staff" className={`admin-tab ${location.pathname === "/admin/staff" ? "active" : ""}`}>
        Manage Staff
      </Link>
      <Link to="/admin/audit" className={`admin-tab ${location.pathname === "/admin/audit" ? "active" : ""}`}>
        Audit Log
      </Link>
    </>
  )}
  
  {/* STAFF & ADMIN (Operational) LINKS: Shared for Superuser access */}
  {(user?.role === 'staff' || user?.role === 'admin') && (
    <>
      <Link to="/staff/dashboard" className={`staff-tab ${location.pathname === "/staff/dashboard" ? "active" : ""}`}>
        <span className="pulse-dot"></span>
        Payments
      </Link>
      <Link to="/staff/facility" className={`staff-tab ${location.pathname === "/staff/facility" ? "active" : ""}`}>
        <span className="pulse-dot" style={{ backgroundColor: '#3498db', boxShadow: '0 0 8px #3498db' }}></span>
        Facility Hub
      </Link>
    </>
  )}
</div>

      <div className="nav-actions">
        {user ? (
          <div className="profile-account-area">
            <span className="welcome-text">Hi, {user.User_Name}</span>
            <div className="user-profile-dropdown">
              {/* FIXED: Added onClick and toggleDropdown here */}
              <div className="profile-trigger" onClick={toggleDropdown}>
                {user.Profile_Image ? (
                  <img src={`${import.meta.env.VITE_API_BASE_URL}/uploads/profiles/${user.Profile_Image}`} alt="Profile" className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder">{user.User_Name.charAt(0).toUpperCase()}</div>
                )}
                <i className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`}>▾</i>
              </div>
              
              {/* FIXED: Added conditional rendering based on state */}
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/account" className="dropdown-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    My Profile
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout-special">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="nav-login">Log In</Link>
            <Link to="/register" className="nav-signup">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}