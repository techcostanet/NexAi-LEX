import React, { useState } from 'react';
import { 
  Scale, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Crown, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { authService, KNOWN_ACCOUNTS } from '../services/authService';
import { AuthUser } from '../types';
import versionData from '../version.json';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const user = await authService.login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setLoading(true);
    setErrorMessage(null);

    try {
      const user = await authService.login(accEmail, accPass);
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-container">
        {/* Top Brand Header */}
        <div className="login-header">
          <div className="login-brand-icon">
            <Scale size={32} color="#B47E20" />
          </div>
          <h1 className="login-title">
            NexAi<span className="text-gold">-LEX</span>
            <span className="login-version-tag">v{versionData.version}</span>
          </h1>
          <p className="login-subtitle">
            Inteligência Processual & Ingestão Autônoma de Intimações Jurídicas
          </p>
          <div className="cloud-security-pill">
            <ShieldCheck size={14} color="#10B981" />
            <span>Google Firebase Authentication • Cloud Firestore 100% Online</span>
          </div>
        </div>

        {/* Formulário de Login Principal */}
        <div className="login-card">
          <h2 className="login-card-title">Acesso à Plataforma</h2>
          <p className="login-card-desc">Informe seu e-mail e senha cadastrados para acessar o sistema.</p>

          {errorMessage && (
            <div className="login-error-alert">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="login-email">E-mail de Acesso</label>
              <div className="login-input-box">
                <Mail size={18} className="login-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: contato@techcosta.net"
                  disabled={loading}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Senha</label>
              <div className="login-input-box">
                <Lock size={18} className="login-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Autenticando na Nuvem...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divisor de Acessos Rápidos */}
          <div className="login-divider">
            <span>Acessos Rápidos & Demonstração</span>
          </div>

          {/* Cards de Acesso Prontos (SuperAdmin & Demo Clientes) */}
          <div className="quick-access-grid">
            {/* Card 1: SuperAdmin Master (TechCosta) */}
            <div className="quick-access-card admin-card">
              <div className="quick-card-header">
                <div className="quick-icon-badge crown-badge">
                  <Crown size={16} />
                </div>
                <div>
                  <div className="quick-card-title">Administração SaaS (Master)</div>
                  <div className="quick-card-badge">TechCosta SuperAdmin</div>
                </div>
              </div>

              <div className="quick-card-credentials">
                <div><strong>E-mail:</strong> {KNOWN_ACCOUNTS.MASTER_ADMIN.email}</div>
                <div><strong>Senha:</strong> {KNOWN_ACCOUNTS.MASTER_ADMIN.defaultPass}</div>
              </div>

              <p className="quick-card-description">
                Acesso irrestrito a faturamento, métricas MRR, criação e controle de bancas clientes.
              </p>

              <button
                type="button"
                className="btn-quick-login btn-admin-quick"
                onClick={() => handleQuickLogin(KNOWN_ACCOUNTS.MASTER_ADMIN.email, KNOWN_ACCOUNTS.MASTER_ADMIN.defaultPass)}
                disabled={loading}
              >
                <Sparkles size={14} />
                <span>Entrar como SuperAdmin Master</span>
              </button>
            </div>

            {/* Card 2: Demo para Clientes (Advocacia) */}
            <div className="quick-access-card client-card">
              <div className="quick-card-header">
                <div className="quick-icon-badge office-badge">
                  <Building2 size={16} />
                </div>
                <div>
                  <div className="quick-card-title">Demonstração para Clientes</div>
                  <div className="quick-card-badge">Costa & Silva Advogados</div>
                </div>
              </div>

              <div className="quick-card-credentials">
                <div><strong>E-mail:</strong> {KNOWN_ACCOUNTS.DEMO_CLIENT.email}</div>
                <div><strong>Senha:</strong> {KNOWN_ACCOUNTS.DEMO_CLIENT.defaultPass}</div>
              </div>

              <p className="quick-card-description">
                Visão real do escritório de advocacia: intimações, prazos CPC e dossiês de processos.
              </p>

              <button
                type="button"
                className="btn-quick-login btn-client-quick"
                onClick={() => handleQuickLogin(KNOWN_ACCOUNTS.DEMO_CLIENT.email, KNOWN_ACCOUNTS.DEMO_CLIENT.defaultPass)}
                disabled={loading}
              >
                <CheckCircle2 size={14} />
                <span>Entrar como Escritório Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé de Segurança */}
        <div className="login-footer">
          <p>© 2026 NexAi-LEX • Tecnologia Jurídica Autônoma • Infraestrutura Google Cloud</p>
          <p className="login-footer-sub">
            Conexão Segura SSL 256 bits • Sem dados locais (Zero LocalStorage) • Multi-tenant em Tempo Real
          </p>
        </div>
      </div>
    </div>
  );
};
