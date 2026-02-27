/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import './AdminStaff.css'; // Ensure you create this file
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminStaff() {
  const [staffs, setStaffs] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });


  const fetchStaff = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/staff`)
      .then(res => res.json())
      .then(setStaffs)
      .catch(err => console.error("Error fetching staff:", err));
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Staff_Name: formData.name,
          Staff_Email: formData.email,
          Staff_Password: formData.password
        })
      });
      if (res.ok) {
        alert("New staff member added successfully!");
        setFormData({ name: '', email: '', password: '' });
        fetchStaff();
      }
    } catch (err) {
      alert("Failed to add staff member.");
    }
  };

  const deleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/staff/${id}`, { method: 'DELETE' });
      fetchStaff();
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Team <span className="neon-text">Management</span></h1>
        <p>Manage your facility staff accounts and permissions.</p>
      </header>
      
      <div className="management-layout">
        {/* ADD STAFF FORM CARD */}
        <div className="stat-card form-section">
          <h3>Hire New Staff</h3>
          <form onSubmit={handleAddStaff} className="staff-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" value={formData.name} required onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="staff@sportconnect.com" value={formData.email} required onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Temporary Password</label>
              <input type="password" placeholder="••••••••" value={formData.password} required onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <button type="submit" className="add-staff-btn">Add Staff Member</button>
          </form>
        </div>

        {/* STAFF LIST TABLE CARD */}
        <div className="stat-card table-section">
          <h3>Current Staff Members</h3>
          <div className="table-wrapper">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {staffs.length > 0 ? (
                  staffs.map(s => (
                    <tr key={s._id}>
                      <td className="staff-name-cell">{s.Staff_Name}</td>
                      <td>{s.Staff_Email}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => deleteStaff(s._id)} className="remove-btn">Remove</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No staff members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}