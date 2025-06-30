import { GeminiModel, GeminiError } from './types';

export function selectOptimalModel(userTier: 'free' | 'premium' | 'enterprise', complexity: 'simple' | 'medium' | 'complex'): GeminiModel {
  if (userTier === 'enterprise') return complexity === 'complex' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
  if (userTier === 'premium') return complexity === 'complex' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
  return 'gemini-2.5-flash-lite';
}

export function classifyQueryComplexity(prompt: string): 'simple' | 'medium' | 'complex' {
  if (prompt.length < 80) return 'simple';
  if (prompt.match(/analiza|estrategia|compara|explica|detalladamente|paso a paso|propuesta|planifica/i)) return 'complex';
  return 'medium';
}

export function calculateCost(model: GeminiModel, inputTokens: number, outputTokens: number): number {
  // Precios ficticios por token
  const prices = {
    'gemini-2.5-pro': 0.00002,
    'gemini-2.5-flash': 0.00001,
    'gemini-2.5-flash-lite': 0.000005
  };
  return (inputTokens + outputTokens) * prices[model];
}

export function formatGeminiError(error: any): string {
  if (!error) return 'Error desconocido.';
  if (error.type === 'rate_limit') return 'Demasiadas solicitudes. Intenta de nuevo en unos segundos.';
  if (error.type === 'quota_exceeded') return 'Has superado el límite de uso de tu plan. Considera actualizar tu suscripción.';
  if (error.type === 'content_policy') return 'El contenido solicitado no está permitido por la política de uso.';
  if (error.type === 'network') return 'Error de red. Intenta de nuevo.';
  return error.message || 'Error desconocido.';
} 