import React, { useState } from 'react';
import { Button } from '../components/shared';
import { COUNTRIES } from '../data';
import { todayISO, countryMeta } from '../utils';

const Home = ({ appState, updateState, onStartSearch }) => {
  const { stops, needs, flexible, flexibleDays } = appState;
  const [destInput, setDestInput] = useState("");

  // Handle Destination Input
  const handleDestChange = (e) => {
    const val = e.target.value;
    setDestInput(val);
    
    // Auto-add if it matches a country code or name exactly (simple UX)
    // Real implementation would use a dropdown
    const match = COUNTRIES.find(c => 
      c[0].toLowerCase() === val.toLowerCase() || 
      c[1].toLowerCase() === val.toLowerCase()
    );

    if (match) {
      addStop(match[0]);
      setDestInput("");
    }
  };

  const addStop = (code) => {
    // Check if already added to avoid dupes if desired, but user might want circular trip
    const t = todayISO();
    const newStops = [...stops, { country: code, start: t, end: t }];
    updateState({ stops: newStops });
  };

  const removeStop = (index) => {
    const newStops = stops.filter((_, i) => i !== index);
    updateState({ stops: newStops });
  };

  const updateStopDate = (index, field, value) => {
    const newStops = [...stops];
    newStops[index][field] = value;
    updateState({ stops: newStops });
  };

  const toggleNeed = (key) => {
    // Special handling for usage which is a string enum
    if (key === 'heavy' || key === 'medium' || key === 'light') {
       updateState({ needs: { ...needs, usage: key } });
    } else {
       updateState({ needs: { ...needs, [key]: !needs[key] } });
    }
  };

  return (
    <div className="home-container">
      
      {/* Hero Section */}
      <div className="hero">
        <h1>Let us take care of your sim needs</h1>
        <p>Check out the cheapest, and best options in your destination.</p>

        {/* --- TRIP BUILDER WIDGET --- */}
        <div className="trip-builder">
          
          {/* STEP 1: DESTINATIONS */}
          <div class="tb-step">
            <div className="tb-label">1. Where are you going?</div>
            
            {/* List of added stops (Compact UI) */}
            {stops.map((stop, idx) => {
              const meta = countryMeta(stop.country);
              return (
                <div key={idx} className="stop-item">
                  <div className="stop-info">
                    <span className="stop-flag">{meta.flag}</span>
                    <span className="stop-name">{meta.name}</span>
                  </div>
                  
                  {/* STEP 2: DATES (Inline) */}
                  <div className="stop-dates">
                    {!flexible ? (
                      <>
                        <input 
                          type="date" 
                          className="mini-date"
                          value={stop.start}
                          onChange={(e) => updateStopDate(idx, 'start', e.target.value)}
                        />
                        <span>to</span>
                        <input 
                          type="date" 
                          className="mini-date"
                          value={stop.end}
                          onChange={(e) => updateStopDate(idx, 'end', e.target.value)}
                        />
                      </>
                    ) : (
                      <span className="badge">Flexible Dates</span>
                    )}
                    <button 
                      className="btn icon-only danger" 
                      style={{width:24, height:24, padding:0, minHeight:0}}
                      onClick={() => removeStop(idx)}
                    >×</button>
                  </div>
                </div>
              );
            })}

            {/* Input Field */}
            <div className="destination-input-wrap">
              <input 
                list="countryList"
                className="destination-input"
                placeholder={stops.length === 0 ? "Enter a destination (e.g. Japan)..." : "Add another destination..."}
                value={destInput}
                onChange={handleDestChange}
                autoFocus={stops.length === 0}
              />
              <datalist id="countryList">
                {COUNTRIES.map(c => <option key={c[0]} value={c[1]} />)}
              </datalist>
            </div>
            
            {/* Flexible Toggle (Global) */}
            {stops.length > 0 && (
              <div style={{marginTop: 10, display: 'flex', gap: 10, alignItems: 'center'}}>
                 <label style={{marginBottom:0, cursor:'pointer'}} onClick={() => updateState({ flexible: !flexible })}>
                   <input type="checkbox" checked={flexible} readOnly style={{width:'auto', marginRight: 6}} /> 
                   I have flexible dates
                 </label>
                 {flexible && (
                   <input 
                     type="number" 
                     className="mini-date" 
                     style={{width: 60}} 
                     value={flexibleDays} 
                     onChange={(e) => updateState({flexibleDays: e.target.value})}
                   />
                 )}
                 {flexible && <span className="small muted">days total</span>}
              </div>
            )}
          </div>

          {/* STEP 3: NEEDS (Only visible if stops exist) */}
          {stops.length > 0 && (
            <div className="tb-step">
              <div className="tb-label">2. What do you need?</div>
              <div className="needs-grid">
                {/* Usage Toggles */}
                <div 
                  className={`need-badge ${needs.usage === 'light' ? 'active' : ''}`}
                  onClick={() => toggleNeed('light')}
                >
                  ✉️ Light Data
                </div>
                <div 
                  className={`need-badge ${needs.usage === 'medium' ? 'active' : ''}`}
                  onClick={() => toggleNeed('medium')}
                >
                  📱 Medium Data
                </div>
                <div 
                  className={`need-badge ${needs.usage === 'heavy' ? 'active' : ''}`}
                  onClick={() => toggleNeed('heavy')}
                >
                  🎥 Heavy Data
                </div>
                
                {/* Feature Toggles */}
                <div 
                  className={`need-badge ${needs.hotspot ? 'active' : ''}`}
                  onClick={() => toggleNeed('hotspot')}
                >
                  📡 Hotspot
                </div>
                <div 
                  className={`need-badge ${needs.remote ? 'active' : ''}`}
                  onClick={() => toggleNeed('remote')}
                >
                  💻 Remote Work
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ACTION */}
          <div style={{ marginTop: 20 }}>
            <Button 
              style={{ width: '100%', fontSize: '16px', padding: '14px' }} 
              disabled={stops.length === 0}
              onClick={onStartSearch}
            >
              {stops.length === 0 ? "Enter a destination above" : "Find best plans"}
            </Button>
          </div>

        </div>
        {/* End Widget */}

      </div>

      <div className="grid two home-grid">
        <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>🌍</div>
          <h3 style={{ margin: '0 0 6px' }}>Global Coverage</h3>
          <div className="muted small">One eSIM, 190+ countries. No swapping.</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>💸</div>
          <h3 style={{ margin: '0 0 6px' }}>Compare & Save</h3>
          <div className="muted small">We check Airalo, Nomad, and more for you.</div>
        </div>
      </div>
    </div>
  );
};

export default Home;