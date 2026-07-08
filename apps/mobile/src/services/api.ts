const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Birth chart
  createChart: (chart: any) =>
    request('/charts', { method: 'POST', body: JSON.stringify(chart) }),

  getChart: (chartId: string) =>
    request(`/charts/${chartId}`),

  // Horoscopes
  getDailyHoroscope: (chartId: string, date?: string) => {
    const params = date ? `?date=${date}` : '';
    return request(`/horoscopes/daily/${chartId}${params}`);
  },

  // Compatibility
  getCompatibility: (chartId1: string, chartId2: string) =>
    request(`/compatibility`, {
      method: 'POST',
      body: JSON.stringify({ chartId1, chartId2 }),
    }),

  // Transit calendar
  getTransitCalendar: (chartId: string, startDate: string, endDate: string) =>
    request(`/transits/${chartId}?start=${startDate}&end=${endDate}`),

  // Subscriptions
  getSubscription: (userId: string) =>
    request(`/subscriptions/${userId}`),

  createSubscription: (userId: string, paymentToken: string) =>
    request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ userId, paymentToken }),
    }),

  // User preferences
  getPreferences: (userId: string) =>
    request(`/preferences/${userId}`),

  updatePreferences: (userId: string, prefs: any) =>
    request(`/preferences/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(prefs),
    }),
};

export default api;