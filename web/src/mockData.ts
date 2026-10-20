import { Tenant, UserProfile, LegalCase, CaseNotification, DeadlineEvent } from './types';

export const mockSoloTenant: Tenant = {
  id: 'tenant_solo',
  name: 'Carlos Eduardo Costa Advocacia',
  slug: 'carlos-costa',
  inboundEmail: 'carlos-costa@inbox.nexai.com.br',
  plan: 'solo',
  maxUsers: 1,
  activeProcessesCount: 68,
  monthlyNotificationsCount: 24,
  createdAt: '2024-01-15',
  cpf: '321.654.987-00',
  oabPrincipal: '345.891/SP',
  telefone: '(11) 98765-4321',
  endereco: 'Av. Paulista, 1000, Cj. 42 - Bela Vista, São Paulo - SP',
  contactEmail: 'demo@nexai.com.br'
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
  createdAt: '2023-08-10',
  cnpj: '14.892.301/0001-55',
  oabPrincipal: '123456/SP',
  telefone: '(11) 3289-4400',
  endereco: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
  contactEmail: 'contato@silvaoliveira.adv.br'
};

export const mockLawyers: UserProfile[] = [
  {
    id: 'user_1',
    tenantId: 'tenant_solo',
    name: 'Dr. Carlos Eduardo Costa',
    email: 'demo@nexai.com.br',
    oabNumber: '345.891/SP',
    role: 'ADMIN',
    googleCalendarLinked: true,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80'
  }
];

export const mockCases: LegalCase[] = [
  {
    id: 'case_1',
    tenantId: 'tenant_solo',
    cnjNumber: '1004523-89.2024.8.26.0100',
    court: 'TJSP - 28ª Vara Cível Central',
    clientName: 'Construtora Horizonte Empreendimentos S.A.',
    opposingParty: 'Pedro Paulo Silveira',
    caseArea: 'CÍVEL',
    phase: 'INSTRUÇÃO',
    caseValue: 485000.00,
    distributionDate: '2024-03-12',
    responsibleLawyerId: 'user_1',
    responsibleLawyerName: 'Dr. Carlos Eduardo Costa',
    responsibleOAB: '345.891/SP',
    status: 'ACTIVE',
    lastUpdateDate: '2026-10-18',
    eventsCount: 14
  },
  {
    id: 'case_2',
    tenantId: 'tenant_solo',
    cnjNumber: '0010892-45.2024.5.02.0012',
    court: 'TRT-2 - 12ª Vara do Trabalho',
    clientName: 'Marcos Vinicius de Albuquerque',
    opposingParty: 'Banco Safira S/A',
    caseArea: 'TRABALHISTA',
    phase: 'INSTRUÇÃO',
    caseValue: 125000.00,
    distributionDate: '2024-05-20',
    responsibleLawyerId: 'user_1',
    responsibleLawyerName: 'Dr. Carlos Eduardo Costa',
    responsibleOAB: '345.891/SP',
    status: 'ACTIVE',
    lastUpdateDate: '2026-10-17',
    eventsCount: 9
  },
  {
    id: 'case_3',
    tenantId: 'tenant_solo',
    cnjNumber: '5003412-18.2024.4.03.6100',
    court: 'TRF-3 - 7ª Vara Federal Tributária',
    clientName: 'Nexus Tech Logística & Distribuição Ltda.',
    opposingParty: 'União Federal (Fazenda Nacional)',
    caseArea: 'TRIBUTÁRIO',
    phase: 'EXECUÇÃO',
    caseValue: 890000.00,
    distributionDate: '2023-11-08',
    responsibleLawyerId: 'user_1',
    responsibleLawyerName: 'Dr. Carlos Eduardo Costa',
    responsibleOAB: '345.891/SP',
    status: 'ACTIVE',
    lastUpdateDate: '2026-10-15',
    eventsCount: 22
  },
  {
    id: 'case_4',
    tenantId: 'tenant_solo',
    cnjNumber: '1029384-12.2024.8.26.0001',
    court: 'TJSP - 1ª Vara Cível de Santana',
    clientName: 'Alpha Logística e Comércio Internacional',
    opposingParty: 'Transportadora Rápido Seguro S/A',
    caseArea: 'EMPRESARIAL',
    phase: 'RECURSAL',
    caseValue: 145000.00,
    distributionDate: '2024-01-18',
    responsibleLawyerId: 'user_1',
    responsibleLawyerName: 'Dr. Carlos Eduardo Costa',
    responsibleOAB: '345.891/SP',
    status: 'ACTIVE',
    lastUpdateDate: '2026-10-12',
    eventsCount: 18
  },
  {
    id: 'case_5',
    tenantId: 'tenant_solo',
    cnjNumber: '1088492-30.2025.8.26.0002',
    court: 'TJSP - 3ª Vara da Família de Santo Amaro',
    clientName: 'Beatriz Vasconcelos Ribeiro',
    opposingParty: 'Eduardo Guimarães Ribeiro',
    caseArea: 'FAMÍLIA',
    phase: 'INICIAL',
    caseValue: 65000.00,
    distributionDate: '2025-02-10',
    responsibleLawyerId: 'user_1',
    responsibleLawyerName: 'Dr. Carlos Eduardo Costa',
    responsibleOAB: '345.891/SP',
    status: 'ACTIVE',
    lastUpdateDate: '2026-10-09',
    eventsCount: 5
  }
];

export const initialNotifications: CaseNotification[] = [
  {
    id: 'notif_1',
    tenantId: 'tenant_solo',
    caseId: 'case_1',
    rawSubject: 'DJE TJSP - Publicação de Despacho com Prazo - Proc. 1004523-89.2024.8.26.0100',
    rawSender: 'comunicacao@tjsp.jus.br',
    rawBody: `PODER JUDICIÁRIO DO ESTADO DE SÃO PAULO
COMARCA DE SÃO PAULO - FORO CENTRAL CÍVEL - 28ª VARA CÍVEL
Processo Digital nº: 1004523-89.2024.8.26.0100
Classe - Assunto: Procedimento Comum Cível - Rescisão do contrato e devolução do dinheiro
Requerente: Pedro Paulo Silveira
Requerido: Construtora Horizonte Empreendimentos S.A.
Advogado(a): CARLOS EDUARDO COSTA - OAB/SP 345891

DESPACHO: Vistos. Manifeste-se a parte requerida em réplica à contestação e documentos juntados às fls. 180/240, no prazo legal de 15 (quinze) dias úteis, sob pena de preclusão. Intime-se. São Paulo, 18 de Outubro de 2026. Juiz de Direito.`,
    receivedAt: 'Hoje às 11:42',
    extractedData: {
      cnjNumber: '1004523-89.2024.8.26.0100',
      court: 'TJSP - 28ª Vara Cível Central da Capital',
      lawyerOAB: '345.891/SP',
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
    assignedLawyerName: 'Dr. Carlos Eduardo Costa'
  },
  {
    id: 'notif_2',
    tenantId: 'tenant_solo',
    caseId: 'case_2',
    rawSubject: 'TRT 2ª Região - Notificação de Designação de Audiência de Instrução',
    rawSender: 'pje.notificacoes@trt2.jus.br',
    rawBody: `TRIBUNAL REGIONAL DO TRABALHO DA 2ª REGIÃO
12ª Vara do Trabalho de São Paulo
PROCESSO: 0010892-45.2024.5.02.0012
RECLAMANTE: Marcos Vinicius de Albuquerque
RECLAMADO: Banco Safira S/A
ADVOGADO: CARLOS EDUARDO COSTA - OAB/SP 345891

Fica V. Sa. intimada da designação de AUDIÊNCIA DE INSTRUÇÃO E JULGAMENTO para o dia 04/11/2026 às 14h30min, na modalidade PRESENCIAL. As testemunhas deverão comparecer independentemente de intimação ou arroladas com antecedência de 5 dias.`,
    receivedAt: 'Hoje às 09:15',
    extractedData: {
      cnjNumber: '0010892-45.2024.5.02.0012',
      court: 'TRT-2 - 12ª Vara do Trabalho de São Paulo',
      lawyerOAB: '345.891/SP',
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
    assignedLawyerId: 'user_1',
    assignedLawyerName: 'Dr. Carlos Eduardo Costa',
    reviewedBy: 'Dr. Carlos Eduardo Costa',
    reviewedAt: 'Hoje às 10:05',
    calendarEventId: 'cal_event_trt2_123'
  }
];

export const initialDeadlines: DeadlineEvent[] = [
  {
    id: 'dl_1',
    tenantId: 'tenant_solo',
    caseId: 'case_2',
    cnjNumber: '0010892-45.2024.5.02.0012',
    clientName: 'Marcos Vinicius de Albuquerque',
    title: 'Protocolar Rol de Testemunhas (Audiência TRT-2)',
    deadlineDate: '2026-10-27',
    daysRemaining: 9,
    isFatal: true,
    status: 'PENDING',
    responsibleLawyerName: 'Dr. Carlos Eduardo Costa'
  },
  {
    id: 'dl_2',
    tenantId: 'tenant_solo',
    caseId: 'case_1',
    cnjNumber: '1004523-89.2024.8.26.0100',
    clientName: 'Construtora Horizonte Empreendimentos S.A.',
    title: 'Manifestação sobre Documentos de fls. 180/240 (TJSP)',
    deadlineDate: '2026-11-10',
    daysRemaining: 23,
    isFatal: true,
    status: 'PENDING',
    responsibleLawyerName: 'Dr. Carlos Eduardo Costa'
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

/* =========================================================
   Mock Data: Administração Geral do SaaS (SuperAdmin)
   ========================================================= */

export const mockSaaSMetrics: import('./types').SaaSMetrics = {
  mrr: 48650,
  mrrGrowthRate: 18.4,
  arr: 583800,
  totalActiveTenants: 142,
  totalLawyers: 388,
  monthlyIntimationsProcessed: 28450,
  geminiEstimatedCost: 199.15,
  grossMarginPercent: 96.2,
  churnRatePercent: 0.7,
  averageTicket: 342.60
};

export const mockSaaSClients: import('./types').SaaSClient[] = [
  {
    id: 'tenant_office',
    name: 'Silva & Oliveira Advogados Associados',
    slug: 'silva-oliveira',
    legalEntity: 'Silva e Oliveira Sociedade de Advogados',
    cnpjOrCpf: '14.892.301/0001-55',
    contactEmail: 'contato@silvaoliveira.adv.br',
    contactPhone: '(11) 3289-4400',
    plan: 'office',
    status: 'ACTIVE',
    mrrValue: 249,
    usersCount: 4,
    maxUsers: 4,
    intimationCountMonth: 148,
    maxIntimationLimit: 1000,
    joinedAt: '2023-08-10',
    inboundEmail: 'silva-oliveira@inbox.nexai.com.br',
    cityState: 'São Paulo - SP'
  },
  {
    id: 'tenant_solo',
    name: 'Carlos Renato Advocacia',
    slug: 'carlos-renato',
    legalEntity: 'Carlos Renato Silva Advocacia Individual',
    cnpjOrCpf: '38.102.498/0001-12',
    contactEmail: 'carlos@renatosilva.adv.br',
    contactPhone: '(11) 98123-4567',
    plan: 'solo',
    status: 'ACTIVE',
    mrrValue: 97,
    usersCount: 1,
    maxUsers: 1,
    intimationCountMonth: 42,
    maxIntimationLimit: 250,
    joinedAt: '2024-01-15',
    inboundEmail: 'carlos-renato@inbox.nexai.com.br',
    cityState: 'Campinas - SP'
  },
  {
    id: 'tenant_corporate_1',
    name: 'Mattos, Ferraz & Pinheiro Advogados',
    slug: 'mattos-ferraz',
    legalEntity: 'Mattos & Ferraz Consultoria Jurídica Empresarial',
    cnpjOrCpf: '09.345.120/0001-88',
    contactEmail: 'gestao@mattosferraz.com.br',
    contactPhone: '(21) 2540-9900',
    plan: 'pro',
    status: 'ACTIVE',
    mrrValue: 499,
    usersCount: 12,
    maxUsers: 15,
    intimationCountMonth: 890,
    maxIntimationLimit: 3000,
    joinedAt: '2023-11-04',
    inboundEmail: 'mattos-ferraz@inbox.nexai.com.br',
    cityState: 'Rio de Janeiro - RJ'
  },
  {
    id: 'tenant_corporate_2',
    name: 'Barros & Guimarães Sociedade de Advogados',
    slug: 'barros-guimaraes',
    legalEntity: 'Barros e Guimarães Advogados Associados',
    cnpjOrCpf: '22.871.409/0001-34',
    contactEmail: 'financeiro@barrosguimaraes.adv.br',
    contactPhone: '(31) 3320-1122',
    plan: 'pro',
    status: 'ACTIVE',
    mrrValue: 499,
    usersCount: 9,
    maxUsers: 15,
    intimationCountMonth: 610,
    maxIntimationLimit: 3000,
    joinedAt: '2024-02-18',
    inboundEmail: 'barros-guimaraes@inbox.nexai.com.br',
    cityState: 'Belo Horizonte - MG'
  },
  {
    id: 'tenant_solo_2',
    name: 'Dra. Fernanda Lins Tributário',
    slug: 'fernanda-lins',
    legalEntity: 'Fernanda Lins Advocacia Especializada',
    cnpjOrCpf: '45.120.984/0001-70',
    contactEmail: 'fernanda@linsadvocacia.com.br',
    contactPhone: '(41) 99876-5432',
    plan: 'solo',
    status: 'TRIAL',
    mrrValue: 97,
    usersCount: 1,
    maxUsers: 1,
    intimationCountMonth: 18,
    maxIntimationLimit: 250,
    joinedAt: '2026-10-12',
    inboundEmail: 'fernanda-lins@inbox.nexai.com.br',
    cityState: 'Curitiba - PR'
  },
  {
    id: 'tenant_office_3',
    name: 'Albuquerque & Costa Advogados Trabalhistas',
    slug: 'albuquerque-costa',
    legalEntity: 'Albuquerque Costa Sociedade de Advogados',
    cnpjOrCpf: '18.990.123/0001-90',
    contactEmail: 'administrativo@albuquerquecosta.adv.br',
    contactPhone: '(71) 3040-5500',
    plan: 'office',
    status: 'PAST_DUE',
    mrrValue: 249,
    usersCount: 3,
    maxUsers: 4,
    intimationCountMonth: 215,
    maxIntimationLimit: 1000,
    joinedAt: '2023-09-22',
    inboundEmail: 'albuquerque-costa@inbox.nexai.com.br',
    cityState: 'Salvador - BA'
  }
];

export const mockSaaSTransactions: import('./types').SaaSTransaction[] = [
  {
    id: 'tx_1091',
    clientName: 'Mattos, Ferraz & Pinheiro Advogados',
    plan: 'pro',
    amount: 499.00,
    date: '2026-10-18 14:22',
    method: 'CREDIT_CARD',
    status: 'PAID'
  },
  {
    id: 'tx_1090',
    clientName: 'Silva & Oliveira Advogados Associados',
    plan: 'office',
    amount: 249.00,
    date: '2026-10-17 10:15',
    method: 'PIX',
    status: 'PAID'
  },
  {
    id: 'tx_1089',
    clientName: 'Carlos Renato Advocacia',
    plan: 'solo',
    amount: 97.00,
    date: '2026-10-16 09:30',
    method: 'CREDIT_CARD',
    status: 'PAID'
  },
  {
    id: 'tx_1088',
    clientName: 'Barros & Guimarães Sociedade de Advogados',
    plan: 'pro',
    amount: 499.00,
    date: '2026-10-15 16:45',
    method: 'PIX',
    status: 'PAID'
  },
  {
    id: 'tx_1087',
    clientName: 'Albuquerque & Costa Advogados Trabalhistas',
    plan: 'office',
    amount: 249.00,
    date: '2026-10-14 11:20',
    method: 'BOLETO',
    status: 'PENDING'
  }
];

export const mockSaaSPlans: import('./types').SaaSPlanConfig[] = [
  {
    id: 'solo',
    name: 'Plano Advogado Solo',
    priceMonthly: 97,
    priceYearly: 970,
    maxUsers: 1,
    maxIntimationsPerMonth: 250,
    features: [
      '1 Advogado com acesso total',
      'E-mail de captura dedicado exclusivo',
      'Extração com Google Gemini 1.5 Flash',
      'Sincronização com Google Agenda',
      'Detecção de prazos fatais CPC/CLT',
      'Suporte via e-mail e WhatsApp'
    ]
  },
  {
    id: 'office',
    name: 'Plano Escritório Associados',
    priceMonthly: 249,
    priceYearly: 2490,
    maxUsers: 4,
    maxIntimationsPerMonth: 1000,
    popular: true,
    features: [
      'Até 4 Advogados na mesma banca',
      'Roteamento inteligente por OAB automático',
      'Gestão colaborativa de prazos',
      'Sincronização individual com Google Agenda de cada advogado',
      'Dossiês unificados por processo CNJ',
      'Painel de aprovação Human-in-the-Loop',
      'Suporte prioritário'
    ]
  },
  {
    id: 'pro',
    name: 'Plano Corporate / Pro',
    priceMonthly: 499,
    priceYearly: 4990,
    maxUsers: 15,
    maxIntimationsPerMonth: 5000,
    features: [
      'Até 15 Advogados ou estagiários',
      'Roteamento multi-filial e áreas especializadas',
      'Processamento em lote ilimitado',
      'Integração direta com APIs e ERPs jurídicos',
      'Auditoria de segurança e logs de visualização',
      'Gerente de conta exclusivo'
    ]
  }
];

export const mockSaaSInfraStatus: import('./types').SaaSInfraStatus = {
  geminiLatencyMs: 640,
  geminiSuccessRate: 99.8,
  cloudFirestoreStatus: 'HEALTHY',
  firebaseHostingStatus: 'HEALTHY',
  inboundWebhookStatus: 'HEALTHY',
  activeTokensCount: 384000,
  lastWebhookPing: 'Agora mesmo (200 OK)'
};
