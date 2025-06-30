import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const { agentType, title } = await request.json();
    
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    console.log('User in API:', user); // Debug log
    
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        agent_type: agentType,
        title: title || `Conversación con ${agentType}`,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    }, { status: 500 });
  }
}