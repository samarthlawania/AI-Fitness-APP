import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '../config/logger.js';

class StorageService {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      endpoint: process.env.S3_ENDPOINT || undefined, // For S3-compatible services
    });
    
    this.bucketName = process.env.S3_BUCKET_NAME;
  }

  async uploadFile(key, buffer, contentType) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);
      
      // Return public URL or signed URL
      return this.getFileUrl(key);
    } catch (error) {
      logger.error('File upload failed:', error);
      throw new Error('Failed to upload file to storage');
    }
  }

  async getSignedUrl(key, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      logger.error('Failed to generate signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  getFileUrl(key) {
    if (process.env.S3_ENDPOINT) {
      // For S3-compatible services, construct URL
      return `${process.env.S3_ENDPOINT}/${this.bucketName}/${key}`;
    } else {
      // For AWS S3
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }
  }

  // Alternative implementation for Supabase Storage
  async uploadToSupabase(key, buffer, contentType) {
    // TODO: Implement Supabase storage integration
    // const { createClient } = require('@supabase/supabase-js');
    // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    throw new Error('Supabase storage not implemented yet');
  }
}

export const storageService = new StorageService();