import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InboxIntimacoes } from './components/InboxIntimacoes';
import { ProcessosList } from './components/ProcessosList';
import { PrazosAgenda } from './components/PrazosAgenda';
import { SimuladorEmail } from './components/SimuladorEmail';
import { ConfiguracaoEscritorio } from './components/ConfiguracaoEscritorio';
import { SaaSAdminDashboard } from './components/SaaSAdmin/SaaSAdminDashboard';
import { LoginPage } from './components/LoginPage';
import { 
  mockSoloTenant, 
  mockOfficeTenant, 
  mockLawyers
} from './mockData';
import { CaseNotification, DeadlineEvent, LegalCase, AuthUser } from './types';
import { firestoreService } from './services/firestoreService';
import { authService } from './services/authService';
import { CheckCircle2, Loader2, Scale } from 'lucide-react';
import './App.css';

export function App() {
  // Estado de Autenticação na Nuvem (Firebase Auth + Firestore)
  const [userAuth, setUserAuth] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [isSoloMode, setIsSoloMode] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');
  const [isSaaSAdminView, setIsSaaSAdminView] = useState(false);
  
  const [notifications, setNotifications] = useState<CaseNotification[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineEvent[]>([]);
  const [cases, setCases] = useState<LegalCase[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentTenant = isSoloMode ? mockSoloTenant : mockOfficeTenant;
  const currentUser = isSoloMode ? mockLawyers[0] : mockLawyers[0]; // Dr. Carlos

  // Monitora a sessão de autenticação do usuário
  useEffect(() => {
    const unsubscribeAuth = authService.subscribeAuthState((user) => {
      setUserAuth(user);
      setAuthLoading(false);
      // Se for SuperAdmin Master, abre diretamente na Administração do SaaS
      if (user?.isSuperAdmin) {
        setIsSaaSAdminView(true);
      } else {
        setIsSaaSAdminView(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Sincronização 100% Online em Tempo Real (Zero localStorage)
  // Conecta diretamente ao Cloud Firestore para colaboração de múltiplos advogados
  useEffect(() => {
    if (!userAuth) return;

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
  }, [userAuth, currentTenant.id]);

  const pendingCount = notifications.filter(n => n.status === 'PENDING_REVIEW').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setUserAuth(user);
    if (user.isSuperAdmin) {
      setIsSaaSAdminView(true);
    } else {
      setIsSaaSAdminView(false);
    }
    showToast(`✓ Bem-vindo(a), ${user.name}!`);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUserAuth(null);
      setIsSaaSAdminView(false);
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

    showToast(`✓ Prazo aprovado! Sincronizado na nuvem e Google Agenda de ${newDeadline.responsibleLawyerName}.`);
  };

  // Recebe e-mail processado pelo simulador e grava no Cloud Firestore online
  const handleEmailProcessed = async (newNotif: CaseNotification) => {
    await firestoreService.addNotification(newNotif);
    setActiveTab('inbox');
    showToast(`⚡ Nova intimação recebida e sincronizada no Cloud Firestore com sucesso!`);
  };

  // Tela de Carregamento Inicial do Firebase Auth
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
            <span>Verificando credenciais de acesso na nuvem...</span>
          </div>
        </div>
      </div>
    );
  }

  // Se o usuário não estiver autenticado, exibe a tela de login
  if (!userAuth) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-wrapper">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={20} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Roteamento Condicional: Área de Gestão SaaS Admin vs Portal do Advogado Cliente */}
      {isSaaSAdminView ? (
        <SaaSAdminDashboard 
          onBackToClient={() => setIsSaaSAdminView(false)} 
          onLogout={handleLogout}
          currentUserAuth={userAuth}
        />
      ) : (
        <>
          {/* Top Navbar da Área do Advogado */}
          <Navbar
            tenant={currentTenant}
            currentUser={currentUser}
            currentUserAuth={userAuth}
            isSoloMode={isSoloMode}
            onToggleSoloMode={() => setIsSoloMode(!isSoloMode)}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            pendingCount={pendingCount}
            onOpenSaaSAdmin={() => setIsSaaSAdminView(true)}
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

            {activeTab === 'simulator' && (
              <SimuladorEmail
                tenant={currentTenant}
                onEmailProcessed={handleEmailProcessed}
              />
            )}

            {activeTab === 'settings' && (
              <ConfiguracaoEscritorio
                tenant={currentTenant}
                lawyers={mockLawyers}
                isSoloMode={isSoloMode}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;

