import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  CreditCard, 
  Mail, 
  ShieldCheck, 
  UserPlus, 
  Check, 
  Sliders, 
  Calendar, 
  Bell, 
  Copy, 
  ExternalLink,
  Save,
  CheckCircle2,
  FileText,
  Clock
} from 'lucide-react';
import { Tenant, UserProfile } from '../types';

interface ConfiguracaoEscritorioProps {
  tenant: Tenant;
  lawyers: UserProfile[];
  isSoloMode: boolean;
  onSaveTenant?: (updated: Partial<Tenant>) => void;
}

export const ConfiguracaoEscritorio: React.FC<ConfiguracaoEscritorioProps> = ({
  tenant,
  lawyers,
  isSoloMode
}) => {
  const [subTab, setSubTab] = useState<'banca' | 'inbound' | 'team' | 'integrations' | 'rules' | 'plan'>('banca');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Estados dos formulários de configuração
  const [bancaNome, setBancaNome] = useState(tenant.name);
  const [bancaCnpj, setBancaCnpj] = useState(tenant.cnpj || '14.892.301/0001-55');
  const [bancaOab, setBancaOab] = useState(tenant.oabPrincipal || '123456/SP');
  const [bancaTel, setBancaTel] = useState(tenant.telefone || '(11) 3289-4400');
  const [bancaEnd, setBancaEnd] = useState(tenant.endereco || 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP');

  // Preferências
  const [googleCalendarSync, setGoogleCalendarSync] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [alertHours, setAlertHours] = useState<number>(48);
  const [countingRule, setCountingRule] = useState<'DIAS_UTEIS' | 'DIAS_CORRIDOS'>('DIAS_UTEIS');

  const handleCopyInbound = () => {
    navigator.clipboard.writeText(tenant.inboundEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="client-settings-container glass-panel">
      {/* Toast de Salvo */}
      {savedToast && (
        <div className="settings-saved-toast">
          <CheckCircle2 size={18} color="#10B981" />
          <span>Configurações atualizadas com sucesso!</span>
        </div>
      )}

      {/* Header da Central de Configurações */}
      <div className="client-settings-header">
        <div className="settings-header-title">
          <div className="settings-icon-circle">
            <Sliders size={22} color="#B47E20" />
          </div>
          <div>
            <h2 className="section-title">Configurações</h2>
            <p className="section-desc">
              Gerencie as informações do seu escritório, equipe e regras de prazos.
            </p>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary">
          <Save size={16} />
          <span>Salvar</span>
        </button>
      </div>

      {/* Layout com Abas Laterais e Conteúdo */}
      <div className="client-settings-body">
        {/* Barra Lateral de Categorias de Configuração */}
        <aside className="settings-sidebar">
          <button 
            className={`settings-nav-btn ${subTab === 'banca' ? 'active' : ''}`}
            onClick={() => setSubTab('banca')}
          >
            <Building size={16} />
            <span>Escritório</span>
          </button>

          <button 
            className={`settings-nav-btn ${subTab === 'inbound' ? 'active' : ''}`}
            onClick={() => setSubTab('inbound')}
          >
            <Mail size={16} />
            <span>E-mail</span>
          </button>

          {!isSoloMode && (
            <button 
              className={`settings-nav-btn ${subTab === 'team' ? 'active' : ''}`}
              onClick={() => setSubTab('team')}
            >
              <Users size={16} />
              <span>Equipe</span>
            </button>
          )}

          <button 
            className={`settings-nav-btn ${subTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setSubTab('integrations')}
          >
            <Calendar size={16} />
            <span>Agenda</span>
          </button>

          <button 
            className={`settings-nav-btn ${subTab === 'rules' ? 'active' : ''}`}
            onClick={() => setSubTab('rules')}
          >
            <ShieldCheck size={16} />
            <span>Prazos</span>
          </button>

          <button 
            className={`settings-nav-btn ${subTab === 'plan' ? 'active' : ''}`}
            onClick={() => setSubTab('plan')}
          >
            <CreditCard size={16} />
            <span>Plano</span>
          </button>
        </aside>

        {/* Área de Conteúdo da Configuração Selecionada */}
        <section className="settings-main-pane">
          
          {/* 1. DADOS DO ESCRITÓRIO */}
          {subTab === 'banca' && (
            <div className="settings-section-card">
              <h3 className="settings-pane-title">Escritório</h3>
              <p className="settings-pane-desc">Informações cadastrais utilizadas nos relatórios e roteamentos judiciais.</p>
              
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="input-label">Nome:</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={bancaNome}
                    onChange={e => setBancaNome(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Código:</label>
                  <input 
                    type="text" 
                    className="text-input readonly"
                    value={tenant.slug}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">CNPJ:</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={bancaCnpj}
                    onChange={e => setBancaCnpj(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">OAB:</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={bancaOab}
                    onChange={e => setBancaOab(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Telefone:</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={bancaTel}
                    onChange={e => setBancaTel(e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="input-label">Endereço:</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={bancaEnd}
                    onChange={e => setBancaEnd(e.target.value)}
                  />
                </div>

                {/* E-mail de Captura Integrado na Configuração */}
                <div className="form-group full-width" style={{ marginTop: '0.75rem', background: '#FFFDF9', border: '1px solid var(--gold-border)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-dark)', fontWeight: 700, margin: 0 }}>
                      <Mail size={16} color="#B47E20" />
                      <span>E-mail:</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setSubTab('inbound')}
                      className="btn-secondary mini-btn"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <ExternalLink size={13} />
                      <span>Instruções</span>
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      className="text-input readonly"
                      value={tenant.inboundEmail}
                      readOnly
                      style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)', background: '#F8FAFC' }}
                    />
                    <button 
                      type="button" 
                      onClick={handleCopyInbound}
                      className="btn-primary"
                      style={{ whiteSpace: 'nowrap', padding: '0.6rem 1.1rem' }}
                    >
                      {copiedEmail ? <Check size={15} /> : <Copy size={15} />}
                      <span>{copiedEmail ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '8px', display: 'block' }}>
                    Cadastre este endereço nos sistemas dos tribunais (PJe, e-SAJ, Projudi) ou convênios OAB para recebimento automático.
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* 2. E-MAIL DE RECEBIMENTO */}
          {subTab === 'inbound' && (
            <div className="settings-section-card">
              <h3 className="settings-pane-title">E-mail</h3>
              <p className="settings-pane-desc">
                Endereço exclusivo para recebimento e processamento automático de publicações e intimações judiciais.
              </p>

              <div className="inbound-highlight-box">
                <div className="inbound-copy-row">
                  <code className="inbound-target-email">{tenant.inboundEmail}</code>
                  <button onClick={handleCopyInbound} className="btn-primary mini-btn">
                    {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedEmail ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="instructions-guide-box">
                <h4 className="guide-title">Como vincular aos tribunais e convênios:</h4>
                <ol className="guide-steps-list">
                  <li>
                    <strong>Tribunais (PJe, e-SAJ, Projudi, Eproc):</strong> Cadastre este e-mail no seu perfil de advogado para comunicações eletrônicas.
                  </li>
                  <li>
                    <strong>Convênio OAB / Recortes / AASP:</strong> Adicione este endereço como destinatário secundário para receber as publicações.
                  </li>
                  <li>
                    <strong>Redirecionamento:</strong> Crie uma regra no seu e-mail corporativo encaminhando mensagens de tribunais para este endereço.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* 3. EQUIPE & OAB */}
          {subTab === 'team' && !isSoloMode && (
            <div className="settings-section-card">
              <div className="section-flex-header">
                <div>
                  <h3 className="settings-pane-title">Equipe</h3>
                  <p className="settings-pane-desc">
                    Direcionamento automático de intimações e prazos pela OAB de cada advogado.
                  </p>
                </div>
                <button className="btn-secondary mini-btn">
                  <UserPlus size={14} />
                  <span>Convidar</span>
                </button>
              </div>

              <div className="team-cards-grid">
                {lawyers.map(lawyer => (
                  <div key={lawyer.id} className="team-member-card">
                    <img src={lawyer.avatarUrl} alt={lawyer.name} className="member-avatar" />
                    <div className="member-details">
                      <div className="member-name">{lawyer.name}</div>
                      <div className="member-email">{lawyer.email}</div>
                      <div className="member-badges">
                        <span className="oab-pill">OAB: <strong>{lawyer.oabNumber || 'Geral'}</strong></span>
                        <span className="role-pill">{lawyer.role}</span>
                        {lawyer.googleCalendarLinked && (
                          <span className="sync-pill" title="Agenda conectada">
                            <CheckCircle2 size={12} color="#10B981" /> Agenda
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. AGENDA & ALERTAS */}
          {subTab === 'integrations' && (
            <div className="settings-section-card">
              <h3 className="settings-pane-title">Agenda</h3>
              <p className="settings-pane-desc">Configure a sincronização da agenda oficial e notificações de alerta.</p>

              <div className="toggles-list">
                <div className="toggle-item-row">
                  <div className="toggle-info">
                    <div className="toggle-title">
                      <Calendar size={18} color="#B47E20" />
                      <span>Google Agenda</span>
                    </div>
                    <div className="toggle-desc">
                      Prazos aprovados entram automaticamente na agenda oficial do advogado responsável.
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={googleCalendarSync} 
                    onChange={e => setGoogleCalendarSync(e.target.checked)}
                    className="toggle-checkbox"
                  />
                </div>

                <div className="toggle-item-row">
                  <div className="toggle-info">
                    <div className="toggle-title">
                      <Bell size={18} color="#B47E20" />
                      <span>WhatsApp</span>
                    </div>
                    <div className="toggle-desc">
                      Alertas enviados no celular antes da data fatal do prazo.
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={whatsappAlerts} 
                    onChange={e => setWhatsappAlerts(e.target.checked)}
                    className="toggle-checkbox"
                  />
                </div>

                <div className="toggle-item-row">
                  <div className="toggle-info">
                    <div className="toggle-title">
                      <Clock size={18} color="#B47E20" />
                      <span>Antecedência</span>
                    </div>
                    <div className="toggle-desc">
                      Tempo prévio para emissão dos avisos de prazo fatal.
                    </div>
                  </div>
                  <select 
                    value={alertHours} 
                    onChange={e => setAlertHours(Number(e.target.value))}
                    className="settings-select"
                  >
                    <option value={24}>24 horas antes</option>
                    <option value={48}>48 horas antes</option>
                    <option value={72}>72 horas antes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 5. REGRAS DE PRAZOS */}
          {subTab === 'rules' && (
            <div className="settings-section-card">
              <h3 className="settings-pane-title">Prazos</h3>
              <p className="settings-pane-desc">Critérios de contagem utilizados para calcular as datas fatais.</p>

              <div className="counting-rules-options">
                <label className={`rule-option-card ${countingRule === 'DIAS_UTEIS' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="rule" 
                    value="DIAS_UTEIS"
                    checked={countingRule === 'DIAS_UTEIS'}
                    onChange={() => setCountingRule('DIAS_UTEIS')}
                  />
                  <div>
                    <strong>Dias Úteis (Art. 219 CPC)</strong>
                    <p>Calcula prazos considerando apenas dias úteis, suspendendo contagem em fins de semana e feriados.</p>
                  </div>
                </label>

                <label className={`rule-option-card ${countingRule === 'DIAS_CORRIDOS' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="rule" 
                    value="DIAS_CORRIDOS"
                    checked={countingRule === 'DIAS_CORRIDOS'}
                    onChange={() => setCountingRule('DIAS_CORRIDOS')}
                  />
                  <div>
                    <strong>Dias Corridos (Penal / Juizados)</strong>
                    <p>Contagem contínua sem interrupção de fins de semana.</p>
                  </div>
                </label>
              </div>

              <div className="holidays-note-box">
                <ShieldCheck size={18} color="#10B981" />
                <span>
                  O NexAi-LEX inclui automaticamente o <strong>Recesso Forense (20 de Dezembro a 20 de Janeiro)</strong> conforme Art. 220 do CPC.
                </span>
              </div>
            </div>
          )}

          {/* 6. MEU PLANO */}
          {subTab === 'plan' && (
            <div className="settings-section-card">
              <h3 className="settings-pane-title">Plano</h3>
              <p className="settings-pane-desc">Detalhes da assinatura e faturamento do escritório.</p>

              <div className="client-plan-box">
                <div className="client-plan-header">
                  <div>
                    <span className="plan-badge-tag">{isSoloMode ? 'SOLO' : 'ESCRITÓRIO'}</span>
                    <div className="client-plan-price">
                      {isSoloMode ? 'R$ 97,00' : 'R$ 249,00'} <small>/ mês</small>
                    </div>
                  </div>
                  <span className="plan-active-status">● Ativo</span>
                </div>

                <div className="client-plan-details">
                  <div className="plan-detail-row">
                    <span>Usuários:</span>
                    <strong>{isSoloMode ? '1 Advogado' : `${lawyers.length} de 4 Advogados`}</strong>
                  </div>
                  <div className="plan-detail-row">
                    <span>Renovação:</span>
                    <strong>15 de Novembro de 2026</strong>
                  </div>
                  <div className="plan-detail-row">
                    <span>Pagamento:</span>
                    <strong>Cartão de Crédito</strong>
                  </div>
                </div>

                <div className="client-plan-actions">
                  <button className="btn-secondary mini-btn">Cartão</button>
                  <button className="btn-primary mini-btn">Upgrade</button>
                </div>
              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
};
