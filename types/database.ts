export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_tier: 'free' | 'premium' | 'enterprise';
  api_usage_current: number;
  api_quota: number;
  country: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
    };
  };
} 

export interface Conversation {
  id: string;
  user_id: string;
  agent_type: 'business' | 'finance' | 'health' | 'education' | 'personal';
  title: string | null;
  model_type: string;
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  token_count: number;
  cost: number;
  model_used: string | null;
  processing_time_ms: number | null;
  created_at: string;
}

export interface AIUsage {
  id: string;
  user_id: string;
  conversation_id: string | null;
  model_type: string;
  tokens_used: number;
  cost: number;
  response_time_ms: number | null;
  created_at: string;
}