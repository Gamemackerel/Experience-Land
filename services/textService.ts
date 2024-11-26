export interface TextProcessingResult {
    processedText: string;
    timestamp: string;
  }

  export class TextService {
    /**
     * Processes input text by reversing it and adding a timestamp
     * @param text The input text to process
     * @returns ProcessingResult containing the reversed text and timestamp
     */
    static processText(text: string): TextProcessingResult {
      const reversed = text.split('').reverse().join('');
      return {
        processedText: reversed,
        timestamp: new Date().toLocaleTimeString(),
      };
    }
  }