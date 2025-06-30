import { AgentManager } from '../agents/manager';
import { generateResponse, generateStreamResponse } from '../gemini/client';
import { selectOptimalModel } from '../gemini/utils';
import { ChatService } from './service';

const chatService = new ChatService();

export async function processAIMessage({ message, userTier, agentType, context, conversationId }: {
  message: string;
  userTier: 'free' | 'premium' | 'enterprise';
  agentType: string;
  context: string[];
  conversationId: string;
}) {
  const complexity = message.length > 120 ? 'complex' : 'simple';
  const model = selectOptimalModel(userTier, complexity);
  const prompt = context.join('\n') + '\nUsuario: ' + message;
  const response = await generateResponse(prompt, model);
  // Guardar mensaje IA en Supabase
  await chatService.sendMessage(conversationId, response, agentType);
  // Actualizar stats (mock tokens/cost)
  await chatService.updateUsageStats('user_id', response.length, 0.001 * response.length);
  return response;
}

export async function* processAIMessageStream({ message, userTier, agentType, context, conversationId }: {
  message: string;
  userTier: 'free' | 'premium' | 'enterprise';
  agentType: string;
  context: string[];
  conversationId: string;
}) {
  const complexity = message.length > 120 ? 'complex' : 'simple';
  const model = selectOptimalModel(userTier, complexity);
  const prompt = context.join('\n') + '\nUsuario: ' + message;
  for await (const chunk of generateStreamResponse(prompt, model)) {
    yield chunk;
  }
} 