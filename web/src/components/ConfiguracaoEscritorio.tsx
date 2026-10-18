import React from 'react';
import { 
  Building, 
  Users, 
  CreditCard, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  UserPlus, 
  Check, 
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { Tenant, UserProfile } from '../types';

interface ConfiguracaoEscritorioProps {
  tenant: Tenant;
  lawyers: UserProfile[];
  isSoloMode: boolean;
}

export const ConfiguracaoEscritorio: React.FC<ConfiguracaoEscritorioProps> = ({
  tenant,
  lawyers,
  isSoloMode
}) => {
  return (
    <div className="settings-layout">
      {/* Coluna da Esquerda: Configurações do Escritório & Equipe */}
      <div className="settings-main-col glass-panel">
        <div className="settings-section-header">
          <Building size={20} color="#B47E20" />
          <h2 className="section-title">
            {isSoloMode ? 'Configurações da Conta do Advogado' : 'Dados do Escritório & Roteamento por OAB'}
          </h2>
        </div>

        <div className="settings-form-grid">
          <div className="form-group">
            <label className="input-label">Nome da Banca / Advogado:</label>
            <input 
              type="text" 
              className="text-input" 
              value={tenant.name} 
              readOnly 
            />
          </div>

          <div className="form-group">
            <label className="input-label">Identificador (Slug Único):</label>
            <input 
              type="text" 
              className="text-input" 
              value={tenant.slug} 
              readOnly 
            />
          </div>

          <div className="form-group full-width">
            <label className="input-label">E-mail de Captura Dedicado (Inbound Gateway):</label>
            <div className="email-display-bar">
              <Mail size={16} color="#B47E20" />
              <code>{tenant.inboundEmail}</code>
            </div>
            <p className="field-hint">
              Cadastre este endereço nos sistemas dos tribunais (PJe, Projudi, e-SAJ) ou no convênio da OAB.
            </p>
          </div>
        </div>

        {/* Gestão de Membros e OABs */}
        {!isSoloMode && (
          <div className="team-management-box">
            <div className="team-header">
              <div>
                <h3 className="sub-title">Equipe & Chaves de Roteamento por OAB</h3>
                <p className="section-desc">
                  Quando o Gemini lê uma publicação no tribunal, ele identifica o número da OAB e encaminha automaticamente para o advogado correto.
                </p>
              </div>

              <button className="btn-secondary mini-btn">
                <UserPlus size={14} />
                <span>Convidar Advogado</span>
              </button>
            </div>

            <div className="team-list">
              {lawyers.map(lawyer => (
                <div key={lawyer.id} className="team-card">
                  <img src={lawyer.avatarUrl} alt={lawyer.name} className="team-avatar" />
                  <div className="team-info">
                    <div className="team-name">{lawyer.name}</div>
                    <div className="team-email">{lawyer.email}</div>
                  </div>
                  <div className="team-oab-badge">
                    <span>OAB: <strong>{lawyer.oabNumber || 'Geral'}</strong></span>
                  </div>
                  <div className="team-role-tag">
                    {lawyer.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Coluna da Direita: Planos SaaS & Precificação */}
      <div className="settings-side-col glass-panel">
        <div className="plan-summary-header">
          <CreditCard size={20} color="#B47E20" />
          <h3 className="section-title">Seu Plano SaaS & Lucratividade</h3>
        </div>

        <div className="current-plan-card">
          <div className="plan-badge-row">
            <span className="plan-type">
              {isSoloMode ? 'PLANO SOLO' : 'PLANO ESCRITÓRIO'}
            </span>
            <span className="active-tag">ATIVO</span>
          </div>
          <div className="plan-price">
            {isSoloMode ? 'R$ 97' : 'R$ 249'}<small>/mês</small>
          </div>
          <div className="plan-features">
            <div className="feat-item">
              <Check size={14} color="#10B981" />
              <span>{isSoloMode ? '1 Advogado com acesso total' : 'Até 4 Advogados com OABs individuais'}</span>
            </div>
            <div className="feat-item">
              <Check size={14} color="#10B981" />
              <span>E-mail dedicado ilimitado</span>
            </div>
            <div className="feat-item">
              <Check size={14} color="#10B981" />
              <span>Extração com Google Gemini 1.5 Flash</span>
            </div>
            <div className="feat-item">
              <Check size={14} color="#10B981" />
              <span>Sincronização com Google Agenda</span>
            </div>
          </div>
        </div>

        {/* Bloco de Economia Unitária (O segredo do seu lucro) */}
        <div className="unit-economics-box">
          <div className="unit-title">
            <TrendingUp size={16} color="#10B981" />
            <span>Métricas de Negócio do seu SaaS</span>
          </div>
          <div className="metrics-list">
            <div className="metric-row">
              <span>Custo Médio por E-mail (Gemini):</span>
              <strong>~ R$ 0,007</strong>
            </div>
            <div className="metric-row">
              <span>Mensalidade Cobrada:</span>
              <strong>{isSoloMode ? 'R$ 97,00' : 'R$ 249,00'}</strong>
            </div>
            <div className="metric-row highlight">
              <span>Margem Bruta Estimada:</span>
              <strong className="green-text">&gt; 94%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
