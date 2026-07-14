import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../theme';
import { chartApi } from '../services/api';

interface DisplayPlanet {
  planet: string;
  sign: string;
  degree: number;
  house: number;
  isRetrograde: boolean;
}

interface DisplayChart {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  locationName: string | null;
  ascendant: number;
  midheaven: number;
  planets: DisplayPlanet[];
  houses: { house: number; sign: string; degree: number }[];
  aspects: { planet1: string; planet2: string; type: string; orb: number }[];
}

const ZODIAC_SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

function getZodiacSign(longitude: number): { sign: string; degree: number; symbol: string } {
  const signIndex = Math.floor(longitude / 30) % 12;
  const degree = longitude % 30;
  return { sign: ZODIAC_SIGNS[signIndex], degree: Math.round(degree * 10) / 10, symbol: ZODIAC_SYMBOLS[signIndex] };
}

function getHouse(longitude: number, houses: { cusp: number; longitude: number }[]): number {
  for (let i = houses.length - 1; i >= 0; i--) {
    if (longitude >= houses[i].longitude) return houses[i].cusp;
  }
  return 1;
}

const ASPECT_SYMBOLS: Record<string, string> = {
  conjunction: '☌', sextile: '⚹', square: '□', trine: '△', opposition: '☍', quincunx: '⚻', semisextile: '⚺',
};

const PLANET_ICONS: Record<string, string> = {
  Sun: 'sunny', Moon: 'moon', Mercury: 'globe', Venus: 'heart', Mars: 'flame',
  Jupiter: 'thunderstorm', Saturn: 'time', Uranus: 'planet', Neptune: 'water', Pluto: 'skull',
};

function PlanetRow({ planet }: { planet: DisplayPlanet }) {
  const icon = PLANET_ICONS[planet.planet] || 'planet';
  const signIdx = ZODIAC_SIGNS.indexOf(planet.sign);
  return (
    <View style={styles.planetRow}>
      <View style={styles.planetIconContainer}>
        <Ionicons name={icon as any} size={20} color={colors.primaryLight} />
      </View>
      <View style={styles.planetInfo}>
        <View style={styles.planetNameRow}>
          <Text style={styles.planetName}>{planet.planet}</Text>
          {planet.isRetrograde && <Text style={styles.retrograde}>℞</Text>}
        </View>
        <Text style={styles.planetPosition}>
          {planet.sign} {ZODIAC_SYMBOLS[ZODIAC_SIGNS.indexOf(planet.sign)]} {planet.degree}° H{planet.house}
        </Text>
      </View>
    </View>
  );
}

export default function BirthChartScreen() {
  const [chart, setChart] = useState<DisplayChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChart();
  }, []);

  const fetchChart = async () => {
    try {
      const charts = await chartApi.list();
      if (charts.charts.length === 0) {
        setError('No birth chart found. Please create one from the onboarding screen.');
        return;
      }
      const latestChart = charts.charts[0];
      const detail = await chartApi.get(latestChart.id);
      const raw = detail.chart.chart_data;

      // Convert backend planet data to display format
      const planets: DisplayPlanet[] = [];
      if (raw.planets) {
        for (const [name, pos] of Object.entries(raw.planets) as [string, any][]) {
          const { sign, degree } = getZodiacSign(pos.longitude);
          const house = getHouse(pos.longitude, raw.houses || []);
          planets.push({
            planet: name,
            sign,
            degree,
            house,
            isRetrograde: pos.speedLongitude < 0,
          });
        }
      }

      // Convert houses
      const houses = (raw.houses || []).map((h: any) => {
        const { sign, degree } = getZodiacSign(h.longitude);
        return { house: h.cusp, sign, degree };
      });

      // Calculate aspects
      const aspects: { planet1: string; planet2: string; type: string; orb: number }[] = [];
      if (raw.planets) {
        const names = Object.keys(raw.planets);
        for (let i = 0; i < names.length; i++) {
          for (let j = i + 1; j < names.length; j++) {
            let diff = Math.abs(raw.planets[names[i]].longitude - raw.planets[names[j]].longitude) % 360;
            if (diff > 180) diff = 360 - diff;
            const aspectDefs: [number, string, number][] = [
              [0, 'conjunction', 8], [60, 'sextile', 4], [90, 'square', 6],
              [120, 'trine', 6], [180, 'opposition', 8], [150, 'quincunx', 3],
            ];
            for (const [angle, type, maxOrb] of aspectDefs) {
              const orb = Math.abs(diff - angle);
              if (orb <= maxOrb) {
                aspects.push({ planet1: names[i], planet2: names[j], type, orb: Math.round(orb * 10) / 10 });
              }
            }
          }
        }
      }

      const { sign: ascSign, degree: ascDegree } = getZodiacSign(raw.ascendant || 0);

      setChart({
        id: detail.chart.id,
        name: detail.chart.name || 'My Birth Chart',
        birthDate: detail.chart.birth_date,
        birthTime: detail.chart.birth_time,
        locationName: detail.chart.location_name,
        ascendant: raw.ascendant || 0,
        midheaven: raw.midheaven || 0,
        planets,
        houses,
        aspects,
      });
    } catch (err: any) {
      console.error('Failed to fetch chart:', err);
      setError(err.message || 'Failed to load birth chart');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your birth chart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!chart) return null;

  const ascSign = getZodiacSign(chart.ascendant);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{chart.name}</Text>
          <Text style={styles.subtitle}>{chart.birthDate} · {chart.birthTime}</Text>
          {chart.locationName && <Text style={styles.subtitle}>{chart.locationName}</Text>}
        </View>

        {/* Ascendant Card */}
        <View style={styles.ascendantCard}>
          <Ionicons name="arrow-up-circle" size={28} color={colors.accent} />
          <View style={styles.ascendantInfo}>
            <Text style={styles.ascendantLabel}>Ascendant (Rising Sign)</Text>
            <Text style={styles.ascendantValue}>{ascSign.sign} {ascSign.symbol}</Text>
            <Text style={styles.ascendantDegree}>{ascSign.degree}°</Text>
          </View>
        </View>

        {/* Sun & Moon Card */}
        {chart.planets.filter(p => p.planet === 'Sun' || p.planet === 'Moon').length > 0 && (
          <View style={styles.sunMoonCard}>
            {chart.planets.filter(p => p.planet === 'Sun').map(sun => (
              <View key="sun" style={styles.sunMoonItem}>
                <Ionicons name="sunny" size={24} color={colors.accent} />
                <Text style={styles.sunMoonLabel}>Sun</Text>
                <Text style={styles.sunMoonSign}>{sun.sign}</Text>
                <Text style={styles.sunMoonDegree}>{sun.degree}° H{sun.house}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            {chart.planets.filter(p => p.planet === 'Moon').map(moon => (
              <View key="moon" style={styles.sunMoonItem}>
                <Ionicons name="moon" size={24} color="#94a3b8" />
                <Text style={styles.sunMoonLabel}>Moon</Text>
                <Text style={styles.sunMoonSign}>{moon.sign}</Text>
                <Text style={styles.sunMoonDegree}>{moon.degree}° H{moon.house}</Text>
              </View>
            ))}
          </View>
        )}

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
            const signIdx = ZODIAC_SIGNS.indexOf(house.sign);
            return (
              <View key={house.house} style={styles.houseCard}>
                <Text style={styles.houseNumber}>H{house.house}</Text>
                <Text style={styles.houseSign}>{ZODIAC_SYMBOLS[signIdx >= 0 ? signIdx : 0]}</Text>
                <Text style={styles.houseSignName}>{house.sign}</Text>
              </View>
            );
          })}
        </View>

        {/* Aspects Section */}
        {chart.aspects.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Aspects</Text>
            <View style={styles.aspectsCard}>
              {chart.aspects.slice(0, 20).map((aspect, index) => (
                <View key={index} style={styles.aspectRow}>
                  <Text style={styles.aspectPlanets}>
                    {aspect.planet1} {ASPECT_SYMBOLS[aspect.type] || '?'} {aspect.planet2}
                  </Text>
                  <Text style={styles.aspectDetail}>{aspect.type} · orb: {aspect.orb}°</Text>
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.md },
  errorText: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.md, textAlign: 'center', paddingHorizontal: spacing.xl },
  header: { marginBottom: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs },
  ascendantCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md,
  },
  ascendantInfo: { marginLeft: spacing.md, flex: 1 },
  ascendantLabel: { fontSize: fontSize.sm, color: colors.textMuted },
  ascendantValue: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginTop: spacing.xs },
  ascendantDegree: { fontSize: fontSize.sm, color: colors.textSecondary },
  sunMoonCard: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.lg, marginBottom: spacing.md, justifyContent: 'space-around',
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
  houseCard: { width: '30%', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.sm, alignItems: 'center' },
  houseNumber: { fontSize: fontSize.xs, color: colors.textMuted },
  houseSign: { fontSize: fontSize.xl, marginVertical: spacing.xs },
  houseSignName: { fontSize: fontSize.xs, color: colors.textSecondary },
  aspectsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md },
  aspectRow: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  aspectPlanets: { fontSize: fontSize.md, color: colors.text, fontWeight: '500' },
  aspectDetail: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
});