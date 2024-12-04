import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY_STORAGE_KEY = '@Experience-Land:apiKey';

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const storedApiKey = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
      setApiKey(storedApiKey);
    } catch (error) {
      console.error('Error loading API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async (newApiKey: string) => {
    try {
      await AsyncStorage.setItem(API_KEY_STORAGE_KEY, newApiKey);
      setApiKey(newApiKey);
    } catch (error) {
      console.error('Error saving API key:', error);
      throw error;
    }
  };

  const clearApiKey = async () => {
    try {
      await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
      setApiKey(null);
    } catch (error) {
      console.error('Error clearing API key:', error);
      throw error;
    }
  };

  return {
    apiKey,
    isLoading,
    saveApiKey,
    clearApiKey,
  };
}