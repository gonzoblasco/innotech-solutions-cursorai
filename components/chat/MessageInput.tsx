'use client';
import React, { useRef, useState } from 'react';
import { Send, Loader2, Paperclip } from 'lucide-react';

export default function MessageInput({
  value,
  onChange,
  onSend,
  loading,
  placeholder,
  typing,
  charLimit = 2000
}:{
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  loading: boolean;
  placeholder: string;
  typing?: boolean;
  charLimit?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Auto-expand
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  // Drag & drop (solo UI)
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(e.type === 'dragenter');
  };

  return (
    <div className={`w-full p-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex flex-col ${dragActive ? 'ring-2 ring-primary' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setDragActive(false); }}>
      <div className="flex items-end gap-2">
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" title="Adjuntar archivo" type="button"><Paperclip className="w-5 h-5" /></button>
        <textarea
          ref={textareaRef}
          rows={1}
          maxLength={charLimit}
          value={value}
          onChange={handleInput}
          placeholder={placeholder}
          className="flex-1 resize-none rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition min-h-[40px] max-h-[120px]"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        />
        <button
          className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition disabled:opacity-50"
          onClick={onSend}
          disabled={loading || !value.trim()}
          type="button"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>
      <div className="flex items-center justify-between mt-1 px-2 text-xs text-gray-400">
        <span>{value.length}/{charLimit}</span>
        {typing && <span className="text-primary animate-pulse">El agente está escribiendo...</span>}
      </div>
      {dragActive && <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center text-primary font-bold text-sm pointer-events-none">Suelta el archivo aquí (solo UI)</div>}
    </div>
  );
} 