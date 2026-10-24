import React, { useState } from 'react';
import { 
  Scale, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { authService } from '../services/authService';
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
            Gestão Jurídica Inteligente
          </p>
          <div className="cloud-security-pill">
            <ShieldCheck size={14} color="#10B981" />
            <span>Ambiente Seguro e Criptografado</span>
          </div>
        </div>

        {/* Formulário de Login Principal */}
        <div className="login-card">
          <h2 className="login-card-title">Acesso</h2>
          <p className="login-card-desc">Informe suas credenciais para entrar no sistema.</p>

          {errorMessage && (
            <div className="login-error-alert">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="login-email">E-mail</label>
              <div className="login-input-box">
                <Mail size={18} className="login-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: advogado@escritorio.com.br"
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
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Rodapé de Segurança */}
        <div className="login-footer">
          <p>© 2026 NexAi-LEX • Gestão Jurídica Inteligente</p>
          <p className="login-footer-sub">
            Conexão Segura SSL 256 bits • Proteção e Sigilo de Dados em Nuvem
          </p>
        </div>
      </div>
    </div>
  );
};
