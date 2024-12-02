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
     * Processes input text by reversing it and adding a timestamp
     * @param text The input text to process
     * @returns ProcessingResult containing the reversed text and timestamp
     */
    abstract processText(text: string): TextProcessingResult;

    abstract initialOutput(): TextProcessingResult;
  }