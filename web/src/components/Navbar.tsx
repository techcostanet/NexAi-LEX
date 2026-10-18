import React from 'react';
import { Scale, Mail, Copy, Check, Users, User, ShieldCheck } from 'lucide-react';
import { Tenant, UserProfile } from '../types';
import versionData from '../version.json';

interface NavbarProps {
  tenant: Tenant;
  currentUser: UserProfile;
  isSoloMode: boolean;
  onToggleSoloMode: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  tenant,
  currentUser,
  isSoloMode,
  onToggleSoloMode,
  activeTab,
  onSelectTab,
  pendingCount
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(tenant.inboundEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-top">
        {/* Brand */}
        <div className="brand-wrapper">
          <div className="brand-icon">
            <Scale size={24} color="#C9A86A" />
          </div>
          <div>
            <div className="brand-title">
              NexAi<span className="brand-accent">-LEX</span>
              <span className="version-pill" title={`Versão do Sistema: v${versionData.version} (${versionData.buildDate})`}>
                v{versionData.version}
              </span>
            </div>
            <div className="brand-subtitle">Inteligência Processual & Ingestão de Intimações</div>
          </div>
        </div>

        {/* E-mail Dedicado do Escritório (Pilar Central) */}
        <div className="inbound-box">
          <div className="inbound-label">
            <Mail size={13} color="#C9A86A" />
            <span>E-MAIL DE CAPTURA DO ESCRITÓRIO:</span>
          </div>
          <div className="inbound-email-row">
            <code className="inbound-email-text">{tenant.inboundEmail}</code>
            <button 
              onClick={handleCopyEmail}
              className="copy-btn"
              title="Copiar e-mail de captura para cadastrar nos tribunais"
            >
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Switcher Solo vs Escritório & Perfil */}
        <div className="profile-actions">
          <div className="mode-toggle-card">
            <div className="mode-toggle-label">Visualização do Sistema:</div>
            <div className="mode-buttons">
              <button
                className={`mode-btn ${isSoloMode ? 'active' : ''}`}
                onClick={onToggleSoloMode}
              >
                <User size={13} />
                <span>1 Advogado (Solo)</span>
              </button>
              <button
                className={`mode-btn ${!isSoloMode ? 'active' : ''}`}
                onClick={onToggleSoloMode}
              >
                <Users size={13} />
                <span>Escritório (Equipe)</span>
              </button>
            </div>
          </div>

          <div className="user-badge-card">
            <img 
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100'} 
              alt={currentUser.name} 
              className="user-avatar"
            />
            <div className="user-info">
              <div className="user-name">{currentUser.name}</div>
              <div className="user-oab">
                <span>OAB: {currentUser.oabNumber || 'Geral'}</span>
                {currentUser.googleCalendarLinked && (
                  <span className="google-sync-indicator" title="Google Agenda Sincronizada">
                    <ShieldCheck size={12} color="#10B981" />
                    Google Sync
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'inbox' ? 'active' : ''}`}
          onClick={() => onSelectTab('inbox')}
        >
          <span>📥 Inbox de Intimações</span>
          {pendingCount > 0 && (
            <span className="tab-counter">{pendingCount}</span>
          )}
        </button>

        <button
          className={`tab-btn ${activeTab === 'cases' ? 'active' : ''}`}
          onClick={() => onSelectTab('cases')}
        >
          <span>📁 Processos & Dossiês</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'deadlines' ? 'active' : ''}`}
          onClick={() => onSelectTab('deadlines')}
        >
          <span>📅 Prazos & Agenda</span>
        </button>

        <button
          className={`tab-btn simulate-tab ${activeTab === 'simulator' ? 'active' : ''}`}
          onClick={() => onSelectTab('simulator')}
        >
          <span>⚡ Simulador de E-mails (Testar IA)</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => onSelectTab('settings')}
        >
          <span>🏢 {isSoloMode ? 'Configurações' : 'Gestão do Escritório'}</span>
        </button>
      </nav>
    </header>
  );
};
