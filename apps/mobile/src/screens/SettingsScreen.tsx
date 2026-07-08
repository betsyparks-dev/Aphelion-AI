import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../theme';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [darkMode] = useState(true);
  const [isPremium] = useState(false);

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Premium',
      'Get full birth chart horoscopes, transit alerts, and compatibility insights for $4.99/month.',
      [
        { text: 'Not Now', style: 'cancel' },
        { text: 'Learn More', style: 'default' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="settings-sharp" size={28} color={colors.primary} />
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Subscription Card */}
        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <Ionicons name={isPremium ? 'diamond' : 'star-outline'} size={24} color={isPremium ? colors.accent : colors.textMuted} />
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionTitle}>
                {isPremium ? 'Premium Member' : 'Free Tier'}
              </Text>
              <Text style={styles.subscriptionDesc}>
                {isPremium
                  ? 'You have full access to all features'
                  : 'Upgrade for full birth chart horoscopes'}
              </Text>
            </View>
          </View>
          {!isPremium && (
            <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
              <Text style={styles.upgradeText}>Upgrade to Premium</Text>
              <Text style={styles.upgradePrice}>$4.99/mo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications Section */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color={colors.text} />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationsEnabled ? colors.primaryLight : colors.textMuted}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="calendar" size={20} color={colors.text} />
              <Text style={styles.settingLabel}>Daily Horoscope Reminder</Text>
            </View>
            <Switch
              value={dailyReminder}
              onValueChange={setDailyReminder}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={dailyReminder ? colors.primaryLight : colors.textMuted}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingRow} onPress={() => Alert.alert('Coming Soon', 'Time zone settings will be available in a future update.')}>
            <View style={styles.settingInfo}>
              <Ionicons name="time" size={20} color={colors.text} />
              <Text style={styles.settingLabel}>Time Zone</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.settingValueText}>{Intl.DateTimeFormat().resolvedOptions().timeZone}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} onPress={() => Alert.alert('Coming Soon', 'Chart display preferences coming soon.')}>
            <View style={styles.settingInfo}>
              <Ionicons name="color-palette" size={20} color={colors.text} />
              <Text style={styles.settingLabel}>Chart Style</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.settingValueText}>Modern</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="person" size={20} color={colors.text} />
              <Text style={styles.settingLabel}>Edit Birth Chart</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="download" size={20} color={colors.text} />
              <Text style={styles.settingLabel}>Download Birth Chart Report</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle" size={20} color={colors.text} />
              <Text style={styles.settingLabel}>Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  header: { marginBottom: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, marginTop: spacing.xs },
  subscriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  subscriptionHeader: { flexDirection: 'row', alignItems: 'center' },
  subscriptionInfo: { marginLeft: spacing.md, flex: 1 },
  subscriptionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text },
  subscriptionDesc: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  upgradeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  upgradeText: { fontSize: fontSize.md, fontWeight: '600', color: '#fff' },
  upgradePrice: { fontSize: fontSize.sm, color: colors.primaryLight },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingLabel: { fontSize: fontSize.md, color: colors.text, marginLeft: spacing.sm },
  settingValue: { flexDirection: 'row', alignItems: 'center' },
  settingValueText: { fontSize: fontSize.sm, color: colors.textSecondary, marginRight: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border },
  versionText: { fontSize: fontSize.sm, color: colors.textMuted },
});