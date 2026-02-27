/* eslint-disable no-undef */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ADDED Link here
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    User_Email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user data (including their 'role') to localStorage
        localStorage.setItem('user', JSON.stringify(data.user)); 
        
        // Show the specific message from the backend (e.g., "Staff Login successful!")
        alert(data.message); 

        // THE SMART REDIRECT LOGIC
       if (data.user.role === 'admin') {
    navigate('/admin/dashboard'); // Admin goes to Analytics
  } else if (data.user.role === 'staff') {
    navigate('/staff/dashboard'); // Staff goes to Payments
  } else {
    navigate('/'); // Customers go Home
  }
        
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Login to Sport Connect</p>
        </div>
        
        <div className="login-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="admin@sportconnect.com" 
                required 
                onChange={(e) => setFormData({...formData, User_Email: e.target.value})} 
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                required 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>

            <button type="submit" className="login-btn">Log In</button>

            <div className="form-footer">
              {/* Upgraded to use React Router's Link instead of a standard <a> tag */}
              <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}