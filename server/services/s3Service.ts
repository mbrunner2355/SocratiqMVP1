import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    
    // Use environment variable or default bucket name
    this.bucketName = process.env.S3_BUCKET_NAME || 'socratiq-pharmaceutical-files';
  }

  async uploadFile(filePath: string, key: string, contentType?: string): Promise<string> {
    try {
      const fileContent = fs.readFileSync(filePath);
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileContent,
        ContentType: contentType,
        // Add metadata for pharmaceutical compliance
        Metadata: {
          uploadedAt: new Date().toISOString(),
          originalPath: path.basename(filePath),
        },
      });

      await this.s3Client.send(command);
      return `s3://${this.bucketName}/${key}`;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error(`Failed to upload file to S3: ${error}`);
    }
  }

  async uploadBuffer(buffer: Buffer, key: string, contentType?: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        Metadata: {
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.s3Client.send(command);
      return `s3://${this.bucketName}/${key}`;
    } catch (error) {
      console.error('Error uploading buffer to S3:', error);
      throw new Error(`Failed to upload buffer to S3: ${error}`);
    }
  }

  async getFile(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      if (!response.Body) {
        throw new Error('File not found');
      }

      const chunks: Uint8Array[] = [];
      for await (const chunk of response.Body as any) {
        chunks.push(chunk);
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('Error getting file from S3:', error);
      throw new Error(`Failed to get file from S3: ${error}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error(`Failed to delete file from S3: ${error}`);
    }
  }

  async getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error(`Failed to generate signed URL: ${error}`);
    }
  }

  generateFileKey(originalName: string, userId?: string, category: string = 'documents'): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const userPrefix = userId ? `users/${userId}/` : 'anonymous/';
    
    return `${category}/${userPrefix}${timestamp}_${sanitizedName}`;
  }
}

export const s3Service = new S3Service();