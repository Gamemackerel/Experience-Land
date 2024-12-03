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

  // Create flicker animation function with proper cleanup
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
      <BlurView intensity={3} style={StyleSheet.absoluteFill} tint="dark" pointerEvents="none"/>
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