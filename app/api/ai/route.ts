import { NextResponse } from 'next/server';
import { buildInsightPrompts } from '@/lib/insights';

type Payload = {
  prompt?: string;
  query?: string;
  activePlugins?: string[];
};

const strategyBlueprints = [
  {
    id: 'insight-map',
    title: 'Kaynak Haritası',
    detail:
      'Akademik yayınlar, uzman blogları ve topluluk içeriklerini üç sütunda gruplayın. Güvenilirlik puanı verip özetleyin.'
  },
  {
    id: 'signal-noise',
    title: 'Sinyal / Gürültü Analizi',
    detail:
      'Sorguyla ilgili en sık tekrar eden kavramları çıkarın. Her kavram için güvenilir kaynak ve hızlı özet eşleştirin.'
  },
  {
    id: 'action-steps',
    title: 'Hareket Planı',
    detail:
      'Kısa vadeli (bugün), orta vadeli (1 hafta) ve uzun vadeli (1 ay) araştırma adımlarını listeleyin.'
  }
];

function craftAssistantMessage(prompt: string | undefined, query: string | undefined) {
  const baseQuery = query?.trim() || prompt?.trim() || 'arama hedefi';
  const insights = buildInsightPrompts(baseQuery).map((item) => `• ${item}`).join('\n');
  const blueprint = strategyBlueprints[Math.floor(Math.random() * strategyBlueprints.length)];

  return `🔍 **Hoopra Derin Arama İçgörüleri**\n\n` +
    `Başlık: ${baseQuery}\n\n` +
    `1. Hedefi netleştir:\n${insights}\n\n` +
    `2. Strateji şablonu: ${blueprint.title}\n${blueprint.detail}\n\n` +
    `3. Arama operatörleri:\n• "${baseQuery}" site:.edu — Akademik kaynakları öne çıkar\n` +
    `• ${baseQuery} filetype:pdf — Rapor ve sunumları bul\n` +
    `• ${baseQuery} intitle:2024 — Güncel trendleri yakala`; 
}

export async function POST(request: Request) {
  const data = (await request.json()) as Payload;
  const response = craftAssistantMessage(data.prompt, data.query);

  return NextResponse.json({
    message: response,
    plugins: data.activePlugins ?? []
  });
}
