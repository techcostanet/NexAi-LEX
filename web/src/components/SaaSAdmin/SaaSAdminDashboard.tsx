import React, { useState } from 'react';
import { 
  Building2, 
  DollarSign, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Activity, 
  Search, 
  CreditCard, 
  ArrowUpRight, 
  ArrowLeft, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Cpu, 
  Mail, 
  Database, 
  CloudLightning,
  UserCheck,
  ChevronRight,
  PlusCircle,
  Percent,
  LogOut
} from 'lucide-react';
import { 
  mockSaaSMetrics, 
  mockSaaSClients, 
  mockSaaSTransactions, 
  mockSaaSPlans, 
  mockSaaSInfraStatus 
} from '../../mockData';
import { SaaSClient, TenantPlan, ClientSubscriptionStatus, AuthUser } from '../../types';

interface SaaSAdminDashboardProps {
  onBackToClient: () => void;
  onLogout?: () => void;
  currentUserAuth?: AuthUser;
}

export const SaaSAdminDashboard: React.FC<SaaSAdminDashboardProps> = ({ 
  onBackToClient,
  onLogout,
  currentUserAuth
}) => {
  const [adminTab, setAdminTab] = useState<'cockpit' | 'clients' | 'financial' | 'plans' | 'infra'>('cockpit');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ClientSubscriptionStatus>('ALL');
  const [clientsList, setClientsList] = useState<SaaSClient[]>(mockSaaSClients);
  const [selectedClient, setSelectedClient] = useState<SaaSClient | null>(null);

  const filteredClients = clientsList.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cnpjOrCpf.includes(searchTerm) ||
      c.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cityState.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && c.status === statusFilter;
  });

  const handleToggleStatus = (clientId: string) => {
    setClientsList(prev => prev.map(c => {
      if (c.id === clientId) {
        const nextStatus: ClientSubscriptionStatus = c.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  return (
    <div className="saas-admin-wrapper">
      {/* SuperAdmin Top Bar */}
      <header className="saas-admin-header glass-panel">
        <div className="saas-admin-header-main">
          <div className="saas-admin-brand">
            <div className="saas-admin-badge-icon">
              <ShieldCheck size={22} color="#FFFFFF" />
            </div>
            <div>
              <div className="saas-admin-title">
                NexAi-LEX <span className="superadmin-tag">MASTER ADMIN</span>
              </div>
              <div className="saas-admin-subtitle">
                Gestão Global do SaaS Jurídico • Multi-tenant Google Cloud
              </div>
            </div>
          </div>

          <div className="saas-admin-actions">
            <div className="cloud-status-indicator" title="Infraestrutura Google Cloud Operacional">
              <span className="status-dot-pulse"></span>
              <span>Google Cloud: <strong>100% Online</strong></span>
            </div>

            <button 
              onClick={onBackToClient}
              className="btn-exit-admin"
              title="Visualizar como Escritório de Advocacia"
            >
              <ArrowLeft size={16} />
              <span>Ver Visão do Escritório</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="btn-admin-logout"
                title="Encerrar sessão de Administrador Master"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            )}
          </div>
        </div>

        {/* SuperAdmin Tabs Navigation */}
        <nav className="saas-admin-nav">
          <button 
            className={`admin-nav-item ${adminTab === 'cockpit' ? 'active' : ''}`}
            onClick={() => setAdminTab('cockpit')}
          >
            <TrendingUp size={16} />
            <span>Cockpit Executivo</span>
          </button>

          <button 
            className={`admin-nav-item ${adminTab === 'clients' ? 'active' : ''}`}
            onClick={() => setAdminTab('clients')}
          >
            <Building2 size={16} />
            <span>Gestão de Clientes ({clientsList.length})</span>
          </button>

          <button 
            className={`admin-nav-item ${adminTab === 'financial' ? 'active' : ''}`}
            onClick={() => setAdminTab('financial')}
          >
            <DollarSign size={16} />
            <span>Financeiro & Assinaturas</span>
          </button>

          <button 
            className={`admin-nav-item ${adminTab === 'plans' ? 'active' : ''}`}
            onClick={() => setAdminTab('plans')}
          >
            <Layers size={16} />
            <span>Planos & Precificação</span>
          </button>

          <button 
            className={`admin-nav-item ${adminTab === 'infra' ? 'active' : ''}`}
            onClick={() => setAdminTab('infra')}
          >
            <Cpu size={16} />
            <span>IA & Google Cloud</span>
          </button>
        </nav>
      </header>

      {/* Conteúdo da Aba Ativa do SuperAdmin */}
      <main className="saas-admin-content">
        
        {/* =========================================================
            ABA 1: COCKPIT EXECUTIVO
            ========================================================= */}
        {adminTab === 'cockpit' && (
          <div className="cockpit-container">
            {/* Grid de KPIs Principais */}
            <div className="kpis-grid">
              <div className="kpi-card glass-panel">
                <div className="kpi-top">
                  <span className="kpi-label">MRR (Faturamento Recorrente)</span>
                  <div className="kpi-icon-circle green">
                    <DollarSign size={18} />
                  </div>
                </div>
                <div className="kpi-value">
                  R$ {mockSaaSMetrics.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="kpi-delta positive">
                  <ArrowUpRight size={14} />
                  <span>+{mockSaaSMetrics.mrrGrowthRate}% neste mês</span>
                </div>
              </div>

              <div className="kpi-card glass-panel">
                <div className="kpi-top">
                  <span className="kpi-label">ARR Projetado (Anual)</span>
                  <div className="kpi-icon-circle blue">
                    <TrendingUp size={18} />
                  </div>
                </div>
                <div className="kpi-value">
                  R$ {mockSaaSMetrics.arr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="kpi-subtext">Baseado nas 142 bancas ativas</div>
              </div>

              <div className="kpi-card glass-panel">
                <div className="kpi-top">
                  <span className="kpi-label">Bancas / Clientes Ativos</span>
                  <div className="kpi-icon-circle gold">
                    <Building2 size={18} />
                  </div>
                </div>
                <div className="kpi-value">{mockSaaSMetrics.totalActiveTenants}</div>
                <div className="kpi-subtext">{mockSaaSMetrics.totalLawyers} advogados utilizando</div>
              </div>

              <div className="kpi-card glass-panel highlight-margin">
                <div className="kpi-top">
                  <span className="kpi-label">Margem Bruta do SaaS</span>
                  <div className="kpi-icon-circle green">
                    <Percent size={18} />
                  </div>
                </div>
                <div className="kpi-value green-text">{mockSaaSMetrics.grossMarginPercent}%</div>
                <div className="kpi-subtext">
                  Custo Gemini: ~R$ {mockSaaSMetrics.geminiEstimatedCost.toFixed(2)} / mês
                </div>
              </div>
            </div>

            {/* Painéis Inferiores do Cockpit */}
            <div className="cockpit-split-grid">
              {/* Resumo da Ingestão e Processamento */}
              <div className="cockpit-card glass-panel">
                <div className="cockpit-card-header">
                  <div className="card-header-left">
                    <Sparkles size={18} color="#B47E20" />
                    <h3>Volume de Ingestão de Intimações (Mês Atual)</h3>
                  </div>
                  <span className="badge-pill gold">Google Gemini 1.5 Flash</span>
                </div>

                <div className="metrics-big-stat">
                  <div className="big-stat-number">
                    {mockSaaSMetrics.monthlyIntimationsProcessed.toLocaleString('pt-BR')}
                  </div>
                  <div className="big-stat-desc">
                    Intimações e publicações judiciais lidas, estruturadas e classificadas com zero esforço manual dos advogados.
                  </div>
                </div>

                <div className="unit-economics-overview">
                  <div className="unit-eco-item">
                    <span className="unit-label">Ticket Médio por Banca:</span>
                    <strong className="unit-val">R$ {mockSaaSMetrics.averageTicket.toFixed(2)}</strong>
                  </div>
                  <div className="unit-eco-item">
                    <span className="unit-label">Taxa de Churn:</span>
                    <strong className="unit-val text-success">{mockSaaSMetrics.churnRatePercent}%</strong>
                  </div>
                  <div className="unit-eco-item">
                    <span className="unit-label">Custo Médio de IA por Intimação:</span>
                    <strong className="unit-val text-success">R$ 0,007</strong>
                  </div>
                </div>
              </div>

              {/* Status Rápido dos Clientes */}
              <div className="cockpit-card glass-panel">
                <div className="cockpit-card-header">
                  <div className="card-header-left">
                    <Users size={18} color="#B47E20" />
                    <h3>Distribuição de Clientes por Plano</h3>
                  </div>
                </div>

                <div className="plans-distribution-list">
                  <div className="dist-item">
                    <div className="dist-info">
                      <span className="dist-name">Plano Escritório (R$ 249/mês)</span>
                      <span className="dist-share">78 bancas (55%)</span>
                    </div>
                    <div className="dist-bar"><div className="dist-fill" style={{ width: '55%' }}></div></div>
                  </div>

                  <div className="dist-item">
                    <div className="dist-info">
                      <span className="dist-name">Plano Solo (R$ 97/mês)</span>
                      <span className="dist-share">49 advogados (35%)</span>
                    </div>
                    <div className="dist-bar"><div className="dist-fill" style={{ width: '35%' }}></div></div>
                  </div>

                  <div className="dist-item">
                    <div className="dist-info">
                      <span className="dist-name">Plano Pro / Corporate (R$ 499/mês)</span>
                      <span className="dist-share">15 bancas (10%)</span>
                    </div>
                    <div className="dist-bar"><div className="dist-fill" style={{ width: '10%' }}></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            ABA 2: GESTÃO DE CLIENTES / BANCAS
            ========================================================= */}
        {adminTab === 'clients' && (
          <div className="clients-manager-container glass-panel">
            <div className="clients-manager-header">
              <div>
                <h2 className="section-title">Bancas & Escritórios Cadastrados</h2>
                <p className="section-desc">
                  Gerenciamento de assinaturas, limites de advogados, e-mails de captura dedicados e status das bancas.
                </p>
              </div>

              <div className="clients-filter-bar">
                <div className="search-box">
                  <Search size={16} color="#64748B" />
                  <input 
                    type="text" 
                    placeholder="Buscar por banca, CNPJ, e-mail ou cidade..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="status-filter-pills">
                  <button 
                    className={`status-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('ALL')}
                  >
                    Todos ({clientsList.length})
                  </button>
                  <button 
                    className={`status-pill ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('ACTIVE')}
                  >
                    Ativos ({clientsList.filter(c => c.status === 'ACTIVE').length})
                  </button>
                  <button 
                    className={`status-pill ${statusFilter === 'TRIAL' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('TRIAL')}
                  >
                    Em Testes ({clientsList.filter(c => c.status === 'TRIAL').length})
                  </button>
                  <button 
                    className={`status-pill ${statusFilter === 'PAST_DUE' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('PAST_DUE')}
                  >
                    Pendentes ({clientsList.filter(c => c.status === 'PAST_DUE').length})
                  </button>
                </div>
              </div>
            </div>

            <div className="clients-table-wrapper">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>Escritório / Razão Social</th>
                    <th>Plano & MRR</th>
                    <th>Advogados</th>
                    <th>Consumo de IA (Mês)</th>
                    <th>E-mail de Captura Dedicado</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(client => (
                    <tr key={client.id} className={selectedClient?.id === client.id ? 'row-selected' : ''}>
                      <td>
                        <div className="client-cell-main">
                          <strong>{client.name}</strong>
                          <small>{client.cnpjOrCpf} • {client.cityState}</small>
                        </div>
                      </td>
                      <td>
                        <div className="plan-cell">
                          <span className={`plan-badge ${client.plan}`}>
                            {client.plan.toUpperCase()}
                          </span>
                          <span className="mrr-val">R$ {client.mrrValue}/mês</span>
                        </div>
                      </td>
                      <td>
                        <div className="users-count-cell">
                          <UserCheck size={14} color="#64748B" />
                          <span>{client.usersCount} / {client.maxUsers}</span>
                        </div>
                      </td>
                      <td>
                        <div className="usage-progress-cell">
                          <span>{client.intimationCountMonth} / {client.maxIntimationLimit}</span>
                          <div className="usage-mini-bar">
                            <div 
                              className="usage-fill" 
                              style={{ width: `${Math.min((client.intimationCountMonth / client.maxIntimationLimit) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code className="inbound-email-code">{client.inboundEmail}</code>
                      </td>
                      <td>
                        {client.status === 'ACTIVE' && (
                          <span className="status-tag active">
                            <CheckCircle2 size={12} /> Ativo
                          </span>
                        )}
                        {client.status === 'TRIAL' && (
                          <span className="status-tag trial">
                            <Clock size={12} /> Em Testes
                          </span>
                        )}
                        {client.status === 'PAST_DUE' && (
                          <span className="status-tag warning">
                            <AlertTriangle size={12} /> Pendente
                          </span>
                        )}
                        {client.status === 'BLOCKED' && (
                          <span className="status-tag blocked">
                            <XCircle size={12} /> Bloqueado
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button 
                            className="btn-action-view"
                            onClick={() => setSelectedClient(client)}
                            title="Ver Detalhes do Cliente"
                          >
                            Detalhes
                          </button>
                          <button 
                            className={`btn-action-toggle ${client.status === 'ACTIVE' ? 'suspend' : 'activate'}`}
                            onClick={() => handleToggleStatus(client.id)}
                            title={client.status === 'ACTIVE' ? 'Suspender Acesso' : 'Ativar Acesso'}
                          >
                            {client.status === 'ACTIVE' ? 'Suspender' : 'Ativar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal de Detalhes do Cliente Selecionado */}
            {selectedClient && (
              <div className="client-modal-overlay" onClick={() => setSelectedClient(null)}>
                <div className="client-modal-card glass-panel" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <div>
                      <h3 className="sub-title">{selectedClient.name}</h3>
                      <p className="section-desc">Identificador: <code>{selectedClient.slug}</code></p>
                    </div>
                    <button className="btn-close-modal" onClick={() => setSelectedClient(null)}>✕</button>
                  </div>

                  <div className="modal-body-grid">
                    <div className="modal-info-item">
                      <span className="label">Razão Social:</span>
                      <strong>{selectedClient.legalEntity}</strong>
                    </div>
                    <div className="modal-info-item">
                      <span className="label">CNPJ / CPF:</span>
                      <strong>{selectedClient.cnpjOrCpf}</strong>
                    </div>
                    <div className="modal-info-item">
                      <span className="label">E-mail de Contato:</span>
                      <strong>{selectedClient.contactEmail}</strong>
                    </div>
                    <div className="modal-info-item">
                      <span className="label">Telefone / WhatsApp:</span>
                      <strong>{selectedClient.contactPhone}</strong>
                    </div>
                    <div className="modal-info-item">
                      <span className="label">E-mail de Captura Dedicado:</span>
                      <code>{selectedClient.inboundEmail}</code>
                    </div>
                    <div className="modal-info-item">
                      <span className="label">Data de Adesão:</span>
                      <strong>{selectedClient.joinedAt}</strong>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button className="btn-secondary mini-btn" onClick={() => setSelectedClient(null)}>
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            ABA 3: FINANCEIRO & ASSINATURAS
            ========================================================= */}
        {adminTab === 'financial' && (
          <div className="financial-container">
            <div className="financial-kpis-row">
              <div className="fin-card glass-panel">
                <span className="fin-card-label">Receita Líquida do Mês</span>
                <div className="fin-card-value">R$ 48.650,00</div>
                <div className="fin-card-sub text-success">+ R$ 7.540,00 comparado ao mês anterior</div>
              </div>

              <div className="fin-card glass-panel">
                <span className="fin-card-label">Inadimplência</span>
                <div className="fin-card-value">0.7%</div>
                <div className="fin-card-sub">Apenas 1 escritório com pagamento pendente</div>
              </div>

              <div className="fin-card glass-panel">
                <span className="fin-card-label">Formas de Pagamento</span>
                <div className="fin-card-value">Cartão (68%) • Pix (32%)</div>
                <div className="fin-card-sub">Cobrança recorrente automatizada</div>
              </div>
            </div>

            <div className="transactions-card glass-panel">
              <div className="transactions-header">
                <h3 className="section-title">Últimas Cobranças & Mensalidades Recebidas</h3>
                <span className="badge-pill green">Gateway de Pagamentos Ativo</span>
              </div>

              <div className="transactions-table-wrapper">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Identificador</th>
                      <th>Banca / Escritório</th>
                      <th>Plano</th>
                      <th>Data & Hora</th>
                      <th>Método</th>
                      <th>Valor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSaaSTransactions.map(tx => (
                      <tr key={tx.id}>
                        <td><code>{tx.id}</code></td>
                        <td><strong>{tx.clientName}</strong></td>
                        <td><span className="plan-pill">{tx.plan.toUpperCase()}</span></td>
                        <td>{tx.date}</td>
                        <td>{tx.method === 'PIX' ? '⚡ Pix' : tx.method === 'CREDIT_CARD' ? '💳 Cartão de Crédito' : '📄 Boleto'}</td>
                        <td><strong>R$ {tx.amount.toFixed(2)}</strong></td>
                        <td>
                          {tx.status === 'PAID' ? (
                            <span className="tx-status paid"><CheckCircle2 size={12} /> Pago</span>
                          ) : (
                            <span className="tx-status pending"><Clock size={12} /> Aguardando</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            ABA 4: PLANOS & PRECIFICAÇÃO
            ========================================================= */}
        {adminTab === 'plans' && (
          <div className="plans-editor-container">
            <div className="plans-intro glass-panel">
              <h2 className="section-title">Planos SaaS NexAi-LEX</h2>
              <p className="section-desc">
                Estrutura de planos comerciais disponíveis para advogados solo e bancas jurídicas de todo o Brasil.
              </p>
            </div>

            <div className="saas-plans-grid">
              {mockSaaSPlans.map(plan => (
                <div key={plan.id} className={`saas-plan-card glass-panel ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && <div className="popular-badge">MAIS POPULAR</div>}
                  <div className="plan-card-name">{plan.name}</div>
                  <div className="plan-card-price">
                    R$ {plan.priceMonthly}<small>/mês</small>
                  </div>
                  <div className="plan-card-subprice">
                    ou R$ {plan.priceYearly}/ano no plano anual
                  </div>

                  <div className="plan-limits-box">
                    <div className="limit-item">
                      <span>Limite de Advogados:</span>
                      <strong>{plan.maxUsers} usuário(s)</strong>
                    </div>
                    <div className="limit-item">
                      <span>Intimações por Mês:</span>
                      <strong>Até {plan.maxIntimationsPerMonth}</strong>
                    </div>
                  </div>

                  <div className="plan-features-list">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="plan-feature-item">
                        <CheckCircle2 size={14} color="#10B981" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <button className="btn-secondary full-btn">
                    Editar Parâmetros do Plano
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            ABA 5: IA & GOOGLE CLOUD
            ========================================================= */}
        {adminTab === 'infra' && (
          <div className="infra-container">
            <div className="infra-grid">
              <div className="infra-card glass-panel">
                <div className="infra-card-header">
                  <Sparkles size={20} color="#B47E20" />
                  <h3>Motor de IA Google Gemini 1.5 Flash</h3>
                </div>
                <div className="infra-status-row">
                  <span>Status da API:</span>
                  <span className="badge-pill green">Operacional (99.8%)</span>
                </div>
                <div className="infra-status-row">
                  <span>Latência Média de Resposta:</span>
                  <strong>{mockSaaSInfraStatus.geminiLatencyMs}ms</strong>
                </div>
                <div className="infra-status-row">
                  <span>Tokens Consumidos no Mês:</span>
                  <strong>{mockSaaSInfraStatus.activeTokensCount.toLocaleString()} tokens</strong>
                </div>
                <div className="infra-status-row">
                  <span>Modo de Resposta:</span>
                  <code>responseSchema (JSON estrito)</code>
                </div>
              </div>

              <div className="infra-card glass-panel">
                <div className="infra-card-header">
                  <Database size={20} color="#B47E20" />
                  <h3>Google Cloud Firestore</h3>
                </div>
                <div className="infra-status-row">
                  <span>Conexão em Tempo Real:</span>
                  <span className="badge-pill green">Online (Multi-tenant)</span>
                </div>
                <div className="infra-status-row">
                  <span>Armazenamento no Navegador:</span>
                  <strong className="text-success">Zero LocalStorage (100% Cloud)</strong>
                </div>
                <div className="infra-status-row">
                  <span>Coleções Ativas:</span>
                  <code>tenants, users, notifications, deadlines</code>
                </div>
              </div>

              <div className="infra-card glass-panel">
                <div className="infra-card-header">
                  <CloudLightning size={20} color="#B47E20" />
                  <h3>Google Firebase Hosting</h3>
                </div>
                <div className="infra-status-row">
                  <span>Projeto:</span>
                  <code>nexai-lex</code>
                </div>
                <div className="infra-status-row">
                  <span>URL Primária:</span>
                  <a href="https://nexai-lex.web.app" target="_blank" rel="noreferrer" className="link-ext">
                    https://nexai-lex.web.app
                  </a>
                </div>
                <div className="infra-status-row">
                  <span>CDN Global Google:</span>
                  <span className="badge-pill green">Ativa com SSL Automático</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
