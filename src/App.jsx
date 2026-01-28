import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import { Header } from './components/Layout';
import { calcTripDays, calcRecommendedGB, uniqCountries } from './utils';
import { computePackages } from './engine';

import Home from './pages/Home';
import Planner from './pages/Planner';
import Results from './pages/Results';
import PackageDetail from './pages/PackageDetail';
import Receipts from './pages/Receipts';
import Support from './pages/Support';

function App() {
  const [nav, setNav] = useState("home");
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const [state, setState] = useState({
    tripName: "My Trip",
    flexible: false,
    flexibleDays: 14,
    stops: [
      { country: "TH", start: "2026-02-10", end: "2026-02-14" },
      { country: "VN", start: "2026-02-15", end: "2026-02-19" },
      { country: "SG", start: "2026-02-20", end: "2026-02-22" },
    ],
    needs: { usage: "medium", hotspot: true, remote: false },
  });

  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

  const derived = useMemo(() => {
    const days = calcTripDays(state.flexible, state.flexibleDays, state.stops);
    const gb = calcRecommendedGB(days, state.needs.usage, state.needs.remote);
    const stopCount = uniqCountries(state.stops).length;
    return { tripDays: days, recommendedGB: gb, stopCount };
  }, [state]);

  const results = useMemo(() => computePackages({ ...state, needs: state.needs }), [state]);

  const handleSaveReceipt = (pkg) => {
    const receipt = {
      receiptId: "r_" + Math.random().toString(36).slice(2, 10),
      createdAt: new Date().toISOString(),
      tripName: state.tripName,
      flexible: state.flexible,
      flexibleDays: state.flexibleDays,
      stops: state.stops,
      needs: state.needs,
      derived,
      chosenPackage: pkg,
      chosenPackageId: pkg.id
    };
    const prev = JSON.parse(localStorage.getItem("esim_receipts") || "[]");
    localStorage.setItem("esim_receipts", JSON.stringify([receipt, ...prev]));
    setNav("receipts");
  };

  const loadReceipt = (r) => {
    setState({
      tripName: r.tripName,
      flexible: r.flexible,
      flexibleDays: r.flexibleDays,
      stops: r.stops,
      needs: r.needs
    });
  };

  const renderView = () => {
    switch (nav) {
      case "home": return <Home setNav={setNav} />;
      case "planner": 
        return <Planner appState={{ ...state, derived }} updateState={updateState} setNav={setNav} />;
      case "results": 
        return <Results results={results} setNav={setNav} onSelectPackage={(id) => { setSelectedPackageId(id); setNav("detail"); }} />;
      case "detail":
        const pkg = results.packages.find(p => p.id === selectedPackageId);
        return <PackageDetail pkg={pkg} trip={results.trip} setNav={setNav} onSaveReceipt={handleSaveReceipt} />;
      case "receipts": 
        return <Receipts onLoadReceipt={loadReceipt} setNav={setNav} />;
      case "support": return <Support />;
      default: return <Home setNav={setNav} />;
    }
  };

  return (
    <div className="app">
      {/* New Top Header */}
      <Header 
        current={nav} 
        setNav={setNav} 
        theme={theme} 
        toggleTheme={toggleTheme}
        stats={{ stopCount: derived.stopCount, days: derived.tripDays }} 
      />
      
      <div id="viewRoot">
        {renderView()}
      </div>
    </div>
  );
}

export default App;