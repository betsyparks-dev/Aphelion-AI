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
  Horoscope: { chartId?: string } | undefined;
  'Birth Chart': { chartId?: string } | undefined;
  Compatibility: { chartId?: string } | undefined;
  Transits: { chartId?: string } | undefined;
  Settings: { chartId?: string } | undefined;
};

export type RootStackParamList = {
  MainTabs: { chartId?: string } | undefined;
  Onboarding: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  screenProps?: { chartId?: string | null };
}

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
      <Tab.Screen
        name="Horoscope"
        component={DailyHoroscopeScreen}
        initialParams={{ chartId }}
      />
      <Tab.Screen
        name="Birth Chart"
        component={BirthChartScreen}
        initialParams={{ chartId }}
      />
      <Tab.Screen
        name="Compatibility"
        component={CompatibilityScreen}
        initialParams={{ chartId }}
      />
      <Tab.Screen
        name="Transits"
        component={TransitCalendarScreen}
        initialParams={{ chartId }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        initialParams={{ chartId }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator({ screenProps }: AppNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        initialParams={{ chartId: screenProps?.chartId }}
      />
    </Stack.Navigator>
  );
}