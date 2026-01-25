import React from 'react';

export const Header = ({ current, setNav, theme, toggleTheme, stats }) => {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "planner", label: "Planner" },
    { id: "results", label: "Results" },
    { id: "receipts", label: "Receipts" },
    { id: "support", label: "Support" },
  ];

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo Area */}
        <div className="brand" onClick={() => setNav('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-dot"></div>
          <span>eSIM Compare</span>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          {navItems.map(item => (
            <div 
              key={item.id} 
              className={`nav-item ${current === item.id ? 'active' : ''}`}
              onClick={() => setNav(item.id)}
            >
              {item.label}
            </div>
          ))}
        </nav>

        {/* Right Actions: Stats + Theme */}
        <div className="header-actions">
          <div className="nav-stats">
            <strong>{stats.stopCount}</strong> stops • <strong>{stats.days}</strong> days
          </div>
          <button 
            onClick={toggleTheme} 
            className="btn secondary icon-only" 
            title="Toggle Theme"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </header>
  );
};