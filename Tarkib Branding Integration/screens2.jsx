/* screens2.jsx — Pairing: connecting / accept-on-TV / success / error */
const { Icon, Screen } = window;

function PairHeader({ title = 'Connect to TV' }) {
  return (
    <div className="appbar">
      <button className="iconbtn" style={{ marginLeft: -8 }}><Icon name="arrow-left" size={24} /></button>
      <div className="title">{title}</div>
    </div>
  );
}

// stage: 0 connecting, 1 accept, 2 done
function StepBar({ stage }) {
  const steps = ['Connect', 'Accept on TV', 'Done'];
  return (
    <div className="steps" style={{ padding: '6px 6px 0' }}>
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          {i > 0 && <div className={'step-line' + (i <= stage ? ' done' : '')} />}
          <div className={'step ' + (i < stage ? 'done' : i === stage ? 'active' : '')}>
            <div className="step-dot">
              {i < stage ? <Icon name="check" size={14} color="#0A0A0A" stroke={2.6} /> : i + 1}
            </div>
            <div className="step-label">{label}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ── 3a · Connecting ──────────────────────────────────────────────────
function PairConnecting() {
  return (
    <Screen>
      <PairHeader />
      <div className="body">
        <StepBar stage={0} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <div className="spinner" />
          <div style={{ textAlign: 'center' }}>
            <div className="t-label" style={{ fontSize: 17, marginBottom: 6 }}>Connecting to Living Room TV…</div>
            <div className="t-hint mono">192.168.1.42</div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ── 3b · Accept on TV (with PIN fallback shown) ──────────────────────
function PairAccept() {
  return (
    <Screen>
      <PairHeader />
      <div className="body">
        <StepBar stage={1} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, paddingTop: 8 }}>
          {/* flat line-art TV with accept dialog */}
          <svg width="200" height="132" viewBox="0 0 200 132" fill="none">
            <rect x="6" y="6" width="188" height="108" rx="8" stroke="#2A2A2A" strokeWidth="2" />
            <path d="M78 124h44M100 114v10" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" />
            {/* dialog */}
            <rect x="44" y="34" width="112" height="56" rx="7" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="1.5" />
            <rect x="56" y="44" width="58" height="5" rx="2.5" fill="#3a3a3a" />
            <rect x="56" y="54" width="40" height="5" rx="2.5" fill="#2f2f2f" />
            <rect x="56" y="70" width="40" height="12" rx="4" fill="none" stroke="#444" strokeWidth="1.5" />
            <rect x="104" y="70" width="40" height="12" rx="4" fill="#FF6B35" />
          </svg>
          <div style={{ textAlign: 'center' }}>
            <div className="t-title" style={{ marginBottom: 8 }}>Accept on your TV</div>
            <p className="t-hint" style={{ maxWidth: 280, margin: '0 auto' }}>
              A prompt has appeared on your TV screen. Select <span style={{ color: 'var(--text)' }}>Allow</span> to continue.
            </p>
          </div>
          {/* PIN fallback */}
          <div style={{ width: '100%', paddingTop: 6 }}>
            <p className="t-hint" style={{ textAlign: 'center', marginBottom: 14 }}>
              Some TVs show a PIN instead — enter it below if prompted
            </p>
            <div className="pinrow">
              <div className="pinbox">2</div>
              <div className="pinbox">4</div>
              <div className="pinbox focus">7</div>
              <div className="pinbox" style={{ color: 'var(--text-sec)' }} />
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ── 3c · Success ─────────────────────────────────────────────────────
function PairSuccess() {
  return (
    <Screen>
      <PairHeader />
      <div className="body">
        <StepBar stage={2} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
          <div className="check-circle">
            <svg className="check-svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
              stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7" />
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="t-title" style={{ fontSize: 24, marginBottom: 6 }}>Connected!</div>
            <p className="t-hint">Living Room TV is ready to control</p>
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ── 3d · Error ───────────────────────────────────────────────────────
function PairError() {
  return (
    <Screen>
      <PairHeader />
      <div className="body">
        <StepBar stage={0} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(244,67,54,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={44} color="var(--error)" stroke={2.4} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="t-title" style={{ marginBottom: 8 }}>Couldn’t connect to Living Room TV</div>
            <p className="t-hint" style={{ maxWidth: 280, margin: '0 auto' }}>
              The TV didn’t respond in time. Check that it’s powered on and on the same Wi-Fi network, then try again.
            </p>
          </div>
        </div>
        <button className="btn btn-accent" style={{ marginBottom: 10 }}>Try again</button>
        <button className="btn btn-ghost" style={{ border: 'none', color: 'var(--text-sec)', marginBottom: 8 }}>
          Choose a different TV
        </button>
      </div>
    </Screen>
  );
}

Object.assign(window, { PairConnecting, PairAccept, PairSuccess, PairError });
