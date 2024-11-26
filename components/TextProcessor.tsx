import React, { useState, useCallback } from 'react';
import { StyleSheet, TextInput, ScrollView, View } from 'react-native';
import { TextService } from '@/services/textService';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface TextProcessorProps {
  placeholder?: string;
}

export function TextProcessor({ placeholder = 'Enter text to process...' }: TextProcessorProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState<string[]>([]);

  const processText = useCallback((text: string) => {
    if (text.trim()) {
      const result = TextService.processText(text);
      setOutputText(prev => [...prev, `[${result.timestamp}] ${result.processedText}`]);
      setInputText('');
    }
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={placeholder}
          placeholderTextColor="#666"
          onSubmitEditing={() => processText(inputText)}
          returnKeyType="send"
        />
      </View>

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
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  input: {
    height: 40,
    padding: 8,
    fontSize: 16,
  },
  outputContainer: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
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
