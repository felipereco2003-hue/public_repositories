import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#e8f5e9',
        tabBarActiveBackgroundColor: '#19621d',
        tabBarInactiveTintColor: '#e0f2e9',
        tabBarStyle: {
          backgroundColor: '#2E7D32',
          borderTopWidth: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 10,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons size={20} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons size={20} name="person-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
