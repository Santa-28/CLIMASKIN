// import { Stack } from 'expo-router';
// import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
// import { Slot } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';

// export default function RootLayout() {
//   const [fontsLoaded] = useFonts({
//     Poppins_400Regular,
//     Poppins_600SemiBold,
//     Poppins_700Bold,
//   });
//   if (!fontsLoaded) return null;

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//       <Stack.Screen name="auth" />      
//       <Stack.Screen name="onboarding" />
//       <Stack.Screen name="dashboard" />
//       <Stack.Screen name="notifications" />
//       <Stack.Screen name="profile" />
//     </Stack>
//   );
// }


import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { UserProvider } from './context/UserContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <UserProvider>
      <StatusBar style="light" />
      <Slot />
    </UserProvider>
  );
}