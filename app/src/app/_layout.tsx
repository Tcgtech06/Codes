import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="add-data" />
        <Stack.Screen name="advertise" />
        <Stack.Screen name="admin" />
      </Stack>
    </>
  );
}
