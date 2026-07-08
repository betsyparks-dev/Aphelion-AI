import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../theme';
import DailyHoroscopeScreen from '../screens/DailyHoroscopeScreen';
import BirthChartScreen from '../screens/BirthChartScreen';
import CompatibilityScreen from '../screens/CompatibilityScreen';
import TransitCalendarScreen from '../screens/TransitCalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type MainTabParamList = {
  Horoscope: undefined;
  'Birth Chart': undefined;
  Compatibility: undefined;
  Transits: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Onboarding: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help';

          switch (route.name) {
            case 'Horoscope':
              iconName = focused ? 'sunny' : 'sunny-outline';
              break;
            case 'Birth Chart':
              iconName = focused ? 'planet' : 'planet-outline';
              break;
            case 'Compatibility':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Transits':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Horoscope" component={DailyHoroscopeScreen} />
      <Tab.Screen name="Birth Chart" component={BirthChartScreen} />
      <Tab.Screen name="Compatibility" component={CompatibilityScreen} />
      <Tab.Screen name="Transits" component={TransitCalendarScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}