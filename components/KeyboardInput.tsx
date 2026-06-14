import React, { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../constants/colors';
import { XIcon, CheckIcon } from './icons';

interface KeyboardInputProps {
  visible: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
}

export function KeyboardInput({ visible, onClose, onSend }: KeyboardInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
    onClose();
  };

  const handleClear = () => setText('');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.scrim} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
        pointerEvents="box-none"
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sectionLabel}>TYPE ON TV</Text>

          <View style={[styles.field, text.length > 0 && styles.fieldFocused]}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Type to send to TV…"
              placeholderTextColor={Colors.textSecondary}
              autoFocus
              returnKeyType="send"
              onSubmitEditing={handleSend}
              selectionColor={Colors.accent}
            />
            {text.length > 0 && (
              <Pressable onPress={handleClear} style={styles.clearBtn}>
                <XIcon size={16} color={Colors.textSecondary} strokeWidth={2.2} />
              </Pressable>
            )}
          </View>

          <Pressable
            onPress={handleSend}
            style={({ pressed }) => [styles.sendBtn, pressed && styles.sendBtnPressed]}
          >
            <CheckIcon size={18} color="#0A0A0A" strokeWidth={2.5} />
            <Text style={styles.sendText}>Send to TV</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  kav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 3,
    backgroundColor: Colors.surfaceHigh,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  fieldFocused: {
    borderColor: Colors.accent,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 18,
    fontFamily: undefined,
  },
  clearBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sendBtnPressed: {
    backgroundColor: '#e55c28',
    transform: [{ scale: 0.98 }],
  },
  sendText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: '600',
  },
});
