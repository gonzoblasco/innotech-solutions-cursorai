import { classifyIntent } from '../gemini/client';
import { AGENT_PROMPTS } from './prompts';
import { ConversationContext } from './context';
import { Agent, AgentType, Message, RoutingResult, Handoff } from './types';

export class AgentRouter {
  private agents: Agent[];
  private context: ConversationContext;
  private analytics: Handoff[] = [];

  constructor(agents: Agent[], context: ConversationContext) {
    this.agents = agents;
    this.context = context;
  }

  async classifyAndRoute(message: string, currentAgent: AgentType): Promise<RoutingResult> {
    const intent = await classifyIntent(message);
    let confidence = 0.9; // Mock: confianza alta si coincide
    if (intent === currentAgent) confidence = 0.99;
    return { agentType: intent, confidence, reason: `Clasificado como ${intent}` };
  }

  selectAgent(agentType: AgentType): Agent {
    return this.agents.find(a => a.type === agentType) || this.agents[0];
  }

  handleHandoff(fromAgent: Agent, toAgent: Agent, reason: string) {
    const handoff: Handoff = {
      fromAgent: fromAgent.id,
      toAgent: toAgent.id,
      reason,
      timestamp: new Date()
    };
    this.analytics.push(handoff);
  }

  getAnalytics() {
    return this.analytics;
  }

  getContext() {
    return this.context.getContext();
  }
} 