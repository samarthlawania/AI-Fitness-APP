import { logger } from '../config/logger.js';

class ImageAdapter {
  async generateImage(prompt, type) {
    return this.generateMockImage(prompt, type);
  }

  // Mock implementation for development
  async generateMockImage(prompt, type) {
    logger.info(`Generating mock image for ${type}: ${prompt.substring(0, 50)}...`);
    // Return a small mock image buffer (1x1 PNG)
    return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  }
}

export const imageAdapter = new ImageAdapter();