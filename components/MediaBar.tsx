import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import { KEYCODE } from '../modules/protocol/keycodes';
import type { KeyDirection } from '../modules/protocol/keycodes';
import {
  SkipBackIcon,
  RewindIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  SkipFwdIcon,
  VolMuteIcon,
  VolDownIcon,
  VolUpIcon,
} from './icons';

interface MediaBarProps {
  onKey: (keyCode: number, direction?: KeyDirection) => void;
}

function MBtn({
  children,
  onPress,
  primary = false,
}: {
  children: React.ReactNode;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.mbtn,
        primary && styles.mbtnPrimary,
        pressed && (primary ? styles.mbtnPrimaryPressed : styles.mbtnPressed),
      ]}
    >
      {children}
    </Pressable>
  );
}

function VBtn({
  children,
  onPress,
  flex,
}: {
  children: React.ReactNode;
  onPress: () => void;
  flex?: number;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.vbtn,
        flex !== undefined && { flex },
        pressed && styles.vbtnPressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

export function MediaBar({ onKey }: MediaBarProps) {
  const [playing, setPlaying] = useState(false);

  const handlePlayPause = () => {
    setPlaying((p) => !p);
    onKey(KEYCODE.MEDIA_PLAY_PAUSE);
  };

  return (
    <View style={styles.container}>
      {/* Media row */}
      <View style={styles.mediarow}>
        <MBtn onPress={() => onKey(KEYCODE.MEDIA_PREVIOUS)}>
          <SkipBackIcon size={20} color={Colors.text} />
        </MBtn>
        <MBtn onPress={() => onKey(KEYCODE.MEDIA_REWIND)}>
          <RewindIcon size={20} color={Colors.text} />
        </MBtn>
        <MBtn onPress={handlePlayPause} primary>
          {playing
            ? <PauseIcon size={22} color="#0A0A0A" />
            : <PlayIcon size={22} color="#0A0A0A" />}
        </MBtn>
        <MBtn onPress={() => onKey(KEYCODE.MEDIA_FAST_FORWARD)}>
          <ForwardIcon size={20} color={Colors.text} />
        </MBtn>
        <MBtn onPress={() => onKey(KEYCODE.MEDIA_NEXT)}>
          <SkipFwdIcon size={20} color={Colors.text} />
        </MBtn>
      </View>

      {/* Volume row */}
      <View style={styles.volrow}>
        <VBtn onPress={() => onKey(KEYCODE.VOLUME_MUTE)} flex={0}>
          <VolMuteIcon size={20} color={Colors.text} />
        </VBtn>
        <View style={styles.vsep} />
        <VBtn onPress={() => onKey(KEYCODE.VOLUME_DOWN)}>
          <VolDownIcon size={20} color={Colors.text} />
          <Text style={styles.volSign}>–</Text>
        </VBtn>
        <View style={styles.vsep} />
        <VBtn onPress={() => onKey(KEYCODE.VOLUME_UP)}>
          <VolUpIcon size={20} color={Colors.text} />
          <Text style={styles.volSign}>+</Text>
        </VBtn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  mediarow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  mbtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mbtnPressed: {
    backgroundColor: Colors.surfaceHigh,
    transform: [{ scale: 0.96 }],
  },
  mbtnPrimary: {
    flex: 1.3,
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  mbtnPrimaryPressed: {
    backgroundColor: '#e55c28',
    transform: [{ scale: 0.96 }],
  },
  volrow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 6,
    height: 56,
  },
  vbtn: {
    flex: 1,
    height: '100%',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: 56,
  },
  vbtnPressed: {
    backgroundColor: Colors.surfaceHigh,
  },
  vsep: {
    width: 1,
    height: 22,
    backgroundColor: Colors.border,
    flexShrink: 0,
  },
  volSign: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '500',
  },
});
