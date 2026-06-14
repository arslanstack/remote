import React, { useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { useDiscovery } from '../hooks/useDiscovery';
import { useTVStore } from '../store/tvStore';
import { TVIcon, ChevronRight, WifiIcon, RefreshIcon, XIcon } from '../components/icons';
import { ScanRings } from '../components/ScanRings';

function TVCard({
  name,
  ip,
  isPaired,
  isConnected,
  onPress,
}: {
  name: string;
  ip: string;
  isPaired?: boolean;
  isConnected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tvcard, pressed && styles.tvcardPressed]}
    >
      <View style={styles.tvIcon}>
        <TVIcon size={24} color={Colors.accent} strokeWidth={1.8} />
      </View>
      <View style={styles.tvMeta}>
        <Text style={styles.tvName}>{name}</Text>
        <Text style={styles.tvIp}>{ip}</Text>
      </View>
      {isPaired && (
        <View style={styles.pill}>
          {isConnected && <View style={styles.dotGreen} />}
          <Text style={styles.pillText}>{isConnected ? 'CONNECTED' : 'PAIRED'}</Text>
        </View>
      )}
      <ChevronRight size={20} color={Colors.textSecondary} />
    </Pressable>
  );
}

export default function DiscoveryScreen() {
  const { tvs, scanning, scan } = useDiscovery();
  const pairedTVs = useTVStore((s) => s.pairedTVs);
  const activeTV = useTVStore((s) => s.activeTV);

  const [showManual, setShowManual] = useState(false);
  const [manualIp, setManualIp] = useState('');

  const navigateToTV = (ip: string, name: string) => {
    router.push({ pathname: '/pairing', params: { ip, name } });
  };

  const handleManualConnect = () => {
    if (!manualIp.trim()) return;
    navigateToTV(manualIp.trim(), 'Android TV');
  };

  const foundIps = new Set(tvs.map((t) => t.ip));
  const newTVs = tvs.filter((t) => !pairedTVs.find((p) => p.ip === t.ip));

  const isEmpty = !scanning && tvs.length === 0 && pairedTVs.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* App bar */}
      <View style={styles.appbar}>
        <Text style={styles.title}>Find your TV</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={scanning}
            onRefresh={scan}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
      >
        <Text style={styles.hint}>
          Make sure your phone and TV are on the same Wi-Fi network
        </Text>

        {/* Scanning state */}
        {scanning && tvs.length === 0 && pairedTVs.length === 0 && (
          <View style={styles.scanCenter}>
            <ScanRings />
            <Text style={styles.scanningText}>Scanning…</Text>
          </View>
        )}

        {/* Empty state */}
        {isEmpty && (
          <View style={styles.emptyCenter}>
            <View style={styles.emptyIcon}>
              <TVIcon size={32} color={Colors.textSecondary} strokeWidth={1.8} />
              <View style={styles.emptyX}>
                <XIcon size={14} color={Colors.textSecondary} strokeWidth={2.2} />
              </View>
            </View>
            <Text style={styles.emptyTitle}>No TVs found</Text>
            <Text style={styles.emptyHint}>
              Make sure your TV is on and connected to the same Wi-Fi network as your phone
            </Text>
            <Pressable
              onPress={scan}
              style={({ pressed }) => [styles.btnGhost, pressed && styles.btnGhostPressed]}
            >
              <RefreshIcon size={18} color={Colors.accent} strokeWidth={2} />
              <Text style={styles.btnGhostText}>Scan again</Text>
            </Pressable>
          </View>
        )}

        {/* Previously paired */}
        {pairedTVs.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Previously paired</Text>
            <View style={styles.cardList}>
              {pairedTVs.map((tv) => (
                <TVCard
                  key={tv.id}
                  name={tv.name}
                  ip={tv.ip}
                  isPaired
                  isConnected={activeTV?.id === tv.id}
                  onPress={() => navigateToTV(tv.ip, tv.name)}
                />
              ))}
            </View>
          </>
        )}

        {/* Found on network */}
        {newTVs.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: pairedTVs.length > 0 ? 24 : 0 }]}>
              Found on your network
            </Text>
            <View style={styles.cardList}>
              {newTVs.map((tv) => (
                <TVCard
                  key={tv.ip}
                  name={tv.name}
                  ip={tv.ip}
                  onPress={() => navigateToTV(tv.ip, tv.name)}
                />
              ))}
            </View>
          </>
        )}

        {/* Scanning indicator when TVs already shown */}
        {scanning && (tvs.length > 0 || pairedTVs.length > 0) && (
          <View style={styles.scanningRow}>
            <ActivityIndicator size="small" color={Colors.accent} />
            <Text style={styles.scanningSmall}>Scanning…</Text>
          </View>
        )}

        <View style={styles.spacer} />

        {/* Manual connect */}
        {!showManual ? (
          <Pressable onPress={() => setShowManual(true)} style={styles.manualBtn}>
            <Text style={styles.manualBtnText}>
              {isEmpty ? 'Enter IP address manually' : "Don't see your TV?"}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.manualSection}>
            <Text style={styles.sectionLabel}>Connect manually</Text>
            <View style={styles.manualRow}>
              <View style={[styles.field, manualIp.length > 0 && styles.fieldFocused]}>
                <TVIcon size={18} color={Colors.textSecondary} strokeWidth={1.8} />
                <TextInput
                  style={styles.fieldInput}
                  value={manualIp}
                  onChangeText={setManualIp}
                  placeholder="192.168.x.x"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="decimal-pad"
                  selectionColor={Colors.accent}
                />
              </View>
              <Pressable
                onPress={handleManualConnect}
                style={({ pressed }) => [styles.connectBtn, pressed && styles.connectBtnPressed]}
              >
                <Text style={styles.connectBtnText}>Connect</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: -0.2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  hint: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 0,
    lineHeight: 19,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
    marginBottom: 12,
    marginTop: 0,
  },
  cardList: {
    gap: 10,
  },
  tvcard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 15,
    paddingHorizontal: 16,
  },
  tvcardPressed: {
    backgroundColor: Colors.surfaceHigh,
  },
  tvIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.trackpad,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tvMeta: {
    flex: 1,
    minWidth: 0,
  },
  tvName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  tvIp: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.accentMuted,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: Colors.accent,
  },
  dotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  scanCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 60,
  },
  scanningText: {
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 0.4,
  },
  scanningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  scanningSmall: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  emptyCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emptyX: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: -0.2,
  },
  emptyHint: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
    lineHeight: 19,
  },
  btnGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  btnGhostPressed: {
    backgroundColor: Colors.accentMuted,
  },
  btnGhostText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accent,
  },
  spacer: {
    flex: 1,
    minHeight: 20,
  },
  manualBtn: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  manualBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.accent,
  },
  manualSection: {
    paddingTop: 18,
  },
  manualRow: {
    flexDirection: 'row',
    gap: 10,
  },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  fieldFocused: {
    borderColor: Colors.accent,
  },
  fieldInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
  connectBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  connectBtnPressed: {
    backgroundColor: '#e55c28',
  },
  connectBtnText: {
    color: '#0A0A0A',
    fontWeight: '600',
    fontSize: 16,
  },
});
