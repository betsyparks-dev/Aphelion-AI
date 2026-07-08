export interface BirthChart {
  userId: string;
  name: string;
  dateOfBirth: string; // ISO date string
  timeOfBirth: string; // HH:mm format
  placeOfBirth: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface PlanetaryPosition {
  planet: string;
  sign: string;
  degree: number;
  house: number;
  isRetrograde: boolean;
}

export interface BirthChartData {
  id: string;
  chart: BirthChart;
  ascendant: string;
  ascendantDegree: number;
  sun: PlanetaryPosition;
  moon: PlanetaryPosition;
  planets: PlanetaryPosition[];
  houses: { house: number; sign: string; degree: number }[];
  aspects: Aspect[];
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | 'quincunx';
  orb: number;
  applying: boolean;
}

export interface DailyHoroscope {
  date: string;
  overall: string;
  love: string;
  career: string;
  health: string;
  luckyNumber?: number;
  luckyColor?: string;
  moonPhase?: string;
}

export interface TransitEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'major' | 'minor';
  planets: string[];
  impact: 'high' | 'medium' | 'low';
}

export interface CompatibilityResult {
  score: number;
  overall: string;
  strengths: string[];
  challenges: string[];
  aspects: Aspect[];
}

export type SubscriptionTier = 'free' | 'premium';
export type OnboardingStep = 'welcome' | 'birth-date' | 'birth-time' | 'birth-place' | 'complete';