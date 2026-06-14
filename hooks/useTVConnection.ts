import { useCallback, useEffect, useRef, useState } from 'react';
import { connectControl, ControlSocket } from '../modules/remote';
import type { TV } from '../store/tvStore';
import type { KeyDirection } from '../modules/protocol/keycodes';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export function useTVConnection(tv: TV | null) {
  const [connectionState, setConnectionState] = useState<
    'disconnected' | 'connecting' | 'connected' | 'error'
  >('disconnected');
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<ControlSocket | null>(null);
  const retriesRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const connect = useCallback((target: TV) => {
    socketRef.current?.disconnect();
    clearRetryTimer();
    setError(null);

    const ctrl = connectControl(target.ip, target.certificate, {
      onStateChange: (state) => {
        if (!mountedRef.current) return;
        setConnectionState(state);
        if (state === 'connected') {
          retriesRef.current = 0;
        }
        if (state === 'disconnected' && retriesRef.current < MAX_RETRIES) {
          retriesRef.current += 1;
          retryTimerRef.current = setTimeout(() => connect(target), RETRY_DELAY_MS);
        }
        if (state === 'error' && retriesRef.current >= MAX_RETRIES) {
          setError('Connection lost. Tap to reconnect.');
        }
      },
      onError: (msg) => {
        if (!mountedRef.current) return;
        setError(msg);
      },
    });

    socketRef.current = ctrl;
  }, []);

  const disconnect = useCallback(() => {
    clearRetryTimer();
    socketRef.current?.disconnect();
    socketRef.current = null;
    setConnectionState('disconnected');
  }, []);

  const sendKey = useCallback((keyCode: number, direction: KeyDirection = 'SHORT') => {
    socketRef.current?.sendKey(keyCode, direction);
  }, []);

  const sendText = useCallback((text: string) => {
    socketRef.current?.sendText(text);
  }, []);

  useEffect(() => {
    if (tv) connect(tv);
    return () => {
      mountedRef.current = false;
      clearRetryTimer();
      socketRef.current?.disconnect();
    };
  }, [tv?.id]);

  return { connect, disconnect, sendKey, sendText, connectionState, error };
}
