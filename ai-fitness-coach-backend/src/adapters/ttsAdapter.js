import OpenAI from 'openai';
import { logger } from '../config/logger.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class TTSAdapter {
  constructor() {
    this.provider = process.env.TTS_PROVIDER || 'openai';
  }

  async generateSpeech(text) {
    switch (this.provider) {
      case 'openai':
        return this.generateWithOpenAI(text);
      default:
        throw new Error(`Unsupported TTS provider: ${this.provider}`);
    }
  }

  async generateWithOpenAI(text) {
    try {
      const response = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: text,
        response_format: 'mp3',
      });

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      logger.error('OpenAI TTS error:', error);
      throw new Error('Failed to generate speech with OpenAI');
    }
  }

  // Mock implementation for development
  async generateMockSpeech(text) {
    // Return a small mock audio buffer
    return Buffer.from('mock-audio-data');
  }
}

export const ttsAdapter = new TTSAdapter();