import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/shared';
import { COUNTRIES } from '../data';
import { todayISO, countryMeta } from '../utils';

const Home = ({ appState, updateState, onStartSearch }) => {
  const { stops, needs, flexible, flexibleDays } = appState;
  
  const [destInput, setDestInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showInput, setShowInput] = useState(stops.length === 0);

  const inputRef = useRef(null);
  const isFirstLoad = useRef(true);

  // Logic: Auto-focus the input when it appears (but do NOT open the menu yet)
  useEffect(() => {
    if (showInput && inputRef.current) {
      if (!isFirstLoad.current) {
        inputRef.current.focus();
      }
    }
    isFirstLoad.current = false;
  }, [showInput]);

  // Filter countries for dropdown
  const filteredCountries = destInput 
    ? COUNTRIES.filter(c => c[1].toLowerCase().includes(destInput.toLowerCase()) || c[0].toLowerCase().includes(destInput.toLowerCase()))
    : COUNTRIES;

  const addStop = (code) => {
    const t = todayISO();
    const newStops = [...stops, { country: code, start: t, end: t }];
    updateState({ stops: newStops });
    
    // Reset interaction & Hide Input
    setDestInput("");
    setIsDropdownOpen(false);
    setShowInput(false); 
  };

  const removeStop = (index) => {
    const newStops = stops.filter((_, i) => i !== index);
    updateState({ stops: newStops });
    
    // If we removed the last stop, show input automatically
    if (newStops.length === 0) {
      setShowInput(true);
      isFirstLoad.current = false; 
    }
  };

  const updateStopDate = (index, field, value) => {
    const newStops = [...stops];
    newStops[index][field] = value;
    updateState({ stops: newStops });
  };

  const toggleNeed = (key) => {
    if (key === 'heavy' || key === 'medium' || key === 'light') {
       updateState({ needs: { ...needs, usage: key } });
    } else {
       updateState({ needs: { ...needs, [key]: !needs[key] } });
    }
  };

  return (
    <div className="home-container">
      
      {/* Invisible backdrop to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="dropdown-backdrop" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
      
      {/* Hero Section */}
      <div className="hero">
        <h1>Let us take care of your sim needs</h1>
        <p>Check out the cheapest, and best options in your destination.</p>

        {/* --- TRIP BUILDER WIDGET --- */}
        <div className="trip-builder">
          
          {/* STEP 1: DESTINATIONS */}
          <div className="tb-step">
            <div className="tb-label">1. Where are you going?</div>
            
            {/* List of added stops */}
            {stops.map((stop, idx) => {
              const meta = countryMeta(stop.country);
              return (
                <div key={idx} className="stop-item">
                  <div className="stop-info">
                    <img 
                      src={`https://flagcdn.com/w40/${stop.country.toLowerCase()}.png`}
                      alt={meta.name}
                      style={{ width: 24, height: 18, borderRadius: 2, objectFit: 'cover' }}
                    />
                    <span className="stop-name">{meta.name}</span>
                  </div>
                  
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

            {/* CONDITIONAL INPUT OR ADD BUTTON */}
            {showInput ? (
              <div className="dropdown-wrapper">
                <input 
                  ref={inputRef}
                  className="destination-input"
                  placeholder={stops.length === 0 ? "Enter a destination (e.g. Japan)..." : "Type another destination..."}
                  value={destInput}
                  
                  // CHANGE: Open ONLY on click or typing, NOT on focus.
                  onClick={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setDestInput(e.target.value);
                    if (!isDropdownOpen) setIsDropdownOpen(true);
                  }}
                  // Removed onFocus handler so auto-focus doesn't pop the menu open
                />

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    {filteredCountries.map(([code, name]) => (
                      <div 
                        key={code} 
                        className="dropdown-item" 
                        onClick={() => addStop(code)}
                      >
                        <img 
                          src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
                          srcSet={`https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`}
                          alt={name}
                          className="dropdown-flag-img"
                          loading="lazy"
                        />
                        <span className="dropdown-name">{name}</span>
                      </div>
                    ))}
                    {filteredCountries.length === 0 && (
                      <div style={{padding: '16px', color: 'var(--muted)', fontSize: '13px', textAlign:'center'}}>
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              // The "Add Stop" Button (shown when stops exist)
              <div className="add-stop-row">
                <button 
                  className="btn-add-stop"
                  onClick={() => setShowInput(true)}
                >
                  + Add another destination
                </button>
              </div>
            )}
            
            {/* Flexible Toggle */}
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

          {/* ACTION */}
          <div style={{ marginTop: 20 }}>
            <Button 
              style={{ width: '100%', fontSize: '16px', padding: '14px' }} 
              disabled={stops.length === 0}
              onClick={onStartSearch}
            >
              {stops.length === 0 ? "Select a destination" : "Find best plans"}
            </Button>
          </div>

        </div>
      </div>

      {/* <div className="grid two home-grid">
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
      </div> */}
    </div>
  );
};

export default Home;