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

  initialOutput(): TextProcessingResult {
    return {
      processedText: 'Walking through the woods for days now, you come upon a small cabin with a man on the porch. The man is sitting on a bench poised with his hands on his hips, and his eyes are pointing opposite directions. You greet him with a \"hello!\", and he responds strangely and instantly \"hellohello!\"',
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}