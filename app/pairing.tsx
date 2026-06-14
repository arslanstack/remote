import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Rect, Path } from 'react-native-svg';
import { Colors } from '../constants/colors';
import { startPairing, PairingStatus } from '../modules/pairing';
import { useTVStore } from '../store/tvStore';
import { ArrowLeft, CheckIcon, XIcon } from '../components/icons';

type Stage = 0 | 1 | 2;

const STEP_LABELS = ['Connect', 'Accept on TV', 'Done'];

function StepBar({ stage }: { stage: Stage }) {
  return (
    <View style={styles.steps}>
      {STEP_LABELS.map((label, i) => {
        const done = i < stage;
        const active = i === stage;
        return (
          <React.Fragment key={label}>
            {i > 0 && (
              <View style={[styles.stepLine, done && styles.stepLineDone]} />
            )}
            <View style={styles.step}>
              <View style={[
                styles.stepDot,
                active && styles.stepDotActive,
                done && styles.stepDotDone,
              ]}>
                {done
                  ? <CheckIcon size={14} color="#0A0A0A" strokeWidth={2.6} />
                  : <Text style={[styles.stepNum, active && styles.stepNumActive]}>{i + 1}</Text>}
              </View>
              <Text style={[
                styles.stepLabel,
                active && styles.stepLabelActive,
                done && styles.stepLabelDone,
              ]}>
                {label}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

function TVAcceptIllustration() {
  return (
    <Svg width={200} height={132} viewBox="0 0 200 132" fill="none">
      <Rect x="6" y="6" width="188" height="108" rx="8" stroke="#2A2A2A" strokeWidth="2" />
      <Path d="M78 124h44M100 114v10" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" />
      <Rect x="44" y="34" width="112" height="56" rx="7" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="1.5" />
      <Rect x="56" y="44" width="58" height="5" rx="2.5" fill="#3a3a3a" />
      <Rect x="56" y="54" width="40" height="5" rx="2.5" fill="#2f2f2f" />
      <Rect x="56" y="70" width="40" height="12" rx="4" fill="none" stroke="#444" strokeWidth="1.5" />
      <Rect x="104" y="70" width="40" height="12" rx="4" fill="#FF6B35" />
    </Svg>
  );
}

export default function PairingScreen() {
  const { ip, name } = useLocalSearchParams<{ ip: string; name: string }>();
  const addTV = useTVStore((s) => s.addTV);
  const setActiveTV = useTVStore((s) => s.setActiveTV);

  const [stage, setStage] = useState<Stage>(0);
  const [status, setStatus] = useState('Connecting…');
  const [errorMsg, setErrorMsg] = useState('');
  const [certStored, setCertStored] = useState('');
  const [pin, setPin] = useState('');

  const stopRef = useRef<(() => void) | null>(null);

  const startPairingFlow = () => {
    setStage(0);
    setStatus('Connecting…');
    setErrorMsg('');

    stopRef.current = startPairing(ip!, {
      onStatus: (s, msg) => {
        if (s === 'connecting') {
          setStage(0);
          setStatus('Connecting…');
        } else if (s === 'waiting_for_accept') {
          setStage(1);
          setStatus('Accept on your TV');
        } else if (s === 'paired') {
          setStage(2);
          setStatus('Pairing complete!');
          const tv = {
            id: ip!,
            name: name ?? 'Android TV',
            ip: ip!,
            port: 6466,
            certificate: certStored,
            pairedAt: Date.now(),
          };
          addTV(tv);
          setActiveTV(tv);
          setTimeout(() => router.replace('/remote'), 1200);
        } else if (s === 'error') {
          setErrorMsg(msg ?? 'Could not connect.');
        }
      },
      onCertificate: (cert) => setCertStored(cert),
    });
  };

  useEffect(() => {
    startPairingFlow();
    return () => stopRef.current?.();
  }, []);

  const hasError = !!errorMsg;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* App bar */}
      <View style={styles.appbar}>
        <Pressable
          onPress={() => { stopRef.current?.(); router.back(); }}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Connect to TV</Text>
      </View>

      <View style={styles.body}>
        <StepBar stage={hasError ? 0 : stage} />

        {/* Content area */}
        {!hasError ? (
          <View style={styles.center}>
            {stage === 0 && (
              <>
                <ActivityIndicator size="large" color={Colors.accent} />
                <View style={styles.textCenter}>
                  <Text style={styles.statusTitle}>Connecting to {name ?? ip}…</Text>
                  <Text style={styles.ipText}>{ip}</Text>
                </View>
              </>
            )}

            {stage === 1 && (
              <>
                <TVAcceptIllustration />
                <View style={styles.textCenter}>
                  <Text style={styles.statusTitle}>Accept on your TV</Text>
                  <Text style={styles.statusHint}>
                    A prompt has appeared on your TV screen. Select{' '}
                    <Text style={{ color: Colors.text }}>Allow</Text> to continue.
                  </Text>
                </View>
                <View style={styles.pinSection}>
                  <Text style={styles.pinHint}>
                    Some TVs show a PIN instead — enter it below if prompted
                  </Text>
                  <View style={styles.pinRow}>
                    {[0, 1, 2, 3].map((i) => (
                      <View
                        key={i}
                        style={[styles.pinBox, pin.length === i && styles.pinBoxFocus]}
                      >
                        <Text style={[styles.pinChar, !pin[i] && styles.pinCharEmpty]}>
                          {pin[i] ?? ''}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <TextInput
                    style={styles.hiddenInput}
                    value={pin}
                    onChangeText={(t) => setPin(t.replace(/\D/g, '').slice(0, 4))}
                    keyboardType="number-pad"
                    maxLength={4}
                    caretHidden
                  />
                </View>
              </>
            )}

            {stage === 2 && (
              <>
                <View style={styles.successCircle}>
                  <CheckIcon size={48} color={Colors.accent} strokeWidth={2.5} />
                </View>
                <View style={styles.textCenter}>
                  <Text style={[styles.statusTitle, { fontSize: 24 }]}>Connected!</Text>
                  <Text style={styles.statusHint}>{name ?? 'Your TV'} is ready to control</Text>
                </View>
              </>
            )}
          </View>
        ) : (
          <View style={styles.center}>
            <View style={styles.errorCircle}>
              <XIcon size={44} color={Colors.error} strokeWidth={2.4} />
            </View>
            <View style={styles.textCenter}>
              <Text style={styles.statusTitle}>Couldn't connect to {name ?? ip}</Text>
              <Text style={styles.statusHint}>{errorMsg}</Text>
            </View>
          </View>
        )}

        {/* Bottom buttons */}
        {hasError && (
          <View style={styles.bottomBtns}>
            <Pressable
              onPress={startPairingFlow}
              style={({ pressed }) => [styles.btnAccent, pressed && styles.btnAccentPressed]}
            >
              <Text style={styles.btnAccentText}>Try again</Text>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.btnGhost, pressed && styles.btnGhostPressed]}
            >
              <Text style={styles.btnGhostText}>Choose a different TV</Text>
            </Pressable>
          </View>
        )}
      </View>
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
    gap: 6,
    minHeight: 56,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  backBtnPressed: {
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: -0.2,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingTop: 6,
  },
  step: {
    alignItems: 'center',
    gap: 7,
  },
  stepLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.border,
    marginHorizontal: 6,
    marginBottom: 18,
  },
  stepLineDone: {
    backgroundColor: Colors.success,
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  stepDotActive: {
    borderColor: Colors.accent,
  },
  stepDotDone: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  stepNumActive: {
    color: Colors.accent,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  stepLabelActive: {
    color: Colors.accent,
  },
  stepLabelDone: {
    color: Colors.text,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    paddingTop: 8,
  },
  textCenter: {
    alignItems: 'center',
    gap: 8,
  },
  statusTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  statusHint: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 19,
  },
  ipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  pinSection: {
    width: '100%',
    paddingTop: 6,
    gap: 14,
  },
  pinHint: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  pinRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  pinBox: {
    width: 56,
    height: 64,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBoxFocus: {
    borderColor: Colors.accent,
  },
  pinChar: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.text,
  },
  pinCharEmpty: {
    color: 'transparent',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(244,67,54,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBtns: {
    gap: 0,
  },
  btnAccent: {
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  btnAccentPressed: {
    backgroundColor: '#e55c28',
    transform: [{ scale: 0.98 }],
  },
  btnAccentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A0A0A',
  },
  btnGhost: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  btnGhostPressed: {
    backgroundColor: Colors.surface,
  },
  btnGhostText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});
