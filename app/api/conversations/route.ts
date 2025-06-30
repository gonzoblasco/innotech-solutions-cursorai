import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import supabase from '@/lib/supabase';
import type { Database } from '@/types/database';

export async function POST(request: NextRequest) {
  console.log('🚀 API conversations POST called');
  
  try {
    const body = await request.json();
    console.log('📝 Request body:', body);

    // Debug headers
    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');
    console.log('🔑 Auth header:', authHeader ? 'Present' : 'Missing');
    console.log('🍪 Cookie header:', cookieHeader ? 'Present' : 'Missing');

    // Método 1: Route handler client con cookies
    console.log('🔍 Trying route handler client...');
    let user = null;
    try {
      const cookieStore = await cookies();
      const supabaseServer = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
      const { data: { user: serverUser }, error: serverError } = await supabaseServer.auth.getUser();
      
      if (serverError) {
        console.log('❌ Server auth error:', serverError);
      } else {
        console.log('✅ Server user found:', serverUser?.email);
        user = serverUser;
      }
    } catch (serverError) {
      console.log('❌ Server method failed:', serverError);
    }

    // Método 2: Client directo con token
    if (!user && authHeader) {
      console.log('🔍 Trying direct client with auth header...');
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token);
        
        if (tokenError) {
          console.log('❌ Token auth error:', tokenError);
        } else {
          console.log('✅ Token user found:', tokenUser?.email);
          user = tokenUser;
        }
      } catch (tokenError) {
        console.log('❌ Token method failed:', tokenError);
      }
    }

    // Si no hay usuario autenticado
    if (!user) {
      console.log('❌ No user found with any method');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);

    // Verificar/crear perfil si no existe
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      console.log('⚠️ Profile not found, creating...');
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email,
          subscription_tier: 'free',
          api_usage_current: 0,
          api_quota: 1000,
          country: 'Argentina'
        })
        .select()
        .single();

      if (profileError) {
        console.error('❌ Error creating profile:', profileError);
        return NextResponse.json({ error: 'Error creando perfil de usuario' }, { status: 500 });
      }
      profile = newProfile;
      console.log('✅ Profile created');
    }

    // Crear conversación
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        agent_type: body.agentType,
        title: body.title || `Conversación con ${body.agentType}`,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating conversation:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ Conversation created:', data.id);
    return NextResponse.json(data);

  } catch (error) {
    console.error('💥 API Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Conversations API is working' });
}