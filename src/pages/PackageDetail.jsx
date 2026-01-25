import React from 'react';
import { Panel, Card, Badge, Chip, Button, Notice } from '../components/shared';
import { money, countryMeta, providerName, logClick } from '../utils';

const PackageDetail = ({ pkg, trip, setNav, onSaveReceipt }) => {
  if (!pkg) return <div>No package selected</div>;

  const handleOpenPlan = (p) => {
    const outbound = p.affiliateUrl;
    logClick({ planId: p.planId, providerId: p.providerId, packageId: pkg.id, outboundUrl: outbound });
    window.open(outbound, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid two">
      <Panel>
        <div className="ph">
          <div className="row">
            <div>
              <Badge color={pkg.id === "cheap" ? "gray" : pkg.id === "best" ? "gray" : "green"}>{pkg.badge}</Badge>
              <h2 style={{ marginTop: 10 }}>{pkg.headline}</h2>
              <div className="hint">{pkg.why}</div>
            </div>
            <div className="price">{Number.isFinite(pkg.totalPrice) ? money(pkg.totalPrice) : "—"}</div>
          </div>
        </div>
        <div className="content">
          <div className="chips">
            {trip.needed.map(c => {
              const ok = pkg.coverageSet.has(c);
              const cm = countryMeta(c);
              return <Chip key={c} status={ok ? "ok" : "bad"}>{cm.flag} <span className="mono">{cm.code}</span> {ok ? "✓" : "×"}</Chip>;
            })}
          </div>
          <div className="sep"></div>
          <div className="kpi">
            <div className="tile"><div className="l">Trip</div><div className="v">{trip.tripDays} days</div></div>
            <div className="tile"><div className="l">Recommended</div><div className="v">~{trip.recommendedGB}GB</div></div>
            <div className="tile"><div className="l">Installs</div><div className="v">{pkg.installs}</div></div>
          </div>
          <div className="sep"></div>
          <div className="inline three">
            <Button variant="secondary" onClick={() => setNav("results")}>← Results</Button>
            <Button disabled>Compare</Button>
            <Button onClick={() => onSaveReceipt(pkg)}>Save receipt</Button>
          </div>

        </div>
      </Panel>

      <Panel title="Offers in this package" subtitle="Open provider uses demo links + logs outbound click.">
        <div className="stack">
          {pkg.offers.map(p => {
             const cm = p.type === "local" ? countryMeta(p.coverage[0]) : null;
             const price = p.type === "unlimited" && p.pricePerDay ? (p.pricePerDay * trip.tripDays) : p.price;
             return (
               <Card key={p.planId}>
                 <div className="row">
                   <div>
                     <div style={{ fontWeight: 900 }}>{providerName(p.providerId)} • {p.title}</div>
                     <div className="muted small" style={{ marginTop: 6 }}>
                       {p.type === "local" ? `${cm.flag} ${cm.name} • ` : ""}{p.validityDays}d • Hotspot: {p.hotspot === true ? "Yes" : "No"}
                     </div>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <div style={{ fontWeight: 900, fontSize: 18 }}>{money(price)}</div>
                   </div>
                 </div>
                 <div className="sep"></div>
                 <div className="inline two">
                   <Button variant="success" onClick={() => handleOpenPlan(p)}>Open provider</Button>
                   <Button variant="secondary">Copy plan id</Button>
                 </div>
               </Card>
             );
          })}
        </div>
      </Panel>
    </div>
  );
};

export default PackageDetail;