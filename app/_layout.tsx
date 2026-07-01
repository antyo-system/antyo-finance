import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useFinanceStore } from '../src/store/useFinanceStore';
import "../src/global.css";

// Prevent splash screen auto-hiding until store hydration is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isHydrated, setIsHydrated] = useState(false);
  const systemColorScheme = useColorScheme();
  const theme = useFinanceStore((state) => state.settings.theme);

  useEffect(() => {
    // Sync state hydration
    const hasHydrated = useFinanceStore.persist.hasHydrated();
    if (hasHydrated) {
      setIsHydrated(true);
      SplashScreen.hideAsync();
    } else {
      const unsub = useFinanceStore.persist.onFinishHydration(() => {
        setIsHydrated(true);
        SplashScreen.hideAsync();
      });
      return () => unsub();
    }
  }, []);

  if (!isHydrated) {
    return null;
  }

  // Resolve theme
  const resolvedScheme = theme === 'system' ? systemColorScheme : theme;
  const currentTheme = resolvedScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={currentTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
