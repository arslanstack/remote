/* screens4.jsx — Keyboard modal + Settings */
const { Icon, Mark, Screen, RemoteHeader, RemoteBody } = window;

// ── 5 · Keyboard modal (bottom sheet over remote) ────────────────────
function KbKey({ ch, cls = '', children }) {
  return <div className={'key ' + cls}>{children || ch}</div>;
}

function FauxKeyboard() {
  const r1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const r2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const r3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
  return (
    <div className="keyboard">
      <div className="kbrow">{r1.map((c) => <KbKey key={c} ch={c} />)}</div>
      <div className="kbrow" style={{ padding: '0 18px' }}>{r2.map((c) => <KbKey key={c} ch={c} />)}</div>
      <div className="kbrow">
        <KbKey cls="wide fn"><Icon name="chevron-up" size={18} /></KbKey>
        {r3.map((c) => <KbKey key={c} ch={c} />)}
        <KbKey cls="wide fn"><Icon name="x" size={16} stroke={2.2} /></KbKey>
      </div>
      <div className="kbrow">
        <KbKey cls="wide fn" ch="?123" />
        <KbKey cls="fn" ch="," />
        <KbKey cls="space" ch="" />
        <KbKey cls="fn" ch="." />
        <KbKey cls="wide fn"><Icon name="check" size={18} color="var(--accent)" /></KbKey>
      </div>
    </div>
  );
}

function KeyboardModal() {
  return (
    <Screen noGesture>
      {/* dimmed remote behind */}
      <div style={{ filter: 'brightness(0.5)', flex: '1 1 auto', display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
        <RemoteHeader connected />
        <RemoteBody />
      </div>
      <div className="sheet-scrim" />
      <div className="sheet">
        <div className="handle" />
        <div className="t-section" style={{ marginBottom: 12 }}>Type on TV</div>
        <div className="field focus" style={{ height: 56, marginBottom: 14 }}>
          <span className="input-text" style={{ fontSize: 18 }}>Stranger Things</span>
          <span style={{ width: 1.5, height: 22, background: 'var(--accent)' }} />
          <div className="spacer" style={{ flex: 1 }} />
          <button className="iconbtn" style={{ width: 28, height: 28 }}><Icon name="x" size={16} color="var(--text-sec)" stroke={2.2} /></button>
        </div>
        <button className="btn btn-accent" style={{ marginBottom: 16 }}>Send to TV</button>
        <FauxKeyboard />
      </div>
    </Screen>
  );
}

// ── 6 · Settings ─────────────────────────────────────────────────────
function SettingsScreen() {
  return (
    <Screen>
      <div className="appbar">
        <button className="iconbtn" style={{ marginLeft: -8 }}><Icon name="arrow-left" size={24} /></button>
        <div className="title">Settings</div>
      </div>
      <div className="body" style={{ paddingTop: 8 }}>

        {/* Connected TV */}
        <div className="set-group">
          <div className="t-section" style={{ marginBottom: 10 }}>Connected TV</div>
          <div className="set-card">
            <div className="set-row">
              <div className="tv-ico" style={{ width: 40, height: 40, borderRadius: 9, background: 'var(--trackpad)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="tv-stand" size={21} color="var(--accent)" stroke={1.8} />
              </div>
              <div className="sr-main">
                <div className="sr-title">Living Room TV</div>
                <div className="sr-sub mono">192.168.1.42</div>
              </div>
              <span className="dot dot-green" />
            </div>
            <div className="set-row">
              <div className="sr-main"><div className="sr-title" style={{ color: 'var(--text-sec)' }}>Disconnect</div></div>
            </div>
            <div className="set-row danger">
              <div className="sr-main"><div className="sr-title">Forget this TV</div></div>
            </div>
          </div>
        </div>

        {/* Paired TVs */}
        <div className="set-group">
          <div className="t-section" style={{ marginBottom: 10 }}>Paired TVs · swipe to remove</div>
          <div className="set-card">
            <div className="set-row" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, transform: 'translateX(-72px)' }}>
                <Icon name="tv" size={20} color="var(--text-sec)" stroke={1.8} />
                <div className="sr-main"><div className="sr-title">Bedroom Google TV</div><div className="sr-sub mono">192.168.1.57</div></div>
              </div>
              <div className="swipe-reveal"><Icon name="trash" size={18} color="#fff" stroke={1.9} /></div>
            </div>
            <div className="set-row">
              <Icon name="tv" size={20} color="var(--text-sec)" stroke={1.8} />
              <div className="sr-main"><div className="sr-title">Kitchen Chromecast</div><div className="sr-sub mono">192.168.1.73</div></div>
              <Icon name="chevron-right" size={18} color="var(--text-sec)" />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="set-group">
          <div className="t-section" style={{ marginBottom: 10 }}>About</div>
          <div className="set-card">
            <div className="set-row">
              <Icon name="info" size={20} color="var(--text-sec)" stroke={1.9} />
              <div className="sr-main"><div className="sr-title">Version</div></div>
              <div className="sr-val mono">1.0.0</div>
            </div>
            <div className="set-row">
              <Icon name="star" size={20} color="var(--text-sec)" stroke={1.9} />
              <div className="sr-main"><div className="sr-title">Rate the app</div></div>
              <Icon name="arrow-up-right" size={18} color="var(--text-sec)" stroke={2} />
            </div>
            <div className="set-row">
              <Icon name="shield" size={20} color="var(--text-sec)" stroke={1.9} />
              <div className="sr-main"><div className="sr-title">Privacy Policy</div></div>
              <Icon name="arrow-up-right" size={18} color="var(--text-sec)" stroke={2} />
            </div>
          </div>
        </div>

        <div className="spacer" style={{ flex: 1 }} />

        {/* Tarkib footer */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '8px 0 14px' }}>
          <Mark size={34} />
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.3 }}>Tarkib</div>
          <div className="t-hint" style={{ fontSize: 11, letterSpacing: 0.3 }}>$1, yours forever · No ads, ever</div>
        </div>
      </div>
    </Screen>
  );
}

Object.assign(window, { KeyboardModal, SettingsScreen });
