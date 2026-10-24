import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  Mail, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Search, 
  Check, 
  Calendar, 
  Bell, 
  Users, 
  Database, 
  Cpu, 
  Lock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  X,
  Loader2,
  Building2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { firestoreService } from '../../services/firestoreService';
import { SaaSClient, TenantPlan } from '../../types';
import versionData from '../../version.json';

interface LandingPageProps {
  onNavigateToLawyer: () => void;
  onNavigateToAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLawyer,
  onNavigateToAdmin
}) => {
  // Modal de Teste Grátis 15 Dias
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [selectedPlanForTrial, setSelectedPlanForTrial] = useState<TenantPlan>('solo');
  const [trialName, setTrialName] = useState('');
  const [trialEmail, setTrialEmail] = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [trialOab, setTrialOab] = useState('');
  const [trialOfficeName, setTrialOfficeName] = useState('');
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialSuccess, setTrialSuccess] = useState(false);
  const [trialError, setTrialError] = useState<string | null>(null);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleOpenTrial = (plan: TenantPlan = 'solo') => {
    setSelectedPlanForTrial(plan);
    setIsTrialModalOpen(true);
    setTrialSuccess(false);
    setTrialError(null);
  };

  const handleSubmitTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialName.trim() || !trialEmail.trim() || !trialPhone.trim()) {
      setTrialError('Por favor, preencha os campos obrigatórios (Nome, E-mail e Telefone).');
      return;
    }

    setTrialLoading(true);
    setTrialError(null);

    try {
      const now = new Date();
      const trialEnds = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
      const clientId = `trial_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const cleanSlug = (trialOfficeName || trialName).toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);

      const newClient: SaaSClient = {
        id: clientId,
        name: trialOfficeName || `${trialName} Advocacia`,
        slug: cleanSlug,
        legalEntity: `${trialName} (Cadastro Teste Grátis 15 Dias)`,
        cnpjOrCpf: trialOab ? `OAB: ${trialOab}` : 'Não informado',
        contactEmail: trialEmail.trim().toLowerCase(),
        contactPhone: trialPhone.trim(),
        plan: selectedPlanForTrial,
        status: 'TRIAL',
        mrrValue: selectedPlanForTrial === 'solo' ? 97 : selectedPlanForTrial === 'office' ? 249 : 599,
        usersCount: 1,
        maxUsers: selectedPlanForTrial === 'solo' ? 1 : selectedPlanForTrial === 'office' ? 4 : 20,
        intimationCountMonth: 0,
        maxIntimationLimit: selectedPlanForTrial === 'solo' ? 250 : selectedPlanForTrial === 'office' ? 1000 : 5000,
        joinedAt: now.toISOString().split('T')[0],
        inboundEmail: `${cleanSlug}@inbox.nexai.com.br`,
        cityState: 'Brasil'
      };

      // Grava no Cloud Firestore para o Admin do SaaS
      await firestoreService.addSaaSClient(newClient);
      setTrialSuccess(true);
    } catch (err: any) {
      setTrialError(err.message || 'Falha ao registrar período de teste.');
    } finally {
      setTrialLoading(false);
    }
  };

  return (
    <div className="landing-wrapper">
      {/* 1. TOP NAVBAR */}
      <header className="landing-navbar glass-panel">
        <div className="landing-navbar-container">
          <div className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="landing-brand-icon">
              <Scale size={24} color="#B47E20" />
            </div>
            <div className="landing-brand-text">
              <span className="brand-main">NexAi<span className="text-gold">-LEX</span></span>
              <span className="version-tag">v{versionData.version}</span>
            </div>
          </div>

          <nav className="landing-nav-links">
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#conexoes">Conexão Gmail & OAB</a>
            <a href="#planos">Planos & Preços</a>
            <a href="#seguranca">Segurança & LGPD</a>
            <a href="#faq">Dúvidas</a>
          </nav>

          <div className="landing-nav-actions">
            <button 
              type="button" 
              onClick={onNavigateToLawyer}
              className="btn-landing-secondary"
            >
              <span>Entrar no Sistema</span>
            </button>
            <button 
              type="button" 
              onClick={() => handleOpenTrial('solo')}
              className="btn-landing-primary"
            >
              <Sparkles size={16} />
              <span>Teste Grátis 15 Dias</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="hero-badge">
            <Sparkles size={15} color="#B47E20" />
            <span>O SaaS Jurídico com IA Mais Completo do Brasil</span>
          </div>

          <h1 className="hero-headline">
            Nunca Mais Perca um <span className="highlight-gold">Prazo Fatal</span>.<br />
            Sua Advocacia no Piloto Automático.
          </h1>

          <p className="hero-subheadline">
            O NexAi-LEX conecta sua caixa de entrada do <strong>Google Gmail</strong> e a API oficial do <strong>CNJ / DJEN</strong> para capturar intimações, preencher seus processos e calcular datas fatais automaticamente no CPC e CLT.
          </p>

          <div className="hero-cta-group">
            <button 
              type="button"
              onClick={() => handleOpenTrial('solo')}
              className="hero-btn-primary"
            >
              <span>Começar Teste de 15 Dias Grátis</span>
              <ArrowRight size={18} />
            </button>
            <button 
              type="button"
              onClick={onNavigateToLawyer}
              className="hero-btn-secondary"
            >
              <span>Acessar Painel do Advogado</span>
            </button>
          </div>

          <div className="hero-guarantees">
            <div className="guarantee-item">
              <CheckCircle2 size={16} color="#10B981" />
              <span>Sem necessidade de cartão para testar</span>
            </div>
            <div className="guarantee-item">
              <CheckCircle2 size={16} color="#10B981" />
              <span>100% em Nuvem Google Cloud Firestore</span>
            </div>
            <div className="guarantee-item">
              <CheckCircle2 size={16} color="#10B981" />
              <span>Conforme Código de Ética da OAB & LGPD</span>
            </div>
          </div>
        </div>

        {/* Simulador / Preview Interativo do Sistema */}
        <div className="landing-hero-preview">
          <div className="preview-window glass-panel">
            <div className="preview-window-header">
              <div className="preview-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="preview-title">NexAi-LEX • Monitor de Intimações & Prazos</div>
              <div className="preview-cloud-pill">
                <span className="status-dot-pulse"></span>
                <span>Google Cloud 100% Online</span>
              </div>
            </div>

            <div className="preview-body">
              {/* Card de Notificação Recente */}
              <div className="preview-item-card">
                <div className="preview-item-top">
                  <span className="preview-badge-court">TJSP • Foro Central Cível</span>
                  <span className="preview-badge-fatal">Prazo Fatal: 15 dias úteis</span>
                </div>
                <div className="preview-cnj">Processo 1024890-44.2026.8.26.0100</div>
                <p className="preview-desc">
                  Intimação via Diário de Justiça Eletrônico: Contestação tempestiva juntada aos autos. Fica a parte autora intimada para apresentar Réplica.
                </p>
                <div className="preview-action-row">
                  <div className="preview-ai-tag">
                    <Sparkles size={12} color="#B47E20" />
                    <span>IA: Réplica à Contestação sugerida</span>
                  </div>
                  <div className="preview-sync-status">
                    <Check size={14} color="#10B981" />
                    <span>Sincronizado na Agenda Google</span>
                  </div>
                </div>
              </div>

              {/* Card de Conexão Ativa */}
              <div className="preview-connection-strip">
                <div className="conn-chip">
                  <Mail size={14} color="#EA4335" />
                  <span>Gmail Conectado (gmail.readonly)</span>
                </div>
                <div className="conn-chip">
                  <Scale size={14} color="#2563EB" />
                  <span>API CNJ / DJEN Sincronizada</span>
                </div>
                <div className="conn-chip">
                  <Calendar size={14} color="#059669" />
                  <span>Alertas WhatsApp Ativos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NÚMEROS E CONFIANÇA */}
      <section className="landing-metrics-strip">
        <div className="metrics-strip-container">
          <div className="metric-box">
            <div className="metric-val">100%</div>
            <div className="metric-desc">Cloud Google Firestore em tempo real</div>
          </div>
          <div className="metric-box">
            <div className="metric-val">0</div>
            <div className="metric-desc">Prazos fatais perdidos com a IA Jurídica</div>
          </div>
          <div className="metric-box">
            <div className="metric-val">Art. 219</div>
            <div className="metric-desc">Contagem automática no CPC (Dias Úteis)</div>
          </div>
          <div className="metric-box">
            <div className="metric-val">256-bit</div>
            <div className="metric-desc">Criptografia bancária ponta a ponta</div>
          </div>
        </div>
      </section>

      {/* 4. FUNCIONALIDADES COMPLETAS */}
      <section id="funcionalidades" className="landing-features-section">
        <div className="section-header-center">
          <span className="section-eyebrow">RECURSOS DE ÚLTIMA GERAÇÃO</span>
          <h2 className="section-title-large">Tudo o que seu escritório precisa para operar no mais alto nível</h2>
          <p className="section-desc-center">
            Projetado por advogados e engenheiros de IA para eliminar tarefas manuais e garantir segurança jurídica absoluta.
          </p>
        </div>

        <div className="features-big-grid">
          {/* Feature 1: Gmail */}
          <div className="feature-card-premium">
            <div className="feature-card-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
              <Mail size={24} />
            </div>
            <h3 className="feature-card-title">Conexão Oficial com Google Gmail</h3>
            <p className="feature-card-desc">
              Conecte sua conta com permissão de somente-leitura (<code>gmail.readonly</code>). O sistema monitora novos e-mails de tribunais, extrai atos judiciais e alimenta os processos e prazos sem nenhuma digitação.
            </p>
            <div className="feature-card-tag">Varredura Contínua Automática</div>
          </div>

          {/* Feature 2: OAB e DJEN */}
          <div className="feature-card-premium">
            <div className="feature-card-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <Scale size={24} />
            </div>
            <h3 className="feature-card-title">Integração Oficial CNJ / DJEN</h3>
            <p className="feature-card-desc">
              Consulta direta ao Diário de Justiça Eletrônico Nacional (API Pública do CNJ). Basta inserir sua OAB e Estado para resgatar todas as publicações recentes em tempo real.
            </p>
            <div className="feature-card-tag">Comunicação Oficial do Judiciário</div>
          </div>

          {/* Feature 3: IA Jurídica */}
          <div className="feature-card-premium">
            <div className="feature-card-icon" style={{ background: '#FEF3C7', color: '#B47E20' }}>
              <Sparkles size={24} />
            </div>
            <h3 className="feature-card-title">Extração com IA Especializada</h3>
            <p className="feature-card-desc">
              Identificação do número CNJ, vara, tribunal, partes do processo e classificação do ato (despacho, intimação, sentença) com cálculo preciso do prazo e sugestão da peça cabível.
            </p>
            <div className="feature-card-tag">Inteligência Judicial Avançada</div>
          </div>

          {/* Feature 4: Agenda de Prazos */}
          <div className="feature-card-premium">
            <div className="feature-card-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
              <Clock size={24} />
            </div>
            <h3 className="feature-card-title">Prazos CPC e Recesso Forense</h3>
            <p className="feature-card-desc">
              Cálculo estrito pelo Art. 219 do CPC (dias úteis, fins de semana e feriados) ou dias corridos, com bloqueio automático do Recesso Forense de 20 de Dezembro a 20 de Janeiro (Art. 220).
            </p>
            <div className="feature-card-tag">Contagem Blindada</div>
          </div>

          {/* Feature 5: Dossiê de Processos */}
          <div className="feature-card-premium">
            <div className="feature-card-icon" style={{ background: '#F3E8FF', color: '#7E22CE' }}>
              <FileText size={24} />
            </div>
            <h3 className="feature-card-title">Dossiê e Histórico Completo</h3>
            <p className="feature-card-desc">
              Cada intimação recebida cria ou atualiza automaticamente o histórico do processo com contadores de eventos, partes envolvidas e advogado responsável.
            </p>
            <div className="feature-card-tag">Gestão Sem Esforço</div>
          </div>

          {/* Feature 6: WhatsApp e Agenda */}
          <div className="feature-card-premium">
            <div className="feature-card-icon" style={{ background: '#FFF1F2', color: '#E11D48' }}>
              <Bell size={24} />
            </div>
            <h3 className="feature-card-title">Sincronização Agenda & Alertas</h3>
            <p className="feature-card-desc">
              Prazos aprovados são espelhados no seu Google Calendar e geram alertas com 24h e 48h de antecedência no WhatsApp para que nenhum prazo seja esquecido.
            </p>
            <div className="feature-card-tag">Alertas Multicanal</div>
          </div>
        </div>
      </section>

      {/* 5. SEÇÃO DE CONEXÕES EM DESTAQUE */}
      <section id="conexoes" className="landing-connections-highlight">
        <div className="connections-card-banner">
          <div className="connections-banner-text">
            <span className="banner-tag">INTEGRAÇÕES NATIVAS</span>
            <h2>Conecte seu Gmail e sua OAB em menos de 1 minuto</h2>
            <p>
              Sem integrações complexas nem servidores locais. Tudo roda diretamente na nuvem de alta velocidade da Google com segurança certificada.
            </p>
            <div className="connections-checklist">
              <div className="check-item"><Check size={16} color="#10B981" /> Permissão estrita de leitura (gmail.readonly)</div>
              <div className="check-item"><Check size={16} color="#10B981" /> Varredura automática periódica a cada 1 hora</div>
              <div className="check-item"><Check size={16} color="#10B981" /> Compatível com PJe, e-SAJ, Projudi, TRT, TRF e STJ</div>
            </div>
            <button 
              type="button" 
              onClick={() => handleOpenTrial('solo')}
              className="btn-landing-primary" 
              style={{ marginTop: '20px' }}
            >
              Experimentar Grátis por 15 Dias
            </button>
          </div>

          <div className="connections-banner-visual">
            <div className="visual-badge-stack">
              <div className="stack-badge google">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Conexão Oficial com Google Gmail</span>
              </div>
              <div className="stack-badge cnj">
                <Scale size={20} color="#2563EB" />
                <span>API Oficial CNJ / DJEN (Diário da Justiça)</span>
              </div>
              <div className="stack-badge firestore">
                <Database size={20} color="#D97706" />
                <span>Banco Cloud Firestore (100% Online)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PLANOS E PREÇOS */}
      <section id="planos" className="landing-pricing-section">
        <div className="section-header-center">
          <span className="section-eyebrow">TRANSPARÊNCIA TOTAL</span>
          <h2 className="section-title-large">Escolha o plano ideal para a sua banca jurídica</h2>
          <p className="section-desc-center">
            Comece com 15 dias gratuitos em qualquer modalidade. Cancele quando quiser, sem letras miúdas.
          </p>
        </div>

        <div className="pricing-cards-grid">
          {/* PLANO SOLO */}
          <div className="pricing-card">
            <div className="pricing-card-header">
              <span className="plan-tag">ADVOGADO INDIVIDUAL</span>
              <h3 className="plan-name">Plano Solo</h3>
              <p className="plan-summary">Ideal para advogados autônomos que buscam precisão e pontualidade.</p>
              <div className="plan-price-row">
                <span className="currency">R$</span>
                <span className="value">97</span>
                <span className="period">/ mês</span>
              </div>
            </div>

            <ul className="plan-features-list">
              <li><Check size={16} color="#10B981" /> <strong>1 Advogado Titular</strong></li>
              <li><Check size={16} color="#10B981" /> Até <strong>250 intimações / mês</strong></li>
              <li><Check size={16} color="#10B981" /> Conexão Oficial Google Gmail</li>
              <li><Check size={16} color="#10B981" /> Integração API CNJ / DJEN e OAB</li>
              <li><Check size={16} color="#10B981" /> Cálculo de prazos no CPC (Dias Úteis)</li>
              <li><Check size={16} color="#10B981" /> Sincronização Google Agenda</li>
              <li><Check size={16} color="#10B981" /> Alertas de Antecedência no WhatsApp</li>
              <li><Check size={16} color="#10B981" /> Banco 100% em Nuvem Google Cloud</li>
            </ul>

            <button 
              type="button"
              onClick={() => handleOpenTrial('solo')}
              className="btn-plan-action"
            >
              Começar 15 Dias Grátis
            </button>
          </div>

          {/* PLANO ESCRITÓRIO (DESTAQUE) */}
          <div className="pricing-card featured">
            <div className="featured-ribbon">MAIS ESCOLHIDO</div>
            <div className="pricing-card-header">
              <span className="plan-tag gold">BANCA & ASSOCIADOS</span>
              <h3 className="plan-name">Plano Escritório</h3>
              <p className="plan-summary">Para sociedades de advogados que exigem colaboração em equipe.</p>
              <div className="plan-price-row">
                <span className="currency">R$</span>
                <span className="value">249</span>
                <span className="period">/ mês</span>
              </div>
            </div>

            <ul className="plan-features-list">
              <li><Check size={16} color="#10B981" /> <strong>Até 4 Advogados e Membros</strong></li>
              <li><Check size={16} color="#10B981" /> Até <strong>1.000 intimações / mês</strong></li>
              <li><Check size={16} color="#10B981" /> <strong>Direcionamento por OAB Individual</strong></li>
              <li><Check size={16} color="#10B981" /> Todas as conexões do Plano Solo</li>
              <li><Check size={16} color="#10B981" /> Múltiplas agendas conectadas</li>
              <li><Check size={16} color="#10B981" /> Gestão de Equipe e Níveis de Acesso</li>
              <li><Check size={16} color="#10B981" /> Relatórios de Produtividade do Escritório</li>
              <li><Check size={16} color="#10B981" /> Suporte Prioritário por WhatsApp</li>
            </ul>

            <button 
              type="button"
              onClick={() => handleOpenTrial('office')}
              className="btn-plan-action primary"
            >
              Começar 15 Dias Grátis
            </button>
          </div>

          {/* PLANO PRO / CORPORATE */}
          <div className="pricing-card">
            <div className="pricing-card-header">
              <span className="plan-tag">GRANDES BANCAS</span>
              <h3 className="plan-name">Plano Pro</h3>
              <p className="plan-summary">Departamentos jurídicos e bancas de alta volumetria processual.</p>
              <div className="plan-price-row">
                <span className="currency">R$</span>
                <span className="value">599</span>
                <span className="period">/ mês</span>
              </div>
            </div>

            <ul className="plan-features-list">
              <li><Check size={16} color="#10B981" /> <strong>Advogados Ilimitados</strong></li>
              <li><Check size={16} color="#10B981" /> <strong>Intimações Ilimitadas</strong></li>
              <li><Check size={16} color="#10B981" /> IA Jurídica para Minutas de Petições</li>
              <li><Check size={16} color="#10B981" /> Webhook e API de Integração dedicada</li>
              <li><Check size={16} color="#10B981" /> Treinamento de Equipe e Onboarding VIP</li>
              <li><Check size={16} color="#10B981" /> SLA de Atendimento 24/7 Garantido</li>
              <li><Check size={16} color="#10B981" /> Gerente de Conta Dedicado</li>
            </ul>

            <button 
              type="button"
              onClick={() => handleOpenTrial('pro')}
              className="btn-plan-action"
            >
              Falar com Especialista
            </button>
          </div>
        </div>
      </section>

      {/* 7. SEGURANÇA E CONFORMIDADE OAB/LGPD */}
      <section id="seguranca" className="landing-security-section">
        <div className="security-inner-box glass-panel">
          <div className="security-text-col">
            <div className="security-icon-circle">
              <ShieldCheck size={32} color="#10B981" />
            </div>
            <h2>Segurança de Nível Bancário e Conformidade com a OAB</h2>
            <p>
              O sigilo dos dados do seu escritório e dos seus clientes é inegociável. O NexAi-LEX adota os mais rigorosos padrões de conformidade técnica e ética:
            </p>

            <div className="security-points-list">
              <div className="point-item">
                <Lock size={18} color="#B47E20" />
                <div>
                  <strong>Sigilo Total Entre Escritórios (Multi-Tenancy Isolado)</strong>
                  <p>Cada cliente possui um isolamento estrito no Google Cloud. O administrador do SaaS não possui acesso aos processos nem intimações dos clientes.</p>
                </div>
              </div>

              <div className="point-item">
                <Database size={18} color="#B47E20" />
                <div>
                  <strong>Hospedagem Google Cloud Brasil (São Paulo)</strong>
                  <p>Dados hospedados no datacenter da Google em território brasileiro, cumprindo todos os requisitos de soberania de dados da LGPD (Lei 13.709/2018).</p>
                </div>
              </div>

              <div className="point-item">
                <ShieldCheck size={18} color="#B47E20" />
                <div>
                  <strong>Código de Ética e Disciplina da OAB</strong>
                  <p>Respeito irrestrito ao sigilo profissional do advogado e às prerrogativas da advocacia nacional.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ - PERGUNTAS FREQUENTES */}
      <section id="faq" className="landing-faq-section">
        <div className="section-header-center">
          <span className="section-eyebrow">TIRA-DÚVIDAS</span>
          <h2 className="section-title-large">Perguntas Frequentes</h2>
        </div>

        <div className="faq-accordion-list">
          {[
            {
              q: 'Preciso cadastrar meu cartão de crédito para fazer o teste gratuito?',
              a: 'Não! O teste de 15 dias é 100% gratuito e não exige nenhum dado de pagamento. Você só escolhe assinar caso comprove na prática a eficiência do sistema.'
            },
            {
              q: 'Como funciona a Conexão com o Gmail? É seguro?',
              a: 'Totalmente seguro. Utilizamos a API OAuth 2.0 oficial da Google com a permissão exclusiva de leitura (gmail.readonly). O sistema nunca altera, apaga nem envia e-mails em seu nome.'
            },
            {
              q: 'O NexAi-LEX atende tribunais de todo o Brasil?',
              a: 'Sim! Nosso robô é integrado à API oficial do CNJ / DJEN (Diário de Justiça Eletrônico Nacional) e lê e-mails de todos os tribunais de justiça estaduais, federais e trabalhistas (PJe, e-SAJ, Projudi, Eproc).'
            },
            {
              q: 'Como é calculada a contagem dos prazos?',
              a: 'O sistema aplica nativamente as regras do Art. 219 do Código de Processo Civil (apenas dias úteis, excluindo finais de semana e feriados nacionais) e já contempla o Recesso Forense de 20 de dezembro a 20 de janeiro (Art. 220 CPC).'
            },
            {
              q: 'Posso convidar outros advogados do meu escritório?',
              a: 'Sim! A partir do Plano Escritório você pode cadastrar advogados associados, atribuir a OAB de cada um e direcionar automaticamente as intimações de cada profissional.'
            }
          ].map((item, index) => (
            <div key={index} className="faq-item-card">
              <button 
                type="button" 
                className="faq-question-btn"
                onClick={() => toggleFaq(index)}
              >
                <span>{item.q}</span>
                {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === index && (
                <div className="faq-answer-content">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. BANNER FINAL CTA */}
      <section className="landing-final-cta">
        <div className="final-cta-box glass-panel">
          <h2>Pronto para transformar a gestão de prazos do seu escritório?</h2>
          <p>Cadastre-se agora e comece a receber intimações e prazos em menos de 2 minutos.</p>
          <button 
            type="button"
            onClick={() => handleOpenTrial('solo')}
            className="hero-btn-primary"
            style={{ margin: '20px auto 0 auto' }}
          >
            <span>Experimente 15 Dias Grátis</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="footer-brand-col">
            <div className="landing-brand">
              <div className="landing-brand-icon">
                <Scale size={20} color="#B47E20" />
              </div>
              <span className="brand-main">NexAi<span className="text-gold">-LEX</span></span>
            </div>
            <p className="footer-motto">
              A plataforma inteligente para advogados que valorizam tempo, precisão e tranquilidade nos prazos processuais.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Navegação</h4>
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#conexoes">Conexão Gmail & OAB</a>
            <a href="#planos">Planos & Preços</a>
            <a href="#seguranca">Segurança & LGPD</a>
          </div>

          <div className="footer-links-col">
            <h4>Acessos</h4>
            <button type="button" onClick={onNavigateToLawyer} className="footer-link-btn">
              Área do Advogado (Sistema)
            </button>
            <button type="button" onClick={() => handleOpenTrial('solo')} className="footer-link-btn">
              Cadastre-se Grátis (15 dias)
            </button>
            <button type="button" onClick={onNavigateToAdmin} className="footer-link-btn muted">
              Área Administrativa Master (SaaS)
            </button>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© 2026 NexAi-LEX v{versionData.version} • Desenvolvido com Google Cloud & Firebase • Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* 11. MODAL DE CADASTRO PARA TESTE DE 15 DIAS */}
      {isTrialModalOpen && (
        <div className="modal-backdrop-trial" onClick={() => setIsTrialModalOpen(false)}>
          <div className="modal-content-trial glass-panel" onClick={e => e.stopPropagation()}>
            <button 
              type="button" 
              className="modal-close-btn"
              onClick={() => setIsTrialModalOpen(false)}
            >
              <X size={20} />
            </button>

            {!trialSuccess ? (
              <div>
                <div className="modal-trial-header">
                  <div className="modal-icon-badge">
                    <Sparkles size={24} color="#B47E20" />
                  </div>
                  <h3>Iniciar Teste de 15 Dias Grátis</h3>
                  <p>Acesse o sistema imediatamente com todas as funcionalidades liberadas. Sem cartão de crédito.</p>
                </div>

                {trialError && (
                  <div className="login-error-alert" style={{ marginBottom: '14px' }}>
                    <AlertCircle size={16} />
                    <span>{trialError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitTrial} className="trial-form">
                  <div className="form-group-trial">
                    <label>Nome Completo do Advogado(a) *</label>
                    <input 
                      type="text" 
                      className="text-input" 
                      value={trialName}
                      onChange={e => setTrialName(e.target.value)}
                      placeholder="ex: Dr. Carlos Eduardo Costa"
                      required
                    />
                  </div>

                  <div className="form-grid-2col-trial">
                    <div className="form-group-trial">
                      <label>E-mail Profissional *</label>
                      <input 
                        type="email" 
                        className="text-input" 
                        value={trialEmail}
                        onChange={e => setTrialEmail(e.target.value)}
                        placeholder="advogado@escritorio.com.br"
                        required
                      />
                    </div>

                    <div className="form-group-trial">
                      <label>WhatsApp / Telefone *</label>
                      <input 
                        type="text" 
                        className="text-input" 
                        value={trialPhone}
                        onChange={e => setTrialPhone(e.target.value)}
                        placeholder="(11) 98765-4321"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2col-trial">
                    <div className="form-group-trial">
                      <label>Inscrição na OAB e UF</label>
                      <input 
                        type="text" 
                        className="text-input" 
                        value={trialOab}
                        onChange={e => setTrialOab(e.target.value)}
                        placeholder="ex: 345.891/SP"
                      />
                    </div>

                    <div className="form-group-trial">
                      <label>Nome do Escritório / Advocacia</label>
                      <input 
                        type="text" 
                        className="text-input" 
                        value={trialOfficeName}
                        onChange={e => setTrialOfficeName(e.target.value)}
                        placeholder="ex: Costa & Associados"
                      />
                    </div>
                  </div>

                  <div className="form-group-trial">
                    <label>Plano que Deseja Experimentar:</label>
                    <div className="plan-selector-grid">
                      <label className={`plan-select-card ${selectedPlanForTrial === 'solo' ? 'selected' : ''}`}>
                        <input 
                          type="radio" 
                          name="plan" 
                          value="solo" 
                          checked={selectedPlanForTrial === 'solo'}
                          onChange={() => setSelectedPlanForTrial('solo')}
                        />
                        <div>
                          <strong>Plano Solo</strong>
                          <span>1 Advogado • R$ 97/mês após 15 dias</span>
                        </div>
                      </label>

                      <label className={`plan-select-card ${selectedPlanForTrial === 'office' ? 'selected' : ''}`}>
                        <input 
                          type="radio" 
                          name="plan" 
                          value="office" 
                          checked={selectedPlanForTrial === 'office'}
                          onChange={() => setSelectedPlanForTrial('office')}
                        />
                        <div>
                          <strong>Plano Escritório</strong>
                          <span>Até 4 Advogados • R$ 249/mês após 15 dias</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-submit-trial"
                    disabled={trialLoading}
                  >
                    {trialLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Criando sua conta de teste no Google Cloud...</span>
                      </>
                    ) : (
                      <>
                        <span>Criar Minha Conta e Testar 15 Dias Grátis</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <p className="trial-terms-hint">
                    🔒 Seus dados são confidenciais e protegidos pela LGPD. Não cobramos nada agora.
                  </p>
                </form>
              </div>
            ) : (
              <div className="trial-success-box">
                <div className="success-icon-badge">
                  <CheckCircle2 size={48} color="#10B981" />
                </div>
                <h3>Conta Criada com Sucesso!</h3>
                <p>
                  Parabéns, <strong>{trialName}</strong>! Seu período de <strong>15 dias gratuitos</strong> no <strong>NexAi-LEX</strong> foi ativado na nuvem Google e registrado no sistema.
                </p>

                <div className="trial-details-chip">
                  <div><strong>Plano:</strong> {selectedPlanForTrial === 'solo' ? 'Plano Solo' : 'Plano Escritório'}</div>
                  <div><strong>E-mail:</strong> {trialEmail}</div>
                  <div><strong>Status:</strong> <span style={{ color: '#10B981', fontWeight: 700 }}>● Ativo por 15 dias</span></div>
                </div>

                <button 
                  type="button" 
                  onClick={() => {
                    setIsTrialModalOpen(false);
                    onNavigateToLawyer();
                  }}
                  className="btn-submit-trial"
                  style={{ marginTop: '20px' }}
                >
                  <span>Acessar Meu Painel Agora</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
