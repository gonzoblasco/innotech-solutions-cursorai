'use client';
import React from 'react';
import { Copy, ThumbsUp, ThumbsDown, Loader2, AlertCircle, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import es from 'date-fns/locale/es';

function renderMarkdown(text: string) {
  // Soporte markdown muy básico: **negrita**, *cursiva*, `código`
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

export default function MessageBubble({ message, agentAvatar }:{ message: any, agentAvatar?: string }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex w-full mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <img src={agentAvatar || '/default-agent.png'} alt="Agente" className="w-8 h-8 rounded-full mr-2 self-end" />
      )}
      <div className={`relative max-w-[80%] px-4 py-2 rounded-2xl shadow transition-all animate-fade-in ${isUser ? 'bg-primary text-white rounded-br-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md'}`}>
        <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
          <span>{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true, locale: es })}</span>
          {message.status === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
          {message.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
          {/* Acciones */}
          <button className="ml-2 hover:text-primary" title="Copiar"><Copy className="w-4 h-4" /></button>
          {!isUser && <><button className="hover:text-green-500" title="Me gusta"><ThumbsUp className="w-4 h-4" /></button><button className="hover:text-red-500" title="No me gusta"><ThumbsDown className="w-4 h-4" /></button></>}
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full ml-2 bg-primary text-white flex items-center justify-center font-bold"><User className="w-5 h-5" /></div>
      )}
    </div>
  );
} 