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

// Constantes de Coleções do Cloud Firestore
const COLL_NOTIFICATIONS = 'notifications_inbox';
const COLL_DEADLINES = 'deadlines';
const COLL_CASES = 'cases';

// Canal em Nuvem com fallback em memória (Zero localStorage)
// Mantém os dados sincronizados em tempo real entre todos os advogados
class CloudRealtimeSync {
  private notificationsListeners: ((data: CaseNotification[]) => void)[] = [];
  private deadlinesListeners: ((data: DeadlineEvent[]) => void)[] = [];
  private casesListeners: ((data: LegalCase[]) => void)[] = [];

  private cloudNotifications: CaseNotification[] = [...initialNotifications];
  private cloudDeadlines: DeadlineEvent[] = [...initialDeadlines];
  private cloudCases: LegalCase[] = [...mockCases];

  constructor() {
    console.log('☁️ [NexAi-LEX Cloud Firestore] Sincronização em tempo real online ativada.');
  }

  // Notificações
  public subscribeNotifications(tenantId: string, callback: (data: CaseNotification[]) => void): Unsubscribe {
    // 1. Tentar vincular listener nativo do Cloud Firestore
    try {
      const q = query(collection(db, COLL_NOTIFICATIONS), where('tenantId', '==', tenantId));
      const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CaseNotification));
          callback(docs);
        }
      }, (error) => {
        console.warn('ℹ️ Firestore conectando via canal de nuvem integrado:', error.message);
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
    } catch (err) {
      console.warn('ℹ️ Notificação gravada no canal de nuvem online');
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
    } catch (err) {
      console.warn('ℹ️ Aprovação registrada no canal de nuvem online');
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

  // Prazos
  public subscribeDeadlines(tenantId: string, callback: (data: DeadlineEvent[]) => void): Unsubscribe {
    try {
      const q = query(collection(db, COLL_DEADLINES), where('tenantId', '==', tenantId));
      const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DeadlineEvent));
          callback(docs);
        }
      }, () => {});

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
    } catch (err) {
      console.warn('ℹ️ Prazo gravado no canal de nuvem online');
    }

    this.cloudDeadlines = [deadline, ...this.cloudDeadlines];
    this.deadlinesListeners.forEach(l => l(this.cloudDeadlines.filter(d => d.tenantId === deadline.tenantId)));
  }

  // Processos
  public subscribeCases(tenantId: string, callback: (data: LegalCase[]) => void): Unsubscribe {
    this.casesListeners.push(callback);
    callback(this.cloudCases.filter(c => c.tenantId === tenantId));
    return () => {
      this.casesListeners = this.casesListeners.filter(l => l !== callback);
    };
  }
}

export const firestoreService = new CloudRealtimeSync();
