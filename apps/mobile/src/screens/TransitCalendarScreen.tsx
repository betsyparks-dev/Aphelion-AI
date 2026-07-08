import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { TransitEvent } from '../types';

const mockTransits: TransitEvent[] = [
  {
    id: '1',
    date: '2026-07-10',
    title: 'New Moon in Cancer',
    description: 'A time for new beginnings in emotional matters and home life. Set intentions for family and security.',
    type: 'major',
    planets: ['Moon', 'Sun'],
    impact: 'high',
  },
  {
    id: '2',
    date: '2026-07-15',
    title: 'Mercury enters Leo',
    description: 'Communication becomes bold and dramatic. Great for creative expression and public speaking.',
    type: 'major',
    planets: ['Mercury'],
    impact: 'high',
  },
  {
    id: '3',
    date: '2026-07-18',
    title: 'Venus trine Jupiter',
    description: 'A harmonious aspect bringing luck in love, finances, and creative pursuits.',
    type: 'minor',
    planets: ['Venus', 'Jupiter'],
    impact: 'medium',
  },
  {
    id: '4',
    date: '2026-07-22',
    title: 'Sun enters Leo',
    description: 'The Sun moves into Leo, boosting confidence and creativity for the next month.',
    type: 'major',
    planets: ['Sun'],
    impact: 'high',
  },
  {
    id: '5',
    date: '2026-07-25',
    title: 'Mars square Saturn',
    description: 'Challenges around ambition and discipline. Avoid impulsive decisions and practice patience.',
    type: 'minor',
    planets: ['Mars', 'Saturn'],
    impact: 'medium',
  },
  {
    id: '6',
    date: '2026-07-28',
    title: 'Full Moon in Aquarius',
    description: 'Culmination in social networks and community matters. Release what no longer serves your higher purpose.',
    type: 'major',
    planets: ['Moon', 'Sun'],
    impact: 'high',
  },
];

const impactColors = {
  high: colors.error,
  medium: colors.accent,
  low: colors.success,
};

export default function TransitCalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [transits] = useState<TransitEvent[]>(mockTransits);

  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goBackMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  };

  const goForwardMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
  };

  const filteredTransits = transits.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === selectedMonth.getMonth() && d.getFullYear() === selectedMonth.getFullYear();
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="calendar" size={28} color={colors.primary} />
          <Text style={styles.title}>Transit Calendar</Text>
          <Text style={styles.subtitle}>Upcoming astrological events personalized for you</Text>
        </View>

        <View style={styles.monthNav}>
          <TouchableOpacity onPress={goBackMonth}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthText}>{monthName}</Text>
          <TouchableOpacity onPress={goForwardMonth}>
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: impactColors.high }]} />
            <Text style={styles.legendText}>High Impact</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: impactColors.medium }]} />
            <Text style={styles.legendText}>Medium Impact</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: impactColors.low }]} />
            <Text style={styles.legendText}>Low Impact</Text>
          </View>
        </View>

        {filteredTransits.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No major transits this month</Text>
          </View>
        ) : (
          filteredTransits.map((transit) => {
            const d = new Date(transit.date);
            return (
              <View key={transit.id} style={[styles.transitCard, { borderLeftColor: impactColors[transit.impact] }]}>
                <View style={styles.transitHeader}>
                  <Text style={styles.transitDate}>
                    {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </Text>
                  {transit.type === 'major' && (
                    <View style={styles.majorBadge}>
                      <Text style={styles.majorBadgeText}>Major</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.transitTitle}>{transit.title}</Text>
                <Text style={styles.transitDescription}>{transit.description}</Text>
                <View style={styles.transitFooter}>
                  {transit.planets.map((p) => (
                    <View key={p} style={styles.planetTag}>
                      <Text style={styles.planetTagText}>{p}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  header: { marginBottom: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, marginTop: spacing.xs },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  monthText: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.xs },
  legendText: { fontSize: fontSize.xs, color: colors.textSecondary },
  emptyState: { alignItems: 'center', marginTop: spacing.xxl },
  emptyText: { fontSize: fontSize.md, color: colors.textMuted, marginTop: spacing.md },
  transitCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
  },
  transitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  transitDate: { fontSize: fontSize.sm, color: colors.textMuted },
  majorBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  majorBadgeText: { fontSize: fontSize.xs, color: '#fff', fontWeight: '600' },
  transitTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  transitDescription: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  transitFooter: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm },
  planetTag: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  planetTagText: { fontSize: fontSize.xs, color: colors.primaryLight },
});