/* kit.jsx — shared building blocks: Icon set, Tarkib Mark, phone-frame chrome.
   Exports to window so the per-screen Babel scripts can use them. */

// ── Icon set (Feather-ish outline; a few filled glyphs) ──────────────
// Each entry returns the inner <svg> children for a 24×24 viewBox.
const ICONS = {
  'chevron-right': <path d="M9 5l7 7-7 7" />,
  'chevron-left':  <path d="M15 5l-7 7 7 7" />,
  'chevron-up':    <path d="M5 15l7-7 7 7" />,
  'chevron-down':  <path d="M5 9l7 7 7-7" />,
  'arrow-left':    <g><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></g>,
  tv: <g><rect x="2" y="5" width="20" height="13" rx="2" /><path d="M8 21h8" /><path d="M12 18v3" /></g>,
  'tv-stand': <g><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8" /><path d="M12 16v4" /></g>,
  wifi: <g>
    <path d="M4 9.5a13 13 0 0 1 16 0" /><path d="M7 13a8.5 8.5 0 0 1 10 0" />
    <path d="M10 16.4a4 4 0 0 1 4 0" /><circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" />
  </g>,
  keyboard: <g>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 13.5h8" />
  </g>,
  more: <g fill="currentColor" stroke="none"><circle cx="12" cy="5" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="12" cy="19" r="1.7" /></g>,
  home: <g><path d="M3 11l9-7 9 7" /><path d="M5 9.6V20h14V9.6" /></g>,
  back: <path d="M9 6l-6 6 6 6M3 12h13a4 4 0 0 0 0-8h-3" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  play: <path d="M7 5l12 7-12 7z" fill="currentColor" stroke="none" />,
  pause: <g fill="currentColor" stroke="none"><rect x="7" y="5" width="3.5" height="14" rx="1" /><rect x="13.5" y="5" width="3.5" height="14" rx="1" /></g>,
  'skip-back': <g fill="currentColor" stroke="none"><path d="M18 5v14l-9-7z" /><rect x="6" y="5" width="2.4" height="14" rx="1" /></g>,
  'skip-fwd':  <g fill="currentColor" stroke="none"><path d="M6 5l9 7-9 7z" /><rect x="15.6" y="5" width="2.4" height="14" rx="1" /></g>,
  rewind:   <g fill="currentColor" stroke="none"><path d="M11 5L3 12l8 7z" /><path d="M21 5l-8 7 8 7z" /></g>,
  forward:  <g fill="currentColor" stroke="none"><path d="M3 5l8 7-8 7z" /><path d="M13 5l8 7-8 7z" /></g>,
  'vol-mute': <g>
    <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
    <path d="M16 9.5l5 5M21 9.5l-5 5" />
  </g>,
  'vol-down': <g>
    <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
    <path d="M16 9.5a4 4 0 0 1 0 5" />
  </g>,
  'vol-up': <g>
    <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
    <path d="M16 9.5a4 4 0 0 1 0 5" /><path d="M19 7a8 8 0 0 1 0 10" />
  </g>,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  search: <g><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></g>,
  plus: <path d="M12 5v14M5 12h14" />,
  refresh: <g><path d="M21 4v6h-6" /><path d="M3 20v-6h6" /><path d="M20 9a8 8 0 0 0-14-3L3 9M4 15a8 8 0 0 0 14 3l3-3" /></g>,
  info: <g><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></g>,
  star: <path d="M12 4l2.4 5 5.5.5-4.2 3.7 1.3 5.4L12 16.8 6.7 18.6 8 13.2 3.8 9.5l5.5-.5z" />,
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />,
  trash: <g><path d="M4 7h16" /><path d="M9 7V5h6v2" /><path d="M6 7l1 13h10l1-13" /></g>,
  'arrow-up-right': <g><path d="M7 17L17 7" /><path d="M8 7h9v9" /></g>,
};

function Icon({ name, size = 24, color = 'currentColor', stroke = 2, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flex: '0 0 auto', ...style }}>
      {ICONS[name] || null}
    </svg>
  );
}

// ── Tarkib mark — round body (echoes the D-pad OK ring) broadcasting in 4
// directions. Built from circles + ticks only. ─────────────────────────
function Mark({ size = 96, ring = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ display: 'block' }}>
      {/* directional ticks */}
      <g stroke="#FF6B35" strokeWidth="5" strokeLinecap="round">
        <path d="M50 4v9" />
        <path d="M50 87v9" />
        <path d="M4 50h9" />
        <path d="M87 50h9" />
      </g>
      {/* round remote body / OK ring */}
      <circle cx="50" cy="50" r="30" stroke={ring} strokeWidth="5" />
      {/* OK core */}
      <circle cx="50" cy="50" r="11" fill="#FF6B35" />
    </svg>
  );
}

// ── Status bar ───────────────────────────────────────────────────────
function StatusBar({ time = '9:41' }) {
  return (
    <div className="statusbar">
      <span>{time}</span>
      <span className="sb-icons">
        {/* signal */}
        <svg width="17" height="13" viewBox="0 0 17 13" fill="#fff">
          <rect x="0" y="9" width="3" height="4" rx="0.6" />
          <rect x="4.5" y="6" width="3" height="7" rx="0.6" />
          <rect x="9" y="3" width="3" height="10" rx="0.6" />
          <rect x="13.5" y="0" width="3" height="13" rx="0.6" />
        </svg>
        {/* wifi */}
        <svg width="16" height="13" viewBox="0 0 18 14" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
          <path d="M2 5a11 11 0 0 1 14 0" /><path d="M5 8.4a6.5 6.5 0 0 1 8 0" />
          <circle cx="9" cy="11.6" r="0.9" fill="#fff" stroke="none" />
        </svg>
        {/* battery */}
        <svg width="25" height="13" viewBox="0 0 25 13" fill="none">
          <rect x="0.6" y="0.6" width="21" height="11.8" rx="3" stroke="#fff" strokeOpacity="0.5" />
          <rect x="2.4" y="2.4" width="14" height="8.2" rx="1.6" fill="#fff" />
          <rect x="23" y="4" width="1.6" height="5" rx="0.8" fill="#fff" fillOpacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

function GestureNav() { return <div className="gesturenav" />; }

// ── Phone frame ──────────────────────────────────────────────────────
// Renders status bar + children + gesture pill in a 412×892 dark screen.
function Screen({ children, time, noGesture, style }) {
  return (
    <div className="screen" style={style}>
      <StatusBar time={time} />
      {children}
      {!noGesture && <GestureNav />}
    </div>
  );
}

Object.assign(window, { Icon, Mark, StatusBar, GestureNav, Screen });
