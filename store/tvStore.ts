import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TV {
  id: string;
  name: string;
  ip: string;
  port: number;
  certificate: string;
  pairedAt: number;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

interface TVStore {
  pairedTVs: TV[];
  activeTV: TV | null;
  connectionState: ConnectionState;

  addTV: (tv: TV) => void;
  removeTV: (id: string) => void;
  setActiveTV: (tv: TV) => void;
  setConnectionState: (state: ConnectionState) => void;
  loadPairedTVs: () => Promise<void>;
}

const STORAGE_KEY = 'paired_tvs';

export const useTVStore = create<TVStore>((set, get) => ({
  pairedTVs: [],
  activeTV: null,
  connectionState: 'disconnected',

  addTV: async (tv) => {
    const existing = get().pairedTVs.filter((t) => t.id !== tv.id);
    const updated = [tv, ...existing];
    set({ pairedTVs: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  removeTV: async (id) => {
    const updated = get().pairedTVs.filter((t) => t.id !== id);
    set({ pairedTVs: updated });
    if (get().activeTV?.id === id) set({ activeTV: null, connectionState: 'disconnected' });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  setActiveTV: (tv) => set({ activeTV: tv }),

  setConnectionState: (state) => set({ connectionState: state }),

  loadPairedTVs: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) set({ pairedTVs: JSON.parse(raw) });
    } catch {
      // ignore storage errors
    }
  },
}));
