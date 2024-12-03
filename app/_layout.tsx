import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CRTEffect } from '@/components/CRTEffect';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
        <StatusBar
          style="light"
          backgroundColor={Colors.light.background}
          translucent={false}
        />
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <CRTEffect>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: Colors.light.background,
                },
                headerTintColor: Colors.light.text,
                headerTitleStyle: {
                  fontFamily: Platform.select({
                    ios: 'Monaco',
                    android: 'monospace',
                    default: 'Courier New'
                  }),
                },
                contentStyle: {
                  backgroundColor: Colors.light.background,
                },
              }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="experiences/index" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </CRTEffect>
        </ThemeProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}