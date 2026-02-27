import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      

      {/* Main Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect <br/><span className="highlight">Sports Partner</span></h1>
          <p>
            Join the ultimate community for athletes. Book courts, find teammates, 
            and elevate your game to the next level.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">I already have an account</Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="features-grid">
          <div className="feature-card">
            <h3>🤝 Buddy Discovery</h3>
            <p>Match with players who share your interests and skill levels.</p>
          </div>
          <div className="feature-card">
            <h3>🏟️ Court Booking</h3>
            <p>Reserve facilities instantly for football, tennis, and more.</p>
          </div>
          <div className="feature-card">
            <h3>📈 Track Progress</h3>
            <p>Manage your matches, schedule, and team events in one place.</p>
          </div>
        </div>
      </main>
    </div>
  );
}