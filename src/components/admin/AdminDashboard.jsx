import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import './AdminDashboard.css';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminDashboard() {
  // Initialize state with the new 'trends' array from your backend
  const [stats, setStats] = useState({ revenue: 0, popularity: [], trends: [] });
  const [loading, setLoading] = useState(true);
  const [currentRate, setCurrentRate] = useState(0);
const [newRate, setNewRate] = useState('');


  useEffect(() => {
  // Fetch Analytics (Your existing code)
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/analytics`)
    .then(res => res.json())
    .then(data => {
      setStats(data);
      setLoading(false);
    });

  // NEW: Fetch Current Price Configuration
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/config`)
    .then(res => res.json())
    .then(data => {
      if (data && data.Hourly_Rate) {
        setCurrentRate(data.Hourly_Rate);
      }
    });
}, []);

// NEW: Function to handle the price update
const handlePriceUpdate = async (e) => {
  e.preventDefault();
  if (!newRate || newRate <= 0) return alert("Please enter a valid rate.");

  try {
    const response = await fetch('`${import.meta.env.VITE_API_BASE_URL}/api/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Hourly_Rate: Number(newRate) })
    });

    if (response.ok) {
      alert(`Master Hourly Rate successfully updated to $${newRate}!`);
      setCurrentRate(newRate);
      setNewRate(''); // Clear input
    } else {
      alert("Failed to update price.");
    }
  } catch (error) {
    console.error("Error updating price:", error);
  }
};

  if (loading) return <div className="loader"></div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin <span className="neon-text">Analytics</span></h1>
        <p>Real-time revenue and business performance insights.</p>
      </header>

      {/* TOP ROW: STAT CARDS */}
      <div className="stats-summary">
        <div className="stat-card mini">
          <p>Total Revenue</p>
          <h2 className="neon-text">${stats.revenue.toLocaleString()}</h2>
        </div>
        <div className="stat-card mini">
          <p>Active Bookings</p>
          <h2>{stats.popularity.reduce((acc, curr) => acc + curr.count, 0)}</h2>
        </div>
      </div>

      <div className="stats-grid-complex">
        {/* FEATURE 1: REVENUE TREND LINE CHART */}
        <div className="stat-card chart-main">
          <h3>Monthly Revenue Growth</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={stats.trends}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="_id" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                <Area type="monotone" dataKey="monthlyTotal" stroke="#39FF14" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FEATURE 2: POPULARITY BARS (Your existing feature) */}
        <div className="stat-card">
          <h3>Most Booked Sports</h3>
          <div className="bar-list">
            {stats.popularity.map((item, index) => (
              <div key={index} className="bar-row">
                <span className="sport-label">{item._id}</span>
                <div className="bar-wrapper">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${(item.count / (stats.popularity[0]?.count || 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="sport-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* FEATURE 3: SYSTEM PRICING CONTROL */}
<div className="stat-card config-card" style={{ border: '1px solid #bb86fc' }}>
  <h3><span className="neon-text" style={{ color: '#bb86fc' }}>⚙️ Global Price Control</span></h3>
  <p style={{ color: '#888', marginBottom: '15px' }}>
    Current System Rate: <strong>${currentRate} / hour</strong>
  </p>
  
  <form onSubmit={handlePriceUpdate} style={{ display: 'flex', gap: '10px' }}>
    <input 
      type="number" 
      placeholder="New Rate (e.g. 30)" 
      value={newRate}
      onChange={(e) => setNewRate(e.target.value)}
      style={{
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #333',
        background: '#0a0a0a',
        color: '#fff',
        flex: 1
      }}
    />
    <button 
      type="submit" 
      style={{
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        background: '#bb86fc',
        color: '#000',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
    >
      Update
    </button>
  </form>
</div>
    </div>
  );
}