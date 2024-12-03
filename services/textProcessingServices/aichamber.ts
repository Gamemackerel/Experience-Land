import { TextProcessingResult, TextProcessBase } from "./textProcessBase";
import Anthropic from '@anthropic-ai/sdk';

export class AnthropicProcessor extends TextProcessBase {
  private client: Anthropic;

  constructor(apiKey: string) {
    super(apiKey);
    this.client = new Anthropic({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async processText(text: string): Promise<TextProcessingResult> {
    try {
      const response = await this.client.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [{ role: "user", content: text }]
      });

      return {
        processedText: response.content[0].text,
        timestamp: new Date().toLocaleTimeString()
      };
    } catch (error) {
      return {
        processedText: `Error processing text: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      };
    }
  }

  initialOutput(): TextProcessingResult {
    return {
      processedText: "You've entered the AI Chamber. Here, your words will be processed by Claude, an AI assistant. What would you like to discuss?",
      timestamp: new Date().toLocaleTimeString()
    };
  }
}