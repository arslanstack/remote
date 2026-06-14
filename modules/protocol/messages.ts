import type { KeyDirection } from './keycodes';

// Minimal manual protobuf encoder for Android TV Remote protocol.
// Each message is framed: [2 bytes big-endian length][N bytes protobuf payload]

function encodeVarint(value: number): number[] {
  const bytes: number[] = [];
  while (value > 0x7f) {
    bytes.push((value & 0x7f) | 0x80);
    value >>>= 7;
  }
  bytes.push(value & 0x7f);
  return bytes;
}

function encodeField(fieldNumber: number, wireType: number, value: number[]): number[] {
  const tag = (fieldNumber << 3) | wireType;
  return [...encodeVarint(tag), ...value];
}

function encodeVarintField(fieldNumber: number, value: number): number[] {
  return encodeField(fieldNumber, 0, encodeVarint(value));
}

function encodeLengthDelimited(fieldNumber: number, bytes: number[]): number[] {
  return encodeField(fieldNumber, 2, [...encodeVarint(bytes.length), ...bytes]);
}

function encodeString(fieldNumber: number, str: string): number[] {
  const encoded = Array.from(new TextEncoder().encode(str));
  return encodeLengthDelimited(fieldNumber, encoded);
}

function frameMessage(payload: number[]): Uint8Array {
  const len = payload.length;
  return new Uint8Array([
    (len >> 8) & 0xff,
    len & 0xff,
    ...payload,
  ]);
}

// Pairing messages
export function buildClientHello(clientName: string): Uint8Array {
  // ClientHello { client_name: string (field 1) }
  const payload = encodeString(1, clientName);
  return frameMessage(payload);
}

export function buildPairingRequest(serviceName: string, clientName: string): Uint8Array {
  // PairingRequest { service_name (1), client_name (2) }
  const payload = [
    ...encodeString(1, serviceName),
    ...encodeString(2, clientName),
  ];
  return frameMessage(payload);
}

// Key direction enum values per proto
const KEY_DIRECTION: Record<KeyDirection, number> = {
  SHORT: 3,
  LONG: 4,
  START_LONG: 5,
  END_LONG: 6,
};

export function buildKeyInject(keyCode: number, direction: KeyDirection): Uint8Array {
  // RemoteKeyInject { key_code (1), direction (2) }
  const remoteKeyInject = [
    ...encodeVarintField(1, keyCode),
    ...encodeVarintField(2, KEY_DIRECTION[direction]),
  ];
  // RemoteMessage { remote_key_inject (4) }
  const payload = encodeLengthDelimited(4, remoteKeyInject);
  return frameMessage(payload);
}

export function buildRemoteConfigure(): Uint8Array {
  // RemoteConfigure { code (1) = 622 }
  const remoteConfigure = encodeVarintField(1, 622);
  // RemoteMessage { remote_configure (1) }
  const payload = encodeLengthDelimited(1, remoteConfigure);
  return frameMessage(payload);
}

export function buildImeKeyInject(text: string): Uint8Array {
  // RemoteImeKeyInject { text_field_status (1) = FOCUSED(1), text (2) }
  const imeKeyInject = [
    ...encodeVarintField(1, 1),
    ...encodeString(2, text),
  ];
  // RemoteMessage { remote_ime_key_inject (6) }
  const payload = encodeLengthDelimited(6, imeKeyInject);
  return frameMessage(payload);
}

// Parse the length-prefix from an incoming buffer and return payload bytes.
// Returns null if buffer is incomplete.
export function parseFrame(buffer: Uint8Array): { payload: Uint8Array; remaining: Uint8Array } | null {
  if (buffer.length < 2) return null;
  const len = (buffer[0] << 8) | buffer[1];
  if (buffer.length < 2 + len) return null;
  return {
    payload: buffer.slice(2, 2 + len),
    remaining: buffer.slice(2 + len),
  };
}
