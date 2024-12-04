import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextBox } from '@/components/ThemedTextBox';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ScrollView } from 'react-native-gesture-handler';
import { useApiKey } from '@/hooks/useApiKey';
import { Colors } from '@/constants/Colors';
import { validateAnthropicApiKey } from '@/utils/apiKeyValidator';

export default function HomeScreen() {
  const { apiKey, isLoading, saveApiKey } = useApiKey();
  const [inputApiKey, setInputApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitApiKey = async () => {
    if (!inputApiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Validate the API key before saving
      await validateAnthropicApiKey(inputApiKey.trim());
      await saveApiKey(inputApiKey.trim());
      setInputApiKey('');
    } catch (err) {
      setError(err.message || 'Failed to validate API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.text} />
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText>Welcome to Experience_Land.</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText>This is a special place where you can travel to other worlds and explore new perspectives.</ThemedText>
      </ThemedView>

      {!apiKey ? (
        <ThemedView style={styles.section}>
          <ThemedText>Please enter your Anthropic API key to continue:</ThemedText>
          <ThemedView style={styles.inputContainer}>
            {isSubmitting ? (
                <ActivityIndicator size="small" color={Colors.light.text} />
              ) : (
                <ThemedText>{">"}</ThemedText>
              )}
            <ThemedTextBox
              value={inputApiKey}
              onChangeText={(text) => {
                setInputApiKey(text);
                setError(null); // Clear error when user types
              }}
              placeholderTextColor={Colors.light.icon}
              style={[
                styles.input,
              ]}
              secureTextEntry
              onSubmitEditing={handleSubmitApiKey}
              editable={!isSubmitting}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
            <TouchableOpacity
              onPress={handleSubmitApiKey}
              style={[
                styles.submitButton,
                isSubmitting ? styles.submitButtonDisabled : null
              ]}
              disabled={isSubmitting}
            >
            </TouchableOpacity>
          </ThemedView>
          {error && (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          )}
        </ThemedView>
      ) : (
        <ThemedView style={styles.section}>
          <Link href="./experiences" asChild>
            <TouchableOpacity style={styles.processorLink}>
            <ThemedText>{">"}</ThemedText>
              <ThemedView style={styles.processorContent}>
                <ThemedText>BROWSE EXPERIENCES</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          </Link>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    padding: 12,
  },
  input: {
    flex: 1,
    height: 40,
    marginRight: 12,
  },
  submitButton: {
    padding: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
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
  },
});