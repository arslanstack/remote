import { useCallback, useEffect, useRef, useState } from 'react';
import { startDiscovery, DiscoveredTV } from '../modules/discovery';

export function useDiscovery() {
  const [tvs, setTVs] = useState<DiscoveredTV[]>([]);
  const [scanning, setScanning] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  const scan = useCallback(() => {
    stopRef.current?.();
    setTVs([]);
    setScanning(true);

    const stop = startDiscovery(
      (tv) => setTVs((prev) => {
        if (prev.find((t) => t.ip === tv.ip)) return prev;
        return [...prev, tv];
      }),
      (name) => setTVs((prev) => prev.filter((t) => t.name !== name)),
      (err) => console.warn('[discovery] error', err),
    );

    stopRef.current = () => {
      stop();
      setScanning(false);
    };
  }, []);

  const stopScan = useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
    setScanning(false);
  }, []);

  useEffect(() => {
    scan();
    return () => stopRef.current?.();
  }, []);

  return { tvs, scanning, scan, stopScan };
}
