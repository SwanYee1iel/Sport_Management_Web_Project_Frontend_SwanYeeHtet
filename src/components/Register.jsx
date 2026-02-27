import { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom'; 

// Define the sports available in your facility
const AVAILABLE_SPORTS = [
  'Football', 'Basketball', 'Tennis', 
  'Badminton', 'Volleyball', 'Swimming'
];

export default function Register() {
  const navigate = useNavigate(); // ADDED THIS LINE HERE!

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, Profile_Picture: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle checking and unchecking sports
  const handleInterestChange = (sport) => {
    setFormData((prevData) => {
      const currentInterests = prevData.Interests;
      if (currentInterests.includes(sport)) {
        // If already selected, remove it
        return { ...prevData, Interests: currentInterests.filter(i => i !== sport) };
      } else {
        // If not selected, add it
        return { ...prevData, Interests: [...currentInterests, sport] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.Interests.length === 0) {
      alert("Please select at least one sport interest.");
      return; 
    }

    try {
      // 1. Initialize FormData
      const dataToSend = new FormData();
      
      // 2. Append all text fields
      dataToSend.append('User_Name', formData.User_Name);
      dataToSend.append('User_Email', formData.User_Email);
      dataToSend.append('password', formData.password);
      dataToSend.append('Gender', formData.Gender);
      dataToSend.append('Phone_Number', formData.Phone_Number);
      
      // 3. Stringify the Interests array (FormData only sends strings/blobs)
      formData.Interests.forEach((sport) => {
  dataToSend.append('Interests', sport);
});

      // 4. Append the image file if it exists
      if (formData.Profile_Picture) {
        dataToSend.append('profileImage', formData.Profile_Picture);
      }

      // 5. Send request WITHOUT the 'Content-Type' header 
      // (The browser will automatically set the boundary for FormData)
      const response = await fetch('/api/register', {
        method: 'POST',
        body: dataToSend, 
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful! Your profile image is saved.");
        navigate('/login'); // This will now work perfectly!
      } else {
        alert("Registration failed: " + data.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Could not connect to the backend server.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h2>Welcome to Sport Connect</h2>
        </div>
        
        <div className="register-card">
          <form onSubmit={handleSubmit}>
            {/* Profile Picture Upload */}
            <div className="profile-upload-container">
              <label htmlFor="profile-upload" className="profile-upload-label">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile Preview" className="profile-image preview" />
                ) : (
                  <div className="profile-image placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>
              <input 
                id="profile-upload" type="file" accept="image/*" 
                onChange={handleImageChange} style={{ display: 'none' }} 
              />
            </div>

            {/* Basic Inputs */}
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="Michel" required 
                onChange={(e) => setFormData({...formData, User_Name: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="You@example.com" required 
                onChange={(e) => setFormData({...formData, User_Email: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Password (6 characters minimum)" required 
                onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            
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
              <input type="tel" placeholder="+1 234 567 890" 
                onChange={(e) => setFormData({...formData, Phone_Number: e.target.value})} />
            </div>
            
            {/* New Interests Checkbox Grid */}
            <div className="form-group">
              <label>Interests (Select at least one)</label>
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

            <button type="submit" className="create-account-btn">Create account</button>
          </form>
        </div>
      </div>
    </div>
  );
}