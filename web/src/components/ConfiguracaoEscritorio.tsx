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
  userEmail?: string;
  onSaveTenant?: (updated: Partial<Tenant>) => void;
}

export const ConfiguracaoEscritorio: React.FC<ConfiguracaoEscritorioProps> = ({
  tenant,
  lawyers,
  isSoloMode,
  userEmail
}) => {
  const [subTab, setSubTab] = useState<'banca' | 'inbound' | 'team' | 'integrations' | 'rules' | 'plan'>('banca');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Estados dos formulários de configuração
  const [bancaNome, setBancaNome] = useState(tenant.name);
  const [bancaCpf, setBancaCpf] = useState(tenant.cpf || '321.654.987-00');
  const [bancaCnpj, setBancaCnpj] = useState(tenant.cnpj || '14.892.301/0001-55');
  const [bancaEmailCadastro, setBancaEmailCadastro] = useState(userEmail || tenant.contactEmail || 'demo@nexai.com.br');
  const [bancaOab, setBancaOab] = useState(tenant.oabPrincipal || (isSoloMode ? '345.891/SP' : '123456/SP'));
  const [bancaTel, setBancaTel] = useState(tenant.telefone || (isSoloMode ? '(11) 98765-4321' : '(11) 3289-4400'));
  const [bancaEnd, setBancaEnd] = useState(tenant.endereco || 'Av. Paulista, 1000, Cj. 42 - Bela Vista, São Paulo - SP');

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
              {isSoloMode 
                ? 'Gerencie seus dados profissionais, e-mail de captura e regras de prazos.' 
                : 'Gerencie as informações do seu escritório, equipe e regras de prazos.'}
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
            <span>{isSoloMode ? 'Perfil Profissional' : 'Escritório'}</span>
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
          
          {/* 1. DADOS CADASTRAIS (PERFIL PROFISSIONAL / ESCRITÓRIO) */}
          {subTab === 'banca' && (
            <div className="settings-section-card">
              <h3 className="settings-pane-title">{isSoloMode ? 'Perfil Profissional' : 'Escritório'}</h3>
              <p className="settings-pane-desc">
                {isSoloMode 
                  ? 'Informações cadastrais do advogado titular utilizadas nos relatórios, procurações e roteamentos judiciais.' 
                  : 'Informações cadastrais utilizadas nos relatórios e roteamentos judiciais.'}
              </p>
              
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="input-label">Nome Completo / Titular:</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={bancaNome}
                    onChange={e => setBancaNome(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Código da Conta:</label>
                  <input 
                    type="text" 
                    className="text-input readonly"
                    value={tenant.slug}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">{isSoloMode ? 'CPF:' : 'CNPJ:'}</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={isSoloMode ? bancaCpf : bancaCnpj}
                    onChange={e => isSoloMode ? setBancaCpf(e.target.value) : setBancaCnpj(e.target.value)}
                    placeholder={isSoloMode ? "000.000.000-00" : "00.000.000/0001-00"}
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">OAB Principal:</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={bancaOab}
                    onChange={e => setBancaOab(e.target.value)}
                  />
                </div>

                {/* E-mail de Cadastro da Conta (Compra e Acesso) */}
                <div className="form-group">
                  <label className="input-label">E-mail de Cadastro:</label>
                  <input 
                    type="email" 
                    className="text-input"
                    value={bancaEmailCadastro}
                    onChange={e => setBancaEmailCadastro(e.target.value)}
                    placeholder="advogado@exemplo.com.br"
                  />
                  <small style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    E-mail do titular utilizado na contratação e login do NexAi-LEX.
                  </small>
                </div>

                <div className="form-group">
                  <label className="input-label">Telefone / WhatsApp:</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={bancaTel}
                    onChange={e => setBancaTel(e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="input-label">Endereço Profissional:</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={bancaEnd}
                    onChange={e => setBancaEnd(e.target.value)}
                  />
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
              <h3 className="settings-pane-title">Plano e Assinatura</h3>
              <p className="settings-pane-desc">Detalhes da sua assinatura individual e recursos ativos.</p>

              <div className="client-plan-box">
                <div className="client-plan-header">
                  <div>
                    <span className="plan-badge-tag" style={{ background: '#B47E20', color: '#FFFFFF', fontWeight: 700, letterSpacing: '0.05em' }}>
                      PLANO SOLO
                    </span>
                    <div className="client-plan-price" style={{ marginTop: '8px' }}>
                      R$ 97,00 <small>/ mês</small>
                    </div>
                  </div>
                  <span className="plan-active-status" style={{ color: '#10B981', fontWeight: 600 }}>
                    ● Assinatura Ativa
                  </span>
                </div>

                <div className="client-plan-details">
                  <div className="plan-detail-row">
                    <span>Modalidade:</span>
                    <strong>Advogado Autônomo / Individual</strong>
                  </div>
                  <div className="plan-detail-row">
                    <span>Acesso:</span>
                    <strong>1 Advogado Titular (Acesso Individual)</strong>
                  </div>
                  <div className="plan-detail-row">
                    <span>Intimações com IA:</span>
                    <strong>Até 250 intimações / mês</strong>
                  </div>
                  <div className="plan-detail-row">
                    <span>Google Agenda:</span>
                    <strong style={{ color: '#10B981' }}>Sincronização Ativa</strong>
                  </div>
                  <div className="plan-detail-row">
                    <span>Alertas no WhatsApp:</span>
                    <strong style={{ color: '#10B981' }}>Inclusos (Antecedência de 48h)</strong>
                  </div>
                  <div className="plan-detail-row">
                    <span>Próxima Renovação:</span>
                    <strong>15 de Novembro de 2026</strong>
                  </div>
                  <div className="plan-detail-row">
                    <span>Forma de Pagamento:</span>
                    <strong>Cartão de Crédito (•••• 4821)</strong>
                  </div>
                </div>

                {/* Banner de Upgrade para Escritório */}
                <div style={{ marginTop: '1.25rem', padding: '14px 18px', background: 'linear-gradient(135deg, #FFFDF8, #FBF6EC)', borderRadius: '12px', border: '1px solid var(--gold-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--gold-dark)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🚀</span> Sua banca cresceu?
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Migre para o <strong>Plano Escritório</strong> (até 4 advogados e 1.000 intimações/mês) por R$ 249/mês.
                    </div>
                  </div>
                  <button className="btn-primary mini-btn" style={{ whiteSpace: 'nowrap' }}>
                    Upgrade para Escritório
                  </button>
                </div>

                <div className="client-plan-actions" style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
                  <button className="btn-secondary mini-btn">Alterar Cartão</button>
                  <button className="btn-secondary mini-btn">Histórico de Faturas</button>
                </div>
              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
};
