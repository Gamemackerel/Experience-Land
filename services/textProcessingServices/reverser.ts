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

  initialOutput(): TextProcessingResult {
    return {
      processedText: 'Having no memory of anything, you walk into a room with a mirror and see yourself. You are the only person in the room. The one thing that is immediately apparent is that in this room, everything is mysteriously reversed.',
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}