import { GeminiModel, GeminiConfig, GeminiRequest, GeminiResponse, GeminiError, GeminiStreamChunk } from './types';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const DEFAULT_SAFETY: GeminiConfig['safetySettings'] = [
  { category: 'HARM_CATEGORY_DEROGATORY', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_TOXICITY', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_VIOLENCE', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUAL', threshold: 'BLOCK_HIGH' },
  { category: 'HARM_CATEGORY_MEDICAL', threshold: 'BLOCK_LOW_AND_ABOVE' },
  { category: 'HARM_CATEGORY_FINANCE', threshold: 'BLOCK_LOW_AND_ABOVE' },
];

function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 500): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429 && i < retries - 1) {
        await sleep(backoff * Math.pow(2, i));
        continue;
      }
      return res;
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(backoff * Math.pow(2, i));
    }
  }
  throw new Error('No se pudo completar la solicitud tras varios intentos.');
}

export async function generateResponse(prompt: string, model: GeminiModel, config?: GeminiConfig): Promise<string> {
  const url = `${BASE_URL}/${model}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    safetySettings: config?.safetySettings || DEFAULT_SAFETY,
    generationConfig: {
      temperature: config?.temperature ?? 0.7,
      maxOutputTokens: config?.maxTokens ?? 1024,
      topP: config?.topP ?? 1,
      topK: config?.topK ?? 1,
    },
  };
  const res = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { type: res.status === 429 ? 'rate_limit' : 'unknown', message: err.error?.message || res.statusText } as GeminiError;
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function* generateStreamResponse(prompt: string, model: GeminiModel, config?: GeminiConfig): AsyncGenerator<string> {
  // NOTA: Gemini API streaming real requiere WebSockets o SSE, aquí es mock para demo
  const text = await generateResponse(prompt, model, config);
  for (let i = 0; i < text.length; i += 30) {
    yield text.slice(0, i + 30);
    await sleep(30);
  }
}

export async function classifyIntent(message: string): Promise<'business' | 'finance' | 'health' | 'education' | 'personal'> {
  // Mock simple, en producción usaría un modelo de clasificación
  if (/finan/i.test(message)) return 'finance';
  if (/salud|médic/i.test(message)) return 'health';
  if (/educa|enseñ/i.test(message)) return 'education';
  if (/negocio|empresa|estrategia/i.test(message)) return 'business';
  return 'personal';
} 