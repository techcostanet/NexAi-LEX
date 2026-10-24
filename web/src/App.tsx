import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InboxIntimacoes } from './components/InboxIntimacoes';
import { ProcessosList } from './components/ProcessosList';
import { PrazosAgenda } from './components/PrazosAgenda';
import { ConfiguracaoEscritorio } from './components/ConfiguracaoEscritorio';
import { SaaSAdminDashboard } from './components/SaaSAdmin/SaaSAdminDashboard';
import { LoginPage } from './components/LoginPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { LandingPage } from './components/LandingPage/LandingPage';
import { 
  mockSoloTenant, 
  mockOfficeTenant, 
  mockLawyers
} from './mockData';
import { CaseNotification, DeadlineEvent, LegalCase, AuthUser, Tenant } from './types';
import { firestoreService } from './services/firestoreService';
import { authService } from './services/authService';
import { CheckCircle2, Loader2, Scale } from 'lucide-react';
import './App.css';

const normalizePath = (path: string): string => {
  const clean = path.toLowerCase().trim();
  if (clean.startsWith('/admin')) return '/admin';
  if (clean.startsWith('/adv')) return '/adv';
  return '/';
};

export function App() {
  // Controle de Rota por URL do Navegador
  const [currentPath, setCurrentPath] = useState<string>(() => normalizePath(window.location.pathname));

  // Estado de Autenticação na Nuvem (Firebase Auth + Firestore)
  const [userAuth, setUserAuth] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('inbox');
  
  const [notifications, setNotifications] = useState<CaseNotification[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineEvent[]>([]);
  const [cases, setCases] = useState<LegalCase[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tenantUpdates, setTenantUpdates] = useState<Record<string, Partial<Tenant>>>({});

  // Navegação SPA transparente
  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(normalizePath(path));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sincroniza com botões voltar/avançar do navegador
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Modo de visualização determinado estritamente pelo Plano SaaS contratado pelo escritório
  const baseTenant = (userAuth?.tenantId === 'tenant_solo' || !userAuth?.isSuperAdmin) ? mockSoloTenant : mockOfficeTenant;
  const currentTenant: Tenant = {
    ...baseTenant,
    ...(tenantUpdates[baseTenant.id] || {})
  };
  const isSoloMode = currentTenant.plan === 'solo';
  const currentUser = mockLawyers[0]; // Advogado titular / Dr. Carlos

  // Monitora a sessão de autenticação do usuário
  useEffect(() => {
    const unsubscribeAuth = authService.subscribeAuthState((user) => {
      setUserAuth(user);
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Sincronização 100% Online em Tempo Real (Zero localStorage)
  // Conecta diretamente ao Cloud Firestore para colaboração de múltiplos advogados
  useEffect(() => {
    if (!userAuth || currentPath !== '/adv') return;

    const unsubNotifs = firestoreService.subscribeNotifications(currentTenant.id, (data) => {
      setNotifications(data);
    });

    const unsubDeadlines = firestoreService.subscribeDeadlines(currentTenant.id, (data) => {
      setDeadlines(data);
    });

    const unsubCases = firestoreService.subscribeCases(currentTenant.id, (data) => {
      setCases(data);
    });

    return () => {
      unsubNotifs();
      unsubDeadlines();
      unsubCases();
    };
  }, [userAuth, currentTenant.id, currentPath]);

  const pendingCount = notifications.filter(n => n.status === 'PENDING_REVIEW').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setUserAuth(user);
    showToast(`✓ Bem-vindo(a), ${user.name}!`);
    if (user.isSuperAdmin) {
      navigate('/admin');
    } else {
      navigate('/adv');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUserAuth(null);
      showToast('Sessão encerrada com segurança.');
    } catch (e) {
      console.error('Erro ao encerrar sessão:', e);
      setUserAuth(null);
    }
  };

  // Human-in-the-Loop: Aprovar intimação e agendar no Google Calendar
  const handleApproveNotification = async (notifId: string) => {
    const target = notifications.find(n => n.id === notifId);
    if (!target) return;

    // 1. Atualiza status no Cloud Firestore online
    await firestoreService.approveNotification(notifId, userAuth?.name || currentUser.name);

    // 2. Adiciona o prazo no Cloud Firestore online (acessível por toda a equipe)
    const newDeadline: DeadlineEvent = {
      id: `dl_${Date.now()}`,
      tenantId: currentTenant.id,
      caseId: target.caseId || `case_${Date.now()}`,
      cnjNumber: target.extractedData.cnjNumber || 'Sem número',
      clientName: 'Cliente do Processo',
      title: `${target.extractedData.intimationType}: ${target.extractedData.recommendedAction}`,
      deadlineDate: target.extractedData.estimatedFatalDate,
      daysRemaining: target.extractedData.suggestedDeadlineDays,
      isFatal: target.extractedData.isFatalDeadline,
      status: 'PENDING',
      responsibleLawyerName: target.assignedLawyerName || userAuth?.name || currentUser.name
    };

    await firestoreService.addDeadline(newDeadline);

    showToast(`✓ Prazo aprovado com sucesso!`);
  };

  const handleSaveTenant = async (updated: Partial<Tenant>) => {
    setTenantUpdates(prev => ({
      ...prev,
      [currentTenant.id]: {
        ...(prev[currentTenant.id] || {}),
        ...updated
      }
    }));
    await firestoreService.updateTenant(currentTenant.id, updated);
  };

  // Tela de Carregamento Inicial
  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-card">
          <div className="auth-loading-brand">
            <Scale size={36} color="#B47E20" />
            <span className="auth-loading-title">NexAi<span className="text-gold">-LEX</span></span>
          </div>
          <div className="auth-loading-spinner-row">
            <Loader2 size={24} className="animate-spin" color="#B47E20" />
            <span>Carregando plataforma...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root-container">
      {/* Toast Alert Global */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={20} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ROTA 1: /admin - Administração Master do SaaS */}
      {currentPath === '/admin' && (
        userAuth?.isSuperAdmin ? (
          <SaaSAdminDashboard 
            onLogout={handleLogout}
            currentUserAuth={userAuth}
          />
        ) : (
          <AdminLoginPage 
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => navigate('/')}
          />
        )
      )}

      {/* ROTA 2: /adv - Portal do Escritório / Advogado Cliente */}
      {currentPath === '/adv' && (
        userAuth ? (
          <div className="app-wrapper">
            {/* Top Navbar da Área do Advogado */}
            <Navbar
              tenant={currentTenant}
              currentUser={currentUser}
              currentUserAuth={userAuth}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              pendingCount={pendingCount}
              onOpenSaaSAdmin={() => navigate('/admin')}
              onLogout={handleLogout}
            />

            {/* Conteúdo da Aba Ativa do Cliente */}
            <main className="tab-content">
              {activeTab === 'inbox' && (
                <InboxIntimacoes
                  notifications={notifications}
                  onApproveNotification={handleApproveNotification}
                  isSoloMode={isSoloMode}
                />
              )}

              {activeTab === 'cases' && (
                <ProcessosList
                  cases={cases}
                  isSoloMode={isSoloMode}
                />
              )}

              {activeTab === 'deadlines' && (
                <PrazosAgenda
                  deadlines={deadlines}
                  isSoloMode={isSoloMode}
                />
              )}

              {activeTab === 'settings' && (
                <ConfiguracaoEscritorio
                  tenant={currentTenant}
                  lawyers={mockLawyers}
                  isSoloMode={isSoloMode}
                  userEmail={userAuth?.email}
                  onSaveTenant={handleSaveTenant}
                />
              )}
            </main>
          </div>
        ) : (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => navigate('/')}
            onOpenTrial={() => navigate('/')}
          />
        )
      )}

      {/* ROTA 3: / (Raiz) - Landing Page Pública Oficial com Captação para Teste Grátis */}
      {currentPath === '/' && (
        <LandingPage 
          onNavigateToLawyer={() => navigate('/adv')}
          onNavigateToAdmin={() => navigate('/admin')}
        />
      )}
    </div>
  );
}

export default App;
