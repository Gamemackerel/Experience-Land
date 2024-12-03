# .aidigest

```
node_modules
.expo
**/**/*.png
```

# .expo/devices.json

```json
{
  "devices": []
}

```

# .expo/README.md

```md
> Why do I have a folder named ".expo" in my project?
The ".expo" folder is created when an Expo project is started using "expo start" command.
> What do the files contain?
- "devices.json": contains information about devices that have recently opened this project. This is used to populate the "Development sessions" list in your development builds.
- "settings.json": contains the server configuration that is used to serve the application manifest.
> Should I commit the ".expo" folder?
No, you should not share the ".expo" folder. It does not contain any information that is relevant for other developers working on the project, it is specific to your machine.
Upon project creation, the ".expo" folder is already added to your ".gitignore" file.

```

# .expo/types/router.d.ts

```ts
/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/experiences/aichamber`; params?: Router.UnknownInputParams; } | { pathname: `/experiences/double`; params?: Router.UnknownInputParams; } | { pathname: `/experiences`; params?: Router.UnknownInputParams; } | { pathname: `/experiences/reverse`; params?: Router.UnknownInputParams; } | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/experiences/aichamber`; params?: Router.UnknownOutputParams; } | { pathname: `/experiences/double`; params?: Router.UnknownOutputParams; } | { pathname: `/experiences`; params?: Router.UnknownOutputParams; } | { pathname: `/experiences/reverse`; params?: Router.UnknownOutputParams; } | { pathname: `/+not-found`, params: Router.UnknownOutputParams & {  } };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/experiences/aichamber${`?${string}` | `#${string}` | ''}` | `/experiences/double${`?${string}` | `#${string}` | ''}` | `/experiences${`?${string}` | `#${string}` | ''}` | `/experiences/reverse${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/experiences/aichamber`; params?: Router.UnknownInputParams; } | { pathname: `/experiences/double`; params?: Router.UnknownInputParams; } | { pathname: `/experiences`; params?: Router.UnknownInputParams; } | { pathname: `/experiences/reverse`; params?: Router.UnknownInputParams; } | `/+not-found` | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } };
    }
  }
}

```

# .expo/web/cache/production/images/favicon/favicon-24272cdaeff82cc5facdaccd982a6f05b60c4504704bbf94c19a6388659880bb-contain-transparent/favicon-48.png

This is a binary file of the type: Image

# .gitignore

```
# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

# development
app-example
.aidigest

```

# app.json

```json
{
  "expo": {
    "name": "TalkBack",
    "slug": "TalkBack",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}

```

# app/_layout.tsx

```tsx
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
```

# app/+not-found.tsx

```tsx
import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

```

# app/experiences/aichamber.tsx

```tsx
import { StyleSheet } from 'react-native';
import { TextProcessor } from '@/components/TextProcessor';
import { ThemedView } from '@/components/ThemedView';
import { AnthropicProcessor } from '@/services/textProcessingServices/aichamber';
import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function AnthropicProcessorScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'AI Chamber',
    });
  }, [navigation]);

  return (
    <ThemedView style={styles.container}>
      <TextProcessor
        processService={new AnthropicProcessor(process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '')}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

# app/experiences/double.tsx

```tsx
import { StyleSheet } from 'react-native';
import { TextProcessor } from '@/components/TextProcessor';
import { ThemedView } from '@/components/ThemedView';
import { Doubler } from '@/services/textProcessingServices/doubler';

import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


export default function DoubleProcessorScreen() {

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Double or Nothing',
    });
  }, [navigation]);


  return (
    <ThemedView style={styles.container}>
      <TextProcessor processService={new Doubler('API_KEY')} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
```

# app/experiences/index.tsx

```tsx
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ScrollView } from 'react-native-gesture-handler';

export default function Explore() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText >{'Available Experiences:'}</ThemedText>
        <Link href="./experiences/reverse" asChild>
          <TouchableOpacity style={styles.processorLink}>
            <IconSymbol name="chevron.right" size={24} color="#687076" />
            <ThemedView style={styles.processorContent}>
              <ThemedText>REVERSE ROOM</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </Link>
        <Link href="./experiences/double" asChild>
          <TouchableOpacity style={styles.processorLink}>
            <IconSymbol name="chevron.right" size={24} color="#687076" />
            <ThemedView style={styles.processorContent}>
              <ThemedText>DOUBLE OR NOTHING</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </Link>
        <Link href="./experiences/aichamber" asChild>
          <TouchableOpacity style={styles.processorLink}>
            <IconSymbol name="chevron.right" size={24} color="#687076" />
            <ThemedView style={styles.processorContent}>
              <ThemedText>AI CHAMBER</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </Link>
      </ThemedView>

      {/* ... other sections ... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  processorLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  processorContent: {
    marginLeft: 12,
    gap: 4,
  }
});
```

# app/experiences/reverse.tsx

```tsx
import { StyleSheet } from 'react-native';
import { TextProcessor } from '@/components/TextProcessor';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Reverser } from '@/services/textProcessingServices/reverser';

import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


export default function ReverseProcessorScreen() {

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Reverse Room',
    });
  }, [navigation]);
  return (
    <ThemedView style={styles.container}>
      <TextProcessor processService={new Reverser('API_KEY')} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
```

# app/index.tsx

```tsx
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ScrollView } from 'react-native-gesture-handler';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText >Welcome to Experience_Land.</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText >This is a special place where you can travel to other worlds and explore new perspectives.</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <Link href="./experiences" asChild>
          <TouchableOpacity style={styles.processorLink}>
            <IconSymbol name="chevron.right" size={24} color="#687076" />
            <ThemedView style={styles.processorContent}>
              <ThemedText>BROWSE EXPERIENCES</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </Link>
      </ThemedView>

      {/* ... other sections ... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  processorLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  processorContent: {
    marginLeft: 12,
    gap: 4,
  }
});
```

# assets/fonts/SpaceMono-Regular.ttf

This is a binary file of the type: Binary

# assets/images/adaptive-icon.png

This is a binary file of the type: Image

# assets/images/favicon.png

This is a binary file of the type: Image

# assets/images/icon.png

This is a binary file of the type: Image

# assets/images/partial-react-logo.png

This is a binary file of the type: Image

# assets/images/react-logo.png

This is a binary file of the type: Image

# assets/images/react-logo@2x.png

This is a binary file of the type: Image

# assets/images/react-logo@3x.png

This is a binary file of the type: Image

# assets/images/splash-icon.png

This is a binary file of the type: Image

# components/__tests__/__snapshots__/ThemedText-test.tsx.snap

```snap
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`renders correctly 1`] = `
<Text
  style={
    [
      {
        "color": "#11181C",
      },
      {
        "fontSize": 16,
        "lineHeight": 24,
      },
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]
  }
>
  Snapshot test!
</Text>
`;

```

# components/__tests__/ThemedText-test.tsx

```tsx
import * as React from 'react';
import renderer from 'react-test-renderer';

import { ThemedText } from '../ThemedText';

it(`renders correctly`, () => {
  const tree = renderer.create(<ThemedText>Snapshot test!</ThemedText>).toJSON();

  expect(tree).toMatchSnapshot();
});

```

# components/CRTEffect.tsx

```tsx
import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface CRTEffectProps {
  children: React.ReactNode;
}

export const CRTEffect: React.FC<CRTEffectProps> = ({ children }) => {
  const scanline = useSharedValue(0);
  const flicker = useSharedValue(0);

  // Create flicker animation function
  const startFlickerAnimation = useCallback(() => {
    let timeoutId: NodeJS.Timeout;

    const animate = () => {
      // Create a quick flash effect
      flicker.value = withSequence(
        withTiming(0.3, { duration: 50 }), // Flash on
        withTiming(0, { duration: 50 }), // Flash off
      );

      // Schedule next flicker
      timeoutId = setTimeout(animate, 2000 + Math.random() * 4000);
    };

    // Start the animation
    animate();

    // Return cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    // Start scanline animation
    scanline.value = withRepeat(
      withTiming(height, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Start flicker animation and get cleanup function
    const cleanupFlicker = startFlickerAnimation();

    // Cleanup both animations on unmount
    return () => {
      cleanupFlicker();
      scanline.value = 0;
      flicker.value = 0;
    };
  }, []);

  const scanlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanline.value }],
  }));

  const flickerStyle = useAnimatedStyle(() => ({
    opacity: flicker.value,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for the flicker
  }));

  return (
    <Animated.View style={styles.container}>
      {children}
      {/* <BlurView intensity={3} style={StyleSheet.absoluteFill} tint="dark" pointerEvents="none"/>  THIS is too slow and doesn't work on android */}
      <Animated.View
        style={[styles.scanline, scanlineStyle]}
        pointerEvents="none"
      />
      <Animated.View
        style={[styles.overlay, flickerStyle]}
        pointerEvents="none"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  scanline: {
    position: 'absolute',
    width: width,
    height: 2,
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
});
```

# components/TextProcessor.tsx

```tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextInput, ScrollView, View, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedTextBox } from './ThemedTextBox';
import { ThemedView } from './ThemedView';
import { TextProcessBase } from '@/services/textProcessingServices/textProcessBase';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '@/constants/Colors';

interface TextProcessorProps {
  processService: TextProcessBase;
}

export function TextProcessor({ processService }: TextProcessorProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const focusInput = () => {
      inputRef.current?.focus();
    };

    focusInput();
    const focusInterval = setInterval(focusInput, 1000);

    const result = processService.initialOutput();
    setOutputText(prev => [...prev, `[${result.timestamp}] ${result.processedText}`]);

    return () => {
      clearInterval(focusInterval);
    };
  }, []);

  const processText = useCallback(async (text: string) => {
    if (text.trim()) {
      setIsProcessing(true);
      try {
        const result = await Promise.resolve(processService.processText(text));
        setOutputText(prev => [...prev, `[${result.timestamp}] ${result.processedText}`]);
        setInputText('');
      } catch (error) {
        setOutputText(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Error: ${error.message}`,
        ]);
      } finally {
        setIsProcessing(false);
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
    }
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.outputContainer}
        contentContainerStyle={styles.outputContent}
      >
        {outputText.map((text, index) => (
          <ThemedText key={index} style={styles.outputText}>
            {text}
          </ThemedText>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          {isProcessing ? (
            <ActivityIndicator size="small" color={Colors.light.text} />
          ) : (
            <IconSymbol
              name="chevron.right"
              size={20}
              color={Colors.light.text}
              style={styles.chevron}
            />
          )}
          <ThemedTextBox
            ref={inputRef}
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor={Colors.light.icon}
            onSubmitEditing={() => processText(inputText)}
            returnKeyType="send"
            editable={!isProcessing}
            autoFocus
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  inputContainer: {
    borderRadius: 8,
    padding: 8,
    backgroundColor: Colors.light.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevron: {
    marginLeft: 4,
  },
  input: {
    height: 40,
    padding: 8,
    fontSize: 16,
    flex: 1,
  },
  outputContainer: {
    flex: 1,
    borderRadius: 8,
  },
  outputContent: {
    padding: 16,
    gap: 8,
  },
  outputText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
```

# components/ThemedText.tsx

```tsx
// components/ThemedText.tsx

import { Text, TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TerminalStyles } from '@/constants/AppStyles';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        TerminalStyles.text,
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
    // Keep the same color as regular text for terminal theme
  },
});
```

# components/ThemedTextBox.tsx

```tsx
import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TerminalStyles } from '@/constants/AppStyles';
import { Platform } from 'react-native';

export type ThemedTextBoxProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export const ThemedTextBox = forwardRef<TextInput, ThemedTextBoxProps>(
  ({ style, lightColor, darkColor, type = 'default', ...rest }, ref) => {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    return (
      <TextInput
        ref={ref}
        style={[
          TerminalStyles.text,
          styles.input,
          { color },
          type === 'default' ? styles.default : undefined,
          type === 'title' ? styles.title : undefined,
          type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
          type === 'subtitle' ? styles.subtitle : undefined,
          type === 'link' ? styles.link : undefined,
          style,
          {...Platform.select({
            web: {
              // @ts-ignore: Web-only property
              outline: 'none',
            },
          })},
        ]}

        {...rest}
      />
    );
  }
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
```

# components/ThemedView.tsx

```tsx
import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

```

# components/ui/IconSymbol.ios.tsx

```tsx
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}

```

# components/ui/IconSymbol.tsx

```tsx
// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

```

# constants/AppStyles.ts

```ts
import { Platform } from 'react-native';

export const TerminalStyles = {
    text: {
      fontFamily: Platform.select({
        ios: 'Menlo',
        android: 'monospace',
        default: 'Courier New'
      }),
      letterSpacing: 0.7, // Increased letter spacing
      textShadow: Platform.select({
        web: `
          0.4px 0.4px 0 #00FF00,
          -0.4px -0.4px 0 #00FF00,
          0px 0.4px 0 #00FF00,
          0 -0.4px 0 #00FF00
        `,
        default: undefined
      }),
      // For native platforms, we'll use multiple text shadow properties
      ...Platform.select({
        ios: {
          textShadowColor: '#00FF00',
          textShadowOffset: { width: 0.4, height: 0.4 },
          textShadowRadius: 0.4,
        },
        android: {
          textShadowColor: '#00FF00',
          textShadowOffset: { width: 0.4, height: 0.4 },
          textShadowRadius: 0.4,
        },
        default: {}
      })
    },
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
};
```

# constants/Colors.ts

```ts
const terminalGreen = '#00FF00';
const dimTerminalGreen = '#00B800';
const terminalBlack = '#000800';

export const Colors = {
  light: {
    text: terminalGreen,
    background: terminalBlack,
    tint: terminalGreen,
    icon: dimTerminalGreen,
    terminal: {
      cursor: terminalGreen,
      selection: '#003300',
      highlight: '#004400',
      border: dimTerminalGreen,
    }
  },
  dark: {
    text: terminalGreen,
    background: terminalBlack,
    tint: terminalGreen,
    icon: dimTerminalGreen,
    terminal: {
      cursor: terminalGreen,
      selection: '#003300',
      highlight: '#004400',
      border: dimTerminalGreen,
    }
  },
};

```

# expo-env.d.ts

```ts
/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore
```

# hooks/useColorScheme.ts

```ts
export { useColorScheme } from 'react-native';

```

# hooks/useColorScheme.web.ts

```ts
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}

```

# hooks/useThemeColor.ts

```ts
/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

```

# package.json

```json
{
  "name": "talkback",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest --watchAll",
    "lint": "expo lint"
  },
  "jest": {
    "preset": "jest-expo"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.32.1",
    "@expo/vector-icons": "^14.0.2",
    "@react-navigation/bottom-tabs": "^7.0.0",
    "@react-navigation/native": "^7.0.0",
    "expo": "~52.0.11",
    "expo-blur": "~14.0.1",
    "expo-constants": "~17.0.3",
    "expo-font": "~13.0.1",
    "expo-haptics": "~14.0.0",
    "expo-linking": "~7.0.3",
    "expo-router": "~4.0.9",
    "expo-splash-screen": "~0.29.13",
    "expo-status-bar": "~2.0.0",
    "expo-symbols": "~0.2.0",
    "expo-system-ui": "~4.0.4",
    "expo-web-browser": "~14.0.1",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-native": "0.76.3",
    "react-native-gesture-handler": "~2.20.2",
    "react-native-reanimated": "~3.16.1",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.1.0",
    "react-native-web": "~0.19.13",
    "react-native-webview": "13.12.2"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/jest": "^29.5.12",
    "@types/react": "~18.3.12",
    "@types/react-test-renderer": "^18.3.0",
    "jest": "^29.2.1",
    "jest-expo": "~52.0.2",
    "react-test-renderer": "18.3.1",
    "typescript": "^5.3.3"
  },
  "private": true
}

```

# README.md

```md
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   \`\`\`bash
   npm install
   \`\`\`

2. Start the app

   \`\`\`bash
    npx expo start
   \`\`\`

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

\`\`\`bash
npm run reset-project
\`\`\`

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```

# scripts/reset-project.js

```js
#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It moves the /app, /components, /hooks, /scripts, and /constants directories to /app-example and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const newDir = "app-example";
const newAppDir = "app";
const newDirPath = path.join(root, newDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const moveDirectories = async () => {
  try {
    // Create the app-example directory
    await fs.promises.mkdir(newDirPath, { recursive: true });
    console.log(`📁 /${newDir} directory created.`);

    // Move old directories to new app-example directory
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      const newDirPath = path.join(root, newDir, dir);
      if (fs.existsSync(oldDirPath)) {
        await fs.promises.rename(oldDirPath, newDirPath);
        console.log(`➡️ /${dir} moved to /${newDir}/${dir}.`);
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      "1. Run `npx expo start` to start a development server.\n2. Edit app/index.tsx to edit the main screen.\n3. Delete the /app-example directory when you're done referencing it."
    );
  } catch (error) {
    console.error(`Error during script execution: ${error}`);
  }
};

moveDirectories();

```

# services/textProcessingServices/aichamber.ts

```ts
import { TextProcessingResult, TextProcessBase } from "./textProcessBase";
import Anthropic from '@anthropic-ai/sdk';

export class AnthropicProcessor extends TextProcessBase {
  private client: Anthropic;

  constructor(apiKey: string) {
    super(apiKey);
    this.client = new Anthropic({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async processText(text: string): Promise<TextProcessingResult> {
    try {
      const response = await this.client.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [{ role: "user", content: text }]
      });

      return {
        processedText: response.content[0].text,
        timestamp: new Date().toLocaleTimeString()
      };
    } catch (error) {
      return {
        processedText: `Error processing text: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      };
    }
  }

  initialOutput(): TextProcessingResult {
    return {
      processedText: "You've entered the AI Chamber. Here, your words will be processed by Claude, an AI assistant. What would you like to discuss?",
      timestamp: new Date().toLocaleTimeString()
    };
  }
}
```

# services/textProcessingServices/doubler.ts

```ts
import { TextProcessingResult, TextProcessBase } from "./textProcessBase";

export class Doubler extends TextProcessBase {
  /**
   * Processes input text by doubling it and adding a timestamp
   * @param text The input text to process
   * @returns ProcessingResult containing the processed text and timestamp
   */
  processText(text: string): TextProcessingResult {
    const doubled = text.repeat(2);
    return {
      processedText: doubled,
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  initialOutput(): TextProcessingResult {
    return {
      processedText: 'Walking through the woods for days now, you come upon a small cabin with a man on the porch. The man is sitting on a bench poised with his hands on his hips, and his eyes are pointing opposite directions. You greet him with a \"hello!\", and he responds strangely and instantly \"hellohello!\"',
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}
```

# services/textProcessingServices/reverser.ts

```ts
import { TextProcessingResult, TextProcessBase } from "./textProcessBase";

export class Reverser extends TextProcessBase {
  /**
   * Processes input text by reversing it and adding a timestamp
   * @param text The input text to process
   * @returns ProcessingResult containing the reversed text and timestamp
   */
  processText(text: string): TextProcessingResult {
    const reversed = text.split('').reverse().join('');
    return {
      processedText: reversed,
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  initialOutput(): TextProcessingResult {
    return {
      processedText: 'Having no memory of anything, you walk into a room with a mirror and see yourself. You are the only person in the room. The one thing that is immediately apparent is that in this room, everything is mysteriously reversed.',
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}
```

# services/textProcessingServices/textProcessBase.ts

```ts
export interface TextProcessingResult {
  processedText: string;
  timestamp: string;
}

export abstract class TextProcessBase {
  protected apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Processes input text and returns a result
   * @param text The input text to process
   * @returns Promise<TextProcessingResult> containing the processed text and timestamp
   */
  abstract processText(text: string): Promise<TextProcessingResult> | TextProcessingResult;

  abstract initialOutput(): TextProcessingResult;
}
```

# tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}

```

