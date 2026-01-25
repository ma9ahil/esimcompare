import React from 'react';

export const Panel = ({ title, subtitle, children }) => (
  <div className="panel">
    <div className="ph">
      <h2>{title}</h2>
      <div className="hint">{subtitle}</div>
    </div>
    <div className="content">{children}</div>
  </div>
);

export const Card = ({ children, className = "" }) => (
  <div className={`card ${className}`}>{children}</div>
);

export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const cls = `btn ${variant !== "primary" ? variant : ""} ${className}`;
  return <button className={cls} {...props}>{children}</button>;
};

export const Toggle = ({ label, sub, checked, onChange }) => (
  <div className="toggle" onClick={() => onChange(!checked)}>
    <div className="ttext">
      <div className="t1">{label}</div>
      <div className="t2">{sub}</div>
    </div>
    <div className={`switch ${checked ? "on" : ""}`} role="switch" aria-checked={checked} />
  </div>
);

export const Badge = ({ children, color = "gray" }) => (
  <span className={`badge ${color}`}>{children}</span>
);

export const Chip = ({ children, status = "default" }) => (
  <span className={`chip ${status}`}>{children}</span>
);

export const Notice = ({ children }) => <div className="notice">{children}</div>;