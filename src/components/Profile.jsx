/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import './Register.css';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const AVAILABLE_SPORTS = ['Football', 'Basketball', 'Tennis', 'Badminton', 'Volleyball', 'Swimming'];

export default function Profile() {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    User_Name: '',
    User_Email: '',
    password: '', 
    Gender: 'Male',
    Phone_Number: '',
    Interests: [], 
    Profile_Picture: null 
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (currentUser?.id) {
      // SMART FETCH: Determine which endpoint to call based on role
      let endpoint = `${import.meta.env.VITE_import.meta.env.VITE_API_BASE_URL}/api/users/${currentUser.id}`;
      if (currentUser.role === 'staff') endpoint = `${import.meta.env.VITE_import.meta.env.VITE_API_BASE_URL}/api/staff`; // You'll need a GET /api/staff/:id if you want to pre-fill
      if (currentUser.role === 'admin') endpoint = `${import.meta.env.VITE_import.meta.env.VITE_API_BASE_URL}/api/admin/config`; // Reusing your config for admin
      
      // For simplicity, we can just pre-fill from localStorage to save a database call!
      setFormData(prev => ({
        ...prev,
        User_Name: currentUser.User_Name || '',
        User_Email: currentUser.User_Email || ''
      }));
      
      // If it's a normal user, fetch the extra details (Interests, Picture)
      if (currentUser.role === 'user') {
        fetch(`${import.meta.env.VITE_import.meta.env.VITE_API_BASE_URL}/api/users/${currentUser.id}`)
          .then(res => res.json())
          .then(data => {
            setFormData(prev => ({
              ...prev,
              Gender: data.Gender || 'Male',
              Phone_Number: data.Phone_Number || '',
              Interests: data.Interests || []
            }));
            if (data.Profile_Picture) {
              setImagePreview(`${import.meta.env.VITE_import.meta.env.VITE_API_BASE_URL}/uploads/profiles/${data.Profile_Picture}`);
            }
            setLoading(false);
          });
      } else {
        setLoading(false); // Staff/Admin load instantly
      }
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, Profile_Picture: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInterestChange = (sport) => {
    setFormData((prevData) => {
      const currentInterests = prevData.Interests;
      return currentInterests.includes(sport) 
        ? { ...prevData, Interests: currentInterests.filter(i => i !== sport) }
        : { ...prevData, Interests: [...currentInterests, sport] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      
      // IF NORMAL USER (Uses FormData for images)
      if (currentUser.role === 'user') {
        if (formData.Interests.length === 0) return alert("Please select at least one sport.");
        
        const dataToSend = new FormData();
        dataToSend.append('User_Name', formData.User_Name);
        dataToSend.append('User_Email', formData.User_Email);
        if (formData.password) dataToSend.append('password', formData.password);
        dataToSend.append('Gender', formData.Gender);
        dataToSend.append('Phone_Number', formData.Phone_Number);
        dataToSend.append('Interests', JSON.stringify(formData.Interests));
        if (formData.Profile_Picture) dataToSend.append('profileImage', formData.Profile_Picture);

        response = await fetch(`${import.meta.env.VITE_import.meta.env.VITE_API_BASE_URL}/api/users/${currentUser.id}`, {
          method: 'PUT',
          body: dataToSend, 
        });
      } 
      // IF STAFF OR ADMIN (Uses JSON, no images)
      else {
        const endpointRole = currentUser.role === 'admin' ? 'admin' : 'staff';
        response = await fetch(`${import.meta.env.VITE_import.meta.env.VITE_API_BASE_URL}/api/${endpointRole}/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            User_Name: formData.User_Name,
            User_Email: formData.User_Email,
            password: formData.password
          })
        });
      }

      const data = await response.json();

      if (response.ok) {
        // Keep the old profile image in local storage if they are a user
        const updatedUser = { ...data.user };
        if (currentUser.role === 'user' && currentUser.Profile_Image && !updatedUser.Profile_Image) {
           updatedUser.Profile_Image = currentUser.Profile_Image;
        }
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert("Account Updated Successfully!");
        window.location.reload();
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (error) {
      alert("Could not connect to the backend server.");
    }
  };

  if (loading) return <div className="modern-loader"></div>;

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h2>Account <span className="neon-text">Settings</span></h2>
          <p style={{ color: '#888', marginTop: '5px', textTransform: 'capitalize' }}>Role: {currentUser.role}</p>
        </div>
        
        <div className="register-card">
          <form onSubmit={handleSubmit}>
            
            {/* ONLY SHOW IMAGE UPLOAD FOR NORMAL USERS */}
            {currentUser.role === 'user' && (
              <div className="profile-upload-container">
                <label htmlFor="profile-upload" className="profile-upload-label">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile Preview" className="profile-image preview" />
                  ) : (
                    <div className="profile-image placeholder">
                      <span style={{ fontSize: '2rem', color: '#fff' }}>{formData.User_Name.charAt(0)}</span>
                    </div>
                  )}
                </label>
                <input id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </div>
            )}

            {/* SHARED INPUTS FOR EVERYONE */}
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={formData.User_Name} required onChange={(e) => setFormData({...formData, User_Name: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={formData.User_Email} required onChange={(e) => setFormData({...formData, User_Email: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label>Change Password (Leave blank to keep current)</label>
              <input type="password" placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            
            {/* ONLY SHOW EXTRA DEMOGRAPHICS FOR NORMAL USERS */}
            {currentUser.role === 'user' && (
              <>
                <div className="form-group">
                  <label>Gender</label>
                  <select value={formData.Gender} onChange={(e) => setFormData({...formData, Gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" value={formData.Phone_Number} onChange={(e) => setFormData({...formData, Phone_Number: e.target.value})} />
                </div>
                
                <div className="form-group">
                  <label>Sports Interests</label>
                  <div className="interests-grid">
                    {AVAILABLE_SPORTS.map((sport) => (
                      <label key={sport} className="interest-checkbox-label">
                        <input 
                          type="checkbox" 
                          value={sport}
                          checked={formData.Interests.includes(sport)}
                          onChange={() => handleInterestChange(sport)}
                        />
                        <span>{sport}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="create-account-btn">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}