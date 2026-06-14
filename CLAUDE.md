# Android TV Remote — CLAUDE.md

## Project Overview

A cross-platform mobile app (Android first, iOS later) that turns your phone into a fully functional remote control for Android TV / Google TV devices on the same Wi-Fi network. Clean UI, no ads, $1 lifetime purchase on Play Store.

**App Name:** Android TV Remote  
**Stack:** Expo (SDK 51) + Expo Router + React Native  
**Primary Target:** Android (Play Store)  
**Secondary Target:** iOS (future, EAS cloud build)  
**State Management:** Zustand  
**Styling:** StyleSheet (no Tailwind — Expo native)

---

## Core Features (v1)

1. **TV Discovery** — scan local Wi-Fi, list all Android TV / Google TV devices
2. **Pairing** — connect via TLS, TV shows accept popup, user confirms on TV
3. **D-Pad Remote** — directional pad, select, back, home, menu
4. **Trackpad** — touch area for pointer-style navigation
5. **Media Controls** — play/pause, rewind, fast-forward, volume up/down/mute
6. **Keyboard Input** — button that opens native keyboard, typed text sent to TV
7. **Saved TVs** — remember paired TVs, auto-reconnect on reopen

---

## What is NOT in v1

- No screencasting / screen mirroring
- No Samsung or LG support (Android TV only)
- No IR blaster support
- No voice control
- No in-app purchases yet (add later)

---

## Tech Stack & Dependencies

```json
{
  "expo": "~51.0.0",
  "expo-router": "^3.0.0",
  "react-native-tcp-socket": "^6.0.0",
  "zustand": "^4.0.0",
  "react-native-gesture-handler": "^2.0.0",
  "expo-network": "^6.0.0",
  "@react-native-async-storage/async-storage": "^1.23.0",
  "react-native-zeroconf": "^0.13.0"
}
```

**Critical:** `react-native-tcp-socket` requires a custom Expo dev build (not Expo Go). Use `eas build --profile development` for testing.

---

## Project Structure

```
android-tv-remote/
├── app/
│   ├── _layout.tsx              # Root layout, gesture handler wrap
│   ├── index.tsx                # Redirect to /discovery
│   ├── discovery.tsx            # Scan + list TVs
│   ├── pairing.tsx              # Pairing flow screen
│   └── remote.tsx               # Main remote control screen
│
├── modules/
│   ├── discovery.ts             # mDNS scan logic using react-native-zeroconf
│   ├── pairing.ts               # TLS socket connect + cert exchange
│   ├── remote.ts                # Send key commands + text over socket
│   └── protocol/
│       ├── keycodes.ts          # All Android TV KEYCODE_* constants
│       └── messages.ts          # Protobuf-style message builders
│
├── components/
│   ├── DPad.tsx                 # Directional pad (up/down/left/right/select)
│   ├── Trackpad.tsx             # Touch area — tracks finger delta, sends pointer events
│   ├── KeyboardInput.tsx        # Floating keyboard trigger + text sender
│   ├── MediaBar.tsx             # Play/pause/rewind/ffwd/vol controls
│   └── RemoteButton.tsx         # Reusable pressable button with haptic
│
├── hooks/
│   ├── useTVConnection.ts       # Manages socket lifecycle, reconnect logic
│   └── useDiscovery.ts          # Wraps zeroconf scan, returns TV list
│
├── store/
│   └── tvStore.ts               # Zustand store — pairedTVs[], activeTV, connectionState
│
├── constants/
│   └── colors.ts                # Design tokens
│
└── app.json                     # Expo config
```

---

## Android TV Remote Protocol

### How It Works

Android TV exposes a remote control service over the local network. The protocol uses:
- **Discovery:** mDNS service type `_androidtvremote2._tcp`
- **Port:** `6466` (TLS)
- **Pairing Port:** `6467` (TLS)
- **Encoding:** Protocol Buffers (protobuf) over TLS socket

### Pairing Flow

```
1. App connects to TV on port 6467 (TLS)
2. App sends: ClientHello { client_name: "Android TV Remote" }
3. TV responds: ServerHello { server_name: "...", certificate: "..." }
4. TV displays pairing popup on screen
5. User presses OK on TV (or enters PIN on some models)
6. App sends: PairingRequest { service_name: "...", client_name: "..." }
7. TV sends: PairingResult { status: STATUS_OK }
8. App stores TV certificate + IP for future reconnects
9. Pairing complete — switch to control socket on port 6466
```

### Control Flow (after pairing)

```
1. App connects to TV on port 6466 (TLS, using stored certificate)
2. App sends: RemoteMessage { remote_configure: { ... } }  ← handshake
3. TV responds with configuration
4. App is now in control mode
5. Send key presses: RemoteMessage { remote_key_inject: { key_code: KEYCODE_DPAD_UP, direction: SHORT } }
6. Send text: RemoteMessage { remote_ime_key_inject: { text_field_status: FOCUSED, text: "hello" } }
```

### Message Format (implement manually — no protobuf library needed)

Each message is framed as:
```
[2 bytes: message length big-endian] [N bytes: protobuf payload]
```

Implement a minimal manual protobuf encoder for just the messages needed. Reference implementation: https://github.com/tronikos/androidtvremote2 (Python — port the message building logic to JS/TS)

---

## Key Codes Reference

```typescript
// modules/protocol/keycodes.ts
export const KEYCODE = {
  DPAD_UP: 19,
  DPAD_DOWN: 20,
  DPAD_LEFT: 21,
  DPAD_RIGHT: 22,
  DPAD_CENTER: 23,      // Select / OK
  BACK: 4,
  HOME: 3,
  MENU: 82,
  POWER: 26,
  VOLUME_UP: 24,
  VOLUME_DOWN: 25,
  VOLUME_MUTE: 164,
  MEDIA_PLAY_PAUSE: 85,
  MEDIA_REWIND: 89,
  MEDIA_FAST_FORWARD: 90,
  MEDIA_NEXT: 87,
  MEDIA_PREVIOUS: 88,
} as const;

export type KeyDirection = 'SHORT' | 'LONG' | 'START_LONG' | 'END_LONG';
```

---

## Screen Specifications

### 1. Discovery Screen (`app/discovery.tsx`)

**Purpose:** Find Android TV devices on the local Wi-Fi network.

**Behavior:**
- On mount: start mDNS scan for `_androidtvremote2._tcp`
- Show animated scanning indicator while searching
- List found TVs with name + IP address
- Also show previously paired TVs at the top (from Zustand store)
- Tap a TV → navigate to `/pairing?ip=x.x.x.x&name=TVName`
- Manual IP entry option (for TVs that don't appear in scan)
- Pull to refresh rescans

**UI Elements:**
- Header: "Find your TV"
- Subtitle: "Make sure your phone and TV are on the same Wi-Fi"
- Scanning animation (pulsing rings or spinner)
- TV list: icon + TV name + IP + "Previously paired" badge if applicable
- "Enter IP manually" button at bottom
- Empty state: "No TVs found. Is your TV on?"

---

### 2. Pairing Screen (`app/pairing.tsx`)

**Purpose:** Establish TLS connection and complete pairing handshake.

**Behavior:**
- On mount: initiate TCP connection to TV's pairing port (6467)
- Show step indicators: Connecting → Waiting for TV → Paired
- If TV shows PIN: show PIN input field in app
- On success: save TV to Zustand store + AsyncStorage, navigate to `/remote`
- On failure: show error with retry button
- Back button cancels and closes socket

**UI Elements:**
- Step indicator: Step 1 (Connect) → Step 2 (Accept on TV) → Step 3 (Done)
- TV illustration showing "accept" popup
- Status message (dynamic): "Connecting...", "Accept on your TV", "Pairing complete!"
- Spinner during waiting states
- Error state with retry CTA

---

### 3. Remote Screen (`app/remote.tsx`)

**Purpose:** The main remote control interface.

**Layout (top to bottom):**

```
┌─────────────────────────────┐
│  TV Name          [⌨] [···] │  ← header: connected TV name, keyboard btn, menu
├─────────────────────────────┤
│                             │
│      TRACKPAD AREA          │  ← large touch area, ~40% of screen height
│   (swipe to move cursor)    │
│                             │
├─────────────────────────────┤
│        ↑                    │
│    ←   OK   →               │  ← D-pad
│        ↓                    │
├─────────────────────────────┤
│  [⌂ Home] [← Back] [☰ Menu]│  ← navigation buttons
├─────────────────────────────┤
│  [⏮] [⏪] [⏯] [⏩] [⏭]    │  ← media controls
├─────────────────────────────┤
│       [🔇] [🔉] [🔊]       │  ← volume
└─────────────────────────────┘
```

**Trackpad behavior:**
- Single tap → DPAD_CENTER (select)
- Swipe → send DPAD direction keys based on delta
- Two-finger swipe → scroll

**Keyboard behavior:**
- Tap keyboard icon in header → show text input modal
- User types → each character sent immediately OR send on submit
- Clear button clears TV text field

**Connection states:**
- Connected: normal UI
- Disconnected: show banner "Reconnecting..." with auto-retry
- Failed: show "Connection lost" with manual retry button

---

## Zustand Store (`store/tvStore.ts`)

```typescript
interface TV {
  id: string;          // unique — use IP as ID
  name: string;
  ip: string;
  port: number;        // default 6466
  certificate: string; // stored after pairing for reconnect
  pairedAt: number;    // timestamp
}

interface TVStore {
  pairedTVs: TV[];
  activeTV: TV | null;
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'error';
  
  // Actions
  addTV: (tv: TV) => void;
  removeTV: (id: string) => void;
  setActiveTV: (tv: TV) => void;
  setConnectionState: (state: TVStore['connectionState']) => void;
}
```

Persist `pairedTVs` to AsyncStorage so TVs are remembered across app restarts.

---

## Design System (`constants/colors.ts`)

Dark theme only — matches TV remote aesthetic.

```typescript
export const Colors = {
  background: '#0A0A0A',       // near black
  surface: '#1A1A1A',          // card/button background
  surfaceHigh: '#2A2A2A',      // elevated surface
  accent: '#FF6B35',           // orange — primary CTA, active states
  accentMuted: '#FF6B3520',    // orange tint for backgrounds
  text: '#FFFFFF',
  textSecondary: '#888888',
  border: '#2A2A2A',
  success: '#4CAF50',
  error: '#F44336',
  trackpad: '#141414',         // slightly different from bg
};
```

**Typography:** System font (SF Pro on iOS, Roboto on Android) — no custom fonts needed for v1.

**Border radius:** 12px for cards, 50% for circular buttons, 8px for standard buttons.

**Haptics:** Use `expo-haptics` — light impact on every button press, medium on D-pad select.

---

## useTVConnection Hook (`hooks/useTVConnection.ts`)

```typescript
// Manages the lifecycle of the TV socket connection
// Exposes:
{
  connect: (tv: TV) => Promise<void>,
  disconnect: () => void,
  sendKey: (keyCode: number, direction: KeyDirection) => void,
  sendText: (text: string) => void,
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'error',
  error: string | null,
}

// Auto-reconnect: if connection drops unexpectedly, retry 3 times with 2s delay
// Use react-native-tcp-socket for the underlying TCP/TLS connection
```

---

## Error Handling Rules

- **TV not found in scan:** Show manual IP entry, never crash
- **Pairing rejected on TV:** Show "Pairing was rejected on your TV. Try again." with retry
- **Connection dropped:** Auto-retry 3x silently, then show banner
- **Wrong network:** Detect via `expo-network`, show "Connect to same Wi-Fi as your TV"
- **Socket error:** Log to console, show user-friendly message, never show raw error strings to user

---

## app.json Config Notes

```json
{
  "expo": {
    "name": "Android TV Remote",
    "slug": "android-tv-remote",
    "platforms": ["android", "ios"],
    "android": {
      "package": "com.arslan.androidtvremote",
      "permissions": [
        "ACCESS_NETWORK_STATE",
        "ACCESS_WIFI_STATE",
        "INTERNET",
        "CHANGE_WIFI_MULTICAST_STATE"
      ]
    }
  }
}
```

`CHANGE_WIFI_MULTICAST_STATE` is required for mDNS multicast discovery to work on Android.

---

## Implementation Order for Claude Code

Build in this exact order — each step is testable before the next:

1. **Project setup** — init Expo, install deps, configure app.json
2. **`constants/colors.ts`** — design tokens
3. **`modules/protocol/keycodes.ts`** — key constants
4. **`modules/protocol/messages.ts`** — message frame builder (length-prefixed bytes)
5. **`store/tvStore.ts`** — Zustand store with AsyncStorage persistence
6. **`modules/discovery.ts`** — mDNS scan using react-native-zeroconf
7. **`modules/pairing.ts`** — TLS connect + pairing handshake
8. **`modules/remote.ts`** — send key + send text over control socket
9. **`hooks/useTVConnection.ts`** — connection lifecycle hook
10. **`hooks/useDiscovery.ts`** — discovery hook
11. **`components/RemoteButton.tsx`** — base button with haptics
12. **`components/DPad.tsx`** — directional pad
13. **`components/Trackpad.tsx`** — touch trackpad area
14. **`components/MediaBar.tsx`** — media controls row
15. **`components/KeyboardInput.tsx`** — keyboard modal
16. **`app/_layout.tsx`** — root layout
17. **`app/discovery.tsx`** — discovery screen
18. **`app/pairing.tsx`** — pairing screen
19. **`app/remote.tsx`** — main remote screen

---

## Reference Implementation

The Python library `androidtvremote2` by tronikos is the best reference for the protocol:
- GitHub: https://github.com/tronikos/androidtvremote2
- Port the pairing handshake and message framing from `pairing.py` and `remotemessage.proto`
- The protobuf schema in that repo defines the exact message structure to implement manually

---

## Testing Notes

- `react-native-tcp-socket` does NOT work in Expo Go — must use a custom dev build
- Run `eas build --profile development --platform android` to get a testable APK
- Test discovery on real Android device (emulator won't find mDNS devices)
- Android TV emulator can be used for pairing/control testing if physical TV unavailable
- Keep a console log of all socket bytes during development for debugging

---

## Out of Scope (do not implement)

- Samsung / LG TV support
- Screencasting or screen mirroring
- IR blaster
- Voice commands
- In-app purchases (add post-launch)
- iOS-specific native modules (handle in future)
- Backend / server of any kind