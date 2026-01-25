import React, { useState } from 'react';
import { Panel, Card, Badge, Chip, Notice, Button } from '../components/shared';
import Modal from '../components/Modal';
import { money, countryMeta, providerName, logClick } from '../utils';

const Results = ({ results, setNav, onSelectPackage }) => {
  const { trip, packages } = results;
  const [modalPkg, setModalPkg] = useState(null);

  const openCompare = (pkg) => setModalPkg(pkg);
  const closeCompare = () => setModalPkg(null);

  const handleOpenPlan = (p, pkgId) => {
    const outbound = p.affiliateUrl || "https://example.com";
    logClick({ planId: p.planId, providerId: p.providerId, packageId: pkgId, outboundUrl: outbound });
    window.open(outbound, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="stack">
        {/* 1. Description on TOP */}
        <Panel title="Recommendations" subtitle={`${trip.needed.length} countries • ${trip.tripDays} days • ~${trip.recommendedGB}GB`}>
          <div className="stack">
            <Card>
              <div className="row">
                <div>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>My Trip</div>
                  <div className="muted small" style={{ marginTop: 6, lineHeight: 1.55 }}>
                    Your itinerary drives coverage. 
                  </div>
                </div>
                <Badge color="gray">Global</Badge>
              </div>
              <div className="sep"></div>
              <div className="chips">
                {trip.needed.map(c => {
                  const cm = countryMeta(c);
                  return <Chip key={c}>{cm.flag} <span className="mono">{cm.code}</span></Chip>;
                })}
              </div>
            </Card>
          </div>
        </Panel>

        {/* 2. Three Badges SIDE BY SIDE */}
        <div className="results-grid">
          {packages.map(pkg => {
            const covered = trip.needed.filter(c => pkg.coverageSet.has(c)).length;
            const fully = covered === trip.needed.length;
            
            return (
              <Panel key={pkg.id} title="" subtitle="">
                <div className="ph" style={{ paddingTop: 0 }}>
                  <div className="row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <Badge color={pkg.id === "cheap" ? "gray" : pkg.id === "best" ? "gray" : "green"}>{pkg.badge}</Badge>
                    </div>
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 900, fontSize: 18, letterSpacing: '-.2px', minHeight: '44px' }}>
                    {pkg.headline}
                  </div>
                  <div className="price" style={{ margin: '10px 0' }}>
                    {Number.isFinite(pkg.totalPrice) ? money(pkg.totalPrice) : "—"}
                  </div>
                  <div className="hint" style={{ minHeight: '34px' }}>{pkg.why}</div>
                </div>
                <div className="content">
                  <div className="sep"></div>
                  <div className="kpi" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div className="tile"><div className="l">Cover</div><div className="v">{covered}/{trip.needed.length}</div></div>
                    <div className="tile"><div className="l">Installs</div><div className="v">{pkg.installs}</div></div>
                  </div>
                  <div className="sep"></div>
                  <div className="stack">
                    <Button disabled={!pkg.offers.length} onClick={() => onSelectPackage(pkg.id)}>View details</Button>
                    <Button variant="secondary" disabled={!pkg.compare.length} onClick={() => openCompare(pkg)}>Compare</Button>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      </div>

      <Modal isOpen={!!modalPkg} onClose={closeCompare} title={`Compare — ${modalPkg?.badge}`} sub={`${trip.needed.length} countries • ${trip.tripDays} days`}>
        <Notice>
          <strong>How to read:</strong> “Fits route” means all your countries are included and validity ≥ trip length. Prices are demo.
        </Notice>
        <table className="table">
          <tbody>
            {modalPkg?.compare.map((r, i) => (
              <tr key={i}>
                <td style={{ width: '30%' }}>
                  <div style={{ fontWeight: 900 }}>{providerName(r.providerId)}</div>
                  <div className="muted small">{r.title}</div>
                </td>
                <td className="small" style={{ width: '18%' }}>
                  <div className="muted">Validity</div>
                  <div style={{ fontWeight: 900 }}>{r.validityDays}d</div>
                </td>
                <td className="small" style={{ width: '18%' }}>
                  <div className="muted">Hotspot</div>
                  <div style={{ fontWeight: 900 }}>{r.hotspot === true ? "Yes" : r.hotspot === "limited" ? "Ltd" : "No"}</div>
                </td>
                <td className="small" style={{ width: '16%' }}>
                  <div className="muted">Price</div>
                  <div style={{ fontWeight: 900 }}>{money(r.price)}</div>
                </td>
                <td className="small" style={{ width: '18%' }}>
                  <div className={`fit ${r.fits ? "ok" : "bad"}`}>{r.fits ? "✅ Fits" : "⚠️ No fit"}</div>
                  <div style={{ marginTop: 8 }}>
                    <button className="btn" disabled={!r.affiliateUrl} onClick={() => handleOpenPlan(r, modalPkg.id)}>Open</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </>
  );
};

export default Results;