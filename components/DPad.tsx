import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import { KEYCODE } from '../modules/protocol/keycodes';
import type { KeyDirection } from '../modules/protocol/keycodes';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from './icons';

interface DPadProps {
  onKey: (keyCode: number, direction?: KeyDirection) => void;
}

function DBtn({
  style,
  children,
  onPress,
  onLongPress,
}: {
  style: object;
  children: React.ReactNode;
  onPress: () => void;
  onLongPress?: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.dBtn, style, pressed && styles.dBtnPressed]}
    >
      {children}
    </Pressable>
  );
}

export function DPad({ onKey }: DPadProps) {
  return (
    <View style={styles.dpad}>
      <DBtn style={styles.up} onPress={() => onKey(KEYCODE.DPAD_UP)}>
        <ChevronUp size={24} color={Colors.textSecondary} />
      </DBtn>
      <DBtn style={styles.down} onPress={() => onKey(KEYCODE.DPAD_DOWN)}>
        <ChevronDown size={24} color={Colors.textSecondary} />
      </DBtn>
      <DBtn style={styles.left} onPress={() => onKey(KEYCODE.DPAD_LEFT)}>
        <ChevronLeft size={24} color={Colors.textSecondary} />
      </DBtn>
      <DBtn style={styles.right} onPress={() => onKey(KEYCODE.DPAD_RIGHT)}>
        <ChevronRight size={24} color={Colors.textSecondary} />
      </DBtn>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onKey(KEYCODE.DPAD_CENTER);
        }}
        style={({ pressed }) => [styles.okBtn, pressed && styles.okPressed]}
      >
        <Text style={styles.okText}>OK</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  dpad: {
    width: 232,
    height: 232,
    alignSelf: 'center',
    position: 'relative',
  },
  dBtn: {
    position: 'absolute',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dBtnPressed: {
    backgroundColor: Colors.surfaceHigh,
  },
  up: {
    top: 0,
    left: 76,
    width: 80,
    height: 76,
    borderRadius: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  down: {
    bottom: 0,
    left: 76,
    width: 80,
    height: 76,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  left: {
    left: 0,
    top: 76,
    width: 76,
    height: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 8,
  },
  right: {
    right: 0,
    top: 76,
    width: 76,
    height: 80,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 20,
  },
  okBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 84,
    height: 84,
    marginTop: -42,
    marginLeft: -42,
    borderRadius: 42,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  okPressed: {
    backgroundColor: Colors.surfaceHigh,
    transform: [{ scale: 0.96 }],
  },
  okText: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
