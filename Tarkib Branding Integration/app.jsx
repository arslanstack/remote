/* app.jsx — assembles all screens onto the design canvas + a foundations cover */
const { Icon, Mark, Screen } = window;
const {
  SplashScreen, DiscoverScanning, DiscoverFound, DiscoverEmpty,
  PairConnecting, PairAccept, PairSuccess, PairError,
  RemoteConnected, RemoteDisconnected,
  KeyboardModal, SettingsScreen,
} = window;

function Swatch({ name, hex, ring }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: hex, border: ring ? '1px solid var(--border)' : 'none', flex: '0 0 auto' }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{name}</div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--text-sec)', marginTop: 1 }}>{hex}</div>
      </div>
    </div>
  );
}

function SystemCover() {
  return (
    <div className="screen" style={{ width: 600, padding: '48px 44px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
        <Mark size={64} />
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>Android TV Remote</div>
          <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-sec)', marginTop: 4 }}>by Tarkib</div>
        </div>
      </div>

      <p className="t-hint" style={{ fontSize: 14, lineHeight: 1.6, margin: '24px 0 0', maxWidth: 480 }}>
        A premium hardware remote, reimagined as software. Dark-mode only, tactile, deliberate.
        The round mark echoes the D-pad’s OK ring broadcasting in four directions — the same
        physical-object language that runs through the whole app.
      </p>

      <div style={{ height: 1, background: 'var(--border)', margin: '32px 0' }} />

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-sec)', marginBottom: 18 }}>Palette</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
        <Swatch name="Background" hex="#0A0A0A" ring />
        <Swatch name="Accent" hex="#FF6B35" />
        <Swatch name="Surface" hex="#1A1A1A" ring />
        <Swatch name="Success" hex="#4CAF50" />
        <Swatch name="Surface Elevated" hex="#2A2A2A" />
        <Swatch name="Error" hex="#F44336" />
        <Swatch name="Trackpad" hex="#141414" ring />
        <Swatch name="Text Secondary" hex="#888888" />
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '32px 0' }} />

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-sec)', marginBottom: 18 }}>Type · System (SF Pro / Roboto)</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontSize: 20, fontWeight: 600 }}>Screen title</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-sec)' }}>20 · semibold</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>TV name / label</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-sec)' }}>16 · medium</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontSize: 13, color: 'var(--text-sec)' }}>Subtitle / hint</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-sec)' }}>13 · regular · #888</span>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '32px 0' }} />

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-sec)', marginBottom: 14 }}>Principles</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['The trackpad & D-pad are physical objects — depth, not decoration',
          'Orange is earned: CTAs, active states, the OK ring. Nothing else',
          'Dense but never cluttered — clear groups, generous touch targets',
          '$1, yours forever · No ads, ever'].map((t) => (
          <div key={t} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--accent)', marginTop: 7, flex: '0 0 auto' }} />
            <span style={{ fontSize: 13.5, color: '#ccc', lineHeight: 1.45 }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const W = 412, H = 892;

function App() {
  return (
    <DesignCanvas>
      <DCSection id="foundations" title="Foundations" subtitle="Design system & branding">
        <DCArtboard id="cover" label="System · Tarkib" width={600} height={892} style={{ background: '#0A0A0A' }}><SystemCover /></DCArtboard>
      </DCSection>

      <DCSection id="splash" title="1 · Splash" subtitle="2-second launch">
        <DCArtboard id="splash" label="Splash" width={W} height={H} style={{ background: '#0A0A0A' }}><SplashScreen /></DCArtboard>
      </DCSection>

      <DCSection id="discovery" title="2 · Discovery" subtitle="Scan the network · find TVs">
        <DCArtboard id="scan"  label="Scanning"   width={W} height={H} style={{ background: '#0A0A0A' }}><DiscoverScanning /></DCArtboard>
        <DCArtboard id="found" label="TVs found"  width={W} height={H} style={{ background: '#0A0A0A' }}><DiscoverFound /></DCArtboard>
        <DCArtboard id="empty" label="Empty state" width={W} height={H} style={{ background: '#0A0A0A' }}><DiscoverEmpty /></DCArtboard>
      </DCSection>

      <DCSection id="pairing" title="3 · Pairing" subtitle="Connect → Accept on TV → Done">
        <DCArtboard id="connecting" label="Connecting" width={W} height={H} style={{ background: '#0A0A0A' }}><PairConnecting /></DCArtboard>
        <DCArtboard id="accept" label="Accept on TV" width={W} height={H} style={{ background: '#0A0A0A' }}><PairAccept /></DCArtboard>
        <DCArtboard id="success" label="Success" width={W} height={H} style={{ background: '#0A0A0A' }}><PairSuccess /></DCArtboard>
        <DCArtboard id="error" label="Error" width={W} height={H} style={{ background: '#0A0A0A' }}><PairError /></DCArtboard>
      </DCSection>

      <DCSection id="remote" title="4 · Remote — the hero" subtitle="Where users live every day">
        <DCArtboard id="connected" label="Connected" width={W} height={H} style={{ background: '#0A0A0A' }}><RemoteConnected /></DCArtboard>
        <DCArtboard id="lost" label="Connection lost" width={W} height={H} style={{ background: '#0A0A0A' }}><RemoteDisconnected /></DCArtboard>
      </DCSection>

      <DCSection id="input" title="5 · Input & Settings" subtitle="Keyboard sheet · device management">
        <DCArtboard id="keyboard" label="Keyboard modal" width={W} height={H} style={{ background: '#0A0A0A' }}><KeyboardModal /></DCArtboard>
        <DCArtboard id="settings" label="Settings" width={W} height={H} style={{ background: '#0A0A0A' }}><SettingsScreen /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
