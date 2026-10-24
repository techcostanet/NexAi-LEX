/**
 * Serviço Oficial de Integração OAB / Diário de Justiça Eletrônico Nacional (DJEN / CNJ)
 * Consulta a API Pública do Conselho Nacional de Justiça (comunicaapi.pje.jus.br)
 * Não requer tokens ou credenciais privadas — 100% oficial e em conformidade com o CNJ.
 */

import { CaseNotification, ExtractedLegalData, IntimationType } from '../types';

export interface DjenCommunicationItem {
  id: number;
  data_disponibilizacao: string;
  siglaTribunal: string;
  tipoComunicacao: string;
  nomeOrgao: string;
  idOrgao?: number;
  texto: string;
  numero_processo: string;
  numeroprocessocommascara: string;
  link?: string;
  tipoDocumento?: string;
  nomeClasse?: string;
  destinatarios?: Array<{ nome: string; polo?: string }>;
  destinatarioadvogados?: Array<{
    advogado?: {
      nome: string;
      numero_oab: string;
      uf_oab: string;
    };
  }>;
}

export interface DjenApiResponse {
  status: string;
  message: string;
  count: number;
  items: DjenCommunicationItem[];
}

/**
 * Converte HTML bruto de diário em texto legível formatado
 */
export function stripHtmlToText(html: string): string {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html.replace(/<style[^>]*>.*?<\/style>/gi, '')
                     .replace(/<script[^>]*>.*?<\/script>/gi, '');
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

/**
 * Calcula a data limite em dias úteis a partir da data base
 */
export function calculateBusinessDays(startDate: Date, days: number): string {
  const current = new Date(startDate);
  let added = 0;
  while (added < days) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Pula sábado e domingo
      added++;
    }
  }
  return current.toISOString().split('T')[0];
}

/**
 * Analisador Jurídico Heurístico para publicações do DJEN
 */
export function parseDjenTextToLegalData(item: DjenCommunicationItem): ExtractedLegalData {
  const plainText = stripHtmlToText(item.texto);
  const lower = plainText.toLowerCase();

  // 1. Número CNJ
  const cnj = item.numeroprocessocommascara || item.numero_processo || '';

  // 2. Tribunal e Vara
  const court = `${item.siglaTribunal || 'Tribunal'} - ${item.nomeOrgao || 'Vara'}`;

  // 3. Advogado citado
  const adv = item.destinatarioadvogados?.[0]?.advogado;
  const lawyerOAB = adv ? `OAB/${adv.uf_oab} ${adv.numero_oab}` : 'OAB do Escritório';

  // 4. Classificação do ato
  let intimationType: IntimationType = 'DESPACHO';
  if (lower.includes('sentença') || lower.includes('julgo procedente') || lower.includes('julgo improcedente')) {
    intimationType = 'SENTENÇA';
  } else if (lower.includes('decisão') || lower.includes('tutela de urgência') || lower.includes('liminar')) {
    intimationType = 'DECISÃO INTERLOCUTÓRIA';
  } else if (lower.includes('audiência') || lower.includes('designada audiência')) {
    intimationType = 'AUDIÊNCIA';
  } else if (lower.includes('acórdão') || lower.includes('acordam os desembargadores')) {
    intimationType = 'ACÓRDÃO';
  } else if (lower.includes('citação') || lower.includes('intimação para contestar')) {
    intimationType = 'CITAÇÃO / INTIMAÇÃO';
  }

  // 5. Extração de Prazos
  let suggestedDeadlineDays = 15;
  const deadlineMatch = lower.match(/prazo\s+de\s+(\d+)\s*(?:\([a-z\s]+\))?\s*dias/i) ||
                        lower.match(/no\s+prazo\s+de\s+(\d+)\s*dias/i) ||
                        lower.match(/(\d+)\s*(?:\([a-z\s]+\))?\s*dias/i);
  if (deadlineMatch && deadlineMatch[1]) {
    const parsed = parseInt(deadlineMatch[1], 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 60) {
      suggestedDeadlineDays = parsed;
    }
  }

  // 6. Risco de Fatalidade
  const isFatalDeadline = lower.includes('sob pena') || 
                          lower.includes('revelia') || 
                          lower.includes('preclusão') || 
                          lower.includes('cancelamento da distribuição') ||
                          lower.includes('extinção') ||
                          lower.includes('penhora');

  // 7. Data estimada
  const estimatedFatalDate = calculateBusinessDays(new Date(), suggestedDeadlineDays);

  // 8. Resumo e Pontos Chaves
  const partes = item.destinatarios?.map(d => d.nome).join(' e ') || 'Partes do processo';
  const resumo = `Publicação oficial no ${item.siglaTribunal} (${item.nomeOrgao}) referente ao processo envolvendo ${partes}. O ato determina providências com prazo fixado de ${suggestedDeadlineDays} dias úteis${isFatalDeadline ? ', sob cominação legal de preclusão ou penalidade' : ''}.`;

  const keyPoints = [
    `Processo CNJ: ${cnj}`,
    `Tribunal / Vara: ${court}`,
    `Prazo assinalado: ${suggestedDeadlineDays} dias úteis (Limite estimado: ${estimatedFatalDate})`,
    isFatalDeadline ? '⚠️ Prazo com risco de fatalidade/preclusão' : 'Prazo ordinário de expediente'
  ];

  // 9. Ação recomendada
  let recommendedAction = 'Analisar publicação e adotar providências cabíveis.';
  if (lower.includes('custas') || lower.includes('recolhimento')) {
    recommendedAction = 'Providenciar o recolhimento das custas processuais ou emitir guia DARE/GRU.';
  } else if (lower.includes('emenda à inicial') || lower.includes('emendar a petição')) {
    recommendedAction = 'Elaborar petição de emenda à inicial sanando os apontamentos.';
  } else if (lower.includes('réplica') || lower.includes('manifestar sobre a contestação')) {
    recommendedAction = 'Apresentar réplica à contestação rebatendo as preliminares e mérito.';
  } else if (lower.includes('contrarrazões') || lower.includes('recurso')) {
    recommendedAction = 'Interpor recurso competente ou protocolar contrarrazões recursais.';
  }

  return {
    cnjNumber: cnj,
    court,
    lawyerOAB,
    intimationType,
    suggestedDeadlineDays,
    isFatalDeadline,
    estimatedFatalDate,
    summary: resumo,
    keyPoints,
    recommendedAction
  };
}

/**
 * Consulta comunicações oficiais por OAB e UF na API do DJEN / CNJ
 */
export async function fetchOabDjenCommunications(
  oabInput: string,
  ufInput: string,
  itensPorPagina = 10,
  pagina = 1
): Promise<DjenCommunicationItem[]> {
  const cleanNumber = oabInput.replace(/\D/g, '');
  const cleanUf = (ufInput || 'SP').toUpperCase().trim();

  if (!cleanNumber) {
    throw new Error('Informe o número da OAB para consulta.');
  }

  const endpoint = `https://comunicaapi.pje.jus.br/api/v1/comunicacao?numeroOab=${cleanNumber}&ufOab=${cleanUf}&itensPorPagina=${itensPorPagina}&pagina=${pagina}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Falha na API pública do CNJ/DJEN: Status ${response.status}`);
  }

  const data = await response.json() as DjenApiResponse;
  return data.items || [];
}

/**
 * Converte um item do DJEN em CaseNotification oficial do NexAi-LEX
 */
export function convertDjenToNotification(
  item: DjenCommunicationItem,
  tenantId: string,
  lawyerName?: string
): CaseNotification {
  const extractedData = parseDjenTextToLegalData(item);
  const plainText = stripHtmlToText(item.texto);

  return {
    id: `djen_${item.id}_${Date.now()}`,
    tenantId,
    rawSubject: `Publicação DJEN — ${item.siglaTribunal} (${item.numeroprocessocommascara || item.numero_processo})`,
    rawSender: `CNJ / DJEN — ${item.siglaTribunal}`,
    rawBody: plainText || item.texto,
    receivedAt: item.data_disponibilizacao ? `${item.data_disponibilizacao}T08:00:00Z` : new Date().toISOString(),
    extractedData,
    status: 'PENDING_REVIEW',
    assignedLawyerName: lawyerName || item.destinatarioadvogados?.[0]?.advogado?.nome || 'Advogado Titular'
  };
}
