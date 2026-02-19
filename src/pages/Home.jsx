import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/shared';
import { COUNTRIES } from '../data';
import { todayISO, countryMeta } from '../utils';

const POPULAR_DESTINATIONS = [
  { code: "JP", name: "Japan", badge: "Trending", emoji: "🇯🇵" },
  { code: "TH", name: "Thailand", badge: "Best Value", emoji: "🇹🇭" },
  { code: "ES", name: "Spain", badge: "Hot", emoji: "🇪🇸" },
  { code: "US", name: "United States", badge: "Popular", emoji: "🇺🇸" },
];

const Home = ({ appState, updateState, onStartSearch }) => {
  const { stops, needs, flexible, flexibleDays } = appState;
  
  const [destInput, setDestInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showInput, setShowInput] = useState(stops.length === 0);

  const inputRef = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (showInput && inputRef.current && !isFirstLoad.current) {
      inputRef.current.focus();
    }
    isFirstLoad.current = false;
  }, [showInput]);

  const filteredCountries = destInput 
    ? COUNTRIES.filter(c => c[1].toLowerCase().includes(destInput.toLowerCase()) || c[0].toLowerCase().includes(destInput.toLowerCase()))
    : COUNTRIES;

  const addStop = (code) => {
    const t = todayISO();
    const newStops = [...stops, { country: code, start: t, end: t }];
    updateState({ stops: newStops });
    setDestInput("");
    setIsDropdownOpen(false);
    setShowInput(false); 
  };

  const removeStop = (index) => {
    const newStops = stops.filter((_, i) => i !== index);
    updateState({ stops: newStops });
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
    if (['light', 'medium', 'heavy'].includes(key)) {
       updateState({ needs: { ...needs, usage: key } });
    } else {
       updateState({ needs: { ...needs, [key]: !needs[key] } });
    }
  };

  return (
    <div className="home-container">
      {isDropdownOpen && (
        <div className="dropdown-backdrop" onClick={() => setIsDropdownOpen(false)} />
      )}
      
      <div className="hero">
        <h1>Find your perfect eSIM</h1>
        <p>Compare the cheapest and best data plans for your next adventure.</p>

        {/* --- MOMONDO-STYLE SEARCH WIDGET --- */}
        <div className="search-widget-container">
          
          <div className="search-row">
            {/* Where to Input */}
            <div className="search-field dest-field">
              <label>Where</label>
              
              <div className="selected-stops">
                {stops.map((stop, idx) => {
                  const meta = countryMeta(stop.country);
                  return (
                    <div key={idx} className="stop-pill">
                      <img src={`https://flagcdn.com/w40/${stop.country.toLowerCase()}.png`} alt={meta.name} className="pill-flag" />
                      <span>{meta.name}</span>
                      <button className="pill-remove" onClick={() => removeStop(idx)}>×</button>
                    </div>
                  );
                })}
              </div>

              {showInput ? (
                <div className="dropdown-wrapper">
                  <input 
                    ref={inputRef}
                    className="destination-search-input"
                    placeholder={stops.length === 0 ? "Anywhere" : "Add another..."}
                    value={destInput}
                    onClick={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setDestInput(e.target.value);
                      if (!isDropdownOpen) setIsDropdownOpen(true);
                    }}
                  />
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      {filteredCountries.map(([code, name]) => (
                        <div key={code} className="dropdown-item" onClick={() => addStop(code)}>
                          <img src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`} alt={name} className="dropdown-flag-img" loading="lazy" />
                          <span className="dropdown-name">{name}</span>
                        </div>
                      ))}
                      {filteredCountries.length === 0 && (
                        <div className="dropdown-empty">No results found</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button className="add-stop-link" onClick={() => setShowInput(true)}>+ Add destination</button>
              )}
            </div>

            {/* Dates Field */}
            {stops.length > 0 && (
              <div className="search-field dates-field">
                <label>Dates</label>
                {stops.map((stop, idx) => (
                  <div key={idx} className="date-picker-row">
                    {!flexible ? (
                      <>
                        <input type="date" className="clean-date-input" value={stop.start} onChange={(e) => updateStopDate(idx, 'start', e.target.value)} />
                        <span>—</span>
                        <input type="date" className="clean-date-input" value={stop.end} onChange={(e) => updateStopDate(idx, 'end', e.target.value)} />
                      </>
                    ) : (
                      <span className="flexible-text">Flexible</span>
                    )}
                  </div>
                ))}
                
                <div className="flexible-toggle-row">
                   <label>
                     <input type="checkbox" checked={flexible} onChange={() => updateState({ flexible: !flexible })} /> 
                     Flexible dates
                   </label>
                   {flexible && (
                     <div className="flex-days-input">
                       <input type="number" value={flexibleDays} onChange={(e) => updateState({flexibleDays: e.target.value})} /> days
                     </div>
                   )}
                </div>
              </div>
            )}

            {/* Search Button */}
            <div className="search-action-field">
              <Button 
                className="search-btn-large"
                disabled={stops.length === 0}
                onClick={onStartSearch}
              >
                Search
              </Button>
            </div>
          </div>
          
          {/* Needs Row (Optional Filters) */}
          {stops.length > 0 && (
             <div className="filters-row">
                <div className="filters-label">Data Needs:</div>
                <div className="needs-pills">
                  <div className={`need-pill ${needs.usage === 'light' ? 'active' : ''}`} onClick={() => toggleNeed('light')}>Light</div>
                  <div className={`need-pill ${needs.usage === 'medium' ? 'active' : ''}`} onClick={() => toggleNeed('medium')}>Medium</div>
                  <div className={`need-pill ${needs.usage === 'heavy' ? 'active' : ''}`} onClick={() => toggleNeed('heavy')}>Heavy</div>
                  <div className="divider" />
                  <div className={`need-pill ${needs.hotspot ? 'active' : ''}`} onClick={() => toggleNeed('hotspot')}>Hotspot</div>
                  <div className={`need-pill ${needs.remote ? 'active' : ''}`} onClick={() => toggleNeed('remote')}>Remote Work</div>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* --- DESTINATIONS WITH BADGES --- */}
      <div className="destinations-section">
        <h2 className="section-title">Trending Destinations</h2>
        <div className="destinations-grid">
          {POPULAR_DESTINATIONS.map(dest => (
            <div className="dest-card" key={dest.code} onClick={() => {
                if(!stops.find(s => s.country === dest.code)) addStop(dest.code);
            }}>
              <div className="dest-badge">{dest.badge}</div>
              <div className="dest-emoji">{dest.emoji}</div>
              <h3>{dest.name}</h3>
              <p>Compare plans →</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;