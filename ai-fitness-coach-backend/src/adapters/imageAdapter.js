import OpenAI from 'openai';
import { logger } from '../config/logger.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ImageAdapter {
  constructor() {
    this.provider = process.env.IMAGE_PROVIDER || 'openai';
  }

  async generateImage(prompt, type) {
    const enhancedPrompt = this.enhancePrompt(prompt, type);
    
    switch (this.provider) {
      case 'openai':
        return this.generateWithOpenAI(enhancedPrompt);
      default:
        throw new Error(`Unsupported image provider: ${this.provider}`);
    }
  }

  enhancePrompt(prompt, type) {
    const basePrompts = {
      exercise: 'Professional fitness photography, clean gym environment, proper form demonstration, ',
      meal: 'Professional food photography, appetizing presentation, healthy meal, clean background, ',
    };

    return basePrompts[type] + prompt + ', high quality, detailed, realistic';
  }

  async generateWithOpenAI(prompt) {
    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'b64_json',
      });

      return Buffer.from(response.data[0].b64_json, 'base64');
    } catch (error) {
      logger.error('OpenAI image generation error:', error);
      throw new Error('Failed to generate image with OpenAI');
    }
  }

  // Mock implementation for development
  async generateMockImage(prompt, type) {
    // Return a small mock image buffer (1x1 PNG)
    return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  }
}

export const imageAdapter = new ImageAdapter();