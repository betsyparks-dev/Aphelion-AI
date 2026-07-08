import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { DailyHoroscope } from '../types';

export default function DailyHoroscopeScreen() {
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHoroscope();
  }, []);

  const fetchHoroscope = async () => {
    try {
      // In production, fetch from API
      // const data = await api.getDailyHoroscope(chartId);
      // Mock data for now
      setHoroscope({
        date: new Date().toISOString().split('T')[0],
        overall: 'The Moon enters your 10th house today, bringing career opportunities to the forefront. Trust your intuition when making professional decisions. Mars in Leo energizes your creative projects — perfect timing to start something new.',
        love: 'Venus trines your natal Venus, making this an excellent day for romance. Single? A chance encounter could spark something special. Coupled? Plan a surprise date night.',
        career: 'Mercury aligns favorably with your midheaven, clearing the path for important communications. Schedule that presentation or pitch today — your words carry extra weight.',
        health: 'With Jupiter in your 6th house, your vitality is strong. A morning yoga session or brisk walk will amplify the positive energy. Stay hydrated.',
        luckyNumber: 7,
        luckyColor: 'Indigo',
        moonPhase: 'Waxing Gibbous',
      });
    } catch (error) {
      console.error('Failed to fetch horoscope:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHoroscope();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="planet" size={48} color={colors.primary} />
          <Text style={styles.loadingText}>Calculating your horoscope...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <Text style={styles.title}>Your Daily Horoscope</Text>
        </View>

        {horoscope?.luckyNumber && (
          <View style={styles.luckyInfo}>
            <View style={styles.luckyItem}>
              <Ionicons name="dice" size={16} color={colors.accent} />
              <Text style={styles.luckyText}>Lucky #: {horoscope.luckyNumber}</Text>
            </View>
            <View style={styles.luckyItem}>
              <Ionicons name="color-palette" size={16} color={colors.accent} />
              <Text style={styles.luckyText}>Color: {horoscope.luckyColor}</Text>
            </View>
            <View style={styles.luckyItem}>
              <Ionicons name="moon" size={16} color={colors.accent} />
              <Text style={styles.luckyText}>Moon: {horoscope.moonPhase}</Text>
            </View>
          </View>
        )}

        {sections.map((section, index) => {
          const key = section.key as keyof DailyHoroscope;
          const content = horoscope?.[key];
          if (typeof content !== 'string') return null;
          return (
            <View key={index} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name={section.icon} size={22} color={section.color} />
                <Text style={styles.sectionTitle}>{section.label}</Text>
              </View>
              <Text style={styles.sectionContent}>{content}</Text>
            </View>
          );
        })}

        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={18} color={colors.primaryLight} />
          <Text style={styles.refreshText}>Refresh for Today</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const sections = [
  { key: 'overall', label: 'Overall', icon: 'sunny' as const, color: colors.accent },
  { key: 'love', label: 'Love & Relationships', icon: 'heart' as const, color: '#ef4444' },
  { key: 'career', label: 'Career & Finance', icon: 'briefcase' as const, color: colors.secondary },
  { key: 'health', label: 'Health & Wellness', icon: 'fitness' as const, color: colors.success },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  luckyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  luckyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  luckyText: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  sectionContent: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  refreshText: {
    fontSize: fontSize.sm,
    color: colors.primaryLight,
    marginLeft: spacing.xs,
  },
});