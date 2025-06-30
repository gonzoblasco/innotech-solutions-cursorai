import { AgentType } from './types';

export function formatPromptWithContext(prompt: string, context: string[], userMessage: string) {
  return [
    prompt,
    ...context.map((c, i) => `Mensaje anterior ${i + 1}: ${c}`),
    `Usuario: ${userMessage}`
  ].join('\n');
}

export function shouldSwitchAgent(currentAgent: AgentType, classifiedIntent: AgentType, confidence: number) {
  return currentAgent !== classifiedIntent && confidence > 0.8;
}

export function generateHandoffMessage(fromAgent: string, toAgent: string, reason: string) {
  return `Transfiriendo la conversación de ${fromAgent} a ${toAgent} por: ${reason}`;
} 