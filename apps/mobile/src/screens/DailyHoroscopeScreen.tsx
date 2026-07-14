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
import { horoscopeApi } from '../services/api';

interface ParsedHoroscope {
  date: string;
  content: string;
  sections: { title: string; body: string; icon: keyof typeof Ionicons.glyphMap; color: string }[];
}

export default function DailyHoroscopeScreen() {
  const [horoscope, setHoroscope] = useState<ParsedHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHoroscope();
  }, []);

  const fetchHoroscope = async () => {
    try {
      setError(null);
      const data = await horoscopeApi.daily();
      const content = data.horoscope.content;
      const sections = parseHoroscopeContent(content);
      setHoroscope({
        date: data.horoscope.date,
        content,
        sections,
      });
    } catch (err: any) {
      console.error('Failed to fetch horoscope:', err);
      setError(err.message || 'Failed to load horoscope');
      // Fallback to mock data
      setHoroscope({
        date: new Date().toISOString().split('T')[0],
        content: 'Please calculate your birth chart first to get a personalized horoscope.',
        sections: [
          { title: 'Overall', body: 'Calculate your birth chart to receive a personalized daily horoscope based on your unique planetary positions.', icon: 'sunny', color: colors.accent },
          { title: 'Love', body: 'Your personalized love horoscope will appear once your birth chart is calculated.', icon: 'heart', color: '#ef4444' },
          { title: 'Career', body: 'Career insights customized to your natal chart will be available soon.', icon: 'briefcase', color: colors.secondary },
          { title: 'Health', body: 'Health and wellness guidance based on your planetary transits.', icon: 'fitness', color: colors.success },
        ],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const parseHoroscopeContent = (text: string): ParsedHoroscope['sections'] => {
    const sections: ParsedHoroscope['sections'] = [];
    const lines = text.split('\n').filter(Boolean);

    let currentTitle = 'Overview';
    let currentBody = '';

    const iconMap: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
      'Significant': { icon: 'sunny', color: colors.accent },
      'Notable': { icon: 'heart', color: '#ef4444' },
      'Subtle': { icon: 'fitness', color: colors.success },
    };

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.startsWith('significant')) {
        if (currentBody) sections.push({ title: currentTitle, body: currentBody, ...iconMap[currentTitle] || { icon: 'sunny', color: colors.accent } });
        currentTitle = 'Significant Transits';
        currentBody = line.replace(/^Significant transits today:\s*/i, '');
      } else if (lower.startsWith('notable')) {
        if (currentBody) sections.push({ title: currentTitle, body: currentBody, ...iconMap[currentTitle] || { icon: 'sunny', color: colors.accent } });
        currentTitle = 'Notable Influences';
        currentBody = line.replace(/^Notable influences:\s*/i, '');
      } else if (lower.startsWith('subtle')) {
        if (currentBody) sections.push({ title: currentTitle, body: currentBody, ...iconMap[currentTitle] || { icon: 'sunny', color: colors.accent } });
        currentTitle = 'Subtle Shifts';
        currentBody = line.replace(/^Subtle shifts:\s*/i, '');
      } else if (lower.startsWith('remember')) {
        // Skip closing message
      } else {
        currentBody += (currentBody ? ' ' : '') + line.replace(/^•\s*/, '').trim();
      }
    }

    if (currentBody) {
      sections.push({ title: currentTitle, body: currentBody, ...iconMap[currentTitle] || { icon: 'sunny', color: colors.accent } });
    }

    // If no sections parsed, add the whole content as one section
    if (sections.length === 0) {
      sections.push({ title: 'Your Horoscope', body: text, icon: 'sunny', color: colors.accent });
    }

    return sections;
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
            {horoscope?.date
              ? new Date(horoscope.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
              : new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <Text style={styles.title}>Your Daily Horoscope</Text>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {horoscope?.sections.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon} size={22} color={section.color} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{section.body}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={18} color={colors.primaryLight} />
          <Text style={styles.refreshText}>Refresh for Today</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.md },
  header: { marginBottom: spacing.lg },
  date: { fontSize: fontSize.sm, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, marginTop: spacing.xs },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: { fontSize: fontSize.sm, color: colors.error, marginLeft: spacing.sm, flex: 1 },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginLeft: spacing.sm },
  sectionContent: { fontSize: fontSize.md, color: colors.textSecondary, lineHeight: 24 },
  refreshButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.md, marginTop: spacing.sm },
  refreshText: { fontSize: fontSize.sm, color: colors.primaryLight, marginLeft: spacing.xs },
});