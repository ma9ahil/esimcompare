import { STATIC_PLANS } from './data';
import { calcTripDays, calcRecommendedGB, uniqCountries } from './utils';

// Helper logic for local generation
const baseLocalPrice = (code, providerId) => {
  const bumps = { SG: 3, TH: 0, VN: 1, MY: 1, ID: 2, PH: 2, KH: 1, LA: 2, MM: 4 };
  const countryBump = bumps[code] ?? 2;
  const providerBump = { airalo: 0, nomad: 1, ubigi: 2, holafly: 2 }[providerId] ?? 1;
  return 7 + countryBump + providerBump;
};

const ensureLocalPlansFor = (code) => {
  const providers = ["airalo", "nomad", "ubigi"];
  return providers.map(pid => ({
    planId: `${pid}_${code}_local_5gb_15d`,
    providerId: pid,
    type: "local",
    title: `${code} Local 5GB`,
    price: baseLocalPrice(code, pid),
    currency: "USD",
    dataGB: 5,
    validityDays: 15,
    hotspot: true,
    topUp: pid !== "ubigi",
    coverage: [code],
    affiliateUrl: `https://example.com/${pid}-${code.toLowerCase()}`
  }));
};

// Main function
export const computePackages = (state) => {
  const needed = uniqCountries(state.stops);
  const d = calcTripDays(state.flexible, state.flexibleDays, state.stops);
  const recGB = calcRecommendedGB(d, state.needs.usage, state.needs.remote);

  // Combine static + dynamic
  const locals = needed.flatMap(ensureLocalPlansFor);
  const plans = [...STATIC_PLANS, ...locals];

  const hotspotOk = (plan) => {
    if (!state.needs.hotspot) return true;
    return plan.hotspot === true || plan.hotspot === "limited";
  };

  const coversAll = (plan) => {
    if (plan.coverage.includes("*")) return true;
    const set = new Set(plan.coverage);
    return needed.every(c => set.has(c));
  };

  // Best Overall
  const bestCandidates = plans.filter(p =>
    (p.type === "regional" || p.type === "global") &&
    p.validityDays >= d &&
    coversAll(p) &&
    hotspotOk(p)
  ).sort((a, b) => (a.price || 0) - (b.price || 0));

  const bestPlan = bestCandidates[0] || null;

  const bestPkg = bestPlan ? {
    id: "best",
    badge: "Best overall",
    headline: bestPlan.type === "global" ? "1 global eSIM" : "1 regional eSIM",
    installs: 1,
    totalPrice: bestPlan.price,
    currency: bestPlan.currency,
    validityDays: bestPlan.validityDays,
    hotspot: bestPlan.hotspot,
    topUp: bestPlan.topUp,
    coverageSet: new Set(bestPlan.coverage.includes("*") ? needed : bestPlan.coverage),
    why: "One install, works across borders, fits your trip duration.",
    offers: [bestPlan],
    compare: bestCandidates.slice(0, 10)
  } : {
    id: "best",
    badge: "Best overall",
    headline: "Regional/global eSIM (not available)",
    installs: 1,
    totalPrice: NaN,
    currency: "USD",
    validityDays: 0,
    hotspot: false,
    topUp: false,
    coverageSet: new Set(),
    why: "No single regional/global plan in this demo fits your exact route + constraints.",
    offers: [],
    compare: []
  };

  // Cheapest (Mix of locals)
  const localCandidates = plans.filter(p => p.type === "local" && p.validityDays >= 7 && hotspotOk(p));
  const chosenLocals = [];
  for (const c of needed) {
    const opts = localCandidates.filter(p => p.coverage.includes(c)).sort((a, b) => a.price - b.price);
    if (opts[0]) chosenLocals.push(opts[0]);
  }
  const localTotal = chosenLocals.reduce((s, p) => s + p.price, 0);
  const localCoverage = new Set(chosenLocals.flatMap(p => p.coverage));

  // Compare mix
  const cheapCompare = ["airalo", "nomad", "ubigi"].map(pid => {
    let total = 0;
    let fits = true;
    for (const c of needed) {
      const opts = localCandidates.filter(p => p.providerId === pid && p.coverage.includes(c)).sort((a, b) => a.price - b.price);
      if (!opts[0]) { fits = false; continue; }
      total += opts[0].price;
    }
    return {
      providerId: pid, planId: `local_mix_${pid}`, type: "local", title: "Local mix estimate",
      price: total, currency: "USD", validityDays: 15, hotspot: true, topUp: true,
      coverage: needed, affiliateUrl: "", fits
    };
  }).sort((a, b) => a.price - b.price);

  const cheapPkg = {
    id: "cheap",
    badge: "Cheapest",
    headline: "Local mix",
    installs: chosenLocals.length,
    totalPrice: localTotal,
    currency: "USD",
    validityDays: d,
    hotspot: true,
    topUp: true,
    coverageSet: localCoverage,
    why: "Cheaper, but you may install multiple eSIMs and switch at borders.",
    offers: chosenLocals,
    compare: cheapCompare
  };

  // Stress-free (Unlimited)
  const unlimitedCandidates = plans.filter(p =>
    p.type === "unlimited" && p.validityDays >= d && coversAll(p) && hotspotOk(p)
  ).map(p => {
    const price = p.pricePerDay ? (p.pricePerDay * d) : p.price;
    return { ...p, computedPrice: price };
  }).sort((a, b) => a.computedPrice - b.computedPrice);

  const unlim = unlimitedCandidates[0] || null;
  const stressPkg = unlim ? {
    id: "stressfree",
    badge: "Most stress-free",
    headline: "Unlimited (by days)",
    installs: 1,
    totalPrice: unlim.computedPrice,
    currency: unlim.currency,
    validityDays: d,
    hotspot: unlim.hotspot,
    topUp: unlim.topUp,
    coverageSet: new Set(unlim.coverage.includes("*") ? needed : unlim.coverage),
    why: "Best for heavy usage and decision fatigue. Price scales with days.",
    offers: [unlim],
    compare: unlimitedCandidates.slice(0, 10)
  } : {
    id: "stressfree",
    badge: "Most stress-free",
    headline: "Unlimited (not available)",
    installs: 1,
    totalPrice: NaN,
    currency: "USD",
    validityDays: 0,
    hotspot: false,
    topUp: false,
    coverageSet: new Set(),
    why: "No unlimited plan in this demo fits your route.",
    offers: [],
    compare: []
  };

  return {
    trip: { needed, tripDays: d, recommendedGB: recGB },
    packages: [bestPkg, cheapPkg, stressPkg]
  };
};

// Need access to this for Compare Modal logic
export { STATIC_PLANS, ensureLocalPlansFor };