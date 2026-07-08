import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { CompatibilityResult } from '../types';

export default function CompatibilityScreen() {
  const [partnerName, setPartnerName] = useState('');
  const [partnerDate, setPartnerDate] = useState('');
  const [partnerTime, setPartnerTime] = useState('');
  const [partnerPlace, setPartnerPlace] = useState('');
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const calculateCompatibility = () => {
    // Mock result for demo
    setResult({
      score: 82,
      overall: 'You and your partner share a deep emotional connection with strong intellectual rapport. Your elements complement each other well, creating a balanced and harmonious partnership.',
      strengths: [
        'Excellent emotional understanding',
        'Shared intellectual interests',
        'Complementary communication styles',
      ],
      challenges: [
        'Different approaches to finances',
        'Need for more quality time together',
        'Occasional power struggles',
      ],
      aspects: [
        { planet1: 'Venus', planet2: 'Mars', type: 'trine', orb: 1.5, applying: true },
        { planet1: 'Sun', planet2: 'Moon', type: 'sextile', orb: 2.1, applying: true },
        { planet1: 'Mercury', planet2: 'Jupiter', type: 'conjunction', orb: 0.8, applying: false },
      ],
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.accent;
    return colors.error;
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
          <TouchableOpacity style={styles.calculateButton} onPress={calculateCompatibility}>
            <Ionicons name="calculator" size={20} color="#fff" />
            <Text style={styles.calculateText}>Calculate Compatibility</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <>
            <View style={[styles.scoreCard, { borderColor: getScoreColor(result.score) }]}>
              <Text style={styles.scoreLabel}>Compatibility Score</Text>
              <Text style={[styles.scoreValue, { color: getScoreColor(result.score) }]}>
                {result.score}%
              </Text>
              <Text style={styles.scoreDesc}>{result.overall}</Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} /> Strengths
              </Text>
              {result.strengths.map((s, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{s}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="warning" size={18} color={colors.accent} /> Challenges
              </Text>
              {result.challenges.map((c, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{c}</Text>
                </View>
              ))}
            </View>
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
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  formTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  input: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  calculateText: { color: '#fff', fontSize: fontSize.md, fontWeight: '600', marginLeft: spacing.sm },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  scoreLabel: { fontSize: fontSize.sm, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  scoreValue: { fontSize: fontSize.xxxl, fontWeight: '700', marginVertical: spacing.sm },
  scoreDesc: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  sectionCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  listItem: { flexDirection: 'row', marginBottom: spacing.sm },
  bullet: { fontSize: fontSize.md, color: colors.primaryLight, marginRight: spacing.sm, width: 12 },
  listText: { fontSize: fontSize.md, color: colors.textSecondary, flex: 1, lineHeight: 22 },
});