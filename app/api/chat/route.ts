import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { generateResponse } from '@/lib/gemini/client';
import { AGENT_PROMPTS } from '@/lib/agents/prompts';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, agentType } = await request.json();
    
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que la conversación pertenece al usuario
    const { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single();

    if (!conversation) {
      return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
    }

    // Guardar mensaje del usuario
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: message
    });

    // Obtener contexto (últimos 10 mensajes)
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Construir prompt con contexto
    const systemPrompt = AGENT_PROMPTS[agentType as keyof typeof AGENT_PROMPTS] || AGENT_PROMPTS.personal;
    const context = messages?.reverse().map(m => `${m.role}: ${m.content}`).join('\n') || '';
    const fullPrompt = `${systemPrompt}\n\nContexto de la conversación:\n${context}\n\nUsuario: ${message}\n\nAsistente:`;

    // Generar respuesta con Gemini
    const aiResponse = await generateResponse(fullPrompt, 'gemini-2.5-flash');

    // Guardar respuesta de la IA
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: aiResponse
    });

    // Actualizar timestamp de conversación
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Error en chat API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}