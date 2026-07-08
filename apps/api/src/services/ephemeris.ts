import swisseph from 'swisseph';
import path from 'path';
import fs from 'fs';
import { config } from '../config.js';

let ephemerisReady = false;

export function initEphemeris(): void {
  const ephePath = config.ephePath;
  if (!fs.existsSync(ephePath)) {
    fs.mkdirSync(ephePath, { recursive: true });
  }
  swisseph.swe_set_ephe_path(ephePath);
  ephemerisReady = true;
}

export interface PlanetPosition {
  longitude: number;
  latitude: number;
  distance: number;
  speedLongitude: number;
  speedLatitude: number;
  speedDistance: number;
}

export interface HouseCusp {
  cusp: number;
  longitude: number;
}

export interface ChartData {
  planets: Record<string, PlanetPosition>;
  houses: HouseCusp[];
  ascendant: number;
  midheaven: number;
}

export enum Planet {
  SUN = 0, MOON = 1, MERCURY = 2, VENUS = 3, MARS = 4,
  JUPITER = 5, SATURN = 6, URANUS = 7, NEPTUNE = 8, PLUTO = 9,
  NORTH_NODE = 10, CHIRON = 11,
}

export const PLANET_NAMES: Record<number, string> = {
  [Planet.SUN]: 'Sun', [Planet.MOON]: 'Moon', [Planet.MERCURY]: 'Mercury',
  [Planet.VENUS]: 'Venus', [Planet.MARS]: 'Mars', [Planet.JUPITER]: 'Jupiter',
  [Planet.SATURN]: 'Saturn', [Planet.URANUS]: 'Uranus', [Planet.NEPTUNE]: 'Neptune',
  [Planet.PLUTO]: 'Pluto', [Planet.NORTH_NODE]: 'North Node', [Planet.CHIRON]: 'Chiron',
};

export function calculatePlanets(jd: number): Record<string, PlanetPosition> {
  if (!ephemerisReady) initEphemeris();
  const planets: Record<string, PlanetPosition> = {};
  const flags = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;

  for (let p = 0; p <= 11; p++) {
    try {
      const result = swisseph.swe_calc_ut(jd, p, flags);
      if (result && result.length >= 6) {
        planets[PLANET_NAMES[p]] = {
          longitude: result[0], latitude: result[1], distance: result[2],
          speedLongitude: result[3], speedLatitude: result[4], speedDistance: result[5],
        };
      }
    } catch (err) {
      console.warn(`Failed to calculate ${PLANET_NAMES[p]}:`, err);
    }
  }
  return planets;
}

export function calculateHouses(jd: number, lat: number, lng: number): { houses: HouseCusp[]; ascendant: number; midheaven: number } {
  if (!ephemerisReady) initEphemeris();
  try {
    const result = swisseph.swe_houses_ex(jd, lat, lng, 'P', swisseph.SEFLG_SWIEPH);
    if (result) {
      const housesArr = result.houses || result[0] || [];
      const ascMC = result.ascMC || result[1] || [];
      return {
        houses: housesArr.map((lon: number, i: number) => ({ cusp: i + 1, longitude: lon })),
        ascendant: Array.isArray(ascMC) ? ascMC[0] : 0,
        midheaven: Array.isArray(ascMC) ? ascMC[1] : 0,
      };
    }
  } catch (err) {
    console.warn('Failed to calculate houses:', err);
  }
  return { houses: [], ascendant: 0, midheaven: 0 };
}

export function dateToJulianDay(year: number, month: number, day: number, hours = 0): number {
  return swisseph.swe_julday(year, month, day, hours, swisseph.SE_GREG_CAL);
}

export function getCurrentJulianDay(): number {
  const now = new Date();
  return dateToJulianDay(
    now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(),
    now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600
  );
}

export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | 'quincunx' | 'semisextile';

export interface Aspect {
  planet1: string;
  planet2: string;
  type: AspectType;
  orb: number;
  exact: number;
}

const ASPECT_ORBS: Record<AspectType, { angle: number; orb: number }> = {
  conjunction: { angle: 0, orb: 8 },
  opposition: { angle: 180, orb: 8 },
  trine: { angle: 120, orb: 6 },
  square: { angle: 90, orb: 6 },
  sextile: { angle: 60, orb: 4 },
  quincunx: { angle: 150, orb: 3 },
  semisextile: { angle: 30, orb: 2 },
};

export function calculateAspects(planets1: Record<string, PlanetPosition>, planets2?: Record<string, PlanetPosition>): Aspect[] {
  const target = planets2 || planets1;
  const aspects: Aspect[] = [];
  const names = Object.keys(planets1);

  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const p1 = names[i], p2 = names[j];
      let diff = Math.abs(planets1[p1].longitude - target[p2].longitude) % 360;
      if (diff > 180) diff = 360 - diff;

      for (const [type, asp] of Object.entries(ASPECT_ORBS)) {
        const angleDiff = Math.abs(diff - asp.angle);
        if (angleDiff <= asp.orb) {
          aspects.push({ planet1: p1, planet2: p2, type: type as AspectType, orb: angleDiff, exact: asp.angle - diff });
        }
      }
    }
  }
  return aspects.sort((a, b) => a.orb - b.orb);
}

export function calculateBirthChart(birthDate: string, birthTime: string, lat: number, lng: number, timezoneOffset: number): ChartData {
  const [y, m, d] = birthDate.split('-').map(Number);
  const [hh, mm] = birthTime.split(':').map(Number);
  const utcHours = hh + mm / 60 - timezoneOffset;
  const jd = dateToJulianDay(y, m, d, utcHours);
  const planets = calculatePlanets(jd);
  const { houses, ascendant, midheaven } = calculateHouses(jd, lat, lng);
  return { planets, houses, ascendant, midheaven };
}