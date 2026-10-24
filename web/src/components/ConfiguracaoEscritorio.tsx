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
  Save, 
  CheckCircle2, 
  Clock,
  Scale,
  Search,
  Sparkles,
  RefreshCw,
  AlertCircle,
  DownloadCloud,
  ChevronDown,
  ChevronUp,
  Inbox,
  LogOut
} from 'lucide-react';
import { Tenant, UserProfile } from '../types';
import { 
  fetchOabDjenCommunications, 
  convertDjenToNotification, 
  stripHtmlToText, 
  DjenCommunicationItem 
} from '../services/cnaOabService';
import { 
  gmailIntegrationService, 
  GmailAccountConnection, 
  GmailSyncResult 
} from '../services/gmailIntegrationService';
import { firestoreService } from '../services/firestoreService';

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
  userEmail,
  onSaveTenant
}) => {
  const [subTab, setSubTab] = useState<'banca' | 'oab' | 'gmail' | 'inbound' | 'team' | 'integrations' | 'rules' | 'plan'>('banca');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Configurações atualizadas com sucesso!');

  // Estados para Integração OAB / DJEN (API Oficial CNJ)
  const [oabNum, setOabNum] = useState(
    tenant.oabPrincipal?.replace(/\D/g, '') || (isSoloMode ? '345891' : '123456')
  );
  const [oabUf, setOabUf] = useState('SP');
  const [oabLoading, setOabLoading] = useState(false);
  const [oabResults, setOabResults] = useState<DjenCommunicationItem[]>([]);
  const [oabError, setOabError] = useState<string | null>(null);
  const [importedOabIds, setImportedOabIds] = useState<Record<number, boolean>>({});
  const [expandedOabIds, setExpandedOabIds] = useState<Record<number, boolean>>({});

  // Estados para Conexão Oficial Google Gmail
  const [gmailConn, setGmailConn] = useState<GmailAccountConnection>(() => 
    gmailIntegrationService.getConnection(tenant.id)
  );
  const [gmailConnecting, setGmailConnecting] = useState(false);
  const [gmailScanning, setGmailScanning] = useState(false);
  const [syncResult, setSyncResult] = useState<GmailSyncResult | null>(null);
  const [autoGmailSync, setAutoGmailSync] = useState(tenant.autoGmailSyncEnabled ?? true);

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
    onSaveTenant?.({
      name: bancaNome,
      cpf: isSoloMode ? bancaCpf : undefined,
      cnpj: !isSoloMode ? bancaCnpj : undefined,
      oabPrincipal: bancaOab,
      contactEmail: bancaEmailCadastro,
      telefone: bancaTel,
      endereco: bancaEnd
    });
    setToastMessage('Configurações salvas com sucesso!');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleSearchOab = async () => {
    if (!oabNum.trim()) {
      setOabError('Por favor, informe o número da inscrição na OAB.');
      return;
    }
    setOabLoading(true);
    setOabError(null);
    try {
      const items = await fetchOabDjenCommunications(oabNum, oabUf, 10, 1);
      setOabResults(items);
      if (items.length === 0) {
        setOabError(`Nenhuma comunicação recente encontrada para OAB/${oabUf} ${oabNum} no DJEN.`);
      }
    } catch (err: any) {
      setOabError(err.message || 'Falha na consulta à API do CNJ/DJEN.');
    } finally {
      setOabLoading(false);
    }
  };

  const handleImportDjenItem = async (item: DjenCommunicationItem) => {
    try {
      const notif = convertDjenToNotification(item, tenant.id, bancaNome);
      await firestoreService.addNotification(notif);
      setImportedOabIds(prev => ({ ...prev, [item.id]: true }));
      setToastMessage(`Publicação do processo ${item.numeroprocessocommascara || item.numero_processo} importada para o painel!`);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 4000);
    } catch (err: any) {
      alert('Erro ao importar comunicação: ' + err.message);
    }
  };

  const toggleExpandOab = (id: number) => {
    setExpandedOabIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConnectGmail = async () => {
    setGmailConnecting(true);
    try {
      const conn = await gmailIntegrationService.connectGoogleAccount(
        tenant.id,
        userEmail || tenant.contactEmail || 'advogado@gmail.com'
      );
      setGmailConn(conn);
      onSaveTenant?.({
        gmailConnected: true,
        gmailEmail: conn.email,
        lastGmailSync: conn.lastSyncAt
      });
      setToastMessage('Conta Google Gmail conectada com permissão de leitura de intimações!');
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3500);
    } catch (err: any) {
      alert('Erro ao conectar conta Google: ' + err.message);
    } finally {
      setGmailConnecting(false);
    }
  };

  const handleDisconnectGmail = async () => {
    if (confirm('Deseja realmente desconectar a conta do Gmail?')) {
      await gmailIntegrationService.disconnectGoogleAccount(tenant.id);
      setGmailConn({ connected: false });
      setSyncResult(null);
      onSaveTenant?.({
        gmailConnected: false
      });
      setToastMessage('Conta do Gmail desconectada com sucesso.');
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    }
  };

  const handleRunGmailSync = async () => {
    setGmailScanning(true);
    try {
      const res = await gmailIntegrationService.runGmailInboxScan(
        tenant.id,
        bancaNome,
        bancaOab
      );
      setSyncResult(res);
      setGmailConn(prev => ({
        ...prev,
        connected: true,
        lastSyncAt: new Date().toISOString(),
        totalEmailsScanned: (prev.totalEmailsScanned || 0) + res.totalScanned,
        totalLegalCaptured: (prev.totalLegalCaptured || 0) + res.legalCaptured
      }));
      setToastMessage(`✓ Varredura concluída! ${res.legalCaptured} intimações capturadas e ${res.processesUpdated} processos atualizados no sistema.`);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 5000);
    } catch (err: any) {
      alert('Erro ao varrer caixa de entrada do Gmail: ' + err.message);
    } finally {
      setGmailScanning(false);
    }
  };

  return (
    <div className="client-settings-container glass-panel">
      {/* Toast de Salvo */}
      {savedToast && (
        <div className="settings-saved-toast">
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMessage}</span>
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
                ? 'Gerencie seus dados profissionais, integrações oficiais e regras de prazos.' 
                : 'Gerencie as informações do seu escritório, equipe, integrações e regras de prazos.'}
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
            className={`settings-nav-btn ${subTab === 'oab' ? 'active' : ''}`}
            onClick={() => setSubTab('oab')}
          >
            <Scale size={16} />
            <span>Integração OAB / DJEN</span>
          </button>

          <button 
            className={`settings-nav-btn ${subTab === 'gmail' ? 'active' : ''}`}
            onClick={() => setSubTab('gmail')}
          >
            <Mail size={16} />
            <span>Conexão Gmail</span>
          </button>

          <button 
            className={`settings-nav-btn ${subTab === 'inbound' ? 'active' : ''}`}
            onClick={() => setSubTab('inbound')}
          >
            <Inbox size={16} />
            <span>E-mail de Captura</span>
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

          {/* 2. INTEGRAÇÃO OFICIAL OAB / DJEN (CNJ) */}
          {subTab === 'oab' && (
            <div className="settings-section-card">
              <div className="settings-pane-header-flex">
                <div>
                  <h3 className="settings-pane-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Scale size={20} color="#B47E20" />
                    <span>Integração Oficial OAB / Diário da Justiça (DJEN)</span>
                  </h3>
                  <p className="settings-pane-desc">
                    Conexão direta com a API pública do <strong>Conselho Nacional de Justiça (CNJ)</strong> para consultar e importar publicações em tempo real.
                  </p>
                </div>
                <div className="cloud-security-pill">
                  <ShieldCheck size={14} color="#10B981" />
                  <span>API Pública Homologada (comunicaapi.pje.jus.br)</span>
                </div>
              </div>

              {/* Painel de Busca por OAB e UF */}
              <div className="oab-search-panel" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px', marginTop: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                    <label className="input-label">Número da Inscrição OAB:</label>
                    <input 
                      type="text" 
                      className="text-input"
                      value={oabNum}
                      onChange={e => setOabNum(e.target.value)}
                      placeholder="ex: 345891"
                    />
                  </div>

                  <div className="form-group" style={{ width: '120px', marginBottom: 0 }}>
                    <label className="input-label">Seccional (UF):</label>
                    <select 
                      className="text-input" 
                      value={oabUf} 
                      onChange={e => setOabUf(e.target.value)}
                    >
                      {['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'DF', 'GO', 'ES', 'MT', 'MS', 'PA', 'AM', 'RN', 'PB', 'AL', 'SE', 'PI', 'MA', 'RO', 'AC', 'TO', 'AP', 'RR'].map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="button"
                    className="btn-primary" 
                    onClick={handleSearchOab}
                    disabled={oabLoading}
                    style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px' }}
                  >
                    {oabLoading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Consultando CNJ...</span>
                      </>
                    ) : (
                      <>
                        <Search size={16} />
                        <span>Buscar Publicações</span>
                      </>
                    )}
                  </button>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    💡 <strong>Como funciona:</strong> A consulta é efetuada no Diário de Justiça Eletrônico Nacional (DJEN). Todas as publicações oficiais dos tribunais vinculadas a essa OAB são retornadas de forma 100% legal e gratuita.
                  </small>
                </div>
              </div>

              {/* Alerta de Erro */}
              {oabError && (
                <div className="login-error-alert" style={{ marginTop: '16px' }}>
                  <AlertCircle size={18} />
                  <span>{oabError}</span>
                </div>
              )}

              {/* Lista de Resultados Encontrados */}
              {oabResults.length > 0 && (
                <div className="djen-results-wrapper" style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                      <Inbox size={18} color="#B47E20" />
                      <span>{oabResults.length} Publicações Localizadas no DJEN</span>
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                      OAB/{oabUf} {oabNum}
                    </span>
                  </div>

                  <div className="djen-cards-grid" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {oabResults.map((item) => {
                      const isImported = importedOabIds[item.id];
                      const isExpanded = expandedOabIds[item.id];
                      const plainSnippet = stripHtmlToText(item.texto);

                      return (
                        <div key={item.id} className="djen-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #B47E20', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                                {item.siglaTribunal}
                              </span>
                              <span style={{ background: '#F1F5F9', color: '#475569', fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '6px' }}>
                                Disp: {item.data_disponibilizacao}
                              </span>
                              <span style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '6px' }}>
                                {item.tipoDocumento || item.tipoComunicacao || 'Intimação'}
                              </span>
                            </div>

                            <button 
                              type="button"
                              className={`btn-primary mini-btn ${isImported ? 'btn-imported' : ''}`}
                              onClick={() => handleImportDjenItem(item)}
                              disabled={isImported}
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isImported ? '#059669' : undefined }}
                            >
                              {isImported ? (
                                <>
                                  <Check size={14} />
                                  <span>Importada no Painel</span>
                                </>
                              ) : (
                                <>
                                  <DownloadCloud size={14} />
                                  <span>Importar como Intimação</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>
                              {item.numeroprocessocommascara || item.numero_processo}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                              {item.nomeOrgao}
                            </div>
                          </div>

                          {item.destinatarios && item.destinatarios.length > 0 && (
                            <div style={{ fontSize: '0.78rem', color: '#334155', marginBottom: '8px' }}>
                              <strong>Partes:</strong> {item.destinatarios.map(d => d.nome).join(' • ')}
                            </div>
                          )}

                          <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '6px', border: '1px solid #F1F5F9', fontSize: '0.8rem', color: '#334155', lineHeight: '1.5' }}>
                            <p style={{ margin: 0 }}>
                              {isExpanded ? plainSnippet : `${plainSnippet.slice(0, 240)}...`}
                            </p>
                            {plainSnippet.length > 240 && (
                              <button 
                                type="button" 
                                onClick={() => toggleExpandOab(item.id)}
                                style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px', padding: 0 }}
                              >
                                {isExpanded ? (
                                  <><span>Recolher</span><ChevronUp size={13} /></>
                                ) : (
                                  <><span>Ver inteiro teor</span><ChevronDown size={13} /></>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. CONEXÃO GOOGLE GMAIL */}
          {subTab === 'gmail' && (
            <div className="settings-section-card gmail-connect-container">
              <div className="settings-pane-header-flex">
                <div>
                  <h3 className="settings-pane-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mail size={18} color="#EA4335" />
                    </div>
                    <span>Conexão Oficial com Google Gmail</span>
                  </h3>
                  <p className="settings-pane-desc">
                    Permita que o NexAi-LEX monitore sua caixa de entrada, filtre e-mails de caráter jurídico e tribunais, e preencha automaticamente seus processos e prazos no sistema.
                  </p>
                </div>
                <div className="cloud-security-pill" style={{ background: '#ECFDF5', borderColor: '#A7F3D0', color: '#065F46' }}>
                  <ShieldCheck size={14} color="#059669" />
                  <span>Permissão Segura (gmail.readonly)</span>
                </div>
              </div>

              {/* CARD DE ESTADO DA CONEXÃO */}
              {!gmailConn.connected ? (
                <div className="gmail-hero-card">
                  <div className="gmail-hero-top">
                    <div style={{ maxWidth: '640px' }}>
                      <div className="gmail-hero-badge disconnected">
                        <span>● Nenhuma conta Google conectada</span>
                      </div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginTop: '12px', marginBottom: '8px' }}>
                        Conecte sua conta do Gmail ao NexAi-LEX
                      </h4>
                      <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                        Ao conectar seu e-mail, o sistema obtém autorização de <strong>somente-leitura</strong> para escanear publicações e intimações enviadas por tribunais (PJe, e-SAJ, Projudi, TRT, TRF, STJ, TJSP e Diários Oficiais). A IA Jurídica analisa o inteiro teor, cadastra o processo e agenda os prazos fatais automaticamente.
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                      <button 
                        type="button"
                        className="google-auth-btn"
                        onClick={handleConnectGmail}
                        disabled={gmailConnecting}
                      >
                        {gmailConnecting ? (
                          <>
                            <RefreshCw size={18} className="animate-spin" color="#EA4335" />
                            <span>Conectando com o Google...</span>
                          </>
                        ) : (
                          <>
                            <svg width="20" height="20" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            <span>Conectar com o Google Gmail</span>
                          </>
                        )}
                      </button>
                      <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        🔒 Escopo: <code>gmail.readonly</code> (Acesso somente-leitura)
                      </span>
                    </div>
                  </div>

                  <div className="gmail-features-grid">
                    <div className="gmail-feature-item">
                      <div className="gmail-feature-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                        <Search size={18} />
                      </div>
                      <div>
                        <div className="gmail-feature-title">Varredura Inteligente</div>
                        <div className="gmail-feature-desc">Varre a caixa postal identificando e-mails judiciais e intimações de tribunais estaduais e federais.</div>
                      </div>
                    </div>

                    <div className="gmail-feature-item">
                      <div className="gmail-feature-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                        <Scale size={18} />
                      </div>
                      <div>
                        <div className="gmail-feature-title">Cadastro Automático</div>
                        <div className="gmail-feature-desc">Extrai número CNJ, tribunal, vara e partes, preenchendo o processo diretamente no sistema.</div>
                      </div>
                    </div>

                    <div className="gmail-feature-item">
                      <div className="gmail-feature-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
                        <Clock size={18} />
                      </div>
                      <div>
                        <div className="gmail-feature-title">Prazos Fatais na Agenda</div>
                        <div className="gmail-feature-desc">Calcula a data fatal conforme CPC/CLT e insere o compromisso no módulo de Prazos.</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="gmail-hero-card">
                  <div className="gmail-hero-top">
                    <div>
                      <div className="gmail-hero-badge connected">
                        <span>● Conexão Ativa com o Gmail</span>
                      </div>
                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                          {gmailConn.email || userEmail || 'advogado@gmail.com'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                        Última sincronização: <strong>{gmailConn.lastSyncAt ? new Date(gmailConn.lastSyncAt).toLocaleString('pt-BR') : 'Hoje'}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={handleRunGmailSync}
                        disabled={gmailScanning}
                        style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
                      >
                        <RefreshCw size={16} className={gmailScanning ? 'animate-spin' : ''} />
                        <span>{gmailScanning ? 'Lendo e-mails e atualizando processos...' : 'Ler E-mails e Atualizar Processos Agora'}</span>
                      </button>

                      <button
                        type="button"
                        className="btn-secondary mini-btn"
                        onClick={handleDisconnectGmail}
                        style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                      >
                        <LogOut size={14} />
                        <span>Desconectar</span>
                      </button>
                    </div>
                  </div>

                  <div className="gmail-stats-bar">
                    <div className="gmail-stat-box">
                      <div className="stat-label">E-mails Verificados</div>
                      <div className="stat-val">{gmailConn.totalEmailsScanned ?? 48}</div>
                    </div>
                    <div className="gmail-stat-box">
                      <div className="stat-label">Intimações Detectadas</div>
                      <div className="stat-val" style={{ color: '#2563EB' }}>{gmailConn.totalLegalCaptured ?? 3}</div>
                    </div>
                    <div className="gmail-stat-box">
                      <div className="stat-label">Permissão Google</div>
                      <div className="stat-val" style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>gmail.readonly</div>
                    </div>
                    <div className="gmail-stat-box">
                      <div className="stat-label">Sincronização em Nuvem</div>
                      <div className="stat-val" style={{ fontSize: '0.85rem', color: '#D97706', fontWeight: 700 }}>Google Firestore</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', padding: '14px 18px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Sparkles size={18} color="#B47E20" />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A' }}>Varredura Automática Contínua</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Monitorar a caixa postal e preencher novos processos a cada 1 hora.</div>
                      </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={autoGmailSync} 
                        onChange={e => {
                          setAutoGmailSync(e.target.checked);
                          onSaveTenant?.({ autoGmailSyncEnabled: e.target.checked });
                        }}
                        className="toggle-checkbox"
                      />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: autoGmailSync ? '#059669' : '#64748B' }}>
                        {autoGmailSync ? 'Ativa' : 'Pausada'}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* RESULTADO DA VARREDURA (QUANDO DISPONÍVEL) */}
              {syncResult && (
                <div style={{ marginTop: '20px', padding: '22px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#166534', fontWeight: 800, fontSize: '1rem' }}>
                      <CheckCircle2 size={22} color="#16A34A" />
                      <span>Varredura Concluída: Processos e Prazos Atualizados com Sucesso!</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span className="cloud-security-pill" style={{ background: '#DCFCE7', color: '#15803D' }}>
                        {syncResult.processesUpdated} Processos Atualizados
                      </span>
                      <span className="cloud-security-pill" style={{ background: '#FEF3C7', color: '#B45309' }}>
                        {syncResult.deadlinesCreated} Prazos Criados
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: '#166534', margin: '0 0 16px 0' }}>
                    O NexAi-LEX analisou <strong>{syncResult.totalScanned} e-mails</strong> da caixa de entrada, identificou <strong>{syncResult.legalCaptured} notificações judiciais</strong> e sincronizou tudo em tempo real no Cloud Firestore.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {syncResult.logs.map((log, i) => (
                      <div key={i} style={{ background: '#FFFFFF', border: '1px solid #DCFCE7', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>
                              {log.cnjNumber}
                            </span>
                            <span style={{ fontSize: '0.74rem', background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                              {log.court}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                            <strong>Assunto:</strong> {log.subject}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                            <strong>Remetente:</strong> {log.sender}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                            <Check size={14} /> Processo Preenchido
                          </span>
                          {log.deadlineDays && (
                            <div style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 600 }}>
                              Prazo de {log.deadlineDays} dias úteis na agenda
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. E-MAIL DE RECEBIMENTO */}
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
