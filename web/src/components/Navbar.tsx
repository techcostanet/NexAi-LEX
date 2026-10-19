import React from 'react';
import { Scale, ShieldCheck, Settings, Crown, LogOut } from 'lucide-react';
import { Tenant, UserProfile, AuthUser } from '../types';
import versionData from '../version.json';

interface NavbarProps {
  tenant: Tenant;
  currentUser: UserProfile;
  currentUserAuth: AuthUser;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingCount: number;
  onOpenSaaSAdmin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  tenant,
  currentUser,
  currentUserAuth,
  activeTab,
  onSelectTab,
  pendingCount,
  onOpenSaaSAdmin,
  onLogout
}) => {
  return (
    <header className="navbar-container">
      <div className="navbar-top">
        {/* Brand */}
        <div className="brand-wrapper">
          <div className="brand-icon">
            <Scale size={24} color="#B47E20" />
          </div>
          <div>
            <div className="brand-title">
              NexAi<span className="brand-accent">-LEX</span>
              <span className="version-pill" title={`Versão do Sistema: v${versionData.version} (${versionData.buildDate})`}>
                v{versionData.version}
              </span>
            </div>
            <div className="brand-subtitle">Gestão Jurídica Inteligente</div>
          </div>
        </div>

        {/* Acesso SuperAdmin SaaS (Apenas para Master) + Perfil + Logout */}
        <div className="profile-actions">
          {/* Botão de Acesso ao Painel Geral do SaaS (Exclusivo Master Admin) */}
          {currentUserAuth.isSuperAdmin && (
            <button 
              className="btn-saas-admin-trigger"
              onClick={onOpenSaaSAdmin}
              title="Acessar o Painel de Gestão Global"
            >
              <Crown size={15} />
              <span>Administração</span>
            </button>
          )}

          <div className="user-badge-card">
            <img 
              src={currentUserAuth.avatarUrl || currentUser.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100'} 
              alt={currentUserAuth.name} 
              className="user-avatar"
            />
            <div className="user-info">
              <div className="user-name">{currentUserAuth.name}</div>
              <div className="user-oab">
                <span>{currentUserAuth.oabNumber ? `OAB: ${currentUserAuth.oabNumber}` : currentUserAuth.isSuperAdmin ? 'Administrador' : 'Advogado'}</span>
                {currentUser.googleCalendarLinked && (
                  <span className="google-sync-indicator" title="Google Agenda Conectada">
                    <ShieldCheck size={12} color="#10B981" />
                    Conectada
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="btn-navbar-logout"
              title="Encerrar sessão"
            >
              <LogOut size={15} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation da Área do Cliente */}
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'inbox' ? 'active' : ''}`}
          onClick={() => onSelectTab('inbox')}
        >
          <span>📥 Intimações</span>
          {pendingCount > 0 && (
            <span className="tab-counter">{pendingCount}</span>
          )}
        </button>

        <button
          className={`tab-btn ${activeTab === 'cases' ? 'active' : ''}`}
          onClick={() => onSelectTab('cases')}
        >
          <span>📁 Processos</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'deadlines' ? 'active' : ''}`}
          onClick={() => onSelectTab('deadlines')}
        >
          <span>📅 Prazos</span>
        </button>

        <button
          className={`tab-btn settings-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => onSelectTab('settings')}
        >
          <Settings size={15} />
          <span>Configurações</span>
        </button>
      </nav>
    </header>
  );
};
