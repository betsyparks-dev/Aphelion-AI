import React, { useState, useEffect } from 'react';
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
import { auth } from '../services/api';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const me = await auth.getMe();
      setUserEmail(me.user.email);
      setUserName(me.user.displayName);
    } catch (e) {
      // Not logged in
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out? You will need to sign in again to access your birth chart.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await auth.clearToken();
            // Force reload the app
            Alert.alert('Logged Out', 'You have been logged out. Please restart the app to sign in again.');
          },
        },
      ]
    );
  };

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

        {/* Profile Card */}
        {userEmail && (
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={28} color={colors.primaryLight} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userName || 'User'}</Text>
              <Text style={styles.profileEmail}>{userEmail}</Text>
            </View>
          </View>
        )}

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
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
            <View style={styles.settingInfo}>
              <Ionicons name="log-out" size={20} color={colors.error} />
              <Text style={[styles.settingLabel, { color: colors.error }]}>Log Out</Text>
            </View>
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
  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surfaceLight,
    justifyContent: 'center', alignItems: 'center',
  },
  profileInfo: { marginLeft: spacing.md, flex: 1 },
  profileName: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text },
  profileEmail: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  subscriptionCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg,
    marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.primary,
  },
  subscriptionHeader: { flexDirection: 'row', alignItems: 'center' },
  subscriptionInfo: { marginLeft: spacing.md, flex: 1 },
  subscriptionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text },
  subscriptionDesc: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  upgradeButton: {
    backgroundColor: colors.primary, borderRadius: borderRadius.md, padding: spacing.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md,
  },
  upgradeText: { fontSize: fontSize.md, fontWeight: '600', color: '#fff' },
  upgradePrice: { fontSize: fontSize.sm, color: colors.primaryLight },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  settingsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, overflow: 'hidden', marginBottom: spacing.md },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingLabel: { fontSize: fontSize.md, color: colors.text, marginLeft: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border },
  versionText: { fontSize: fontSize.sm, color: colors.textMuted },
});