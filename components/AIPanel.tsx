'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export type AiMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type AIPanelProps = {
  open: boolean;
  onClose: () => void;
  messages: AiMessage[];
  onSend: (prompt: string) => Promise<void>;
  loading: boolean;
  query: string;
};

export function AIPanel({ open, onClose, messages, onSend, loading, query }: AIPanelProps) {
  const [prompt, setPrompt] = useState('');
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [open, messages]);

  useEffect(() => {
    if (!open) {
      setPrompt('');
    }
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prompt.trim() || loading) return;
    const nextPrompt = prompt.trim();
    setPrompt('');
    await onSend(nextPrompt);
  }

  return (
    <aside
      className={clsx(
        'fixed top-0 right-0 z-30 h-full w-full max-w-xl bg-white shadow-2xl transition-transform duration-300 ease-out sm:w-[420px] sm:rounded-l-3xl sm:border-l sm:border-slate-200',
        open ? 'translate-x-0' : 'pointer-events-none translate-x-full'
      )}
    >
      <div className="flex h-full flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 pb-3 pt-5">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Hoopra AI</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Sorgunuza Akıllı Rehber</h2>
            <p className="mt-1 text-sm text-slate-500">
              {query ? `"${query}" sorgusunu analiz ediyoruz.` : 'İpucu: Sorgunuzu yazın ve Hoopra AI öneriler sağlasın.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="AI panelini kapat"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </header>

        <div ref={viewportRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={clsx(
                'flex gap-3',
                message.role === 'assistant' ? 'justify-start' : 'justify-end'
              )}
            >
              {message.role === 'assistant' && (
                <div className="grid h-10 w-10 place-content-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-sm font-semibold text-white shadow-soft">
                  AI
                </div>
              )}
              <div
                className={clsx(
                  'max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm',
                  message.role === 'assistant'
                    ? 'bg-slate-50 text-slate-800'
                    : 'bg-indigo-600 text-white'
                )}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
              </div>
              {message.role === 'user' && (
                <div className="grid h-10 w-10 place-content-center rounded-full border border-slate-200 text-xs font-medium text-slate-500">
                  Siz
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="grid h-10 w-10 place-content-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-sm font-semibold text-white shadow-soft">
                AI
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
                Hoopra AI yanıt hazırlıyor...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-slate-100 p-4">
          <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm focus-within:border-indigo-400 focus-within:shadow-md">
            <textarea
              rows={2}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Aradığın şey hakkında daha fazla anlat..."
              className="flex-1 resize-none border-none bg-transparent text-sm text-slate-800 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Gönder
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Hoopra AI, sorguna göre taktikler, hızlı özetler ve akıllı bağlantılar sunar.
          </p>
        </form>
      </div>
    </aside>
  );
}
