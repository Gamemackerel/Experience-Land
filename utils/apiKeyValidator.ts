import Anthropic from '@anthropic-ai/sdk';

export async function validateAnthropicApiKey(apiKey: string): Promise<boolean> {
  try {
    const client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true
    });

    // Make a minimal request to test the API key
    await client.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1,
      messages: [{ role: "user", content: "test" }]
    });

    return true;
  } catch (error) {
    if (error.status === 401) {
      throw new Error('Invalid API key. Please check your key and try again.');
    }
    throw new Error('Error validating API key. Please try again.');
  }
}