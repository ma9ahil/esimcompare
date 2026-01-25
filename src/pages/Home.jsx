import React from 'react';
import { Button } from '../components/shared';

const Home = ({ setNav }) => {
  return (
    <div className="home-container">
      <div className="home-content-wrapper">
        
        {/* Hero Section */}
        <div className="hero">
          <h1>Let us take care of your sim needs</h1>
          <p>Check out the cheapest, and best options in your destination.</p>

          <div className="home-actions">
            <div className="inline two">
              <Button onClick={() => setNav("planner")}>Build my trip</Button>
              <Button variant="secondary" onClick={() => setNav("results")}>View offers</Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid two home-grid">
          <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>🌍</div>
            <h3 style={{ margin: '0 0 6px' }}>Global Coverage</h3>
            <div className="muted small">One eSIM, 190+ countries.</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>💸</div>
            <h3 style={{ margin: '0 0 6px' }}>Compare & Save</h3>
            <div className="muted small">We check top providers for you.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;