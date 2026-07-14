import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

const TOKEN_KEY = 'auth_token';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...((options.headers as Record<string, string>) || {}) },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// Auth
export const auth = {
  register: (email: string, password: string, displayName?: string) =>
    request<{ user: { id: string; email: string; displayName: string | null }; token: string }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ email, password, displayName }) }
    ),

  login: (email: string, password: string) =>
    request<{ user: { id: string; email: string; displayName: string | null }; token: string }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),

  getMe: () =>
    request<{ user: { id: string; email: string; displayName: string | null; timezone: string | null; createdAt: string }; preferences: any }>(
      '/auth/me'
    ),

  storeToken: async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  getToken: async () => {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },

  clearToken: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};

// Birth Charts
export const chartApi = {
  calculate: (params: {
    birthDate: string;
    birthTime: string;
    latitude: number;
    longitude: number;
    locationName?: string;
    timezoneOffset: number;
    name?: string;
  }) =>
    request<{ chart: { id: string; name: string; birthDate: string; birthTime: string; latitude: number; longitude: number; locationName: string | null; timezoneOffset: number; data: any } }>(
      '/chart/calculate',
      { method: 'POST', body: JSON.stringify(params) }
    ),

  list: () =>
    request<{ charts: { id: string; name: string; birth_date: string; birth_time: string; location_name: string | null; created_at: string }[] }>(
      '/charts'
    ),

  get: (id: string) =>
    request<{ chart: any }>(`/chart/${id}`),
};

// Horoscopes
export const horoscopeApi = {
  daily: () =>
    request<{ horoscope: { id: string; content: string; date: string; type: string; signType: string; transits?: any } }>(
      '/horoscope/daily'
    ),

  weekly: () =>
    request<{ horoscope: { id: string; content: string; date: string; type: string; signType: string; transits?: any } }>(
      '/horoscope/weekly'
    ),

  history: (limit = 30) =>
    request<{ horoscopes: { id: string; date: string; type: string; sign_type: string; content: string }[] }>(
      `/horoscope/history?limit=${limit}`
    ),
};

// Compatibility
export const compatibilityApi = {
  compare: (targetChartId: string) =>
    request<{ compatibility: { score: number; summary: string; aspects: any[] }; charts: { mine: string; target: string } }>(
      '/compatibility',
      { method: 'POST', body: JSON.stringify({ targetChartId }) }
    ),

  calculateRaw: (chart1: any, chart2: any) =>
    request<{ compatibility: { score: number; summary: string; aspects: any[] } }>(
      '/compatibility/calculate',
      { method: 'POST', body: JSON.stringify({ chart1, chart2 }) }
    ),
};

// Transits
export const transitApi = {
  today: () =>
    request<{ transits: any; date: string }>('/transits/today'),

  calendar: (start?: string, end?: string) => {
    const params = new URLSearchParams();
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    const qs = params.toString();
    return request<{ events: any[] }>(`/transits/calendar${qs ? `?${qs}` : ''}`);
  },
};

// Health
export const healthApi = {
  check: () => request<{ status: string; timestamp: string }>('/health'),
};

export default {
  auth,
  chartApi,
  horoscopeApi,
  compatibilityApi,
  transitApi,
  healthApi,
};