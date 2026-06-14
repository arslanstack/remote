import React, { useRef } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { KEYCODE } from '../modules/protocol/keycodes';
import type { KeyDirection } from '../modules/protocol/keycodes';

const SWIPE_THRESHOLD = 18;
const TAP_MOVE_LIMIT = 8;

interface TrackpadProps {
  onKey: (keyCode: number, direction?: KeyDirection) => void;
  firstUse?: boolean;
}

export function Trackpad({ onKey, firstUse }: TrackpadProps) {
  const startPos = useRef({ x: 0, y: 0 });
  const lastSentPos = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const fingers = useRef(0);

  const handleStart = (e: GestureResponderEvent) => {
    const touch = e.nativeEvent.touches[0];
    startPos.current = { x: touch.pageX, y: touch.pageY };
    lastSentPos.current = { x: touch.pageX, y: touch.pageY };
    moved.current = false;
    fingers.current = e.nativeEvent.touches.length;
  };

  const handleMove = (e: GestureResponderEvent) => {
    const touch = e.nativeEvent.touches[0];
    const dx = touch.pageX - lastSentPos.current.x;
    const dy = touch.pageY - lastSentPos.current.y;

    const totalDx = touch.pageX - startPos.current.x;
    const totalDy = touch.pageY - startPos.current.y;
    if (Math.abs(totalDx) > TAP_MOVE_LIMIT || Math.abs(totalDy) > TAP_MOVE_LIMIT) {
      moved.current = true;
    }

    if (!moved.current) return;

    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      onKey(dx > 0 ? KEYCODE.DPAD_RIGHT : KEYCODE.DPAD_LEFT);
      lastSentPos.current = { x: touch.pageX, y: lastSentPos.current.y };
    }
    if (Math.abs(dy) >= SWIPE_THRESHOLD) {
      onKey(dy > 0 ? KEYCODE.DPAD_DOWN : KEYCODE.DPAD_UP);
      lastSentPos.current = { x: lastSentPos.current.x, y: touch.pageY };
    }
  };

  const handleEnd = () => {
    if (!moved.current) {
      onKey(KEYCODE.DPAD_CENTER);
    }
    moved.current = false;
  };

  return (
    <View
      style={styles.trackpad}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleStart}
      onResponderMove={handleMove}
      onResponderRelease={handleEnd}
    >
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: 40 }).map((_, row) =>
          Array.from({ length: 40 }).map((__, col) => (
            <View
              key={`${row}-${col}`}
              style={{
                position: 'absolute',
                width: 1.5,
                height: 1.5,
                borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.025)',
                top: row * 9,
                left: col * 9,
              }}
            />
          ))
        )}
      </View>

      <Text style={styles.label}>TRACKPAD</Text>
      {firstUse && (
        <Text style={styles.hint}>Tap to select · Swipe to navigate</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trackpad: {
    flex: 1,
    minHeight: 188,
    backgroundColor: Colors.trackpad,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 4,
  },
  label: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: '#4d4d4d',
    textTransform: 'uppercase',
  },
  hint: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
    letterSpacing: 0.3,
  },
});
