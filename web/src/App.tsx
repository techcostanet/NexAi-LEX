import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { InboxIntimacoes } from './components/InboxIntimacoes';
import { ProcessosList } from './components/ProcessosList';
import { PrazosAgenda } from './components/PrazosAgenda';
import { SimuladorEmail } from './components/SimuladorEmail';
import { ConfiguracaoEscritorio } from './components/ConfiguracaoEscritorio';
import { 
  mockSoloTenant, 
  mockOfficeTenant, 
  mockLawyers, 
  mockCases, 
  initialNotifications, 
  initialDeadlines 
} from './mockData';
import { CaseNotification, DeadlineEvent } from './types';
import { CheckCircle2, BellRing } from 'lucide-react';
import './App.css';

export function App() {
  const [isSoloMode, setIsSoloMode] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');
  
  const [notifications, setNotifications] = useState<CaseNotification[]>(initialNotifications);
  const [deadlines, setDeadlines] = useState<DeadlineEvent[]>(initialDeadlines);
  const [cases, setCases] = useState(mockCases);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentTenant = isSoloMode ? mockSoloTenant : mockOfficeTenant;
  const currentUser = isSoloMode ? mockLawyers[0] : mockLawyers[0]; // Dr. Carlos

  const pendingCount = notifications.filter(n => n.status === 'PENDING_REVIEW').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Human-in-the-Loop: Aprovar intimação e agendar no Google Calendar
  const handleApproveNotification = (notifId: string) => {
    const target = notifications.find(n => n.id === notifId);
    if (!target) return;

    setNotifications(prev => prev.map(n => {
      if (n.id === notifId) {
        return {
          ...n,
          status: 'APPROVED',
          reviewedBy: currentUser.name,
          reviewedAt: 'Agora mesmo',
          calendarEventId: `cal_${Date.now()}`
        };
      }
      return n;
    }));

    // Adiciona o prazo na agenda automaticamente
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
      responsibleLawyerName: target.assignedLawyerName || currentUser.name
    };

    setDeadlines(prev => [newDeadline, ...prev]);

    showToast(`✓ Prazo aprovado! Evento sincronizado na Google Agenda de ${newDeadline.responsibleLawyerName}.`);
  };

  // Recebe e-mail processado pelo simulador
  const handleEmailProcessed = (newNotif: CaseNotification) => {
    setNotifications(prev => [newNotif, ...prev]);
    setActiveTab('inbox');
    showToast(`⚡ Nova intimação recebida do tribunal e processada pelo Google Gemini!`);
  };

  return (
    <div className="app-wrapper">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={20} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        tenant={currentTenant}
        currentUser={currentUser}
        isSoloMode={isSoloMode}
        onToggleSoloMode={() => setIsSoloMode(!isSoloMode)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingCount={pendingCount}
      />

      {/* Conteúdo da Aba Ativa */}
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
    </div>
  );
}

export default App;
