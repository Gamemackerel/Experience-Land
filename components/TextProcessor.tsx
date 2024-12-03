import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextInput, ScrollView, View, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedTextBox } from './ThemedTextBox';
import { ThemedView } from './ThemedView';
import { TextProcessBase } from '@/services/textProcessingServices/textProcessBase';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '@/constants/Colors';

interface TextProcessorProps {
  processService: TextProcessBase;
}

export function TextProcessor({ processService }: TextProcessorProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const result = processService.initialOutput();
    setOutputText(_ => [`${result.processedText}`]);
  }, []);

  const processText = useCallback(async (text: string) => {
    if (text.trim()) {
      setIsProcessing(true);
      setInputText('');
      try {
        const result = await Promise.resolve(processService.processText(text, outputText));
        setOutputText(prev => [...prev, `${result.processedText}`]);
      } catch (error) {
        setOutputText(prev => [
          ...prev,
          `ERROR: ${error.message}`,
        ]);
      } finally {
        setIsProcessing(false);
      }
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
          {isProcessing ? (
            <ActivityIndicator size="small" color={Colors.light.text} />
          ) : (
            <IconSymbol
              name="chevron.right"
              size={20}
              color={Colors.light.text}
              style={styles.chevron}
            />
          )}
          <ThemedTextBox
            ref={inputRef}
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor={Colors.light.icon}
            onSubmitEditing={() => !isProcessing && processText(inputText)}
            returnKeyType="send"
            submitBehavior='submit'
            blurOnSubmit={false}
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