import { StyleSheet } from 'react-native';
import { TextProcessor } from '@/components/TextProcessor';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Reverser } from '@/services/textProcessingServices/reverser';

export default function ReverseProcessorScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Reverse Text Processor</ThemedText>
      <TextProcessor placeholder="Type something and press enter..." processService={new Reverser('API_KEY')} />
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