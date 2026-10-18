// Tipos do Domínio NexAi-LEX

export type TenantPlan = 'solo' | 'office' | 'pro';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  inboundEmail: string; // Ex: silva-advogados@inbox.nexai.com.br
  plan: TenantPlan;
  maxUsers: number;
  activeProcessesCount: number;
  monthlyNotificationsCount: number;
  createdAt: string;
}

export type UserRole = 'ADMIN' | 'LAWYER' | 'ASSISTANT';

export interface UserProfile {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  oabNumber: string; // Ex: "123456/SP"
  role: UserRole;
  googleCalendarLinked: boolean;
  avatarUrl?: string;
}

export type CaseStatus = 'ACTIVE' | 'ARCHIVED' | 'SUSPENDED';

export interface LegalCase {
  id: string;
  tenantId: string;
  cnjNumber: string; // Ex: "1002345-67.2024.8.26.0100"
  court: string; // Ex: "TJSP - 2ª Vara Cível Central"
  clientName: string;
  caseArea: 'CÍVEL' | 'TRABALHISTA' | 'TRIBUTÁRIO' | 'FAMÍLIA' | 'CRIMINAL' | 'EMPRESARIAL';
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
  estimatedFatalDate: string; // Formato YYYY-MM-DD
  summary: string; // Resumo em 2-3 parágrafos claros
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
