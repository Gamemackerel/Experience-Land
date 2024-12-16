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
        {/* <Link href="./experiences/reverse" asChild>
          <TouchableOpacity style={styles.processorLink}>
            <ThemedText>{">"}</ThemedText>
            <ThemedView style={styles.processorContent}>
              <ThemedText>REVERSE ROOM</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </Link>
        <Link href="./experiences/double" asChild>
          <TouchableOpacity style={styles.processorLink}>
            <ThemedText>{">"}</ThemedText>
            <ThemedView style={styles.processorContent}>
              <ThemedText>DOUBLE OR NOTHING</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </Link> */}
        <Link href="./experiences/aichamber" asChild>
          <TouchableOpacity style={styles.processorLink}>
            <ThemedText>{">"}</ThemedText>
            <ThemedView style={styles.processorContent}>
              <ThemedText>BASIC AI CHAMBER</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </Link>
        <Link href="./experiences/zork" asChild>
          <TouchableOpacity style={styles.processorLink}>
            <ThemedText>{">"}</ThemedText>
            <ThemedView style={styles.processorContent}>
              <ThemedText>THE TEMPLE</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </Link>
        <Link href="./experiences/bork" asChild>
          <TouchableOpacity style={styles.processorLink}>
            <ThemedText>{">"}</ThemedText>
            <ThemedView style={styles.processorContent}>
              <ThemedText>THE TEMPLE 2</ThemedText>
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