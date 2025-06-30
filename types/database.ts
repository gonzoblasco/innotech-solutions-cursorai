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