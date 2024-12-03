import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface CRTEffectProps {
  children: React.ReactNode;
}

export const CRTEffect: React.FC<CRTEffectProps> = ({ children }) => {
  // Animation values for different effects
  const scanline = useSharedValue(0);
  const flicker = useSharedValue(1);

  useEffect(() => {
    // Animate scanline movement
    scanline.value = withRepeat(
      withTiming(height, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Random screen flicker effect
    const flickerAnimation = () => {
      flicker.value = withTiming(0.98 + Math.random() * 0.04, {
        duration: 50 + Math.random() * 100,
        easing: Easing.linear,
      });
      setTimeout(flickerAnimation, 2000 + Math.random() * 4000);
    };

    flickerAnimation();
  }, []);

  // Scanline animation style
  const scanlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanline.value }],
  }));

  // Screen flicker animation style
  const flickerStyle = useAnimatedStyle(() => ({
    opacity: flicker.value,
  }));

  return (
    <Animated.View style={[styles.container, flickerStyle]}>
      {children}
      <Animated.View
        style={[styles.scanline, scanlineStyle]}
        pointerEvents="none"
      />
      <Animated.View
        style={styles.overlay}
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
    opacity: 0.2,
    // Add subtle CRT screen curvature and scan pattern
    backgroundImage: `linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 255, 0, 0.05) 50%
    )`,
    backgroundSize: '100% 4px',
  },
});