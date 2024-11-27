import { TextProcessingResult, TextProcessBase } from "./textProcessBase";

export class Doubler extends TextProcessBase {
  /**
   * Processes input text by doubling it and adding a timestamp
   * @param text The input text to process
   * @returns ProcessingResult containing the processed text and timestamp
   */
  processText(text: string): TextProcessingResult {
    const doubled = text.repeat(2);
    return {
      processedText: doubled,
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}