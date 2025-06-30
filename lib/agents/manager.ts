import { Agent, Message, AgentType } from './types';
import { AgentRouter } from './router';
import { ConversationContext } from './context';

export class AgentManager {
  private agents: Agent[];
  private context: ConversationContext;
  private router: AgentRouter;

  constructor(agents: Agent[], conversation: any) {
    this.agents = agents;
    this.context = new ConversationContext(conversation);
    this.router = new AgentRouter(agents, this.context);
  }

  async processMessage(message: Message, currentAgent: AgentType) {
    this.context.addMessage(message);
    const routing = await this.router.classifyAndRoute(message.content, currentAgent);
    if (routing.agentType !== currentAgent && routing.confidence > 0.8) {
      const fromAgent = this.agents.find(a => a.type === currentAgent)!;
      const toAgent = this.agents.find(a => a.type === routing.agentType)!;
      this.router.handleHandoff(fromAgent, toAgent, routing.reason || 'Cambio de intención');
      this.context.switchAgent(toAgent.id);
      return { handoff: true, toAgent, routing };
    }
    return { handoff: false, routing };
  }

  async determineAgent(message: string) {
    return this.router.classifyAndRoute(message, this.context.conversation.agentId as AgentType);
  }

  executeHandoff(fromAgent: Agent, toAgent: Agent, reason: string) {
    this.router.handleHandoff(fromAgent, toAgent, reason);
    this.context.switchAgent(toAgent.id);
  }

  getAgentCapabilities(agentId: string) {
    const agent = this.agents.find(a => a.id === agentId);
    return agent?.capabilities || [];
  }
} 