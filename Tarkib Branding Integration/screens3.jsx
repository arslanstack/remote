/* screens3.jsx — Remote (hero): connected + disconnected banner */
const { Icon, Screen } = window;

function RemoteHeader({ connected = true }) {
  return (
    <div className="appbar" style={{ gap: 10, paddingTop: 6, paddingBottom: 2 }}>
      <span className={'dot ' + (connected ? 'dot-green' : 'dot-grey')} style={{ marginLeft: 2 }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Living Room TV
        </div>
        <div style={{ fontSize: 11, color: connected ? 'var(--success)' : 'var(--text-sec)', letterSpacing: 0.4, marginTop: 1 }}>
          {connected ? 'Connected' : 'Reconnecting…'}
        </div>
      </div>
      <div className="spacer" />
      <button className="iconbtn surface"><Icon name="keyboard" size={21} stroke={1.8} /></button>
      <button className="iconbtn"><Icon name="more" size={22} /></button>
    </div>
  );
}

function DPad() {
  return (
    <div className="dpad">
      <button className="d-btn d-up"><Icon name="chevron-up" size={24} stroke={2.2} color="var(--text-sec)" /></button>
      <button className="d-btn d-left"><Icon name="chevron-left" size={24} stroke={2.2} color="var(--text-sec)" /></button>
      <button className="d-btn d-right"><Icon name="chevron-right" size={24} stroke={2.2} color="var(--text-sec)" /></button>
      <button className="d-btn d-down"><Icon name="chevron-down" size={24} stroke={2.2} color="var(--text-sec)" /></button>
      <button className="d-ok">OK</button>
    </div>
  );
}

function RemoteBody({ firstUse }) {
  return (
    <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 6 }}>
      {/* Zone 1 — trackpad */}
      <div className="trackpad" style={{ flex: '1 1 auto', minHeight: 188 }}>
        <div className="tp-grain" />
        <div className="tp-label t-section" style={{ color: '#4d4d4d' }}>Trackpad</div>
        {firstUse && <div className="tp-hint">Tap to select · Swipe to navigate</div>}
      </div>

      {/* Zone 2 — D-pad */}
      <DPad />

      {/* Zone 3 — navigation */}
      <div className="btnrow">
        <button className="rbtn"><Icon name="home" size={21} stroke={1.9} /><span className="rbtn-lbl">Home</span></button>
        <button className="rbtn"><Icon name="back" size={21} stroke={1.9} /><span className="rbtn-lbl">Back</span></button>
        <button className="rbtn"><Icon name="menu" size={21} stroke={1.9} /><span className="rbtn-lbl">Menu</span></button>
      </div>

      {/* Zone 4 — media */}
      <div className="mediarow">
        <button className="mbtn"><Icon name="skip-back" size={20} /></button>
        <button className="mbtn"><Icon name="rewind" size={20} /></button>
        <button className="mbtn primary"><Icon name="play" size={22} color="#0A0A0A" /></button>
        <button className="mbtn"><Icon name="forward" size={20} /></button>
        <button className="mbtn"><Icon name="skip-fwd" size={20} /></button>
      </div>

      {/* Zone 5 — volume */}
      <div className="volrow">
        <button className="vbtn mute"><Icon name="vol-mute" size={20} /></button>
        <div className="vsep" />
        <button className="vbtn"><Icon name="vol-down" size={20} /><span style={{ fontSize: 18, fontWeight: 500 }}>–</span></button>
        <div className="vsep" />
        <button className="vbtn"><Icon name="vol-up" size={20} /><span style={{ fontSize: 18, fontWeight: 500 }}>+</span></button>
      </div>
    </div>
  );
}

// ── 4a · Remote — connected ──────────────────────────────────────────
function RemoteConnected() {
  return (
    <Screen>
      <RemoteHeader connected />
      <RemoteBody firstUse />
    </Screen>
  );
}

// ── 4b · Remote — connection lost banner ─────────────────────────────
function RemoteDisconnected() {
  return (
    <Screen>
      <RemoteHeader connected={false} />
      <div className="banner">
        <Icon name="wifi" size={18} color="#fff" stroke={2} />
        <span>Connection lost</span>
        <span className="b-action">Reconnect</span>
      </div>
      <RemoteBody />
    </Screen>
  );
}

Object.assign(window, { RemoteConnected, RemoteDisconnected });
