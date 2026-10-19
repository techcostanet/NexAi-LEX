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
            <h2 className="section-title">Central de Configurações da Banca</h2>
            <p className="section-desc">
              Gerencie os dados cadastrais do escritório, e-mail de captura, equipe de advogados e regras de prazos em um único local centralizado.
            </p>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary">
          <Save size={16} />
          <span>Salvar Alterações</span>
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
            <span>Dados da Banca</span>
          </button>

          <button 
            className={`settings-nav-btn ${subTab === 'inbound' ? 'active' : ''}`}
            onClick={() => setSubTab('inbound')}
          >
            <Mail size={16} />
            <span>E-mail de Captura</span>
          </button>

          {!isSoloMode && (
            <button 
              className={`settings-nav-btn ${subTab === 'team' ? 'active' : ''}`}
              onClick={() => setSubTab('team')}
            >
              <Users size={16} />
              <span>Equipe & OABs ({lawyers.length})</span>
            </button>
          )}

          <button 
            className={`settings-nav-btn ${subTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setSubTab('integrations')}
          >
            <Calendar size={16} />
            <span>Google Agenda & Alertas</span>
          </button>

          <button 
            className={`settings-nav-btn ${subTab === 'rules' ? 'active' : ''}`}
            onClick={() => setSubTab('rules')}
          >
            <ShieldCheck size={16} />
            <span>Contagem de Prazos (CPC)</span>
          </button>

          <button 
            className={`settings-nav-btn ${subTab === 'plan' ? 'active' : ''}`}
            onClick={() => setSubTab('plan')}
          >
            <CreditCard size={16} />
            <span>Meu Plano & Faturas</span>
          </button>
        </aside>

        {/* Área de Conteúdo da Configuração Selecionada */}
        <section className="settings-main-pane">
          
          {/* 1. DADOS DA BANCA */}
          {subTab === 'banca' && (
            <div className="settings-section-card">
              <h3 className="settings-pane-title">Dados Cadastrais da Banca Jurídica</h3>
              <p className="settings-pane-desc">Informações do escritório utilizadas nos relatórios e roteamentos judiciais.</p>
              
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="input-label">Nome da Sociedade / Advogado:</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={bancaNome}
                    onChange={e => setBancaNome(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Identificador Único (Slug):</label>
                  <input 
                    type="text" 
                    className="text-input readonly"
                    value={tenant.slug}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">CNPJ da Sociedade de Advogados:</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={bancaCnpj}
                    onChange={e => setBancaCnpj(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">OAB Principal do Escritório:</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={bancaOab}
                    onChange={e => setBancaOab(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Telefone / WhatsApp Comercial:</label>
                  <input 
                    type="text" 
                    className="text-input"
                    value={bancaTel}
                    onChange={e => setBancaTel(e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="input-label">Endereço da Sede do Escritório:</label>
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
                      <span>E-mail Dedicado de Captura e Ingestão de Intimações (IA)</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setSubTab('inbound')}
                      className="btn-secondary mini-btn"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <ExternalLink size={13} />
                      <span>Ver Instruções para Tribunais</span>
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
                      <span>{copiedEmail ? 'Copiado!' : 'Copiar E-mail'}</span>
                    </button>
                  </div>
                  <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '8px', display: 'block' }}>
                    Cadastre este endereço nos sistemas dos tribunais (PJe, e-SAJ, Projudi) ou no seu convênio OAB para que o Google Gemini processe suas intimações e prazos automaticamente.
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* 2. E-MAIL DE CAPTURA DEDICADO */}
          {subTab === 'inbound' && (
            <div className="settings-section-card">
              <h3 className="settings-pane-title">E-mail de Captura Dedicado (Inbound Gateway)</h3>
              <p className="settings-pane-desc">
                Este é o endereço de e-mail exclusivo da sua banca. Todas as publicações e intimações enviadas para ele são automaticamente lidas e processadas pelo Google Gemini 1.5.
              </p>

              <div className="inbound-highlight-box">
                <div className="inbound-copy-row">
                  <code className="inbound-target-email">{tenant.inboundEmail}</code>
                  <button onClick={handleCopyInbound} className="btn-primary mini-btn">
                    {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedEmail ? 'Copiado!' : 'Copiar E-mail'}</span>
                  </button>
                </div>
              </div>

              <div className="instructions-guide-box">
                <h4 className="guide-title">Como vincular aos tribunais e convênios:</h4>
                <ol className="guide-steps-list">
                  <li>
                    <strong>Sistemas dos Tribunais (PJe, e-SAJ, Projudi, Eproc):</strong> Cadastre este e-mail no seu perfil de advogado como endereço para comunicações eletrônicas.
                  </li>
                  <li>
                    <strong>Convênio OAB / Recortes / AASP:</strong> Adicione este endereço como destinatário secundário para receber as publicações do Diário Oficial.
                  </li>
                  <li>
                    <strong>Redirecionamento Automático:</strong> Crie uma regra no seu Outlook ou Gmail corporativo encaminhando e-mails de tribunais para este endereço.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* 3. EQUIPE & ROTEAMENTO POR OAB */}
          {subTab === 'team' && !isSoloMode && (
            <div className="settings-section-card">
              <div className="section-flex-header">
                <div>
                  <h3 className="settings-pane-title">Advogados & Chaves de Roteamento por OAB</h3>
                  <p className="settings-pane-desc">
                    Quando o Gemini detecta uma intimação, ele lê a OAB citada no despacho e direciona automaticamente a tarefa para o advogado correto.
                  </p>
                </div>
                <button className="btn-secondary mini-btn">
                  <UserPlus size={14} />
                  <span>Convidar Advogado</span>
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
                          <span className="sync-pill" title="Sincronizado com Google Agenda">
                            <CheckCircle2 size={12} color="#10B981" /> Google Sync
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. INTEGRAÇÕES GOOGLE & ALERTAS */}
          {subTab === 'integrations' && (
            <div className="settings-section-card">
              <h3 className="settings-pane-title">Integrações Cloud & Notificações</h3>
              <p className="settings-pane-desc">Configure os canais de recebimento de alertas e a sincronização em nuvem.</p>

              <div className="toggles-list">
                <div className="toggle-item-row">
                  <div className="toggle-info">
                    <div className="toggle-title">
                      <Calendar size={18} color="#B47E20" />
                      <span>Sincronização com Google Agenda (Google Calendar)</span>
                    </div>
                    <div className="toggle-desc">
                      Prazos fatais aprovados pela banca entram automaticamente na agenda oficial do advogado responsável.
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
                      <span>Alertas de Prazo Fatal por WhatsApp</span>
                    </div>
                    <div className="toggle-desc">
                      Notificações instantâneas enviadas no celular do advogado antes da expiração do prazo judicial.
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
                      <span>Antecedência Mínima do Alerta Crítico</span>
                    </div>
                    <div className="toggle-desc">
                      Defina com quantas horas de antecedência o sistema deve emitir avisos de risco de preclusão.
                    </div>
                  </div>
                  <select 
                    value={alertHours} 
                    onChange={e => setAlertHours(Number(e.target.value))}
                    className="settings-select"
                  >
                    <option value={24}>24 horas antes da data fatal</option>
                    <option value={48}>48 horas antes da data fatal (Recomendado)</option>
                    <option value={72}>72 horas antes da data fatal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 5. REGRAS DE CONTAGEM DE PRAZOS (CPC/CLT) */}
          {subTab === 'rules' && (
            <div className="settings-section-card">
              <h3 className="settings-pane-title">Regras de Contagem de Prazos Processuais</h3>
              <p className="settings-pane-desc">Definição dos critérios que o motor de inteligência processual utiliza para estimar datas fatais.</p>

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
                    <strong>Padrão CPC — Dias Úteis (Art. 219 do CPC)</strong>
                    <p>Calcula prazos judiciais considerando apenas dias úteis, suspendendo contagem em sábados, domingos e feriados nacionais.</p>
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
                    <strong>Dias Corridos (Penal / Juizados Especiais Específicos)</strong>
                    <p>Contagem contínua sem interrupção de fins de semana (aplicável a matéria criminal e prazos materiais decadenciais).</p>
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

          {/* 6. MEU PLANO & FATURAS */}
          {subTab === 'plan' && (
            <div className="settings-section-card">
              <h3 className="settings-pane-title">Assinatura & Faturamento da Banca</h3>
              <p className="settings-pane-desc">Informações do plano contratado e histórico de mensalidades.</p>

              <div className="client-plan-box">
                <div className="client-plan-header">
                  <div>
                    <span className="plan-badge-tag">{isSoloMode ? 'PLANO SOLO' : 'PLANO ESCRITÓRIO ASSOCIADOS'}</span>
                    <div className="client-plan-price">
                      {isSoloMode ? 'R$ 97,00' : 'R$ 249,00'} <small>/ mês</small>
                    </div>
                  </div>
                  <span className="plan-active-status">● Assinatura Ativa</span>
                </div>

                <div className="client-plan-details">
                  <div className="plan-detail-row">
                    <span>Usuários Cadastrados:</span>
                    <strong>{isSoloMode ? '1 Advogado' : `${lawyers.length} de 4 Advogados`}</strong>
                  </div>
                  <div className="plan-detail-row">
                    <span>Próxima Cobrança Automática:</span>
                    <strong>15 de Novembro de 2026</strong>
                  </div>
                  <div className="plan-detail-row">
                    <span>Forma de Pagamento:</span>
                    <strong>Cartão de Crédito terminado em 4092</strong>
                  </div>
                </div>

                <div className="client-plan-actions">
                  <button className="btn-secondary mini-btn">Alterar Cartão</button>
                  <button className="btn-primary mini-btn">Fazer Upgrade de Plano</button>
                </div>
              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
};
