import { calculatePlanets, getCurrentJulianDay, calculateAspects, PLANET_NAMES, Planet, AspectType } from './ephemeris.js';

export interface TransitEvent {
  planet: string;
  transitPlanet: string;
  aspectType: AspectType;
  orb: number;
  date: string;
  description: string;
  severity: 'major' | 'moderate' | 'minor';
}

const TRANSIT_IMPORTANCE: Record<number, { major: string[]; moderate: string[] }> = {
  [Planet.SUN]: { major: ['Saturn', 'Uranus', 'Neptune', 'Pluto'], moderate: ['Jupiter'] },
  [Planet.MOON]: { major: ['Saturn', 'Uranus', 'Neptune', 'Pluto'], moderate: ['Jupiter'] },
  [Planet.MERCURY]: { major: ['Saturn', 'Uranus', 'Neptune', 'Pluto'], moderate: ['Jupiter'] },
  [Planet.VENUS]: { major: ['Saturn', 'Uranus', 'Neptune', 'Pluto'], moderate: ['Jupiter'] },
  [Planet.MARS]: { major: ['Saturn', 'Uranus', 'Neptune', 'Pluto'], moderate: ['Jupiter'] },
};

const ASPECT_DESCRIPTIONS: Record<AspectType, (p1: string, p2: string) => string> = {
  conjunction: (p1, p2) => `${p1} conjoins ${p2}, blending their energies. A powerful time for new beginnings.`,
  sextile: (p1, p2) => `${p1} sextiles ${p2}, bringing supportive opportunities and creative flow.`,
  square: (p1, p2) => `${p1} squares ${p2}, creating tension that demands action and growth.`,
  trine: (p1, p2) => `${p1} trines ${p2}, offering natural talent and ease. Harmonious energy supports your goals.`,
  opposition: (p1, p2) => `${p1} opposes ${p2}, highlighting a need for balance between these energies.`,
  quincunx: (p1, p2) => `${p1} is quincunx ${p2}, requiring adjustment and realignment.`,
  semisextile: (p1, p2) => `${p1} is semisextile ${p2}, a subtle influence for gradual integration.`,
};

export function analyzeDailyTransits(natalPlanets: Record<string, { longitude: number }>): TransitEvent[] {
  const now = getCurrentJulianDay();
  const transitPositions = calculatePlanets(now);

  // Build simplified positions for aspect calc
  const natals: Record<string, any> = {};
  for (const [name, pos] of Object.entries(natalPlanets)) {
    natals[name] = { ...pos, latitude: 0, distance: 0, speedLongitude: 0, speedLatitude: 0, speedDistance: 0 };
  }

  const aspects = calculateAspects(transitPositions, natals);
  const events: TransitEvent[] = [];

  for (const aspect of aspects) {
    const transitPlanetIdx = Object.values(PLANET_NAMES).indexOf(aspect.planet1);
    let severity: 'minor' | 'moderate' | 'major' = 'minor';
    const imp = TRANSIT_IMPORTANCE[transitPlanetIdx as keyof typeof TRANSIT_IMPORTANCE];
    if (imp) {
      if (imp.major.includes(aspect.planet2)) severity = 'major';
      else if (imp.moderate.includes(aspect.planet2)) severity = 'moderate';
    }
    if (severity === 'minor' && (aspect.type === 'conjunction' || aspect.type === 'opposition' || aspect.type === 'square')) {
      severity = 'moderate';
    } else if (severity === 'moderate' && (aspect.type === 'conjunction' || aspect.type === 'opposition')) {
      severity = 'major';
    }

    events.push({
      planet: aspect.planet2,
      transitPlanet: aspect.planet1,
      aspectType: aspect.type,
      orb: aspect.orb,
      date: new Date().toISOString().split('T')[0],
      description: ASPECT_DESCRIPTIONS[aspect.type](aspect.planet1, aspect.planet2),
      severity,
    });
  }

  return events.sort((a, b) => {
    const order = { major: 0, moderate: 1, minor: 2 };
    return order[a.severity] - order[b.severity];
  });
}

export function generateHoroscopeText(name: string, transitEvents: TransitEvent[], signType: string): string {
  if (transitEvents.length === 0) {
    return `Today's transits for ${name} are quiet — a good day for reflection and grounding.`;
  }

  const major = transitEvents.filter(e => e.severity === 'major');
  const moderate = transitEvents.filter(e => e.severity === 'moderate');
  const minor = transitEvents.filter(e => e.severity === 'minor');

  let text = signType === 'full_chart'
    ? `Your personalized birth chart horoscope for ${name}`
    : `Your ${signType} sign horoscope for ${name}`;

  if (major.length > 0) {
    text += `\n\nSignificant transits today:\n${major.map(e => `\n• ${e.description}`).join('')}`;
  }
  if (moderate.length > 0) {
    text += `\n\nNotable influences:\n${moderate.map(e => `\n• ${e.description}`).join('')}`;
  }
  if (minor.length > 0) {
    text += `\n\nSubtle shifts:\n${minor.map(e => `\n• ${e.description}`).join('')}`;
  }
  text += `\n\nRemember: transits show the sky's invitations — how you respond is always your choice.`;
  return text;
}

export function calculateCompatibilityScore(
  chart1: Record<string, { longitude: number }>,
  chart2: Record<string, { longitude: number }>
): { score: number; aspects: any[]; summary: string } {
  const pos1: Record<string, any> = {};
  const pos2: Record<string, any> = {};
  for (const [name, pos] of Object.entries(chart1)) pos1[name] = { ...pos, latitude: 0, distance: 0, speedLongitude: 0, speedLatitude: 0, speedDistance: 0 };
  for (const [name, pos] of Object.entries(chart2)) pos2[name] = { ...pos, latitude: 0, distance: 0, speedLongitude: 0, speedLatitude: 0, speedDistance: 0 };

  const aspects = calculateAspects(pos1, pos2);
  let score = 50;

  const aspectScores: Record<AspectType, number> = {
    conjunction: 8, sextile: 6, trine: 10, square: -4, opposition: -2, quincunx: -1, semisextile: 3,
  };

  for (const aspect of aspects) {
    const adj = aspectScores[aspect.type] || 0;
    score += adj * Math.max(0, 1 - aspect.orb / 8);
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let summary = '';
  if (score >= 80) summary = 'Strong cosmic connection! Significant harmony between your charts suggests natural understanding and compatibility.';
  else if (score >= 60) summary = 'Good compatibility with areas for growth. The connection has promise with mutual effort.';
  else if (score >= 40) summary = 'A balanced but challenging connection. Differences can complement each other when well understood.';
  else summary = 'A complex connection requiring patience. Contrasts create friction but also growth opportunities.';

  return { score, aspects, summary };
}