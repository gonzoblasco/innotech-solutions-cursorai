import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export class ChatService {
  async sendMessage(conversationId: string, message: string, agentType: string) {
    const { data, error } = await supabase.rpc('process_ai_message', {
      conversation_id: conversationId,
      message,
      agent_type: agentType
    });
    if (error) throw error;
    return data;
  }

  async createConversation(agentType: string, title?: string) {
    const { data, error } = await supabase.from('conversations').insert({ agent_type: agentType, title }).select().single();
    if (error) throw error;
    return data;
  }

  async getConversations(userId: string) {
    const { data, error } = await supabase.from('conversations').select('*').eq('user_id', userId).order('last_updated', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getMessages(conversationId: string) {
    const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('timestamp', { ascending: true });
    if (error) throw error;
    return data;
  }

  async updateUsageStats(userId: string, tokensUsed: number, cost: number) {
    const { error } = await supabase.from('usage_stats').upsert({ user_id: userId, tokens_used: tokensUsed, cost }, { onConflict: 'user_id' });
    if (error) throw error;
    return true;
  }
} 