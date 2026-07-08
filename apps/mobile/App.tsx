import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { BirthChart } from './src/types';

export default function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [userChart, setUserChart] = useState<BirthChart | null>(null);

  const handleOnboardingComplete = (chart: BirthChart) => {
    setUserChart(chart);
    setOnboardingComplete(true);
    // In production, save chart via API
    // await api.createChart(chart);
  };

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
      <AppNavigator />
    </NavigationContainer>
  );
}