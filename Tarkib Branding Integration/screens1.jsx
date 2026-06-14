/* screens1.jsx — Splash + Discovery (scanning / found / empty) */
const { Icon, Mark, Screen } = window;

// ── 1 · Splash ───────────────────────────────────────────────────────
function SplashScreen() {
  return (
    <Screen noGesture>
      <div className="splash">
        <Mark size={96} />
        <div className="wordmark">Android TV Remote</div>
        <div className="byline">by Tarkib</div>
        <div className="loadbar" />
      </div>
    </Screen>
  );
}

// shared discovery header
function DiscoverHeader({ back }) {
  return (
    <div className="appbar">
      {back && (
        <button className="iconbtn" style={{ marginLeft: -8 }}><Icon name="arrow-left" size={24} /></button>
      )}
      <div className="title">Find your TV</div>
    </div>
  );
}

function TVCard({ name, ip, paired, reconnect }) {
  return (
    <div className="tvcard">
      <div className="tv-ico"><Icon name="tv-stand" size={24} color="var(--accent)" stroke={1.8} /></div>
      <div className="tv-meta">
        <div className="tv-name">{name}</div>
        <div className="tv-ip mono">{ip}</div>
      </div>
      {paired && <span className="pill pill-accent">PAIRED</span>}
      {reconnect && <span className="dot dot-green" />}
      <Icon name="chevron-right" size={20} color="var(--text-sec)" />
    </div>
  );
}

// ── 2a · Discovery — scanning ────────────────────────────────────────
function DiscoverScanning() {
  return (
    <Screen>
      <DiscoverHeader />
      <div className="body">
        <p className="t-hint" style={{ margin: '4px 0 0' }}>
          Make sure your phone and TV are on the same Wi-Fi network
        </p>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div className="scanwrap">
            <div className="ring" />
            <div className="ring r2" />
            <div className="ring r3" />
            <div className="scan-core"><Icon name="tv-stand" size={28} color="var(--accent)" stroke={1.8} /></div>
          </div>
          <div className="t-hint" style={{ letterSpacing: 0.4 }}>Scanning…</div>
        </div>
        <button className="t-btn" style={{ background: 'none', border: 'none', color: 'var(--accent)', padding: '20px 0', fontFamily: 'var(--font)', cursor: 'pointer' }}>
          Don’t see your TV?
        </button>
      </div>
    </Screen>
  );
}

// ── 2b · Discovery — TVs found (+ manual IP expanded) ────────────────
function DiscoverFound() {
  return (
    <Screen>
      <DiscoverHeader />
      <div className="body">
        <p className="t-hint" style={{ margin: '4px 0 22px' }}>
          Make sure your phone and TV are on the same Wi-Fi network
        </p>

        <div className="t-section" style={{ marginBottom: 12 }}>Previously paired</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          <TVCard name="Living Room TV" ip="192.168.1.42" reconnect />
        </div>

        <div className="t-section" style={{ marginBottom: 12 }}>Found on your network</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <TVCard name="Bedroom Google TV" ip="192.168.1.57" />
          <TVCard name="SHIELD Android TV" ip="192.168.1.61" />
          <TVCard name="Kitchen Chromecast" ip="192.168.1.73" />
        </div>

        <div style={{ flex: 1 }} />

        {/* manual IP entry expanded */}
        <div style={{ paddingTop: 18 }}>
          <div className="t-section" style={{ marginBottom: 10 }}>Connect manually</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="field focus" style={{ flex: 1 }}>
              <Icon name="tv" size={18} color="var(--text-sec)" stroke={1.8} />
              <span className="input-text ph mono">192.168.x.x</span>
            </div>
            <button className="btn btn-accent" style={{ width: 'auto', padding: '0 22px' }}>Connect</button>
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ── 2c · Discovery — empty state ─────────────────────────────────────
function DiscoverEmpty() {
  return (
    <Screen>
      <DiscoverHeader />
      <div className="body">
        <p className="t-hint" style={{ margin: '4px 0 0' }}>
          Make sure your phone and TV are on the same Wi-Fi network
        </p>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '0 20px' }}>
          <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 22, background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <Icon name="tv-stand" size={32} color="var(--text-sec)" stroke={1.8} />
            <div style={{ position: 'absolute', right: -6, bottom: -6, width: 30, height: 30, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--elev)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="x" size={14} color="var(--text-sec)" stroke={2.2} />
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="t-title" style={{ marginBottom: 8 }}>No TVs found</div>
            <p className="t-hint" style={{ maxWidth: 250, margin: '0 auto' }}>
              Make sure your TV is on and connected to the same Wi-Fi network as your phone
            </p>
          </div>
        </div>
        <button className="btn btn-ghost" style={{ marginBottom: 8 }}>
          <Icon name="refresh" size={18} color="var(--accent)" stroke={2} /> Scan again
        </button>
        <button className="t-btn" style={{ background: 'none', border: 'none', color: 'var(--text-sec)', padding: '14px 0', fontFamily: 'var(--font)', cursor: 'pointer' }}>
          Enter IP address manually
        </button>
      </div>
    </Screen>
  );
}

Object.assign(window, { SplashScreen, DiscoverScanning, DiscoverFound, DiscoverEmpty });
