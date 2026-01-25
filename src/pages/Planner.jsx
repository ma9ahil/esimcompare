import React from 'react';
import { Panel, Card, Toggle, Button, Badge } from '../components/shared';
import { COUNTRIES } from '../data';
import { todayISO, clampInt, countryMeta } from '../utils';

const Planner = ({ appState, updateState, setNav }) => {
  const { tripName, flexible, flexibleDays, stops, needs, derived } = appState;

  const handleStopChange = (idx, field, val) => {
    const newStops = [...stops];
    if (field === "country") val = val.toUpperCase().slice(0, 2);
    newStops[idx][field] = val;
    updateState({ stops: newStops });
  };

  const addStop = () => {
    const t = todayISO();
    updateState({ stops: [...stops, { country: "TH", start: t, end: t }] });
  };

  const removeStop = (idx) => {
    const newStops = stops.filter((_, i) => i !== idx);
    updateState({ stops: newStops });
  };

  const moveStop = (idx, dir) => {
    const j = dir === "up" ? idx - 1 : idx + 1;
    if (j < 0 || j >= stops.length) return;
    const newStops = [...stops];
    const tmp = newStops[idx];
    newStops[idx] = newStops[j];
    newStops[j] = tmp;
    updateState({ stops: newStops });
  };

  return (
    <div className="grid two">
      <Panel title="Trip builder">
        <div className="stack">

          <Toggle 
            label="Flexible dates" 
            sub="If you’re unsure, just set total trip days" 
            checked={flexible} 
            onChange={(v) => updateState({ flexible: v })} 
          />

          {flexible && (
            <Card>
              <label>Total trip days</label>
              <input 
                type="number" min="1" max="90" 
                value={flexibleDays} 
                onChange={(e) => updateState({ flexibleDays: clampInt(e.target.value, 1, 90) })} 
              />
            </Card>
          )}

          <Card>
            <div className="row">
              <div style={{ fontWeight: 800 }}>Stops</div>
              <Button variant="secondary" onClick={addStop}>+ Add stop</Button>
            </div>
            <div className="sep"></div>
            <div className="stack">
              {stops.map((s, idx) => {
                const cm = countryMeta(s.country);
                return (
                  <div key={idx}>
                    <Card>
                      <div className="row" style={{ gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Badge color="gray">{idx + 1}</Badge>
                          <div>
                            <div style={{ fontWeight: 900 }}>{cm.flag} <span className="mono">{cm.code}</span> {cm.name}</div>
                            <div className="muted small">Tap country to change. Use ↑↓ to reorder.</div>
                          </div>
                        </div>
                        <div className="row" style={{ gap: 8 }}>
                          <Button variant="secondary" onClick={() => moveStop(idx, "up")}>↑</Button>
                          <Button variant="secondary" onClick={() => moveStop(idx, "down")}>↓</Button>
                          <Button variant="danger" onClick={() => removeStop(idx)}>Remove</Button>
                        </div>
                      </div>
                      <div className="sep"></div>
                      <div className="inline three">
                        <div>
                          <label>Country</label>
                          <input 
                            list="countryList" 
                            value={s.country} 
                            onChange={(e) => handleStopChange(idx, "country", e.target.value)} 
                            placeholder="ISO2" 
                          />
                        </div>
                        {!flexible && (
                          <>
                            <div>
                              <label>Start</label>
                              <input type="date" value={s.start} onChange={(e) => handleStopChange(idx, "start", e.target.value)} />
                            </div>
                            <div>
                              <label>End</label>
                              <input type="date" value={s.end} onChange={(e) => handleStopChange(idx, "end", e.target.value)} />
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                    {idx < stops.length - 1 && <div className="sep"></div>}
                  </div>
                );
              })}
            </div>
          </Card>
          <div className="inline two">
            <Button variant="secondary" onClick={() => setNav("home")}>Back</Button>
            <Button onClick={() => setNav("home") /* Just stays here in react version really */}>Next</Button>
          </div>
        </div>
      </Panel>

      <Panel title="Needs" subtitle="Choose usage + hotspot + remote work.">
        <div className="stack">
          <Card>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>Usage</div>
            <div className="seg">
              {['light', 'medium', 'heavy'].map(u => (
                <button 
                  key={u} 
                  className={needs.usage === u ? "active" : ""}
                  onClick={() => updateState({ needs: { ...needs, usage: u } })}
                >
                  {u.charAt(0).toUpperCase() + u.slice(1)}
                </button>
              ))}
            </div>
            <div className="muted small" style={{ marginTop: 10, lineHeight: 1.5 }}>
              Light: maps + messaging • Medium: socials • Heavy: streaming
            </div>
          </Card>

          <Toggle 
            label="Need hotspot" sub="Tether your laptop" 
            checked={needs.hotspot} 
            onChange={(v) => updateState({ needs: { ...needs, hotspot: v } })} 
          />
          <Toggle 
            label="Remote work / video" sub="Adds buffer" 
            checked={needs.remote} 
            onChange={(v) => updateState({ needs: { ...needs, remote: v } })} 
          />

          <Card>
            <div className="row">
              <div>
                <div className="muted small">Recommendation</div>
                <div style={{ fontWeight: 900, fontSize: 20, marginTop: 4 }}>~{derived.recommendedGB} GB</div>
              </div>
              <Badge color="gray">{derived.tripDays} days</Badge>
            </div>
          </Card>

          <div className="inline two">
            <Button variant="secondary">Edit trip</Button>
            <Button variant="success" onClick={() => setNav("results")}>Show plans</Button>
          </div>
        </div>
      </Panel>
      <datalist id="countryList">
        {COUNTRIES.map(c => <option key={c[0]} value={c[0]}>{c[1]}</option>)}
      </datalist>
    </div>
  );
};

export default Planner;