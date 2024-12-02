import { StyleSheet } from 'react-native';
import { TextProcessor } from '@/components/TextProcessor';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Doubler } from '@/services/textProcessingServices/doubler';

import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


export default function DoubleProcessorScreen() {

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Double or Nothing',
    });
  }, [navigation]);


  return (
    <ThemedView style={styles.container}>
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