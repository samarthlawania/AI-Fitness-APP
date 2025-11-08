import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { logger } from '../config/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class TTSAdapter {
  async generateSpeech(text) {
    try {
      return await this.generateWithGTTS(text);
    } catch (error) {
      logger.warn('gTTS failed, using mock:', error.message);
      return this.generateMockSpeech(text);
    }
  }

  async generateWithGTTS(text) {
    const tempFile = path.join(__dirname, '../../temp', `tts_${Date.now()}.mp3`);
    
    // Ensure temp directory exists
    await fs.mkdir(path.dirname(tempFile), { recursive: true });
    
    return new Promise((resolve, reject) => {
      const python = spawn('python', ['-c', `
import sys
from gtts import gTTS
import io

text = sys.argv[1]
output_file = sys.argv[2]

tts = gTTS(text=text, lang='en', slow=False)
tts.save(output_file)
print('TTS generated successfully')
      `, text, tempFile]);
      
      python.on('close', async (code) => {
        if (code === 0) {
          try {
            const audioBuffer = await fs.readFile(tempFile);
            await fs.unlink(tempFile); // Clean up temp file
            logger.info(`gTTS generated audio for: ${text.substring(0, 50)}...`);
            resolve(audioBuffer);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error(`gTTS process exited with code ${code}`));
        }
      });
      
      python.on('error', (error) => {
        reject(new Error(`Failed to start gTTS: ${error.message}`));
      });
    });
  }

  // Fallback mock implementation
  async generateMockSpeech(text) {
    logger.info(`Generating mock TTS for: ${text.substring(0, 50)}...`);
    
    const mockMp3Header = Buffer.from([
      0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
    
    return mockMp3Header;
  }
}

export const ttsAdapter = new TTSAdapter();