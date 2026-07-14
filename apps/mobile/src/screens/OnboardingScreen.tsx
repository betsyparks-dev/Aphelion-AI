import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { OnboardingStep } from '../types';

interface OnboardingScreenProps {
  onComplete: (chart: {
    name: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    latitude: number;
    longitude: number;
  }) => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Simple city coordinate lookup for common cities
  const getCityCoords = (place: string): { lat: number; lng: number } => {
    const lower = place.toLowerCase();
    const coords: Record<string, { lat: number; lng: number }> = {
      'new york': { lat: 40.7128, lng: -74.006 },
      'los angeles': { lat: 34.0522, lng: -118.2437 },
      'london': { lat: 51.5074, lng: -0.1278 },
      'paris': { lat: 48.8566, lng: 2.3522 },
      'tokyo': { lat: 35.6762, lng: 139.6503 },
      'sydney': { lat: -33.8688, lng: 151.2093 },
      'berlin': { lat: 52.52, lng: 13.405 },
      'mumbai': { lat: 19.076, lng: 72.8777 },
      'beijing': { lat: 39.9042, lng: 116.4074 },
      'moscow': { lat: 55.7558, lng: 37.6173 },
      'toronto': { lat: 43.6532, lng: -79.3832 },
      'chicago': { lat: 41.8781, lng: -87.6298 },
      'san francisco': { lat: 37.7749, lng: -122.4194 },
      'miami': { lat: 25.7617, lng: -80.1918 },
      'seattle': { lat: 47.6062, lng: -122.3321 },
      'delhi': { lat: 28.7041, lng: 77.1025 },
      'são paulo': { lat: -23.5505, lng: -46.6333 },
      'mexico city': { lat: 19.4326, lng: -99.1332 },
      'cairo': { lat: 30.0444, lng: 31.2357 },
      'dubai': { lat: 25.2048, lng: 55.2708 },
      'singapore': { lat: 1.3521, lng: 103.8198 },
      'hong kong': { lat: 22.3193, lng: 114.1694 },
      'istanbul': { lat: 41.0082, lng: 28.9784 },
      'rome': { lat: 41.9028, lng: 12.4964 },
    };

    for (const [city, { lat, lng }] of Object.entries(coords)) {
      if (lower.includes(city)) return { lat, lng };
    }
    // Default to a neutral location (Greenwich)
    return { lat: 51.4769, lng: 0 };
  };

  const handleNext = async () => {
    switch (step) {
      case 'welcome':
        setStep('birth-date');
        break;
      case 'birth-date':
        if (!dateOfBirth) {
          Alert.alert('Required', 'Please enter your date of birth.');
          return;
        }
        setStep('birth-time');
        break;
      case 'birth-time':
        setStep('birth-place');
        break;
      case 'birth-place':
        if (!placeOfBirth) {
          Alert.alert('Required', 'Please enter your place of birth.');
          return;
        }
        setStep('complete');
        break;
      case 'complete': {
        setSubmitting(true);
        const coords = getCityCoords(placeOfBirth);
        onComplete({
          name: name || 'Me',
          dateOfBirth,
          timeOfBirth: timeOfBirth || '12:00',
          placeOfBirth,
          latitude: coords.lat,
          longitude: coords.lng,
        });
        break;
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <View style={styles.welcomeContainer}>
            <Ionicons name="star" size={80} color={colors.primary} />
            <Text style={styles.welcomeTitle}>Astral Lens</Text>
            <Text style={styles.welcomeSubtitle}>
              Your personal astrological guide. Discover what the stars have in store for you every day.
            </Text>
            <Text style={styles.welcomeDesc}>
              Get truly personalized horoscopes based on your unique birth chart — not just your sun sign.
            </Text>
            <View style={styles.featureList}>
              {['Daily personalized horoscopes', 'Full birth chart analysis', 'Compatibility insights', 'Transit calendar'].map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primaryLight} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      case 'birth-date':
        return (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Your Birth Date</Text>
            <Text style={styles.formSubtitle}>When were you born?</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/DD/YYYY"
              placeholderTextColor={colors.textMuted}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              keyboardType="numbers-and-punctuation"
            />
            <TextInput
              style={[styles.input, { marginTop: spacing.md }]}
              placeholder="Your name (optional)"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>
        );
      case 'birth-time':
        return (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Birth Time</Text>
            <Text style={styles.formSubtitle}>What time were you born? (optional but helps accuracy)</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM (24-hour format)"
              placeholderTextColor={colors.textMuted}
              value={timeOfBirth}
              onChangeText={setTimeOfBirth}
              keyboardType="numbers-and-punctuation"
            />
            <Text style={styles.hint}>Even if you don't know the exact time, we can still calculate a partial chart.</Text>
          </View>
        );
      case 'birth-place':
        return (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Place of Birth</Text>
            <Text style={styles.formSubtitle}>Where were you born? (City, Country)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., New York, USA"
              placeholderTextColor={colors.textMuted}
              value={placeOfBirth}
              onChangeText={setPlaceOfBirth}
            />
            <Text style={styles.hint}>We use the location to calculate your rising sign and house positions.</Text>
          </View>
        );
      case 'complete':
        return (
          <View style={styles.welcomeContainer}>
            {submitting ? (
              <>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.welcomeSubtitle}>Calculating your birth chart...</Text>
              </>
            ) : (
              <>
                <Ionicons name="sparkles" size={60} color={colors.accent} />
                <Text style={styles.welcomeTitle}>You're All Set!</Text>
                <Text style={styles.welcomeSubtitle}>
                  Your birth chart is being prepared. Get ready for personalized astrological insights!
                </Text>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>Name</Text>
                  <Text style={styles.summaryValue}>{name || 'Me'}</Text>
                  <Text style={styles.summaryLabel}>Birth Date</Text>
                  <Text style={styles.summaryValue}>{dateOfBirth}</Text>
                  {timeOfBirth ? (
                    <>
                      <Text style={styles.summaryLabel}>Birth Time</Text>
                      <Text style={styles.summaryValue}>{timeOfBirth}</Text>
                    </>
                  ) : null}
                  <Text style={styles.summaryLabel}>Birth Place</Text>
                  <Text style={styles.summaryValue}>{placeOfBirth}</Text>
                </View>
              </>
            )}
          </View>
        );
    }
  };

  const canGoBack = step !== 'welcome';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderStep()}
      </ScrollView>
      <View style={styles.footer}>
        {canGoBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              const steps: OnboardingStep[] = ['welcome', 'birth-date', 'birth-time', 'birth-place', 'complete'];
              const idx = steps.indexOf(step);
              if (idx > 0) setStep(steps[idx - 1]);
            }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, submitting && { opacity: 0.7 }, canGoBack ? { flex: 1, marginLeft: spacing.md } : { flex: 1 }]}
          onPress={handleNext}
          disabled={submitting}
        >
          <Text style={styles.nextButtonText}>
            {submitting ? 'Creating Chart...' : step === 'complete' ? 'Begin Your Journey' : 'Continue'}
          </Text>
          {!submitting && <Ionicons name="arrow-forward" size={20} color="#fff" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  welcomeTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  welcomeSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 24,
  },
  welcomeDesc: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  featureList: {
    marginTop: spacing.xl,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  featureText: {
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  formContainer: {
    paddingVertical: spacing.xl,
  },
  formTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
  },
  formSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  hint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    marginTop: spacing.lg,
  },
  summaryLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  summaryValue: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
});