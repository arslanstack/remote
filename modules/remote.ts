import TcpSocket from 'react-native-tcp-socket';
import { buildRemoteConfigure, buildKeyInject, buildImeKeyInject, parseFrame } from './protocol/messages';
import type { KeyDirection } from './protocol/keycodes';

const CONTROL_PORT = 6466;

export type ControlConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface ControlCallbacks {
  onStateChange: (state: ControlConnectionState) => void;
  onError: (message: string) => void;
}

export interface ControlSocket {
  sendKey: (keyCode: number, direction: KeyDirection) => void;
  sendText: (text: string) => void;
  disconnect: () => void;
}

export function connectControl(
  ip: string,
  certificate: string,
  callbacks: ControlCallbacks,
): ControlSocket {
  let buffer = new Uint8Array(0);
  let ready = false;

  callbacks.onStateChange('connecting');

  const socket = TcpSocket.createConnection(
    {
      host: ip,
      port: CONTROL_PORT,
      tls: true,
      tlsCheckValidity: false,
    },
    () => {
      socket.write(Buffer.from(buildRemoteConfigure()));
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

    while (true) {
      const frame = parseFrame(buffer);
      if (!frame) break;
      buffer = frame.remaining;
      if (!ready) {
        ready = true;
        callbacks.onStateChange('connected');
      }
    }
  });

  socket.on('error', (err) => {
    callbacks.onStateChange('error');
    callbacks.onError('Connection error. Check your TV is reachable.');
    console.error('[remote] socket error', err);
  });

  socket.on('close', () => {
    if (ready) {
      callbacks.onStateChange('disconnected');
    }
  });

  const write = (bytes: Uint8Array) => {
    if (!ready) return;
    try { socket.write(Buffer.from(bytes)); } catch { /* ignore */ }
  };

  return {
    sendKey: (keyCode, direction) => write(buildKeyInject(keyCode, direction)),
    sendText: (text) => write(buildImeKeyInject(text)),
    disconnect: () => {
      try { socket.destroy(); } catch { /* ignore */ }
    },
  };
}
