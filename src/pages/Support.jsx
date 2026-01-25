import React from 'react';
import { Panel, Card } from '../components/shared';

const Support = () => (
  <div className="grid two">
    <Panel title="Support" subtitle="Common questions for Level 1 (affiliate flow).">
      <div className="stack">
        {[
          ["What is an eSIM?", "An eSIM is a digital SIM. You install it on your phone and use it for data abroad."],
          ["Will my phone work?", "Your device must support eSIM and be carrier-unlocked."],
          ["Install tips", "Install on Wi‑Fi before you travel, then enable it on arrival."],
        ].map(([t, b]) => (
          <Card key={t}>
            <div style={{ fontWeight: 900 }}>{t}</div>
            <div className="muted small" style={{ marginTop: 8, lineHeight: 1.55 }}>{b}</div>
          </Card>
        ))}
      </div>
    </Panel>
  </div>
);

export default Support;