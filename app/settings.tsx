import React from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { useTVStore } from '../store/tvStore';
import {
  ArrowLeft,
  TVIcon,
  InfoIcon,
  StarIcon,
  ShieldIcon,
  ArrowUpRightIcon,
  ChevronRight,
} from '../components/icons';
import { TarkibMark } from '../components/icons';

function SetRow({
  icon,
  title,
  subtitle,
  value,
  right,
  danger,
  onPress,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  right?: React.ReactNode;
  danger?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.setRow, pressed && onPress && styles.setRowPressed]}
      disabled={!onPress}
    >
      {icon && <View style={styles.setRowIcon}>{icon}</View>}
      <View style={styles.setRowMain}>
        <Text style={[styles.setRowTitle, danger && styles.setRowDanger]}>{title}</Text>
        {subtitle && <Text style={styles.setRowSub}>{subtitle}</Text>}
      </View>
      {value && <Text style={styles.setRowVal}>{value}</Text>}
      {right}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const activeTV = useTVStore((s) => s.activeTV);
  const pairedTVs = useTVStore((s) => s.pairedTVs);
  const removeTV = useTVStore((s) => s.removeTV);
  const setActiveTV = useTVStore((s) => s.setActiveTV);
  const setConnectionState = useTVStore((s) => s.setConnectionState);

  const handleDisconnect = () => {
    setConnectionState('disconnected');
    router.replace('/discovery');
  };

  const handleForgetActive = () => {
    if (!activeTV) return;
    Alert.alert(
      'Forget this TV?',
      `This will remove ${activeTV.name} from your paired TVs.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Forget',
          style: 'destructive',
          onPress: () => {
            removeTV(activeTV.id);
            router.replace('/discovery');
          },
        },
      ],
    );
  };

  const handleForgetTV = (id: string, name: string) => {
    Alert.alert('Forget TV?', `Remove ${name} from paired TVs?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeTV(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.appbar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Connected TV */}
        {activeTV && (
          <View style={styles.setGroup}>
            <Text style={styles.sectionLabel}>Connected TV</Text>
            <View style={styles.setCard}>
              <SetRow
                icon={<TVIcon size={21} color={Colors.accent} strokeWidth={1.8} />}
                title={activeTV.name}
                subtitle={activeTV.ip}
                right={<View style={[styles.dot, styles.dotGreen]} />}
              />
              <SetRow
                title="Disconnect"
                onPress={handleDisconnect}
              />
              <SetRow
                title="Forget this TV"
                danger
                onPress={handleForgetActive}
              />
            </View>
          </View>
        )}

        {/* All paired TVs */}
        {pairedTVs.length > 0 && (
          <View style={styles.setGroup}>
            <Text style={styles.sectionLabel}>Paired TVs</Text>
            <View style={styles.setCard}>
              {pairedTVs.map((tv) => (
                <SetRow
                  key={tv.id}
                  icon={<TVIcon size={20} color={Colors.textSecondary} strokeWidth={1.8} />}
                  title={tv.name}
                  subtitle={tv.ip}
                  right={<ChevronRight size={18} color={Colors.textSecondary} />}
                  onPress={() => {
                    setActiveTV(tv);
                    router.replace('/remote');
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* About */}
        <View style={styles.setGroup}>
          <Text style={styles.sectionLabel}>About</Text>
          <View style={styles.setCard}>
            <SetRow
              icon={<InfoIcon size={20} color={Colors.textSecondary} strokeWidth={1.9} />}
              title="Version"
              value="1.0.0"
            />
            <SetRow
              icon={<StarIcon size={20} color={Colors.textSecondary} strokeWidth={1.9} />}
              title="Rate the app"
              right={<ArrowUpRightIcon size={18} color={Colors.textSecondary} strokeWidth={2} />}
              onPress={() => Linking.openURL('market://details?id=com.arslan.androidtvremote')}
            />
            <SetRow
              icon={<ShieldIcon size={20} color={Colors.textSecondary} strokeWidth={1.9} />}
              title="Privacy Policy"
              right={<ArrowUpRightIcon size={18} color={Colors.textSecondary} strokeWidth={2} />}
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.flex1} />

        {/* Tarkib footer */}
        <View style={styles.footer}>
          <TarkibMark size={34} />
          <Text style={styles.footerName}>Tarkib</Text>
          <Text style={styles.footerTagline}>$1, yours forever · No ads, ever</Text>
        </View>
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
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  setGroup: {
    marginBottom: 24,
  },
  setCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  setRowPressed: {
    backgroundColor: Colors.surfaceHigh,
  },
  setRowIcon: {
    width: 40,
    height: 40,
    borderRadius: 9,
    backgroundColor: Colors.trackpad,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  setRowMain: {
    flex: 1,
    minWidth: 0,
  },
  setRowTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  setRowDanger: {
    color: Colors.error,
  },
  setRowSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  setRowVal: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  dotGreen: {
    backgroundColor: Colors.success,
  },
  flex1: { flex: 1, minHeight: 20 },
  footer: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  footerName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: 0.3,
  },
  footerTagline: {
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
});
