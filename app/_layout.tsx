import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppThemeProvider } from '@/theme/Provider';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Commissioner-VariableFont_FLAR,VOLM,slnt,wght": require("../assets/fonts/Commissioner/Commissioner-VariableFont_FLAR,VOLM,slnt,wght.ttf")
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error])

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}
