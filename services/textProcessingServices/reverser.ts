import { TextProcessingResult, TextProcessBase } from "./textProcessBase";

export class Reverser extends TextProcessBase {
  /**
   * Processes input text by reversing it and adding a timestamp
   * @param text The input text to process
   * @returns ProcessingResult containing the reversed text and timestamp
   */
  processText(text: string): TextProcessingResult {
    const reversed = text.split('').reverse().join('');
    return {
      processedText: reversed,
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}