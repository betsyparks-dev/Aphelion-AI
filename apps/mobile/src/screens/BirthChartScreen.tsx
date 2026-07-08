import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { BirthChartData, PlanetaryPosition } from '../types';

// Mock data for demonstration
const mockChartData: BirthChartData = {
  id: '1',
  chart: {
    userId: 'user1',
    name: 'Me',
    dateOfBirth: '1990-06-15',
    timeOfBirth: '14:30',
    placeOfBirth: 'New York, USA',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
  },
  ascendant: 'Virgo',
  ascendantDegree: 15.3,
  sun: { planet: 'Sun', sign: 'Gemini', degree: 24.2, house: 1, isRetrograde: false },
  moon: { planet: 'Moon', sign: 'Pisces', degree: 8.7, house: 5, isRetrograde: false },
  planets: [
    { planet: 'Mercury', sign: 'Gemini', degree: 12.5, house: 1, isRetrograde: false },
    { planet: 'Venus', sign: 'Cancer', degree: 3.8, house: 2, isRetrograde: false },
    { planet: 'Mars', sign: 'Aries', degree: 19.1, house: 11, isRetrograde: false },
    { planet: 'Jupiter', sign: 'Leo', degree: 5.4, house: 3, isRetrograde: false },
    { planet: 'Saturn', sign: 'Capricorn', degree: 22.9, house: 8, isRetrograde: true },
    { planet: 'Uranus', sign: 'Aquarius', degree: 11.3, house: 9, isRetrograde: true },
    { planet: 'Neptune', sign: 'Sagittarius', degree: 7.2, house: 7, isRetrograde: false },
    { planet: 'Pluto', sign: 'Libra', degree: 16.8, house: 6, isRetrograde: true },
  ],
  houses: [
    { house: 1, sign: 'Virgo', degree: 15.3 },
    { house: 2, sign: 'Libra', degree: 10.1 },
    { house: 3, sign: 'Scorpio', degree: 5.8 },
    { house: 4, sign: 'Sagittarius', degree: 2.4 },
    { house: 5, sign: 'Capricorn', degree: 8.9 },
    { house: 6, sign: 'Aquarius', degree: 14.7 },
    { house: 7, sign: 'Pisces', degree: 15.3 },
    { house: 8, sign: 'Aries', degree: 10.1 },
    { house: 9, sign: 'Taurus', degree: 5.8 },
    { house: 10, sign: 'Gemini', degree: 2.4 },
    { house: 11, sign: 'Cancer', degree: 8.9 },
    { house: 12, sign: 'Leo', degree: 14.7 },
  ],
  aspects: [
    { planet1: 'Sun', planet2: 'Moon', type: 'trine', orb: 2.5, applying: true },
    { planet1: 'Venus', planet2: 'Mars', type: 'square', orb: 1.3, applying: false },
  ],
};

const planetIcons: Record<string, string> = {
  Sun: 'sunny',
  Moon: 'moon',
  Mercury: 'globe',
  Venus: 'heart',
  Mars: 'flame',
  Jupiter: 'thunderstorm',
  Saturn: 'time',
  Uranus: 'planet',
  Neptune: 'water',
  Pluto: 'skull',
};

const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

function PlanetRow({ planet }: { planet: PlanetaryPosition }) {
  const icon = planetIcons[planet.planet] || 'planet';
  const signIndex = zodiacSigns.indexOf(planet.sign);
  const signEmoji = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'][signIndex];

  return (
    <View style={styles.planetRow}>
      <View style={styles.planetIconContainer}>
        <Ionicons name={icon as any} size={20} color={colors.primaryLight} />
      </View>
      <View style={styles.planetInfo}>
        <View style={styles.planetNameRow}>
          <Text style={styles.planetName}>{planet.planet}</Text>
          {planet.isRetrograde && (
            <Text style={styles.retrograde}>℞</Text>
          )}
        </View>
        <Text style={styles.planetPosition}>
          {planet.sign} {signEmoji} {planet.degree}° in House {planet.house}
        </Text>
      </View>
    </View>
  );
}

export default function BirthChartScreen() {
  const chart = mockChartData;
  const ascIndex = zodiacSigns.indexOf(chart.ascendant);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Birth Chart</Text>
          <Text style={styles.subtitle}>{chart.chart.dateOfBirth} · {chart.chart.timeOfBirth}</Text>
          <Text style={styles.subtitle}>{chart.chart.placeOfBirth}</Text>
        </View>

        {/* Ascendant Card */}
        <View style={styles.ascendantCard}>
          <Ionicons name="arrow-up-circle" size={28} color={colors.accent} />
          <View style={styles.ascendantInfo}>
            <Text style={styles.ascendantLabel}>Ascendant (Rising Sign)</Text>
            <Text style={styles.ascendantValue}>
              {chart.ascendant} {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'][ascIndex]}
            </Text>
            <Text style={styles.ascendantDegree}>{chart.ascendantDegree}°</Text>
          </View>
        </View>

        {/* Sun & Moon Card */}
        <View style={styles.sunMoonCard}>
          <View style={styles.sunMoonItem}>
            <Ionicons name="sunny" size={24} color={colors.accent} />
            <Text style={styles.sunMoonLabel}>Sun</Text>
            <Text style={styles.sunMoonSign}>{chart.sun.sign}</Text>
            <Text style={styles.sunMoonDegree}>{chart.sun.degree}° H{chart.sun.house}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.sunMoonItem}>
            <Ionicons name="moon" size={24} color="#94a3b8" />
            <Text style={styles.sunMoonLabel}>Moon</Text>
            <Text style={styles.sunMoonSign}>{chart.moon.sign}</Text>
            <Text style={styles.sunMoonDegree}>{chart.moon.degree}° H{chart.moon.house}</Text>
          </View>
        </View>

        {/* Planets Section */}
        <Text style={styles.sectionTitle}>Planets</Text>
        <View style={styles.planetsCard}>
          {chart.planets.map((planet, index) => (
            <PlanetRow key={index} planet={planet} />
          ))}
        </View>

        {/* Houses Section */}
        <Text style={styles.sectionTitle}>Houses</Text>
        <View style={styles.housesGrid}>
          {chart.houses.map((house) => {
            const signIdx = zodiacSigns.indexOf(house.sign);
            return (
              <View key={house.house} style={styles.houseCard}>
                <Text style={styles.houseNumber}>H{house.house}</Text>
                <Text style={styles.houseSign}>
                  {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'][signIdx]}
                </Text>
                <Text style={styles.houseSignName}>{house.sign}</Text>
              </View>
            );
          })}
        </View>

        {/* Aspects Section */}
        <Text style={styles.sectionTitle}>Aspects</Text>
        <View style={styles.aspectsCard}>
          {chart.aspects.map((aspect, index) => {
            const aspectSymbols: Record<string, string> = {
              conjunction: '☌', sextile: '⚹', square: '□', trine: '△', opposition: '☍', quincunx: '⚻',
            };
            return (
              <View key={index} style={styles.aspectRow}>
                <Text style={styles.aspectPlanets}>{aspect.planet1} {aspectSymbols[aspect.type]} {aspect.planet2}</Text>
                <Text style={styles.aspectDetail}>{aspect.type} · orb: {aspect.orb}°{aspect.applying ? ' (applying)' : ''}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  header: { marginBottom: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs },
  ascendantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  ascendantInfo: { marginLeft: spacing.md, flex: 1 },
  ascendantLabel: { fontSize: fontSize.sm, color: colors.textMuted },
  ascendantValue: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginTop: spacing.xs },
  ascendantDegree: { fontSize: fontSize.sm, color: colors.textSecondary },
  sunMoonCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    justifyContent: 'space-around',
  },
  sunMoonItem: { alignItems: 'center' },
  sunMoonLabel: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.xs },
  sunMoonSign: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginTop: spacing.xs },
  sunMoonDegree: { fontSize: fontSize.sm, color: colors.textSecondary },
  divider: { width: 1, backgroundColor: colors.border },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.md },
  planetsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md },
  planetRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  planetIconContainer: { width: 36, alignItems: 'center' },
  planetInfo: { marginLeft: spacing.sm, flex: 1 },
  planetNameRow: { flexDirection: 'row', alignItems: 'center' },
  planetName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  retrograde: { fontSize: fontSize.xs, color: colors.error, marginLeft: spacing.xs, fontWeight: '700' },
  planetPosition: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  housesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  houseCard: {
    width: '30%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  houseNumber: { fontSize: fontSize.xs, color: colors.textMuted },
  houseSign: { fontSize: fontSize.xl, marginVertical: spacing.xs },
  houseSignName: { fontSize: fontSize.xs, color: colors.textSecondary },
  aspectsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md },
  aspectRow: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  aspectPlanets: { fontSize: fontSize.md, color: colors.text, fontWeight: '500' },
  aspectDetail: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
});