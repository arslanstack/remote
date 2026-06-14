import TcpSocket from 'react-native-tcp-socket';
import { buildClientHello, buildPairingRequest, parseFrame } from './protocol/messages';

const PAIRING_PORT = 6467;
const CLIENT_NAME = 'Android TV Remote';
const SERVICE_NAME = 'androidtvremote2';

export type PairingStatus =
  | 'connecting'
  | 'waiting_for_accept'
  | 'paired'
  | 'error';

export interface PairingCallbacks {
  onStatus: (status: PairingStatus, message?: string) => void;
  onCertificate: (cert: string) => void;
}

export function startPairing(
  ip: string,
  callbacks: PairingCallbacks,
): () => void {
  let buffer = new Uint8Array(0);
  let handshakeStage = 0;

  const socket = TcpSocket.createConnection(
    {
      host: ip,
      port: PAIRING_PORT,
      tls: true,
      tlsCheckValidity: false,
    },
    () => {
      callbacks.onStatus('connecting');
      socket.write(Buffer.from(buildClientHello(CLIENT_NAME)));
    },
  );

  socket.on('data', (data: Buffer | string) => {
    const chunk = typeof data === 'string'
      ? new TextEncoder().encode(data)
      : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);

    const merged = new Uint8Array(buffer.length + chunk.length);
    merged.set(buffer);
    merged.set(chunk, buffer.length);
    buffer = merged;

    const frame = parseFrame(buffer);
    if (!frame) return;
    buffer = frame.remaining;

    if (handshakeStage === 0) {
      // ServerHello received — extract certificate
      const cert = Buffer.from(frame.payload).toString('base64');
      callbacks.onCertificate(cert);
      callbacks.onStatus('waiting_for_accept');
      handshakeStage = 1;

      // Send pairing request
      socket.write(Buffer.from(buildPairingRequest(SERVICE_NAME, CLIENT_NAME)));
    } else if (handshakeStage === 1) {
      // PairingResult — status byte (field 1, varint)
      // value 200 = STATUS_OK
      const statusByte = frame.payload[1] ?? 0;
      if (statusByte === 200 || statusByte === 0) {
        callbacks.onStatus('paired');
      } else {
        callbacks.onStatus('error', 'Pairing was rejected on your TV. Try again.');
      }
      handshakeStage = 2;
    }
  });

  socket.on('error', (err) => {
    callbacks.onStatus('error', 'Could not connect. Check that your TV is on and on the same Wi-Fi.');
    console.error('[pairing] socket error', err);
  });

  socket.on('close', () => {
    if (handshakeStage < 2) {
      callbacks.onStatus('error', 'Connection closed before pairing completed.');
    }
  });

  return () => {
    try { socket.destroy(); } catch { /* ignore */ }
  };
}
