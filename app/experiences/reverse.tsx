import { StyleSheet } from 'react-native';
import { TextProcessor } from '@/components/TextProcessor';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Reverser } from '@/services/textProcessingServices/reverser';

import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


export default function ReverseProcessorScreen() {

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Reverse Room',
    });
  }, [navigation]);
  return (
    <ThemedView style={styles.container}>
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