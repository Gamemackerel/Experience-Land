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