
import React from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { UserProvider } from './context/UserContext';

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <UserProvider>
      <StatusBar style="light" />
      <Slot />
    </UserProvider>
  );
}


