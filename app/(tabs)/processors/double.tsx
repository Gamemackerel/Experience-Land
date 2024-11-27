import { StyleSheet } from 'react-native';
import { TextProcessor } from '@/components/TextProcessor';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Doubler } from '@/services/textProcessingServices/doubler';

export default function ReverseProcessorScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Reverse Text Processor</ThemedText>
      <TextProcessor placeholder="Type something and press enter..." processService={new Doubler('API_KEY')} />
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