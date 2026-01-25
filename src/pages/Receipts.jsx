import React, { useState, useEffect } from 'react';
import { Panel, Card, Badge, Chip, Button, Notice } from '../components/shared';
import { money, countryMeta, uniqCountries } from '../utils';

const Receipts = ({ onLoadReceipt, setNav }) => {
  const [receipts, setReceipts] = useState([]);
  const [viewId, setViewId] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("esim_receipts") || "[]");
    setReceipts(data);
  }, []);

  const openReceipt = receipts.find(r => r.receiptId === viewId);

  const clear = () => {
    if(!window.confirm("Clear all?")) return;
    localStorage.removeItem("esim_receipts");
    setReceipts([]);
    setViewId(null);
  };

  return (
    <div className="grid two">
      <Panel title="Receipts" subtitle="Saved “trip receipts” for sharing or returning later.">
        <div className="stack">
          <Card>
            <div className="row">
              <div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>Saved receipts</div>
                <div className="muted small" style={{ marginTop: 6 }}>Stored in browser (localStorage).</div>
              </div>
              <Badge color="gray">{receipts.length}</Badge>
            </div>
            <div className="sep"></div>
            <div className="inline two">
              <Button variant="secondary" onClick={clear} disabled={!receipts.length}>Clear receipts</Button>
              <Button>Export JSON</Button>
            </div>
          </Card>
          <div className="stack">
            {receipts.length === 0 && <Notice>No receipts yet.</Notice>}
            {receipts.map(r => {
               const d = new Date(r.createdAt);
               const countries = uniqCountries(r.stops).slice(0, 6);
               return (
                 <Card key={r.receiptId}>
                   <div className="row">
                     <div>
                       <div style={{ fontWeight: 900 }}>{r.tripName}</div>
                       <div className="muted small">{d.toLocaleString()} • {r.derived.tripDays}d</div>
                     </div>
                     <Button variant="secondary" onClick={() => setViewId(r.receiptId)}>Open</Button>
                   </div>
                   <div style={{ marginTop: 10 }} className="chips">
                     {countries.map(c => <Chip key={c}>{countryMeta(c).flag} <span className="mono">{countryMeta(c).code}</span></Chip>)}
                   </div>
                 </Card>
               );
            })}
          </div>
        </div>
      </Panel>

      <Panel title="Receipt detail" subtitle={openReceipt ? "Snapshot loaded" : "Select a receipt to view."}>
        <div className="stack">
          {openReceipt && (
            <Card>
              <div className="row">
                <div>
                  <Badge color="gray">Receipt</Badge>
                  <div style={{ fontWeight: 900, fontSize: 18, marginTop: 8 }}>{openReceipt.tripName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 900, fontSize: 20 }}>{money(openReceipt.chosenPackage.totalPrice)}</div>
                </div>
              </div>
              <div className="sep"></div>
              <div className="inline three">
                <Button variant="secondary" onClick={() => setViewId(null)}>Back</Button>
                <Button>Copy link</Button>
                <Button variant="success" onClick={() => { onLoadReceipt(openReceipt); setNav("results"); }}>Recompute</Button>
              </div>
            </Card>
          )}
        </div>
      </Panel>
    </div>
  );
};

export default Receipts;