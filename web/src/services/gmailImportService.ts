/**
 * Serviço de Importação e Análise de E-mails do Gmail para Ambiente de Teste
 * Permite colar textos de notificações recebidas de tribunais, diários e intimações
 * ou carregar exemplos reais com 1 clique para alimentar o painel do advogado.
 */

import { CaseNotification, ExtractedLegalData, IntimationType } from '../types';
import { calculateBusinessDays } from './cnaOabService';

export interface GmailExampleTemplate {
  title: string;
  tribunal: string;
  sender: string;
  subject: string;
  body: string;
}

export const GMAIL_TEST_EXAMPLES: GmailExampleTemplate[] = [
  {
    title: 'TJSP — Réplica à Contestação (15 dias úteis)',
    tribunal: 'TJSP - 14ª Vara Cível Central',
    sender: 'intimacao.eletronica@tjsp.jus.br',
    subject: 'Intimação Eletrônica - Processo 1024890-44.2026.8.26.0100 - TJSP',
    body: `PODER JUDICIÁRIO DO ESTADO DE SÃO PAULO
COMARCA DE SÃO PAULO - FORO CENTRAL CÍVEL
14ª VARA CÍVEL - JUIZ DE DIREITO: DR. MARCOS A. FERREIRA

Processo Digital nº: 1024890-44.2026.8.26.0100
Classe - Assunto: Procedimento Comum Cível - Rescisão Contratual e Reparação de Danos
Requerente: ALUMAXIS ESQUADRIAS E ENGENHARIA LTDA
Requerido: CONSTRUTORA HORIZONTE S/A
Advogado(a): CARLOS EDUARDO COSTA (OAB/SP 345.891)

ATO ORDINATÓRIO / INTIMAÇÃO ELETRÔNICA:
Certifico e dou fé que a contestação foi juntada tempestivamente aos autos pela requerida, acompanhada de novos documentos.
Fica a parte autora intimada para, no prazo legal de 15 (quinze) dias úteis (CPC, art. 350 e 351), apresentar Réplica à Contestação, manifestando-se expressamente sobre as preliminares arguidas e eventuais provas que pretenda produzir em audiência de instrução.

São Paulo, 24 de outubro de 2026.`
  },
  {
    title: 'TRT-2 — Laudo Pericial Trabalhista (10 dias úteis)',
    tribunal: 'TRT-2 - 32ª Vara do Trabalho de São Paulo',
    sender: 'notificacao.pje@trt2.jus.br',
    subject: 'Notificação PJe - Processo 0010532-18.2026.5.02.0032',
    body: `JUSTIÇA DO TRABALHO - TRIBUNAL REGIONAL DO TRABALHO DA 2ª REGIÃO
32ª VARA DO TRABALHO DE SÃO PAULO - SP

PROCESSO Nº: 0010532-18.2026.5.02.0032
RECLAMANTE: ROBERTO MENDONÇA SANTOS
RECLAMADA: EXPRESS LOGÍSTICA E DISTRIBUIÇÃO S/A
Advogado do Reclamante: CARLOS EDUARDO COSTA (OAB/SP 345.891)

DESPACHO / INTIMAÇÃO:
Tendo em vista a juntada do laudo técnico pericial de insalubridade e periculosidade aos autos pelo perito judicial nomeado, intimem-se as partes para ciência e manifestação no prazo comum de 10 (dez) dias úteis, oportunidade em que poderão apresentar parecer técnico de seus assistentes ou quesitos suplementares elucidativos.
Preclusa a faculdade, venham os autos conclusos para saneamento ou julgamento.

São Paulo, 24 de outubro de 2026.`
  },
  {
    title: 'DJE Federal — Decisão de Tutela de Urgência (5 dias)',
    tribunal: 'TRF-3 - 6ª Vara Federal Cível de SP',
    sender: 'dje.publicacoes@trf3.jus.br',
    subject: 'Publicação Oficial TRF3 - Agravo / Tutela 5002194-88.2026.4.03.6100',
    body: `TRIBUNAL REGIONAL FEDERAL DA 3ª REGIÃO
SEÇÃO JUDICIÁRIA DE SÃO PAULO - 6ª VARA CÍVEL FEDERAL

Processo: 5002194-88.2026.4.03.6100
Autor: CARLOS EDUARDO COSTA ADVOCACIA
Réu: DELEGADO DA RECEITA FEDERAL DO BRASIL EM SÃO PAULO

DECISÃO INTERLOCUTÓRIA:
Vistos. Trata-se de mandado de segurança com pedido de tutela de urgência.
Defiro parcialmente a liminar para determinar à autoridade coatora que se abstenha de aplicar a penalidade até decisão colegiada.
Intime-se a impetrante para, no prazo de 5 (cinco) dias, recolher as custas remanescentes sob pena de cassação da medida de urgência deferida.
Notifique-se a autoridade coatora para prestar informações no decêndio legal.

Publique-se e cumpra-se com urgência.`
  }
];

/**
 * Parser inteligente de texto de e-mail do Gmail
 */
export function parseRawGmailEmail(rawSubject: string, rawBody: string, defaultOab = '345.891/SP'): ExtractedLegalData {
  const fullText = `${rawSubject}\n${rawBody}`;
  const lower = fullText.toLowerCase();

  // 1. Número CNJ
  const cnjRegex = /\b\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}\b/;
  const cnjMatch = fullText.match(cnjRegex);
  const cnjNumber = cnjMatch ? cnjMatch[0] : '';

  // 2. Tribunal
  let court = 'Tribunal de Justiça';
  if (lower.includes('trt-2') || lower.includes('trt da 2ª região') || lower.includes('trabalho')) {
    court = 'TRT-2 - Vara do Trabalho de São Paulo';
  } else if (lower.includes('trf-3') || lower.includes('trf3') || lower.includes('federal')) {
    court = 'TRF-3 - Vara Federal de São Paulo';
  } else if (lower.includes('tjsp') || lower.includes('foro central cível') || lower.includes('vara cível')) {
    const varaMatch = fullText.match(/(\d+ª\s+Vara\s+Cível[^\n]*)/i);
    court = varaMatch ? `TJSP - ${varaMatch[1].trim()}` : 'TJSP - Foro Central Cível';
  } else if (lower.includes('stj') || lower.includes('superior tribunal')) {
    court = 'Superior Tribunal de Justiça (STJ)';
  }

  // 3. OAB
  const oabRegex = /oab(?:\/[a-z]{2})?\s*[:.]?\s*(\d+[\d.]*)/i;
  const oabMatch = fullText.match(oabRegex);
  const lawyerOAB = oabMatch ? `OAB ${oabMatch[1]}` : defaultOab;

  // 4. Tipo de Intimação
  let intimationType: IntimationType = 'DESPACHO';
  if (lower.includes('sentença') || lower.includes('julgo procedente') || lower.includes('julgo improcedente')) {
    intimationType = 'SENTENÇA';
  } else if (lower.includes('decisão') || lower.includes('tutela de urgência') || lower.includes('liminar')) {
    intimationType = 'DECISÃO INTERLOCUTÓRIA';
  } else if (lower.includes('audiência') || lower.includes('designada audiência')) {
    intimationType = 'AUDIÊNCIA';
  } else if (lower.includes('acórdão')) {
    intimationType = 'ACÓRDÃO';
  } else if (lower.includes('citação') || lower.includes('intimação para contestar')) {
    intimationType = 'CITAÇÃO / INTIMAÇÃO';
  }

  // 5. Prazos em dias
  let suggestedDeadlineDays = 15;
  const deadlineMatch = lower.match(/prazo\s+(?:legal\s+)?(?:de\s+)?(\d+)\s*(?:\([a-z\s]+\))?\s*dias/i) ||
                        lower.match(/no\s+prazo\s+de\s+(\d+)\s*dias/i);
  if (deadlineMatch && deadlineMatch[1]) {
    const d = parseInt(deadlineMatch[1], 10);
    if (!isNaN(d) && d > 0 && d <= 60) {
      suggestedDeadlineDays = d;
    }
  }

  // 6. Fatalidade
  const isFatalDeadline = lower.includes('sob pena') || 
                          lower.includes('preclus') || 
                          lower.includes('revelia') ||
                          lower.includes('cassação') ||
                          lower.includes('cancelamento');

  // 7. Data limite em dias úteis
  const estimatedFatalDate = calculateBusinessDays(new Date(), suggestedDeadlineDays);

  // 8. Resumo
  const summary = `Notificação judicial recebida via e-mail informando ato de ${intimationType} referente ao processo ${cnjNumber || 'em trâmite'}. Fixado prazo de ${suggestedDeadlineDays} dias úteis para manifestação${isFatalDeadline ? ', sob pena de preclusão ou penalidade processual' : ''}.`;

  // 9. Pontos Chaves
  const keyPoints = [
    `Número do Processo: ${cnjNumber || 'Não identificado no texto'}`,
    `Vara / Foro: ${court}`,
    `Prazo: ${suggestedDeadlineDays} dias úteis (Limite estimado: ${estimatedFatalDate})`,
    isFatalDeadline ? '⚠️ Prazo com risco de fatalidade/preclusão' : 'Prazo ordinário de expediente'
  ];

  // 10. Ação Recomendada
  let recommendedAction = 'Analisar e peticionar no processo.';
  if (lower.includes('réplica')) {
    recommendedAction = 'Apresentar Réplica à Contestação rebatendo as preliminares e mérito.';
  } else if (lower.includes('laudo') || lower.includes('pericial')) {
    recommendedAction = 'Manifestar sobre o Laudo Pericial com parecer do assistente técnico.';
  } else if (lower.includes('custas')) {
    recommendedAction = 'Efetuar o recolhimento das custas processuais pendentes.';
  } else if (lower.includes('tutela') || lower.includes('liminar')) {
    recommendedAction = 'Cumprir as determinações urgentes da decisão interlocutória.';
  }

  return {
    cnjNumber: cnjNumber || '0000000-00.0000.0.00.0000',
    court,
    lawyerOAB,
    intimationType,
    suggestedDeadlineDays,
    isFatalDeadline,
    estimatedFatalDate,
    summary,
    keyPoints,
    recommendedAction
  };
}

/**
 * Cria objeto CaseNotification para salvar no Firestore a partir do e-mail do Gmail
 */
export function buildNotificationFromGmail(
  subject: string,
  sender: string,
  body: string,
  tenantId: string,
  lawyerName?: string,
  lawyerOab?: string
): CaseNotification {
  const extractedData = parseRawGmailEmail(subject, body, lawyerOab);

  return {
    id: `gmail_${Date.now()}`,
    tenantId,
    rawSubject: subject || 'Notificação Processual via Gmail',
    rawSender: sender || 'tribunal@jus.br',
    rawBody: body,
    receivedAt: new Date().toISOString(),
    extractedData,
    status: 'PENDING_REVIEW',
    assignedLawyerName: lawyerName || 'Advogado Responsável'
  };
}
