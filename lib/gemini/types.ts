export type GeminiModel = 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gemini-2.5-flash-lite';

export interface GeminiConfig {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  safetySettings?: GeminiSafetySetting[];
  stream?: boolean;
}

export interface GeminiSafetySetting {
  category: 'HARM_CATEGORY_DEROGATORY' | 'HARM_CATEGORY_TOXICITY' | 'HARM_CATEGORY_VIOLENCE' | 'HARM_CATEGORY_SEXUAL' | 'HARM_CATEGORY_MEDICAL' | 'HARM_CATEGORY_FINANCE';
  threshold: 'BLOCK_NONE' | 'BLOCK_LOW_AND_ABOVE' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_HIGH';
}

export interface GeminiRequest {
  model: GeminiModel;
  prompt: string;
  config?: GeminiConfig;
}

export interface GeminiResponse {
  text: string;
  tokens: number;
  model: GeminiModel;
  finishReason?: string;
}

export interface GeminiStreamChunk {
  text: string;
  done: boolean;
}

export type GeminiErrorType = 'rate_limit' | 'quota_exceeded' | 'content_policy' | 'network' | 'unknown';

export interface GeminiError {
  type: GeminiErrorType;
  message: string;
  code?: string | number;
  retryAfter?: number;
} 