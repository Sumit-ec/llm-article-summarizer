/**
 * LLM Service
 * 
 * Provides AI-powered article summarization using OpenAI's GPT models
 * or mock responses for development and testing purposes.
 */

import OpenAI from 'openai';

/**
 * Generate AI summary for article content
 * @param {string} content - The article content to summarize
 * @param {string} provider - The LLM provider to use ('openai' or 'mock')
 * @returns {Promise<string>} Generated summary text
 */
export async function summarizeWithLLM(content, provider = 'mock') {
  if (provider === 'openai') {
    try {
      // Initialize OpenAI client with API key
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Generate summary using GPT-3.5-turbo
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes articles. Provide a concise, informative summary that captures the main points and key insights of the article. Keep the summary clear and well-structured."
          },
          {
            role: "user",
            content: `Please summarize the following article:\n\n${content}`
          }
        ],
        max_tokens: 300, // Limit summary length
        temperature: 0.7, // Balance between creativity and consistency
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate summary with OpenAI');
    }
  } else {
    // Mock response for development/testing without API costs
    return `This is a mock summary of the article. The content contains approximately ${content.length} characters and would be processed by an AI model to generate a meaningful summary.`;
  }
} 