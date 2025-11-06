'use client';

import { FormEvent, useMemo, useState } from 'react';
import {
  AdjustmentsHorizontalIcon,
  ArrowTopRightOnSquareIcon,
  BoltIcon,
  CommandLineIcon,
  MagnifyingGlassCircleIcon,
  SparklesIcon,
  TvIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { AIPanel, type AiMessage } from '@/components/AIPanel';
import { buildMicroFeatures } from '@/lib/insights';

const searchModes = [
  { id: 'web', label: 'Web', param: '' },
  { id: 'images', label: 'Görseller', param: '&tbm=isch' },
  { id: 'news', label: 'Haberler', param: '&tbm=nws' },
  { id: 'videos', label: 'Videolar', param: '&tbm=vid' },
  { id: 'scholar', label: 'Akademi', param: '&tbm=sch' }
];

const pluginCatalog = [
  {
    id: 'intel-graph',
    title: 'Intel Graph',
    description: 'Kaynaklar arası ilişkileri haritalar, gizli bağlantıları açığa çıkarır.',
    icon: CommandLineIcon
  },
  {
    id: 'pulse-monitor',
    title: 'Trend Nabzı',
    description: 'Sosyal medya ve forumları tarayarak gerçek zamanlı nabız tutar.',
    icon: BoltIcon
  },
  {
    id: 'focus-filter',
    title: 'Odak Filtreleri',
    description: 'Kelimeler, dosya tipi, tarih ve alan bazlı akıllı filtreler.',
    icon: AdjustmentsHorizontalIcon
  }
];

const heroHighlights = [
  'Kullanıcı odaklı sonuç kartları',
  'Derinlemesine kaynak dengeleme',
  'İşbirliğine hazır paylaşım araçları'
];

function buildGoogleUrl(query: string, modeParam: string) {
  const encoded = encodeURIComponent(query.trim());
  return `https://www.google.com/search?q=${encoded}${modeParam}`;
}

export default function Page() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState(searchModes[0]);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    {
      role: 'assistant',
      content:
        'Hoopra AI hazır! Sorgunu paylaş ve kaynak stratejisi, operatör ipuçları ya da hızlı özetlerle cevaplayayım.'
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [activePlugins, setActivePlugins] = useState<string[]>(['intel-graph', 'focus-filter']);

  const microFeatures = useMemo(() => buildMicroFeatures(query), [query]);

  function handleModeSelect(modeId: string) {
    const selected = searchModes.find((item) => item.id === modeId) ?? searchModes[0];
    setMode(selected);
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    const url = buildGoogleUrl(query, mode.param);
    window.open(url, '_blank', 'noopener');
  }

  async function handleAiSend(prompt: string) {
    setAiMessages((prev) => [...prev, { role: 'user', content: prompt }]);
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, query, activePlugins })
      });
      const data = await response.json();
      setAiMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Bağlantı sorunu yaşandı. Yine de sana gelişmiş arama ipuçları sağlamaya devam edeceğim.'
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  }

  function togglePlugin(id: string) {
    setActivePlugins((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-96 w-[70rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-200 via-white to-slate-100 opacity-60 blur-3xl" />
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <header className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-soft">
              H
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Hoopra Search</h1>
              <p className="text-sm text-slate-500">Yeni nesil arama deneyimi — hız, doğruluk ve içgörü tek yerde.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {heroHighlights.map((highlight) => (
              <span key={highlight} className="rounded-full border border-indigo-200 bg-white px-4 py-1 text-xs font-medium uppercase tracking-widest text-indigo-500">
                {highlight}
              </span>
            ))}
            <button
              onClick={() => setAiOpen(true)}
              className="group flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-500"
            >
              <SparklesIcon className="h-5 w-5 transition group-hover:rotate-6" />
              Hoopra AI
            </button>
          </div>
        </header>

        <section className="mb-10 flex flex-col gap-6 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-400">
              <span className="font-medium text-slate-500">omnibox://{mode.id}</span>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="hidden sm:inline">Güvenli / Ultra hızlı</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-soft focus-within:border-indigo-200 focus-within:shadow-lg"
            >
              <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                <MagnifyingGlassCircleIcon className="h-10 w-10 text-indigo-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Hoopra ile dünyayı ara..."
                  className="h-12 flex-1 border-none bg-transparent text-lg outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Hoopra ile Ara
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {searchModes.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleModeSelect(item.id)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      mode.id === item.id
                        ? 'bg-indigo-600 text-white shadow-soft'
                        : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </form>
          </div>

          <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
            <div className="rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400">Akıllı Hızlı Kartlar</p>
                  <h2 className="text-lg font-semibold text-slate-900">Aramanızı hızlandıracak hazır aksiyonlar</h2>
                </div>
                <Link
                  href="https://www.google.com/advanced_search"
                  target="_blank"
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600"
                >
                  Gelişmiş arama
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {microFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-slate-700">{feature}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Hoopra filtreleri ile bu perspektifte sonuç listelerini otomatik daralt.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex h-full flex-col gap-3 rounded-2xl border border-slate-100 bg-white/95 p-5 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Eklenti Merkezi</p>
                  <h3 className="text-base font-semibold text-slate-900">Hoopra modüllerini karıştır</h3>
                </div>
                <TvIcon className="h-6 w-6 text-slate-300" />
              </div>
              <div className="space-y-3">
                {pluginCatalog.map(({ id, title, description, icon: Icon }) => {
                  const active = activePlugins.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => togglePlugin(id)}
                      className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                        active
                          ? 'border-indigo-200 bg-indigo-50/70 shadow-soft'
                          : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/40'
                      }`}
                    >
                      <div className={`mt-1 rounded-full p-2 ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{title}</p>
                        <p className="mt-1 text-xs text-slate-500">{description}</p>
                      </div>
                      <div
                        className={`ml-auto mt-1 h-2 w-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-200'}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-soft backdrop-blur md:grid-cols-2">
          <div className="flex h-full flex-col justify-between gap-5 rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Hoopra Vites</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">
                Sorgunuza göre otomatik odak değişimi
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Hoopra, sorgu bağlamını analiz ederek görsel, haber ya da akademik sonuçlara anında kayar.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {searchModes.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    mode.id === item.id
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                      : 'border-slate-100 bg-white text-slate-600'
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col justify-between gap-5 rounded-2xl border border-slate-100 bg-gradient-to-br from-indigo-600 via-indigo-500 to-slate-900 p-5 text-white shadow-soft">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-200">AI Partner</p>
              <h2 className="mt-2 text-lg font-semibold">Hoopra AI ile güçlen</h2>
              <p className="mt-2 text-sm text-indigo-100">
                Sorgunu optimize et, sonuçları kategorize et ve tek tuşla rapora dönüştür. Sağdaki AI paneli senin strateji masan.
              </p>
            </div>
            <button
              onClick={() => setAiOpen(true)}
              className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Hoopra AI Panelini aç
              <SparklesIcon className="h-5 w-5" />
            </button>
          </div>
        </section>
      </main>

      <AIPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        messages={aiMessages}
        onSend={handleAiSend}
        loading={aiLoading}
        query={query}
      />
    </div>
  );
}
