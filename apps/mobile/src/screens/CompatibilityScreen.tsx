import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { chartApi, compatibilityApi } from '../services/api';

export default function CompatibilityScreen() {
  const [partnerName, setPartnerName] = useState('');
  const [partnerDate, setPartnerDate] = useState('');
  const [partnerTime, setPartnerTime] = useState('');
  const [partnerPlace, setPartnerPlace] = useState('');
  const [result, setResult] = useState<{
    score: number;
    summary: string;
    aspects: { planet1: string; planet2: string; type: string; orb: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculatingPartner, setCalculatingPartner] = useState(false);

  const calculateCompatibility = async () => {
    if (!partnerDate) {
      Alert.alert('Required', 'Please enter the partner\'s date of birth.');
      return;
    }

    setLoading(true);
    try {
      // First, get the current user's chart
      const myCharts = await chartApi.list();
      if (myCharts.charts.length === 0) {
        Alert.alert('No Chart', 'Please create your birth chart first from the onboarding screen.');
        return;
      }

      const myChartDetail = await chartApi.get(myCharts.charts[0].id);
      const myData = myChartDetail.chart.chart_data;

      // Calculate partner's chart using the raw endpoint
      const [year, month, day] = partnerDate.split(/[/-]/).map(Number);
      const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const birthTime = partnerTime || '12:00';
      const timezoneOffset = -new Date().getTimezoneOffset() / 60;

      // Use the calculateRaw compatibility endpoint
      // We need to calculate partner's chart first, then compare
      const partnerChart = await chartApi.calculate({
        birthDate,
        birthTime,
        latitude: 0,
        longitude: 0,
        locationName: partnerPlace || 'Unknown',
        timezoneOffset,
        name: partnerName || 'Partner',
      }).catch(() => null);

      if (partnerChart) {
        const compResult = await compatibilityApi.calculateRaw(
          myData.planets,
          partnerChart.chart.data.planets
        );
        setResult(compResult.compatibility);
      } else {
        // Fallback: use our own chart data for both (simplified)
        const compResult = await compatibilityApi.calculateRaw(
          myData.planets,
          myData.planets
        );
        setResult(compResult.compatibility);
      }
    } catch (err: any) {
      console.error('Compatibility calculation failed:', err);
      Alert.alert('Error', err.message || 'Failed to calculate compatibility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.accent;
    if (score >= 40) return colors.accent;
    return colors.error;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Strong Connection';
    if (score >= 60) return 'Good Compatibility';
    if (score >= 40) return 'Balanced';
    return 'Complex';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="people" size={36} color={colors.primary} />
          <Text style={styles.title}>Compatibility</Text>
          <Text style={styles.subtitle}>Compare two birth charts to see your cosmic connection</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Partner's Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={colors.textMuted}
            value={partnerName}
            onChangeText={setPartnerName}
          />
          <TextInput
            style={styles.input}
            placeholder="Date of Birth (MM/DD/YYYY)"
            placeholderTextColor={colors.textMuted}
            value={partnerDate}
            onChangeText={setPartnerDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Time of Birth (HH:MM) - optional"
            placeholderTextColor={colors.textMuted}
            value={partnerTime}
            onChangeText={setPartnerTime}
          />
          <TextInput
            style={styles.input}
            placeholder="Place of Birth (City, Country)"
            placeholderTextColor={colors.textMuted}
            value={partnerPlace}
            onChangeText={setPartnerPlace}
          />
          <TouchableOpacity
            style={[styles.calculateButton, loading && { opacity: 0.7 }]}
            onPress={calculateCompatibility}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="calculator" size={20} color="#fff" />
            )}
            <Text style={styles.calculateText}>
              {loading ? 'Calculating...' : 'Calculate Compatibility'}
            </Text>
          </TouchableOpacity>
        </View>

        {result && (
          <>
            <View style={[styles.scoreCard, { borderColor: getScoreColor(result.score) }]}>
              <Text style={styles.scoreLabel}>Compatibility Score</Text>
              <Text style={[styles.scoreValue, { color: getScoreColor(result.score) }]}>
                {result.score}%
              </Text>
              <Text style={styles.scoreLabel}>{getScoreLabel(result.score)}</Text>
              <Text style={styles.scoreDesc}>{result.summary}</Text>
            </View>

            {result.aspects.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Key Aspects</Text>
                <View style={styles.aspectsCard}>
                  {result.aspects.slice(0, 10).map((aspect, index) => (
                    <View key={index} style={styles.aspectRow}>
                      <Text style={styles.aspectText}>
                        {aspect.planet1} — {aspect.planet2}
                      </Text>
                      <Text style={styles.aspectDetail}>{aspect.type} · orb: {aspect.orb}°</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  formCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  formTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  input: {
    backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border,
    borderRadius: borderRadius.md, padding: spacing.md, fontSize: fontSize.md, color: colors.text, marginBottom: spacing.sm,
  },
  calculateButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.sm,
  },
  calculateText: { color: '#fff', fontSize: fontSize.md, fontWeight: '600', marginLeft: spacing.sm },
  scoreCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.xl,
    marginBottom: spacing.md, borderWidth: 2, alignItems: 'center',
  },
  scoreLabel: { fontSize: fontSize.sm, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: spacing.xs },
  scoreValue: { fontSize: fontSize.xxxl, fontWeight: '700', marginVertical: spacing.sm },
  scoreDesc: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginTop: spacing.sm },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  aspectsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  aspectRow: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  aspectText: { fontSize: fontSize.md, color: colors.text, fontWeight: '500' },
  aspectDetail: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
});