import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  Loader2,
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import { authService, MASTER_ADMIN_EMAIL, KNOWN_ACCOUNTS } from '../services/authService';
import { AuthUser } from '../types';
import versionData from '../version.json';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ 
  onLoginSuccess,
  onNavigateHome 
}) => {
  const [email, setEmail] = useState(MASTER_ADMIN_EMAIL);
  const [password, setPassword] = useState(KNOWN_ACCOUNTS.MASTER_ADMIN.defaultPass);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Por favor, informe o e-mail e a senha do Administrador.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const user = await authService.login(email, password);
      if (!user.isSuperAdmin) {
        throw new Error('Acesso negado: Este usuário não possui privilégios de Administrador Master do SaaS. Para acessar seu escritório, utilize o portal do advogado (/adv).');
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao autenticar no painel de administração.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-screen-wrapper">
      <div className="admin-login-container">
        {/* Top Back Navigation */}
        <div style={{ marginBottom: '16px' }}>
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="admin-back-home-btn"
          >
            <ArrowLeft size={16} />
            <span>Voltar para a Página Inicial</span>
          </button>
        </div>

        {/* Brand Header */}
        <div className="admin-login-header">
          <div className="admin-login-badge-icon">
            <ShieldCheck size={36} color="#B47E20" />
          </div>
          <h1 className="admin-login-title">
            NexAi<span className="text-gold">-LEX</span>
            <span className="admin-badge-tag">MASTER ADMIN</span>
          </h1>
          <p className="admin-login-subtitle">
            Portal Exclusivo de Gestão Global do SaaS e Multi-Tenancy
          </p>
          <div className="cloud-security-pill" style={{ background: '#FEF3C7', borderColor: '#FDE68A', color: '#B45309' }}>
            <KeyRound size={13} color="#B47E20" />
            <span>Autenticação Segura Google Firebase Auth</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="admin-login-card">
          <h2 className="admin-login-card-title">Acesso Master</h2>
          <p className="admin-login-card-desc">
            Credenciais restritas à diretoria e administração do sistema.
          </p>

          {errorMessage && (
            <div className="login-error-alert">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="admin-email">E-mail do Administrador</label>
              <div className="login-input-box">
                <Mail size={18} className="login-input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@techcosta.net"
                  disabled={loading}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="admin-password">Senha de Segurança</label>
              <div className="login-input-box">
                <Lock size={18} className="login-input-icon" />
                <input
                  id="admin-password"
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
              className="admin-login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Autenticando Master...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Cockpit SaaS</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2026 NexAi-LEX v{versionData.version} • Todos os direitos reservados</p>
          <p className="login-footer-sub">
            Ambiente Monitorado e Protegido • Google Cloud Brasil (SouthAmerica-East1)
          </p>
        </div>
      </div>
    </div>
  );
};
