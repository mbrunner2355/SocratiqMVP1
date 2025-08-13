import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { nlpService, type NLPResult } from './nlp';
import { advancedNLPService, type AdvancedNLPResult } from './advancedNLP';
import { s3Service } from './s3Service';
import { storage } from '../storage';
import { ProcessingStatus } from '@shared/schema';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export interface ProcessingResult {
  success: boolean;
  documentId: string;
  error?: string;
  processingTimeMs: number;
  nlpResult?: NLPResult;
  advancedNLPResult?: AdvancedNLPResult;
  s3Key?: string;
  s3Url?: string;
}

export class FileProcessor {
  private uploadsDir: string;
  
  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadsDirectory();
  }

  private async ensureUploadsDirectory() {
    try {
      await mkdir(this.uploadsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create uploads directory:', error);
    }
  }

  async processFile(
    file: any, 
    documentId: string
  ): Promise<ProcessingResult> {
    const startTime = Date.now();
    
    try {
      // Update status to processing
      await storage.updateDocument(documentId, { 
        status: ProcessingStatus.PROCESSING,
        processingProgress: 10
      });

      // Upload file to S3 first
      const userId = file.userId || 'anonymous';
      const s3Key = s3Service.generateFileKey(file.originalname, userId, 'pharmaceutical-documents');
      const s3Url = await s3Service.uploadFile(file.path, s3Key, file.mimetype);
      
      // Extract text content based on file type
      const content = await this.extractTextContent(file);
      
      await storage.updateDocument(documentId, { 
        content,
        filePath: s3Url,
        s3Key: s3Key,
        processingProgress: 30
      });

      // Perform NLP processing
      const nlpResult = await nlpService.processText(content);
      
      await storage.updateDocument(documentId, { 
        processingProgress: 50
      });

      // Perform advanced NLP processing with BERT/BioBERT
      const advancedNLPResult = await advancedNLPService.processAdvancedText(content);
      
      await storage.updateDocument(documentId, { 
        processingProgress: 70
      });

      // Generate semantic tags (combining basic and advanced results)
      const basicSemanticTags = nlpService.generateSemanticTags(nlpResult.entities, content);
      const semanticTags = [...basicSemanticTags, ...advancedNLPResult.semanticTags];

      // Create entities in storage (combining basic and advanced entities)
      const basicEntityInserts = nlpResult.entities.map(entity => ({
        documentId,
        type: entity.type,
        value: entity.value,
        confidence: entity.confidence,
        startPosition: entity.startPosition,
        endPosition: entity.endPosition,
        context: entity.context,
        metadata: { source: 'basic_nlp' }
      }));

      const advancedEntityInserts = advancedNLPResult.entities.map(entity => ({
        documentId,
        type: entity.type,
        value: entity.value,
        confidence: entity.confidence,
        startPosition: entity.startPosition,
        endPosition: entity.endPosition,
        context: entity.context,
        metadata: { 
          source: 'advanced_nlp',
          semanticEnrichment: entity.semanticEnrichment,
          meshConnections: entity.meshConnections
        }
      }));

      await storage.createEntities([...basicEntityInserts, ...advancedEntityInserts]);

      // Update document with final results (including advanced NLP data)
      const processingTimeMs = Date.now() - startTime;
      await storage.updateDocument(documentId, {
        status: ProcessingStatus.COMPLETED,
        processingProgress: 100,
        confidence: Math.max(nlpResult.confidence, advancedNLPResult.confidence),
        wordCount: nlpResult.wordCount,
        entities: [...nlpResult.entities, ...advancedNLPResult.entities],
        semanticTags,
        processingTimeMs,
        metadata: {
          language: nlpResult.language,
          sentiment: nlpResult.sentiment,
          entityCount: nlpResult.entities.length + advancedNLPResult.entities.length,
          domainClassification: advancedNLPResult.domainClassification,
          biomedicalConcepts: advancedNLPResult.biomedicalConcepts,
          bioDomainSentiment: advancedNLPResult.sentiment,
          meshEnrichment: advancedNLPResult.meshEnrichment,
          processingMetrics: advancedNLPResult.processingMetrics
        }
      });

      // Clean up temporary file
      this.cleanupFile(file.path);

      return {
        success: true,
        documentId,
        processingTimeMs,
        nlpResult,
        advancedNLPResult,
        s3Key,
        s3Url
      };

    } catch (error) {
      console.error('File processing failed:', error);
      
      const processingTimeMs = Date.now() - startTime;
      await storage.updateDocument(documentId, {
        status: ProcessingStatus.FAILED,
        processingTimeMs,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });

      this.cleanupFile(file.path);

      return {
        success: false,
        documentId,
        processingTimeMs,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async extractTextContent(file: any): Promise<string> {
    const fileBuffer = await readFile(file.path);
    
    switch (file.mimetype) {
      case 'application/pdf':
        return await this.extractPdfText(fileBuffer);
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await this.extractDocxText(fileBuffer);
      
      case 'text/plain':
        return fileBuffer.toString('utf-8');
      
      default:
        throw new Error(`Unsupported file type: ${file.mimetype}`);
    }
  }

  private async extractPdfText(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      throw new Error(`Failed to extract PDF text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async extractDocxText(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      throw new Error(`Failed to extract DOCX text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private cleanupFile(filePath: string) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Failed to cleanup file:', error);
    }
  }

  async getProcessingStatus(documentId: string) {
    const document = await storage.getDocument(documentId);
    return document ? {
      status: document.status,
      progress: document.processingProgress || 0,
      confidence: document.confidence,
      wordCount: document.wordCount,
      entityCount: Array.isArray(document.entities) ? document.entities.length : 0
    } : null;
  }
}

export const fileProcessor = new FileProcessor();
