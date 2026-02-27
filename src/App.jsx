/* eslint-disable react-hooks/static-components */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import Navbar from './components/Navbar'; 
import Landing from './components/Landing';
import Register from './components/Register';
import Login from './components/Login';
import Booking from './components/Booking';
import BookingHistory from './components/History'; 
import StaffDashboard from './components/staff/StaffDashboard';
import FacilityHub from './components/staff/FacilityHub';
import Buddies from './components/Buddies'; 
import Profile from './components/Profile'; // Imported perfectly

// Admin Imports
import AdminDashboard from './components/admin/AdminDashboard';
import AdminStaff from './components/admin/AdminStaff'; 
import AdminAudit from './components/admin/AdminAudit'; 

function App() {
  const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // If no user or the role isn't 'admin', kick them back to login
    if (!user || user.role !== 'admin') {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

  return (
    <Router>
      {/* Because Navbar is outside of <Routes>, it will be locked to the top of EVERY page! */}
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bookings" element={<Booking />} /> 
        <Route path="/buddies" element={<Buddies />} /> 
        <Route path="/history" element={<BookingHistory />} />     
        
        {/* ADDED THE MISSING ACCOUNT ROUTE HERE! */}
        <Route path="/account" element={<Profile />} /> 

        {/* Staff Routes */}
        <Route path="/staff/dashboard" element={<StaffDashboard />} /> 
        <Route path="/staff/facility" element={<FacilityHub />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/staff" element={<AdminRoute><AdminStaff /></AdminRoute>} />
        <Route path="/admin/audit" element={<AdminRoute><AdminAudit /></AdminRoute>} /> 
      </Routes>
    </Router>
  );
}

export default App;