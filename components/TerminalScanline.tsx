// Draft for scanline effect to add over all text

import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  withSequence
} from 'react-native-reanimated';
import { TerminalStyles } from '@/constants/Colors';

export function TerminalScanline() {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 1000 }),
        withTiming(0, { duration: 0 })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <Animated.View
      style={[
        styles.scanline,
        animatedStyle
      ]}
    />
  );
}

const styles = StyleSheet.create({
  scanline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    ...TerminalStyles.scanline,
  },
});

export default TerminalScanline;