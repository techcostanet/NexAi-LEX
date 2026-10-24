export type TenantPlan = 'solo' | 'office' | 'pro' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  inboundEmail: string;
  plan: TenantPlan;
  maxUsers: number;
  activeProcessesCount: number;
  monthlyNotificationsCount: number;
  createdAt: string;
  // Campos expandidos de configuração
  oabPrincipal?: string;
  cnpj?: string;
  cpf?: string;
  contactEmail?: string;
  telefone?: string;
  endereco?: string;
  cidadeUf?: string;
  whatsappAlertsEnabled?: boolean;
  alertPriorHours?: number; // 24 ou 48 horas
  cpcCountingRule?: 'DIAS_UTEIS' | 'DIAS_CORRIDOS';
  gmailConnected?: boolean;
  gmailEmail?: string;
  lastGmailSync?: string;
  autoGmailSyncEnabled?: boolean;
}

export type UserRole = 'ADMIN' | 'LAWYER' | 'ASSISTANT';

export interface UserProfile {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  oabNumber: string;
  role: UserRole;
  googleCalendarLinked: boolean;
  avatarUrl?: string;
}

export type CaseStatus = 'ACTIVE' | 'ARCHIVED' | 'SUSPENDED';
export type CasePhase = 'INICIAL' | 'INSTRUÇÃO' | 'SENTENÇA' | 'RECURSAL' | 'EXECUÇÃO';

export interface LegalCase {
  id: string;
  tenantId: string;
  cnjNumber: string;
  court: string;
  clientName: string;
  opposingParty?: string;
  caseArea: 'CÍVEL' | 'TRABALHISTA' | 'TRIBUTÁRIO' | 'FAMÍLIA' | 'CRIMINAL' | 'EMPRESARIAL';
  phase?: CasePhase;
  caseValue?: number;
  distributionDate?: string;
  responsibleLawyerId: string;
  responsibleLawyerName: string;
  responsibleOAB: string;
  status: CaseStatus;
  lastUpdateDate: string;
  eventsCount: number;
}

export type IntimationType = 
  | 'DESPACHO'
  | 'DECISÃO INTERLOCUTÓRIA'
  | 'SENTENÇA'
  | 'AUDIÊNCIA'
  | 'CITAÇÃO / INTIMAÇÃO'
  | 'ACÓRDÃO'
  | 'OUTROS';

export interface ExtractedLegalData {
  cnjNumber: string;
  court: string;
  lawyerOAB: string;
  intimationType: IntimationType;
  suggestedDeadlineDays: number;
  isFatalDeadline: boolean;
  estimatedFatalDate: string;
  summary: string;
  keyPoints: string[];
  recommendedAction: string;
}

export type NotificationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface CaseNotification {
  id: string;
  tenantId: string;
  caseId?: string;
  rawSubject: string;
  rawSender: string;
  rawBody: string;
  receivedAt: string;
  extractedData: ExtractedLegalData;
  status: NotificationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  assignedLawyerId?: string;
  assignedLawyerName?: string;
  calendarEventId?: string;
}

export interface DeadlineEvent {
  id: string;
  tenantId: string;
  caseId: string;
  cnjNumber: string;
  clientName: string;
  title: string;
  deadlineDate: string;
  daysRemaining: number;
  isFatal: boolean;
  status: 'PENDING' | 'DONE' | 'EXPIRED';
  responsibleLawyerName: string;
}

/* =========================================================
   Tipos do Módulo de Administração Geral do SaaS (SuperAdmin)
   ========================================================= */

export type ClientSubscriptionStatus = 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'BLOCKED';

export interface SaaSClient {
  id: string;
  name: string;
  slug: string;
  legalEntity: string; // Razão Social / Nome completo
  cnpjOrCpf: string;
  contactEmail: string;
  contactPhone: string;
  plan: TenantPlan;
  status: ClientSubscriptionStatus;
  mrrValue: number; // Valor mensal pago
  usersCount: number;
  maxUsers: number;
  intimationCountMonth: number;
  maxIntimationLimit: number;
  joinedAt: string;
  inboundEmail: string;
  cityState: string;
}

export interface SaaSMetrics {
  mrr: number; // Receita recorrente mensal
  mrrGrowthRate: number; // Percentual de crescimento
  arr: number; // Receita anualizada
  totalActiveTenants: number;
  totalLawyers: number;
  monthlyIntimationsProcessed: number;
  geminiEstimatedCost: number; // Custo estimado da API Google Gemini
  grossMarginPercent: number; // Margem bruta
  churnRatePercent: number;
  averageTicket: number;
}

export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'BOLETO';
export type TransactionStatus = 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED';

export interface SaaSTransaction {
  id: string;
  clientName: string;
  plan: TenantPlan;
  amount: number;
  date: string;
  method: PaymentMethod;
  status: TransactionStatus;
  invoiceUrl?: string;
}

export interface SaaSPlanConfig {
  id: TenantPlan;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  maxUsers: number;
  maxIntimationsPerMonth: number;
  features: string[];
  popular?: boolean;
}

export interface SaaSInfraStatus {
  geminiLatencyMs: number;
  geminiSuccessRate: number;
  cloudFirestoreStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  firebaseHostingStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  inboundWebhookStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  activeTokensCount: number;
  lastWebhookPing: string;
}

/* =========================================================
   Tipos de Autenticação e Sessão de Usuário
   ========================================================= */

export type AuthRole = 'SUPER_ADMIN' | 'OFFICE_ADMIN' | 'LAWYER';

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: AuthRole;
  isSuperAdmin: boolean;
  tenantId: string;
  tenantName: string;
  oabNumber?: string;
  avatarUrl?: string;
}

