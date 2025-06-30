import { Message, Conversation } from './types';

const CONTEXT_KEY = 'latam_conversation_context';
const MAX_TOKENS = 2000;

export class ConversationContext {
  private conversation: Conversation;

  constructor(conversation: Conversation) {
    this.conversation = conversation;
  }

  addMessage(message: Message) {
    this.conversation.messages.push(message);
    this.persist();
  }

  getContext(): string[] {
    // Devuelve los últimos mensajes hasta el límite de tokens
    let tokens = 0;
    const context: string[] = [];
    for (let i = this.conversation.messages.length - 1; i >= 0; i--) {
      const msg = this.conversation.messages[i];
      tokens += msg.content.length;
      if (tokens > MAX_TOKENS) break;
      context.unshift(msg.content);
    }
    return context;
  }

  resetContext() {
    this.conversation.messages = [];
    this.persist();
  }

  switchAgent(newAgentId: string) {
    this.conversation.agentId = newAgentId;
    this.persist();
  }

  persist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONTEXT_KEY, JSON.stringify(this.conversation));
    }
  }

  static load(): Conversation | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(CONTEXT_KEY);
    return data ? JSON.parse(data) : null;
  }
} 