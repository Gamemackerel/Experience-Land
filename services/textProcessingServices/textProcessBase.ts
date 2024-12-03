export interface TextProcessingResult {
  processedText: string;
  timestamp: string;
}

export abstract class TextProcessBase {
  protected apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Processes input text and returns a result
   * @param text The input text to process
   * @returns Promise<TextProcessingResult> containing the processed text and timestamp
   */
  abstract processText(text: string, previousOutputs?: string[]): Promise<TextProcessingResult> | TextProcessingResult;

  abstract initialOutput(): TextProcessingResult;
}