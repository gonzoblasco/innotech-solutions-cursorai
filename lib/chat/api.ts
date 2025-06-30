import { ChatService } from './service';

const chatService = new ChatService();

async function retry<T>(fn: () => Promise<T>, retries = 3, backoff = 500): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      if (e.code === 'quota_exceeded') throw new Error('Has superado tu cuota de uso.');
      if (e.code === 'unauthorized') throw new Error('No autorizado. Inicia sesión.');
      if (i === retries - 1) throw e;
      await new Promise(res => setTimeout(res, backoff * Math.pow(2, i)));
    }
  }
  throw new Error('Error de red persistente.');
}

export async function apiSendMessage(conversationId: string, message: string, agentType: string) {
  return retry(() => chatService.sendMessage(conversationId, message, agentType));
}

export async function apiCreateConversation(agentType: string, title?: string) {
  return retry(() => chatService.createConversation(agentType, title));
}

export async function apiGetConversations(userId: string) {
  return retry(() => chatService.getConversations(userId));
}

export async function apiGetMessages(conversationId: string) {
  return retry(() => chatService.getMessages(conversationId));
}

export async function apiUpdateUsageStats(userId: string, tokensUsed: number, cost: number) {
  return retry(() => chatService.updateUsageStats(userId, tokensUsed, cost));
} 