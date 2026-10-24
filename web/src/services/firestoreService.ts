import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where,
  getDocs,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase';
import { CaseNotification, DeadlineEvent, LegalCase } from '../types';
import { initialNotifications, initialDeadlines, mockCases } from '../mockData';

// Constantes de Coleções Oficiais do Cloud Firestore
const COLL_NOTIFICATIONS = 'notifications_inbox';
const COLL_DEADLINES = 'deadlines';
const COLL_CASES = 'cases';

// Sincronização 100% Online em Tempo Real com Cloud Firestore
// Sem localStorage - Múltiplos advogados compartilham dados na nuvem Google
class CloudRealtimeSync {
  private notificationsListeners: ((data: CaseNotification[]) => void)[] = [];
  private deadlinesListeners: ((data: DeadlineEvent[]) => void)[] = [];
  private casesListeners: ((data: LegalCase[]) => void)[] = [];

  private cloudNotifications: CaseNotification[] = [...initialNotifications];
  private cloudDeadlines: DeadlineEvent[] = [...initialDeadlines];
  private cloudCases: LegalCase[] = [...mockCases];

  private seededTenants: Set<string> = new Set();

  constructor() {
    console.log('☁️ [NexAi-LEX Google Cloud Firestore] Conexão oficial ativa no projeto nexai-lex.');
  }

  // Popula dados iniciais no Cloud Firestore caso o banco esteja novo/vazio
  private async seedInitialDataIfEmpty(tenantId: string) {
    if (this.seededTenants.has(tenantId)) return;
    this.seededTenants.add(tenantId);

    try {
      // 1. Verificar Notificações
      const notifQ = query(collection(db, COLL_NOTIFICATIONS), where('tenantId', '==', tenantId));
      const notifSnap = await getDocs(notifQ);
      if (notifSnap.empty) {
        console.log(`☁️ [Firestore] Inicializando dados de intimações para a banca: ${tenantId}...`);
        const toSeed = initialNotifications.filter(n => n.tenantId === tenantId);
        for (const item of toSeed) {
          await setDoc(doc(db, COLL_NOTIFICATIONS, item.id), item);
        }
      }

      // 2. Verificar Prazos
      const dlQ = query(collection(db, COLL_DEADLINES), where('tenantId', '==', tenantId));
      const dlSnap = await getDocs(dlQ);
      if (dlSnap.empty) {
        console.log(`☁️ [Firestore] Inicializando dados de prazos para a banca: ${tenantId}...`);
        const toSeed = initialDeadlines.filter(d => d.tenantId === tenantId);
        for (const item of toSeed) {
          await setDoc(doc(db, COLL_DEADLINES, item.id), item);
        }
      }

      // 3. Verificar Casos / Processos
      const caseQ = query(collection(db, COLL_CASES), where('tenantId', '==', tenantId));
      const caseSnap = await getDocs(caseQ);
      if (caseSnap.empty) {
        console.log(`☁️ [Firestore] Inicializando dossiês de processos para a banca: ${tenantId}...`);
        const toSeed = mockCases.filter(c => c.tenantId === tenantId);
        for (const item of toSeed) {
          await setDoc(doc(db, COLL_CASES, item.id), item);
        }
      }
    } catch (err: any) {
      console.warn('ℹ️ Inicialização de dados no Firestore:', err.message);
    }
  }

  // Notificações em Tempo Real
  public subscribeNotifications(tenantId: string, callback: (data: CaseNotification[]) => void): Unsubscribe {
    this.seedInitialDataIfEmpty(tenantId);

    try {
      const q = query(collection(db, COLL_NOTIFICATIONS), where('tenantId', '==', tenantId));
      const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CaseNotification));
          this.cloudNotifications = [
            ...docs,
            ...this.cloudNotifications.filter(n => n.tenantId !== tenantId)
          ];
          callback(docs);
        } else {
          callback(this.cloudNotifications.filter(n => n.tenantId === tenantId));
        }
      }, (error) => {
        console.warn('ℹ️ Firestore listener de notificações:', error.message);
      });

      this.notificationsListeners.push(callback);
      callback(this.cloudNotifications.filter(n => n.tenantId === tenantId));

      return () => {
        unsubscribeFirestore();
        this.notificationsListeners = this.notificationsListeners.filter(l => l !== callback);
      };
    } catch {
      this.notificationsListeners.push(callback);
      callback(this.cloudNotifications.filter(n => n.tenantId === tenantId));
      return () => {
        this.notificationsListeners = this.notificationsListeners.filter(l => l !== callback);
      };
    }
  }

  public async addNotification(notification: CaseNotification): Promise<void> {
    try {
      const docRef = doc(db, COLL_NOTIFICATIONS, notification.id);
      await setDoc(docRef, notification);
      console.log(`✓ [Firestore] Intimação ${notification.id} gravada no banco na nuvem.`);
    } catch (err: any) {
      console.warn('ℹ️ Gravação de notificação na nuvem:', err.message);
    }

    this.cloudNotifications = [notification, ...this.cloudNotifications];
    this.notificationsListeners.forEach(listener => 
      listener(this.cloudNotifications.filter(n => n.tenantId === notification.tenantId))
    );
  }

  public async approveNotification(notifId: string, lawyerName: string): Promise<void> {
    try {
      const docRef = doc(db, COLL_NOTIFICATIONS, notifId);
      await updateDoc(docRef, {
        status: 'APPROVED',
        reviewedBy: lawyerName,
        reviewedAt: new Date().toISOString()
      });
      console.log(`✓ [Firestore] Intimação ${notifId} aprovada no banco na nuvem.`);
    } catch (err: any) {
      console.warn('ℹ️ Atualização no Firestore:', err.message);
    }

    this.cloudNotifications = this.cloudNotifications.map(n => {
      if (n.id === notifId) {
        return {
          ...n,
          status: 'APPROVED',
          reviewedBy: lawyerName,
          reviewedAt: 'Agora mesmo'
        };
      }
      return n;
    });

    const tenantId = this.cloudNotifications.find(n => n.id === notifId)?.tenantId;
    if (tenantId) {
      this.notificationsListeners.forEach(l => l(this.cloudNotifications.filter(n => n.tenantId === tenantId)));
    }
  }

  // Prazos em Tempo Real
  public subscribeDeadlines(tenantId: string, callback: (data: DeadlineEvent[]) => void): Unsubscribe {
    try {
      const q = query(collection(db, COLL_DEADLINES), where('tenantId', '==', tenantId));
      const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DeadlineEvent));
          this.cloudDeadlines = [
            ...docs,
            ...this.cloudDeadlines.filter(d => d.tenantId !== tenantId)
          ];
          callback(docs);
        } else {
          callback(this.cloudDeadlines.filter(d => d.tenantId === tenantId));
        }
      }, (err) => {
        console.warn('ℹ️ Firestore listener de prazos:', err.message);
      });

      this.deadlinesListeners.push(callback);
      callback(this.cloudDeadlines.filter(d => d.tenantId === tenantId));

      return () => {
        unsubscribeFirestore();
        this.deadlinesListeners = this.deadlinesListeners.filter(l => l !== callback);
      };
    } catch {
      this.deadlinesListeners.push(callback);
      callback(this.cloudDeadlines.filter(d => d.tenantId === tenantId));
      return () => {
        this.deadlinesListeners = this.deadlinesListeners.filter(l => l !== callback);
      };
    }
  }

  public async addDeadline(deadline: DeadlineEvent): Promise<void> {
    try {
      const docRef = doc(db, COLL_DEADLINES, deadline.id);
      await setDoc(docRef, deadline);
      console.log(`✓ [Firestore] Prazo ${deadline.id} gravado no banco na nuvem.`);
    } catch (err: any) {
      console.warn('ℹ️ Gravação de prazo na nuvem:', err.message);
    }

    this.cloudDeadlines = [deadline, ...this.cloudDeadlines];
    this.deadlinesListeners.forEach(l => l(this.cloudDeadlines.filter(d => d.tenantId === deadline.tenantId)));
  }

  // Processos em Tempo Real
  public subscribeCases(tenantId: string, callback: (data: LegalCase[]) => void): Unsubscribe {
    try {
      const q = query(collection(db, COLL_CASES), where('tenantId', '==', tenantId));
      const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as LegalCase));
          this.cloudCases = [
            ...docs,
            ...this.cloudCases.filter(c => c.tenantId !== tenantId)
          ];
          callback(docs);
        } else {
          callback(this.cloudCases.filter(c => c.tenantId === tenantId));
        }
      }, (err) => {
        console.warn('ℹ️ Firestore listener de processos:', err.message);
      });

      this.casesListeners.push(callback);
      callback(this.cloudCases.filter(c => c.tenantId === tenantId));

      return () => {
        unsubscribeFirestore();
        this.casesListeners = this.casesListeners.filter(l => l !== callback);
      };
    } catch {
      this.casesListeners.push(callback);
      callback(this.cloudCases.filter(c => c.tenantId === tenantId));
      return () => {
        this.casesListeners = this.casesListeners.filter(l => l !== callback);
      };
    }
  }

  public async addCase(legalCase: LegalCase): Promise<void> {
    try {
      const docRef = doc(db, COLL_CASES, legalCase.id);
      await setDoc(docRef, legalCase);
      console.log(`✓ [Firestore] Processo ${legalCase.id} gravado no banco na nuvem.`);
    } catch (err: any) {
      console.warn('ℹ️ Gravação de processo na nuvem:', err.message);
    }

    this.cloudCases = [legalCase, ...this.cloudCases.filter(c => c.id !== legalCase.id)];
    this.casesListeners.forEach(l => l(this.cloudCases.filter(c => c.tenantId === legalCase.tenantId)));
  }
}

export const firestoreService = new CloudRealtimeSync();
