export type AgentType = 'business' | 'finance' | 'health' | 'education' | 'personal';

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  capabilities: string[];
  planRequired: 'free' | 'premium' | 'enterprise';
  available: boolean;
  rating?: number;
  category?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status: 'sending' | 'delivered' | 'error';
}

export interface Conversation {
  id: string;
  agentId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutingResult {
  agentType: AgentType;
  confidence: number;
  reason: string;
}

export interface Handoff {
  fromAgent: string;
  toAgent: string;
  reason: string;
  timestamp: Date;
}