import { Tenant, UserProfile, LegalCase, CaseNotification, DeadlineEvent } from './types';

export const mockSoloTenant: Tenant = {
  id: 'tenant_solo',
  name: 'Carlos Renato Advocacia',
  slug: 'carlos-renato',
  inboundEmail: 'carlos-renato@inbox.nexai.com.br',
  plan: 'solo',
  maxUsers: 1,
  activeProcessesCount: 68,
  monthlyNotificationsCount: 24,
  createdAt: '2024-01-15'
};

export const mockOfficeTenant: Tenant = {
  id: 'tenant_office',
  name: 'Silva & Oliveira Advogados Associados',
  slug: 'silva-oliveira',
  inboundEmail: 'silva-oliveira@inbox.nexai.com.br',
  plan: 'office',
  maxUsers: 4,
  activeProcessesCount: 312,
  monthlyNotificationsCount: 148,
  createdAt: '2023-08-10'
};

export const mockLawyers: UserProfile[] = [
  {
    id: 'user_1',
    tenantId: 'tenant_office',
    name: 'Dr. Carlos Renato Silva',
    email: 'carlos@silvaoliveira.adv.br',
    oabNumber: '123456/SP',
    role: 'ADMIN',
    googleCalendarLinked: true,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_2',
    tenantId: 'tenant_office',
    name: 'Dra. Mariana Souza',
    email: 'mariana@silvaoliveira.adv.br',
    oabNumber: '234567/SP',
    role: 'LAWYER',
    googleCalendarLinked: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_3',
    tenantId: 'tenant_office',
    name: 'Dr. Roberto Lima',
    email: 'roberto@silvaoliveira.adv.br',
    oabNumber: '345678/SP',
    role: 'LAWYER',
    googleCalendarLinked: false,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_4',
    tenantId: 'tenant_office',
    name: 'Beatriz Santos',
    email: 'beatriz@silvaoliveira.adv.br',
    oabNumber: '',
    role: 'ASSISTANT',
    googleCalendarLinked: false,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80'
  }
];

export const mockCases: LegalCase[] = [
  {
    id: 'case_1',
    tenantId: 'tenant_office',
    cnjNumber: '1004523-89.2024.8.26.0100',
    court: 'TJSP - 28ª Vara Cível Central da Capital',
    clientName: 'Construtora Horizonte Empreendimentos S.A.',
    caseArea: 'CÍVEL',
    responsibleLawyerId: 'user_1',
    responsibleLawyerName: 'Dr. Carlos Renato Silva',
    responsibleOAB: '123456/SP',
    status: 'ACTIVE',
    lastUpdateDate: '2026-10-18',
    eventsCount: 14
  },
  {
    id: 'case_2',
    tenantId: 'tenant_office',
    cnjNumber: '0010892-45.2024.5.02.0012',
    court: 'TRT-2 - 12ª Vara do Trabalho de São Paulo',
    clientName: 'Marcos Vinicius de Albuquerque',
    caseArea: 'TRABALHISTA',
    responsibleLawyerId: 'user_2',
    responsibleLawyerName: 'Dra. Mariana Souza',
    responsibleOAB: '234567/SP',
    status: 'ACTIVE',
    lastUpdateDate: '2026-10-17',
    eventsCount: 9
  },
  {
    id: 'case_3',
    tenantId: 'tenant_office',
    cnjNumber: '5003412-18.2024.4.03.6100',
    court: 'TRF-3 - 7ª Vara Federal Tributária',
    clientName: 'Nexus Tech Logística & Distribuição Ltda.',
    caseArea: 'TRIBUTÁRIO',
    responsibleLawyerId: 'user_3',
    responsibleLawyerName: 'Dr. Roberto Lima',
    responsibleOAB: '345678/SP',
    status: 'ACTIVE',
    lastUpdateDate: '2026-10-15',
    eventsCount: 22
  }
];

export const initialNotifications: CaseNotification[] = [
  {
    id: 'notif_1',
    tenantId: 'tenant_office',
    caseId: 'case_1',
    rawSubject: 'DJE TJSP - Publicação de Despacho com Prazo - Proc. 1004523-89.2024.8.26.0100',
    rawSender: 'comunicacao@tjsp.jus.br',
    rawBody: `PODER JUDICIÁRIO DO ESTADO DE SÃO PAULO
COMARCA DE SÃO PAULO - FORO CENTRAL CÍVEL - 28ª VARA CÍVEL
Processo Digital nº: 1004523-89.2024.8.26.0100
Classe - Assunto: Procedimento Comum Cível - Rescisão do contrato e devolução do dinheiro
Requerente: Pedro Paulo Silveira
Requerido: Construtora Horizonte Empreendimentos S.A.
Advogado(a): CARLOS RENATO SILVA - OAB/SP 123456

DESPACHO: Vistos. Manifeste-se a parte requerida em réplica à contestação e documentos juntados às fls. 180/240, no prazo legal de 15 (quinze) dias úteis, sob pena de preclusão. Intime-se. São Paulo, 18 de Outubro de 2026. Juiz de Direito.`,
    receivedAt: 'Hoje às 11:42',
    extractedData: {
      cnjNumber: '1004523-89.2024.8.26.0100',
      court: 'TJSP - 28ª Vara Cível Central da Capital',
      lawyerOAB: '123456/SP',
      intimationType: 'DESPACHO',
      suggestedDeadlineDays: 15,
      isFatalDeadline: true,
      estimatedFatalDate: '2026-11-10',
      summary: 'O magistrado abriu prazo para a Construtora Horizonte se manifestar sobre os documentos novos apresentados pelo autor da ação (fls. 180/240).',
      keyPoints: [
        'Prazo de 15 dias úteis fixado com menção expressa à preclusão.',
        'Análise necessária dos documentos juntados às fls. 180/240.',
        'Petições sem manifestação levarão ao encerramento da instrução probatória.'
      ],
      recommendedAction: 'Elaborar e protocolar petição de manifestação sobre os novos documentos até 10/11/2026.'
    },
    status: 'PENDING_REVIEW',
    assignedLawyerId: 'user_1',
    assignedLawyerName: 'Dr. Carlos Renato Silva'
  },
  {
    id: 'notif_2',
    tenantId: 'tenant_office',
    caseId: 'case_2',
    rawSubject: 'TRT 2ª Região - Notificação de Designação de Audiência de Instrução',
    rawSender: 'pje.notificacoes@trt2.jus.br',
    rawBody: `TRIBUNAL REGIONAL DO TRABALHO DA 2ª REGIÃO
12ª Vara do Trabalho de São Paulo
PROCESSO: 0010892-45.2024.5.02.0012
RECLAMANTE: Marcos Vinicius de Albuquerque
RECLAMADO: Banco Safira S/A
ADVOGADA: MARIANA SOUZA - OAB/SP 234567

Fica V. Sa. intimada da designação de AUDIÊNCIA DE INSTRUÇÃO E JULGAMENTO para o dia 04/11/2026 às 14h30min, na modalidade PRESENCIAL. As testemunhas deverão comparecer independentemente de intimação ou arroladas com antecedência de 5 dias.`,
    receivedAt: 'Hoje às 09:15',
    extractedData: {
      cnjNumber: '0010892-45.2024.5.02.0012',
      court: 'TRT-2 - 12ª Vara do Trabalho de São Paulo',
      lawyerOAB: '234567/SP',
      intimationType: 'AUDIÊNCIA',
      suggestedDeadlineDays: 5,
      isFatalDeadline: true,
      estimatedFatalDate: '2026-10-27',
      summary: 'Audiência de instrução presencial designada para 04/11/2026 às 14h30min. Rol de testemunhas deve ser protocolado com 5 dias de antecedência.',
      keyPoints: [
        'Audiência presencial marcada na 12ª VT/SP para 04/11/2026 às 14h30.',
        'Prazo crítico: 5 dias úteis para arrolar testemunhas ou intimá-las.',
        'Necessidade de alinhamento prévio com o cliente Marcos Vinicius.'
      ],
      recommendedAction: 'Agendar call preparatória com o cliente e protocolar o rol de testemunhas até 27/10/2026.'
    },
    status: 'APPROVED',
    assignedLawyerId: 'user_2',
    assignedLawyerName: 'Dra. Mariana Souza',
    reviewedBy: 'Dra. Mariana Souza',
    reviewedAt: 'Hoje às 10:05',
    calendarEventId: 'cal_event_trt2_123'
  }
];

export const initialDeadlines: DeadlineEvent[] = [
  {
    id: 'dl_1',
    tenantId: 'tenant_office',
    caseId: 'case_2',
    cnjNumber: '0010892-45.2024.5.02.0012',
    clientName: 'Marcos Vinicius de Albuquerque',
    title: 'Protocolar Rol de Testemunhas (Audiência TRT-2)',
    deadlineDate: '2026-10-27',
    daysRemaining: 9,
    isFatal: true,
    status: 'PENDING',
    responsibleLawyerName: 'Dra. Mariana Souza'
  },
  {
    id: 'dl_2',
    tenantId: 'tenant_office',
    caseId: 'case_1',
    cnjNumber: '1004523-89.2024.8.26.0100',
    clientName: 'Construtora Horizonte Empreendimentos S.A.',
    title: 'Manifestação sobre Documentos de fls. 180/240 (TJSP)',
    deadlineDate: '2026-11-10',
    daysRemaining: 23,
    isFatal: true,
    status: 'PENDING',
    responsibleLawyerName: 'Dr. Carlos Renato Silva'
  }
];

export const sampleCourtTemplates = [
  {
    label: 'TJSP — Sentença Procedente com Prazo de Apelação (15 dias)',
    subject: 'Diário da Justiça Eletrônico TJSP - Sentença - Proc. 1029384-12.2024.8.26.0001',
    sender: 'publicacoes@dje.tjsp.jus.br',
    body: `TRIBUNAL DE JUSTIÇA DE SÃO PAULO - 1ª VARA CÍVEL DO FORO REGIONAL DE SANTANA
Processo nº 1029384-12.2024.8.26.0001
Classe: Procedimento Comum Cível
Autor: Alpha Logística e Comércio Internacional
Réu: Transportadora Rápido Seguro S/A
Advogado da parte autora: CARLOS RENATO SILVA - OAB/SP 123456

SENTENÇA: Diante do exposto e pelo que mais dos autos consta, JULGO PROCEDENTE o pedido inicial para CONDENAR a ré ao pagamento de R$ 145.000,00 acrescidos de correção monetária pela Tabela Prática do TJSP desde o desembolso e juros de mora de 1% ao mês a partir da citação. Condeno a ré em custas e honorários advocatícios em 15% sobre o valor da condenação. P.R.I. Prazo recursal de apelação: 15 (quinze) dias úteis nos termos do art. 1.003, §5º do CPC.`
  },
  {
    label: 'TRT-2 — Intimação para Contraminuta de Agravo de Petição (8 dias)',
    subject: 'PJe TRT 2ª Região - Notificação Eletrônica - Proc. 0001452-98.2023.5.02.0044',
    sender: 'pje@trt2.jus.br',
    body: `TRIBUNAL REGIONAL DO TRABALHO DA 2ª REGIÃO - 44ª VARA DO TRABALHO DE SÃO PAULO
Processo: 0001452-98.2023.5.02.0044
Reclamante: Carlos Alberto Fagundes
Reclamada: Indústria Metalúrgica Forjaço S/A
Advogado do Reclamante: ROBERTO LIMA - OAB/SP 345678

INTIMAÇÃO: Fica a parte exequente intimada para, no prazo improrrogável de 8 (oito) dias úteis, apresentar contraminuta ao Agravo de Petição interposto pela executada às fls. 320/335. Intime-se.`
  },
  {
    label: 'TRF-3 — Despacho em Execução Fiscal: Embargos (30 dias)',
    subject: 'TRF 3ª Região - Intimação - Execução Fiscal 5012390-88.2024.4.03.6100',
    sender: 'intima@trf3.jus.br',
    body: `JUSTIÇA FEDERAL DE PRIMEIRO GRAU - SEÇÃO JUDICIÁRIA DE SÃO PAULO
14ª Vara das Execuções Fiscais Federais de São Paulo
Processo: 5012390-88.2024.4.03.6100
Exequente: UNIÃO FEDERAL - FAZENDA NACIONAL
Executado: Nexus Tech Logística & Distribuição Ltda.
Advogada constituída: MARIANA SOUZA - OAB/SP 234567

DESPACHO: Intime-se a executada acerca da penhora formalizada no evento 42, para que, querendo, ofereça Embargos à Execução Fiscal no prazo de 30 (trinta) dias úteis (art. 16 da Lei nº 6.830/80).`
  }
];
