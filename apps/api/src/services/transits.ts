import {
  calculatePlanets,
  getCurrentJulianDay,
  calculateAspects,
  dateToJulianDay,
  PLANET_NAMES,
  Planet,
  Aspect,
  AspectType,
} from './ephemeris.js';

export interface TransitEvent {
  planet: string;
  transitPlanet: string;
  aspectType: AspectType;
  orb: number;
  date: string;
  description: string;
  severity: 'major' | 'moderate' | 'minor';
}

const TRANSIT_IMPORTANCE: Record<string, { major: string[]; moderate: string[] }> = {
  [Planet.SUN]: { major: ['Saturn', 'Uranus', 'Neptune', 'Pluto'], moderate: ['Jupiter'] },
  [Planet.MOON]: { major: ['Saturn', 'Uranus', 'Neptune', 'Pluto'], moderate: ['Jupiter'] },
  [Planet.MERCURY]: { major: ['Saturn', 'Uranus', 'Neptune', 'Pluto'], moderate: ['Jupiter'] },
  [Planet.VENUS]: { major: ['Saturn', 'Uranus', 'Neptune', 'Pluto'], moderate: ['Jupiter'] },
  [Planet.MARS]: { major: ['Saturn', 'Uranus', 'Neptune', 'Pluto'], moderate: ['Jupiter'] },
};

const ASPECT_MEANINGS: Record<AspectType, (p1: string, p2: string) => string> = {
  conjunction: (p1, p2) => `${p1} conjoins ${p2}, blending their energies. A powerful time for new beginnings in matters ruled by these planets.`,
  sextile: (p1, p2) => `${p1} forms a sextile with ${p2}, bringing supportive opportunities and creative flow.`,
  square: (p1, p2) => `${p1} squares ${p2}, creating tension that demands action. Growth comes through resolving this friction.`,
  trine: (p1, p2) => `${p1} trines ${p2}, offering natural talent and ease. This harmonious energy supports your goals.`,
  opposition: (p1, p2) => `${p1} opposes ${p2}, highlighting a need for balance between these energies in your life.`,
  quincunx: (p1, p2) => `${p1} is quincunx ${p2}, requiring adjustment and realignment in how these forces interact.`,
  semisextile: (p1, p2) => `${p1} is semisextile ${p2}, a subtle influence encouraging gradual integration.`,
};

/**
 * Analyze transits for today relative to a birth chart
 */
export function analyzeDailyTransits(natalPlanets: Record<string, { longitude: number }>): TransitEvent[] {
  const now = getCurrentJulianDay();
  const transitPositions = calculatePlanets(now);
  
  // Build simplified position objects for aspect calculation
  const natals: Record<string, { longitude: number; latitude: number; distance: number; speedLongitude: number; speedLatitude: number; speedDistance: number }> = {};
  for (const [name, pos] of Object.entries(natalPlanets)) {
    natals[name] = { ...pos, latitude: 0, distance: 0, speedLongitude: 0, speedLatitude: 0, speedDistance: 0 };
  }
  
  const aspects = calculateAspects(transitPositions, natals);
  
  const events: TransitEvent[] = [];
  
  for (const aspect of aspects) {
    const planetIdx = Object.values(PLANET_NAMES).indexOf(aspect.planet1);
    const transitPlanetIdx = Object.values(PLANET_NAMES).indexOf(aspect.planet2);
    
    // Determine severity
    let severity: 'minor' | 'moderate' | 'major' = 'minor';
    const imp = TRANSIT_IMPORTANCE[transitPlanetIdx as keyof typeof TRANSIT_IMPORTANCE];
    if (imp) {
      if (imp.major.includes(aspect.planet1)) severity = 'major';
      else if (imp.moderate.includes(aspect.planet1)) severity = 'moderate';
    }
    
    // Major aspects get bumped up
    if (aspect.type === 'conjunction' || aspect.type === 'opposition' || aspect.type === 'square') {
      if (severity === 'minor') severity = 'moderate';
      else if (severity === 'moderate') severity = 'major';
    }
    
    const aspectName = aspect.type.charAt(0).toUpperCase() + aspect.type.slice(1);
    const descFn = ASPECT_MEANINGS[aspect.type];
    
    events.push({
      planet: aspect.planet2,
      transitPlanet: aspect.planet1,
      aspectType: aspect.type,
      orb: aspect.orb,
      date: new Date().toISOString().split('T')[0],
      description: descFn(aspect.planet1, aspect.planet2),
      severity,
    });
  }
  
  return events.sort((a, b) => {
    const sev = { major: 0, moderate: 1, minor: 2 };
    return sev[a.severity] - sev[b.severity];
  });
}

/**
 * Generate horoscope text from transit events
 */
export function generateHoroscopeText(
  name: string,
  transitEvents: TransitEvent[],
  signType: string
): string {
  if (transitEvents.length === 0) {
    return `Today's transits for ${name} are relatively quiet — a good day for reflection and grounding. The celestial energies support rest and inner work over external activity.`;
  }
  
  const majorEvents = transitEvents.filter(e => e.severity === 'major');
  const moderateEvents = transitEvents.filter(e => e.severity === 'moderate');
  const minorEvents = transitEvents.filter(e => e.severity === 'minor');
  
  let text = `Your ${signType} horoscope for ${name}`;
  if (signType === 'full_chart') {
    text = `Your personalized birth chart horoscope for ${name}`;
  }
  
  if (majorEvents.length > 0) {
    text += `\n\nSignificant transits today:\n`;
    for (const ev of majorEvents) {
      text += `\n• ${ev.description}`;
    }
  }
  
  if (moderateEvents.length > 0) {
    text += `\n\nNotable influences:\n`;
    for (const ev of moderateEvents) {
      text += `\n• ${ev.description}`;
    }
  }
  
  if (minorEvents.length > 0) {
    text += `\n\nSubtle shifts:\n`;
    for (const ev of minorEvents) {
      text += `\n• ${ev.description}`;
    }
  }
  
  text += `\n\nRemember: transits show the sky's invitations — how you respond is always your choice.`;
  
  return text;
}

/**
 * Calculate compatibility (synastry) score between two charts
 */
export function calculateCompatibilityScore(
  chart1: Record<string, { longitude: number }>,
  chart2: Record<string, { longitude: number }>
): { score: number; aspects: Aspect[]; summary: string } {
  // Build full position objects for aspect calculation
  const pos1: Record<string, { longitude: number; latitude: number; distance: number; speedLongitude: number; speedLatitude: number; speedDistance: number }> = {};
  const pos2: Record<string, { longitude: number; latitude: number; distance: number; speedLongitude: number; speedLatitude: number; speedDistance: number }> = {};
  
  for (const [name, pos] of Object.entries(chart1)) {
    pos1[name] = { ...pos, latitude: 0, distance: 0, speedLongitude: 0, speedLatitude: 0, speedDistance: 0 };
  }
  for (const [name, pos] of Object.entries(chart2)) {
    pos2[name] = { ...pos, latitude: 0, distance: 0, speedLongitude: 0, speedLatitude: 0, speedDistance: 0 };
  }
  
  const aspects = calculateAspects(pos1, pos2);
  
  // Score based on aspect quality
  let score = 50; // base score
  
  const aspectScores: Record<AspectType, number> = {
    conjunction: 8,
    sextile: 6,
    trine: 10,
    square: -4,
    opposition: -2,
    quincunx: -1,
    semisextile: 3,
  };
  
  for (const aspect of aspects) {
    const adj = aspectScores[aspect.type] || 0;
    // Tight orbs score more
    const orbFactor = Math.max(0, 1 - aspect.orb / 8);
    score += adj * orbFactor;
  }
  
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  let summary = '';
  if (score >= 80) summary = 'Strong cosmic connection! There is significant harmony between your charts, suggesting natural understanding and compatibility.';
  else if (score >= 60) summary = 'Good compatibility with some areas of growth. The connection has promise with mutual effort.';
  else if (score >= 40) summary = 'A balanced but challenging connection. Differences can be complementary if understood well.';
  else summary = 'A complex connection requiring patience. The contrasts may create friction but also opportunity for growth.';
  
  return { score, aspects, summary };
}