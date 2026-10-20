import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AuthUser } from '../types';

// Credenciais e Perfis Oficiais do Sistema
export const MASTER_ADMIN_EMAIL = 'contato@techcosta.net';
export const DEMO_CLIENT_EMAIL = 'demo@nexai.com.br';

export const KNOWN_ACCOUNTS = {
  MASTER_ADMIN: {
    email: MASTER_ADMIN_EMAIL,
    defaultPass: 'T3chCost@10',
    name: 'TechCosta Admin Master',
    role: 'SUPER_ADMIN' as const,
    isSuperAdmin: true,
    tenantId: 'techcosta_master',
    tenantName: 'NexAi-LEX SaaS Global (TechCosta)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
  },
  DEMO_CLIENT: {
    email: DEMO_CLIENT_EMAIL,
    defaultPass: 'ClienteDemo2026',
    name: 'Dr. Carlos Eduardo Costa',
    role: 'LAWYER' as const,
    isSuperAdmin: false,
    tenantId: 'tenant_solo',
    tenantName: 'Carlos Eduardo Costa Advocacia',
    oabNumber: 'OAB/SP 345.891',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120'
  }
};

class AuthService {
  /**
   * Converte usuário Firebase para AuthUser do sistema e persiste no Cloud Firestore
   */
  private async resolveAuthUser(fbUser: FirebaseUser): Promise<AuthUser> {
    const emailLower = (fbUser.email || '').toLowerCase().trim();
    const isMaster = emailLower === MASTER_ADMIN_EMAIL.toLowerCase();

    // Perfil padrão baseado na credencial
    let profile: AuthUser;
    if (isMaster) {
      profile = {
        uid: fbUser.uid,
        email: fbUser.email || MASTER_ADMIN_EMAIL,
        name: KNOWN_ACCOUNTS.MASTER_ADMIN.name,
        role: 'SUPER_ADMIN',
        isSuperAdmin: true,
        tenantId: KNOWN_ACCOUNTS.MASTER_ADMIN.tenantId,
        tenantName: KNOWN_ACCOUNTS.MASTER_ADMIN.tenantName,
        avatarUrl: KNOWN_ACCOUNTS.MASTER_ADMIN.avatarUrl
      };
    } else {
      profile = {
        uid: fbUser.uid,
        email: fbUser.email || DEMO_CLIENT_EMAIL,
        name: KNOWN_ACCOUNTS.DEMO_CLIENT.name,
        role: 'LAWYER',
        isSuperAdmin: false,
        tenantId: KNOWN_ACCOUNTS.DEMO_CLIENT.tenantId,
        tenantName: KNOWN_ACCOUNTS.DEMO_CLIENT.tenantName,
        oabNumber: KNOWN_ACCOUNTS.DEMO_CLIENT.oabNumber,
        avatarUrl: KNOWN_ACCOUNTS.DEMO_CLIENT.avatarUrl
      };
    }

    // Sincroniza o perfil no Cloud Firestore (Sem LocalStorage)
    try {
      const userDocRef = doc(db, 'users', fbUser.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        profile = {
          ...profile,
          name: data.name || profile.name,
          role: data.role || profile.role,
          isSuperAdmin: data.isSuperAdmin !== undefined ? data.isSuperAdmin : profile.isSuperAdmin,
          tenantId: data.tenantId || profile.tenantId,
          tenantName: data.tenantName || profile.tenantName,
          oabNumber: data.oabNumber || profile.oabNumber
        };
      } else {
        await setDoc(userDocRef, {
          ...profile,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (firestoreErr) {
      console.warn('Sincronização Firestore do usuário:', firestoreErr);
    }

    return profile;
  }

  /**
   * Realiza login por e-mail e senha via Google Firebase Auth
   */
  async login(email: string, pass: string): Promise<AuthUser> {
    const cleanEmail = email.trim().toLowerCase();
    
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      return await this.resolveAuthUser(cred.user);
    } catch (err: any) {
      // Mensagens de erro amigáveis em português
      console.error('Erro de autenticação Firebase:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        throw new Error('E-mail ou senha incorretos. Por favor, verifique as credenciais.');
      }
      if (err.code === 'auth/too-many-requests') {
        throw new Error('Muitas tentativas sem sucesso. Aguarde alguns instantes e tente novamente.');
      }
      if (err.code === 'auth/invalid-email') {
        throw new Error('Formato de e-mail inválido.');
      }
      throw new Error(err.message || 'Falha ao autenticar. Verifique sua conexão.');
    }
  }

  /**
   * Encerra a sessão atual
   */
  async logout(): Promise<void> {
    await firebaseSignOut(auth);
  }

  /**
   * Monitora alterações de estado de autenticação em tempo real
   */
  subscribeAuthState(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        callback(null);
        return;
      }
      try {
        const authUser = await this.resolveAuthUser(fbUser);
        callback(authUser);
      } catch (e) {
        console.error('Erro ao resolver perfil do usuário:', e);
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();
