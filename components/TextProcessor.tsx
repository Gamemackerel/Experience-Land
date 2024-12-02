import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextInput, ScrollView, View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedTextBox } from './ThemedTextBox';
import { ThemedView } from './ThemedView';
import { TextProcessBase } from '@/services/textProcessingServices/textProcessBase';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '@/constants/Colors';

interface TextProcessorProps {
  placeholder?: string;
  processService: TextProcessBase;
}

export function TextProcessor({ placeholder = 'Enter text to process...', processService }: TextProcessorProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState<string[]>([]);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus on mount
    const focusInput = () => {
      inputRef.current?.focus();
    };

    // Initial focus
    focusInput();

    // Set up an interval to check and restore focus
    const focusInterval = setInterval(focusInput, 1000);

    // Do an initial text output
    const result = processService.initialOutput();
    setOutputText(prev => [...prev, `[${result.timestamp}] ${result.processedText}`]);

    return () => {
      clearInterval(focusInterval);
    };
  }, []);

  const processText = useCallback((text: string) => {
    if (text.trim()) {
      const result = processService.processText(text);
      setOutputText(prev => [...prev, `[${result.timestamp}] ${result.processedText}`]);
      setInputText('');

      // Ensure focus after processing
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, []);

  return (
    <ThemedView style={styles.container}>
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
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <IconSymbol
            name="chevron.right"
            size={20}
            color={Colors.light.text}
            style={styles.chevron}
          />
          <ThemedTextBox
            ref={inputRef}
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor={Colors.light.icon}
            onSubmitEditing={() => processText(inputText)}
            returnKeyType="send"
            autoFocus
          />
        </View>
      </View>
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
    padding: 8,
    backgroundColor: Colors.light.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevron: {
    marginLeft: 4,
  },
  input: {
    height: 40,
    padding: 8,
    fontSize: 16,
    flex: 1,
  },
  outputContainer: {
    flex: 1,
    borderRadius: 8,
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