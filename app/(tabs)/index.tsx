// app/(tabs)/index.tsx

import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Text Processors</ThemedText>
        <Link href="./processors/reverse" asChild>
          <TouchableOpacity style={styles.processorLink}>
            <IconSymbol name="chevron.right" size={24} color="#687076" />
            <ThemedView style={styles.processorContent}>
              <ThemedText type="defaultSemiBold">Reverse Text</ThemedText>
              <ThemedText>Reverse any text you type</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </Link>
        <Link href="./processors/double" asChild>
          <TouchableOpacity style={styles.processorLink}>
            <IconSymbol name="chevron.right" size={24} color="#687076" />
            <ThemedView style={styles.processorContent}>
              <ThemedText type="defaultSemiBold">Double Text</ThemedText>
              <ThemedText>Double any text you type</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </Link>
      </ThemedView>

      {/* ... other sections ... */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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