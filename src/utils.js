import { COUNTRIES, PROVIDERS } from './data';

export const todayISO = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const parseDate = (s) => (s ? new Date(s + "T00:00:00") : null);

export const daysBetweenInclusive = (aISO, bISO) => {
  const a = parseDate(aISO), b = parseDate(bISO);
  if (!a || !b) return 0;
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff) + 1;
};

export const clampInt = (v, min, max) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.floor(n)));
};

export const money = (n) => {
  if (!Number.isFinite(n)) return "—";
  return `$${Math.round(n)}`;
};

export const providerName = (pid) => {
  return (PROVIDERS.find(p => p.id === pid) || { name: pid }).name;
};

export const countryMeta = (code) => {
  const c = COUNTRIES.find(x => x[0] === code);
  return c ? { code: c[0], name: c[1], flag: c[2] } : { code, name: code, flag: "🏳️" };
};

export const uniqCountries = (stops) => {
  const out = [];
  const seen = new Set();
  for (const s of stops) {
    const c = (s.country || "").toUpperCase().trim();
    if (!c) continue;
    if (!seen.has(c)) { seen.add(c); out.push(c); }
  }
  return out;
};

export const calcTripDays = (flexible, flexibleDays, stops) => {
  if (flexible) return clampInt(flexibleDays, 1, 90);
  let sum = 0;
  for (const s of stops) {
    sum += daysBetweenInclusive(s.start, s.end);
  }
  return sum || 1;
};

export const calcRecommendedGB = (tripDays, usage, remote) => {
  const base = usage === "light" ? 0.35 : usage === "medium" ? 0.7 : 1.2;
  const bump = remote ? 0.4 : 0.0;
  return Math.ceil((base + bump) * tripDays);
};

export const getOrCreateTripId = () => {
  const key = "esim_trip_id";
  let v = localStorage.getItem(key);
  if (!v) {
    v = "t_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(key, v);
  }
  return v;
};

export const logClick = ({ planId, providerId, packageId, outboundUrl }) => {
  const key = "esim_clicks";
  const clicks = JSON.parse(localStorage.getItem(key) || "[]");
  clicks.unshift({
    clickId: "c_" + Math.random().toString(36).slice(2, 10),
    ts: new Date().toISOString(),
    planId, providerId, packageId, outboundUrl
  });
  localStorage.setItem(key, JSON.stringify(clicks));
};