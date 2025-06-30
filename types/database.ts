export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          subscription_tier: 'free' | 'premium' | 'enterprise';
          api_usage_current: number;
          api_quota: number;
          country: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>;
        Update: Partial<Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>>;
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          agent_type: string;
          title: string | null;
          status: 'active' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'>>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>>;
      };
    };
  };
}

// Exportar tipos individuales
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];