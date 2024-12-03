import { StyleSheet } from 'react-native';
import { TextProcessor } from '@/components/TextProcessor';
import { ThemedView } from '@/components/ThemedView';
import { Zork } from '@/services/textProcessingServices/zork';
import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useApiKey } from '@/hooks/useApiKey';
import { ThemedText } from '@/components/ThemedText';

export default function ZorkProcessorScreen() {
  const navigation = useNavigation();
  const { apiKey } = useApiKey();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'The Temple',
    });
  }, [navigation]);

  if (!apiKey) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No API key found. Please return to the home screen and enter your API key.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <TextProcessor
        processService={new Zork(apiKey)}
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