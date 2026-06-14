import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import { useTVStore } from '../store/tvStore';
import { useTVConnection } from '../hooks/useTVConnection';
import { KEYCODE } from '../modules/protocol/keycodes';
import type { KeyDirection } from '../modules/protocol/keycodes';
import { DPad } from '../components/DPad';
import { Trackpad } from '../components/Trackpad';
import { MediaBar } from '../components/MediaBar';
import { KeyboardInput } from '../components/KeyboardInput';
import {
  KeyboardIcon,
  MoreIcon,
  HomeIcon,
  BackIcon,
  MenuIcon,
  WifiIcon,
} from '../components/icons';

function NavButton({
  children,
  label,
  onPress,
}: {
  children: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [styles.rbtn, pressed && styles.rbtnPressed]}
    >
      {children}
      <Text style={styles.rbtnLabel}>{label}</Text>
    </Pressable>
  );
}

export default function RemoteScreen() {
  const activeTV = useTVStore((s) => s.activeTV);
  const [kbVisible, setKbVisible] = useState(false);

  const { sendKey, sendText, connectionState, error, connect } = useTVConnection(activeTV);

  const isConnected = connectionState === 'connected';
  const isReconnecting = connectionState === 'connecting' || connectionState === 'disconnected';
  const hasFatalError = connectionState === 'error' && !!error;

  const handleKey = (keyCode: number, direction: KeyDirection = 'SHORT') => {
    sendKey(keyCode, direction);
  };

  if (!activeTV) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.noTVCenter}>
          <Text style={styles.noTVText}>No TV selected</Text>
          <Pressable
            onPress={() => router.replace('/discovery')}
            style={({ pressed }) => [styles.btnAccent, pressed && styles.btnAccentPressed]}
          >
            <Text style={styles.btnAccentText}>Find a TV</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.appbar}>
        <View style={[styles.connDot, isConnected ? styles.dotGreen : styles.dotGrey]} />
        <View style={styles.tvInfo}>
          <Text style={styles.tvName} numberOfLines={1}>{activeTV.name}</Text>
          <Text style={[styles.tvStatus, isConnected ? styles.tvStatusOk : styles.tvStatusWait]}>
            {isConnected ? 'Connected' : 'Reconnecting…'}
          </Text>
        </View>
        <View style={styles.spacer} />
        <Pressable
          onPress={() => setKbVisible(true)}
          style={({ pressed }) => [styles.iconBtn, styles.iconBtnSurface, pressed && styles.iconBtnPressed]}
        >
          <KeyboardIcon size={21} color={Colors.text} strokeWidth={1.8} />
        </Pressable>
        <Pressable
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
        >
          <MoreIcon size={22} color={Colors.text} />
        </Pressable>
      </View>

      {/* Reconnect banner */}
      {hasFatalError && (
        <View style={styles.banner}>
          <WifiIcon size={18} color="#fff" strokeWidth={2} />
          <Text style={styles.bannerText}>Connection lost</Text>
          <Pressable onPress={() => connect(activeTV)} style={styles.bannerAction}>
            <Text style={styles.bannerActionText}>Reconnect</Text>
          </Pressable>
        </View>
      )}
      {isReconnecting && !hasFatalError && (
        <View style={[styles.banner, styles.bannerWarn]}>
          <WifiIcon size={18} color="#fff" strokeWidth={2} />
          <Text style={styles.bannerText}>Reconnecting…</Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Zone 1 — Trackpad */}
        <Trackpad onKey={handleKey} firstUse />

        {/* Zone 2 — D-pad */}
        <DPad onKey={handleKey} />

        {/* Zone 3 — Navigation */}
        <View style={styles.btnrow}>
          <NavButton label="Home" onPress={() => handleKey(KEYCODE.HOME)}>
            <HomeIcon size={21} color={Colors.text} strokeWidth={1.9} />
          </NavButton>
          <NavButton label="Back" onPress={() => handleKey(KEYCODE.BACK)}>
            <BackIcon size={21} color={Colors.text} strokeWidth={1.9} />
          </NavButton>
          <NavButton label="Menu" onPress={() => handleKey(KEYCODE.MENU)}>
            <MenuIcon size={21} color={Colors.text} strokeWidth={1.9} />
          </NavButton>
        </View>

        {/* Zones 4 + 5 — Media + Volume */}
        <MediaBar onKey={handleKey} />
      </ScrollView>

      {/* Keyboard modal */}
      <KeyboardInput
        visible={kbVisible}
        onClose={() => setKbVisible(false)}
        onSend={sendText}
      />
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
    gap: 10,
    minHeight: 56,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 2,
  },
  connDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 2,
    flexShrink: 0,
  },
  dotGreen: { backgroundColor: Colors.success },
  dotGrey: { backgroundColor: Colors.textSecondary },
  tvInfo: {
    minWidth: 0,
  },
  tvName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: -0.1,
  },
  tvStatus: {
    fontSize: 11,
    letterSpacing: 0.4,
    marginTop: 1,
  },
  tvStatusOk: { color: Colors.success },
  tvStatusWait: { color: Colors.textSecondary },
  spacer: { flex: 1 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnSurface: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBtnPressed: {
    backgroundColor: Colors.surfaceHigh,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: Colors.error,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  bannerWarn: {
    backgroundColor: Colors.textSecondary,
  },
  bannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  bannerAction: {
    marginLeft: 'auto',
  },
  bannerActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.95,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  btnrow: {
    flexDirection: 'row',
    gap: 12,
  },
  rbtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 11,
  },
  rbtnPressed: {
    backgroundColor: Colors.surfaceHigh,
    transform: [{ scale: 0.97 }],
  },
  rbtnLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  noTVCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 32,
  },
  noTVText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  btnAccent: {
    height: 52,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAccentPressed: {
    backgroundColor: '#e55c28',
  },
  btnAccentText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: '600',
  },
});
