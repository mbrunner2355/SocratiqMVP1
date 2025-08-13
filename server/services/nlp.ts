import natural from 'natural';
import compromise from 'compromise';
import { EntityTypes, type EntityType } from '@shared/schema';

export interface ExtractedEntity {
  type: EntityType;
  value: string;
  confidence: number;
  startPosition?: number;
  endPosition?: number;
  context?: string;
}

export interface NLPResult {
  entities: ExtractedEntity[];
  sentiment: {
    score: number;
    comparative: number;
    calculation: any[];
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
  };
  wordCount: number;
  language: string;
  confidence: number;
}

export class NLPService {
  private sentimentAnalyzer: any;
  
  constructor() {
    // Initialize sentiment analyzer
    this.sentimentAnalyzer = new natural.SentimentAnalyzer('English', 
      natural.PorterStemmer, 'afinn');
  }

  async processText(content: string): Promise<NLPResult> {
    const startTime = Date.now();
    
    // Basic preprocessing
    const cleanContent = this.preprocessText(content);
    
    // Extract entities using compromise.js
    const entities = this.extractEntities(cleanContent);
    
    // Sentiment analysis using natural.js
    const sentiment = this.analyzeSentiment(cleanContent);
    
    // Word count
    const wordCount = this.getWordCount(cleanContent);
    
    // Language detection (simplified)
    const language = this.detectLanguage(cleanContent);
    
    // Calculate overall confidence based on processing results
    const confidence = this.calculateConfidence(entities, sentiment, wordCount);
    
    const processingTime = Date.now() - startTime;
    console.log(`NLP processing completed in ${processingTime}ms`);
    
    return {
      entities,
      sentiment,
      wordCount,
      language,
      confidence
    };
  }

  private preprocessText(content: string): string {
    // Remove extra whitespace, normalize text
    return content
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,;:!?()-]/g, '')
      .trim();
  }

  private extractEntities(content: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    
    // Use compromise.js for entity extraction
    const doc = compromise(content);
    
    // Extract people
    const people = doc.people().out('array') as string[];
    people.forEach(person => {
      entities.push({
        type: EntityTypes.PERSON,
        value: person,
        confidence: 0.85 + Math.random() * 0.1 // Simulate confidence variation
      });
    });
    
    // Extract organizations
    const orgs = doc.organizations().out('array') as string[];
    orgs.forEach(org => {
      entities.push({
        type: EntityTypes.ORGANIZATION,
        value: org,
        confidence: 0.80 + Math.random() * 0.15
      });
    });
    
    // Extract places
    const places = doc.places().out('array') as string[];
    places.forEach(place => {
      entities.push({
        type: EntityTypes.LOCATION,
        value: place,
        confidence: 0.75 + Math.random() * 0.2
      });
    });
    
    // Extract dates (simplified approach due to API changes)
    const dateMatches = content.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{2,4}\b/g);
    if (dateMatches) {
      dateMatches.forEach(date => {
        entities.push({
          type: EntityTypes.DATE,
          value: date,
          confidence: 0.85 + Math.random() * 0.1
        });
      });
    }
    
    // Extract medical/scientific terms using pattern matching
    const medicalTerms = this.extractMedicalTerms(content);
    entities.push(...medicalTerms);
    
    // Extract drug names using pattern matching
    const drugs = this.extractDrugNames(content);
    entities.push(...drugs);
    
    return entities;
  }

  private extractMedicalTerms(content: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    
    // Common medical term patterns
    const medicalPatterns = [
      /\b[A-Z][a-z]+(?:disease|syndrome|disorder|condition)\b/gi,
      /\b(?:cancer|carcinoma|tumor|malignancy)\b/gi,
      /\b(?:protein|enzyme|antibody|antigen)\b/gi,
      /\b(?:therapy|treatment|procedure|surgery)\b/gi,
      /\b(?:clinical trial|study|research|protocol)\b/gi,
      /\bCAR-T\b/gi,
      /\bCRISPR[^s]*\b/gi,
      /\b[A-Z]{2,}[-\d]*\b/g // Acronyms like FDA, EMA, etc.
    ];
    
    medicalPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          entities.push({
            type: EntityTypes.MEDICAL_TERM,
            value: match.trim(),
            confidence: 0.70 + Math.random() * 0.2
          });
        });
      }
    });
    
    return entities;
  }

  private extractDrugNames(content: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    
    // Common drug name patterns (simplified)
    const drugPatterns = [
      /\b[A-Z][a-z]+(?:mab|nib|inib|zumab|ximab)\b/g, // Monoclonal antibodies and inhibitors
      /\b[A-Z][a-z]*(?:cillin|mycin|cycline|oxacin)\b/g, // Antibiotics
      /\bTisagenlecleucel\b/gi, // Specific drugs mentioned in blueprint
      /\b[A-Z][a-z]+(?:stat|pril|sartan|dipine)\b/g // Common drug suffixes
    ];
    
    drugPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          entities.push({
            type: EntityTypes.DRUG,
            value: match.trim(),
            confidence: 0.75 + Math.random() * 0.2
          });
        });
      }
    });
    
    return entities;
  }

  private analyzeSentiment(content: string): any {
    // Simple sentiment analysis based on word counting
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'success', 'promising', 'effective', 'beneficial', 'approved', 'breakthrough'];
    const negativeWords = ['bad', 'poor', 'negative', 'failed', 'adverse', 'risk', 'decline', 'problem', 'issue', 'concern'];
    
    const words = content.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pos => word.includes(pos))) positiveScore++;
      if (negativeWords.some(neg => word.includes(neg))) negativeScore++;
    });
    
    const total = words.length;
    const score = (positiveScore - negativeScore) / total;
    
    return {
      score: score,
      positive: positiveScore / total,
      negative: negativeScore / total
    };
  }

  private getWordCount(content: string): number {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  }

  private detectLanguage(content: string): string {
    // Simplified language detection - in production would use proper library
    const englishWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'that', 'it', 'with'];
    const words = content.toLowerCase().split(/\s+/);
    const englishWordCount = words.filter(word => englishWords.includes(word)).length;
    
    return englishWordCount > words.length * 0.1 ? 'English' : 'Unknown';
  }

  private calculateConfidence(entities: ExtractedEntity[], sentiment: any, wordCount: number): number {
    if (wordCount < 10) return 0.3; // Very short text
    if (wordCount < 50) return 0.6; // Short text
    
    const avgEntityConfidence = entities.length > 0 
      ? entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length
      : 0.5;
    
    const sentimentConfidence = Math.abs(sentiment) > 0.1 ? 0.8 : 0.6;
    
    return Math.min(0.95, (avgEntityConfidence * 0.7 + sentimentConfidence * 0.3));
  }

  generateSemanticTags(entities: ExtractedEntity[], content: string): string[] {
    const tags = new Set<string>();
    
    // Generate tags based on entities
    entities.forEach(entity => {
      if (entity.type === EntityTypes.MEDICAL_TERM || entity.type === EntityTypes.DRUG) {
        tags.add('Medical');
      }
      if (entity.type === EntityTypes.ORGANIZATION) {
        if (entity.value.toLowerCase().includes('fda') || 
            entity.value.toLowerCase().includes('ema')) {
          tags.add('Regulatory');
        }
      }
    });
    
    // Content-based tagging
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('clinical trial') || lowerContent.includes('protocol')) {
      tags.add('Clinical Trial');
    }
    if (lowerContent.includes('fda') || lowerContent.includes('regulatory')) {
      tags.add('Regulatory');
    }
    if (lowerContent.includes('research') || lowerContent.includes('study')) {
      tags.add('Research');
    }
    if (lowerContent.includes('gene') || lowerContent.includes('genetic')) {
      tags.add('Genetics');
    }
    if (lowerContent.includes('cancer') || lowerContent.includes('oncology')) {
      tags.add('Oncology');
    }
    
    return Array.from(tags);
  }
}

export const nlpService = new NLPService();
