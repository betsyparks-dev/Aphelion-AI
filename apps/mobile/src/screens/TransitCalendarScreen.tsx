import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { transitApi, chartApi } from '../services/api';

interface TransitDisplay {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'major' | 'minor';
  planets: string[];
  impact: 'high' | 'medium' | 'low';
}

const impactColors = {
  high: colors.error,
  medium: colors.accent,
  low: colors.success,
};

export default function TransitCalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [transits, setTransits] = useState<TransitDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransits();
  }, []);

  const fetchTransits = async () => {
    try {
      setError(null);
      // Get the date range for the current month
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth();
      const start = new Date(year, month, 1).toISOString().split('T')[0];
      const end = new Date(year, month + 1, 0).toISOString().split('T')[0];

      // Check if user has a chart first
      const charts = await chartApi.list().catch(() => null);
      if (!charts || charts.charts.length === 0) {
        setError('Create your birth chart first to see personalized transits.');
        setLoading(false);
        return;
      }

      // Fetch today's transits as a fallback
      const today = await transitApi.today().catch(() => null);
      if (today && today.transits) {
        const mapped: TransitDisplay[] = today.transits.map((t: any, i: number) => ({
          id: `transit-${i}`,
          date: today.date,
          title: `${t.transitPlanet} ${t.aspectType} ${t.planet}`,
          description: t.description,
          type: t.severity === 'major' ? 'major' : 'minor',
          planets: [t.transitPlanet, t.planet],
          impact: t.severity === 'major' ? 'high' : t.severity === 'moderate' ? 'medium' : 'low',
        }));
        setTransits(mapped);
      } else {
        setTransits([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch transits:', err);
      setError(err.message || 'Failed to load transits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Re-fetch when month changes
    if (!loading) {
      fetchTransits();
    }
  }, [selectedMonth]);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading transits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="calendar" size={28} color={colors.primary} />
          <Text style={styles.title}>Transit Calendar</Text>
          <Text style={styles.subtitle}>Upcoming astrological events personalized for you</Text>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.md },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.error,
  },
  errorText: { fontSize: fontSize.sm, color: colors.error, marginLeft: spacing.sm, flex: 1 },
  header: { marginBottom: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, marginTop: spacing.xs },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md,
  },
  monthText: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, marginBottom: spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.xs },
  legendText: { fontSize: fontSize.xs, color: colors.textSecondary },
  emptyState: { alignItems: 'center', marginTop: spacing.xxl },
  emptyText: { fontSize: fontSize.md, color: colors.textMuted, marginTop: spacing.md },
  transitCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg,
    marginBottom: spacing.md, borderLeftWidth: 4,
  },
  transitHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  transitDate: { fontSize: fontSize.sm, color: colors.textMuted },
  majorBadge: { backgroundColor: colors.primary, borderRadius: borderRadius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  majorBadgeText: { fontSize: fontSize.xs, color: '#fff', fontWeight: '600' },
  transitTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  transitDescription: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  transitFooter: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm },
  planetTag: { backgroundColor: colors.surfaceLight, borderRadius: borderRadius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  planetTagText: { fontSize: fontSize.xs, color: colors.primaryLight },
});