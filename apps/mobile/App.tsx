import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { auth, chartApi } from './src/services/api';

export default function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [chartId, setChartId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const token = await auth.getToken();
      if (token) {
        // Verify token is still valid
        const me = await auth.getMe().catch(() => null);
        if (me) {
          setAuthReady(true);
          setOnboardingComplete(true);
          // Check if user has a chart
          const charts = await chartApi.list().catch(() => null);
          if (charts?.charts?.length) {
            setChartId(charts.charts[0].id);
          } else {
            setOnboardingComplete(false);
          }
          return;
        }
      }
    } catch (e) {
      // Token invalid or expired, start fresh
      await auth.clearToken();
    }
    setAuthReady(true);
  };

  const handleOnboardingComplete = async (chartData: {
    name: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    latitude: number;
    longitude: number;
  }) => {
    try {
      // Auto-register if no token
      let token = await auth.getToken();
      if (!token) {
        const email = `user_${Date.now()}@astrallens.app`;
        const password = 'temp_' + Math.random().toString(36).slice(2, 10);
        const reg = await auth.register(email, password, chartData.name);
        await auth.storeToken(reg.token);
      }

      // Calculate chart via API
      const [year, month, day] = chartData.dateOfBirth.split(/[/-]/).map(Number);
      const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const timezoneOffset = -new Date().getTimezoneOffset() / 60;

      const result = await chartApi.calculate({
        birthDate,
        birthTime: chartData.timeOfBirth || '12:00',
        latitude: chartData.latitude,
        longitude: chartData.longitude,
        locationName: chartData.placeOfBirth,
        timezoneOffset,
        name: chartData.name,
      });

      setChartId(result.chart.id);
      setOnboardingComplete(true);
    } catch (error) {
      console.error('Failed to create chart:', error);
      // Still proceed even if API fails - screens will show mock data
      setOnboardingComplete(true);
    }
  };

  if (!authReady) {
    return null; // Loading splash
  }

  if (!onboardingComplete) {
    return (
      <>
        <StatusBar style="light" />
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: '#7c3aed',
          background: '#0a0a1a',
          card: '#14142a',
          text: '#f1f5f9',
          border: '#1e293b',
          notification: '#7c3aed',
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        },
      }}
    >
      <StatusBar style="light" />
      <AppNavigator screenProps={{ chartId }} />
    </NavigationContainer>
  );
}