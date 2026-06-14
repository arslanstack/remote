import Zeroconf from 'react-native-zeroconf';

export interface DiscoveredTV {
  name: string;
  ip: string;
  port: number;
}

const SERVICE_TYPE = 'androidtvremote2';
const SERVICE_DOMAIN = 'local.';

let zc: Zeroconf | null = null;

function getZeroconf(): Zeroconf {
  if (!zc) zc = new Zeroconf();
  return zc;
}

export function startDiscovery(
  onFound: (tv: DiscoveredTV) => void,
  onRemoved: (name: string) => void,
  onError: (err: unknown) => void,
): () => void {
  const z = getZeroconf();

  z.on('resolved', (service) => {
    const ip = service.addresses?.[0];
    if (!ip) return;
    onFound({ name: service.name, ip, port: service.port ?? 6466 });
  });

  z.on('remove', (name) => onRemoved(name));
  z.on('error', onError);

  z.scan(SERVICE_TYPE, 'tcp', SERVICE_DOMAIN);

  return () => {
    z.stop();
    z.removeDeviceListeners();
  };
}

export function stopDiscovery(): void {
  zc?.stop();
}
