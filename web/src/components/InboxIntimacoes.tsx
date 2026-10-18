import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  UserCheck, 
  FileText, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CaseNotification } from '../types';

interface InboxIntimacoesProps {
  notifications: CaseNotification[];
  onApproveNotification: (id: string) => void;
  isSoloMode: boolean;
}

export const InboxIntimacoes: React.FC<InboxIntimacoesProps> = ({
  notifications,
  onApproveNotification,
  isSoloMode
}) => {
  const [selectedNotif, setSelectedNotif] = useState<CaseNotification | null>(
    notifications[0] || null
  );
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');

  const filtered = notifications.filter(n => {
    if (filter === 'PENDING') return n.status === 'PENDING_REVIEW';
    if (filter === 'APPROVED') return n.status === 'APPROVED';
    return true;
  });

  return (
    <div className="inbox-layout">
      {/* Coluna da Esquerda: Lista de Intimações */}
      <div className="inbox-list-col">
        <div className="inbox-list-header">
          <div>
            <h2 className="section-title">Inbox de Intimações</h2>
            <p className="section-desc">
              E-mails capturados e estruturados automaticamente pelo <strong>Google Gemini</strong>.
            </p>
          </div>

          <div className="filter-pill-group">
            <button
              className={`filter-pill ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              Todas ({notifications.length})
            </button>
            <button
              className={`filter-pill ${filter === 'PENDING' ? 'active' : ''}`}
              onClick={() => setFilter('PENDING')}
            >
              Pendentes ({notifications.filter(n => n.status === 'PENDING_REVIEW').length})
            </button>
            <button
              className={`filter-pill ${filter === 'APPROVED' ? 'active' : ''}`}
              onClick={() => setFilter('APPROVED')}
            >
              Aprovadas ({notifications.filter(n => n.status === 'APPROVED').length})
            </button>
          </div>
        </div>

        <div className="cards-scroll-container">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <FileText size={40} color="#64748B" />
              <p>Nenhuma intimação encontrada nesta categoria.</p>
            </div>
          ) : (
            filtered.map(notif => {
              const isSelected = selectedNotif?.id === notif.id;
              const isPending = notif.status === 'PENDING_REVIEW';
              const isFatal = notif.extractedData.isFatalDeadline;

              return (
                <div
                  key={notif.id}
                  className={`notif-card ${isSelected ? 'selected' : ''} ${isPending ? 'pending-border' : ''}`}
                  onClick={() => setSelectedNotif(notif)}
                >
                  <div className="notif-card-top">
                    <span className="notif-type-tag">
                      {notif.extractedData.intimationType}
                    </span>
                    <span className="notif-time">{notif.receivedAt}</span>
                  </div>

                  <div className="notif-cnj">
                    {notif.extractedData.cnjNumber || 'CNJ não especificado'}
                  </div>

                  <div className="notif-court">
                    {notif.extractedData.court}
                  </div>

                  <div className="notif-summary-snippet">
                    {notif.extractedData.summary.slice(0, 120)}...
                  </div>

                  <div className="notif-card-footer">
                    {isFatal ? (
                      <span className="fatal-badge">
                        <ShieldAlert size={12} />
                        Prazo: {notif.extractedData.suggestedDeadlineDays}d (Fatal)
                      </span>
                    ) : (
                      <span className="gold-badge">
                        <Clock size={12} />
                        Prazo: {notif.extractedData.suggestedDeadlineDays}d úteis
                      </span>
                    )}

                    {!isSoloMode && notif.assignedLawyerName && (
                      <span className="assigned-badge">
                        <UserCheck size={12} />
                        {notif.assignedLawyerName}
                      </span>
                    )}

                    {notif.status === 'APPROVED' ? (
                      <span className="approved-tag">
                        <CheckCircle2 size={13} />
                        Aprovado
                      </span>
                    ) : (
                      <span className="pending-tag">
                        <AlertCircle size={13} />
                        Pendente
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Coluna da Direita: Dossiê e Validação Human-in-the-Loop */}
      <div className="inbox-detail-col">
        {selectedNotif ? (
          <div className="detail-card glass-panel">
            {/* Header do Dossiê */}
            <div className="detail-header">
              <div className="detail-header-left">
                <div className="detail-cnj-row">
                  <span className="detail-cnj">{selectedNotif.extractedData.cnjNumber}</span>
                  <span className="notif-type-tag large">
                    {selectedNotif.extractedData.intimationType}
                  </span>
                </div>
                <div className="detail-court-text">{selectedNotif.extractedData.court}</div>
              </div>

              {selectedNotif.status === 'PENDING_REVIEW' ? (
                <button
                  className="btn-primary approve-btn"
                  onClick={() => onApproveNotification(selectedNotif.id)}
                >
                  <CheckCircle2 size={16} />
                  <span>Aprovar Prazo & Agendar no Google</span>
                </button>
              ) : (
                <div className="status-approved-box">
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Prazo Confirmado na Google Agenda</span>
                </div>
              )}
            </div>

            {/* Banner de Risco / Prazo Fatal */}
            <div className={`deadline-banner ${selectedNotif.extractedData.isFatalDeadline ? 'fatal' : 'normal'}`}>
              <div className="banner-icon-area">
                <Calendar size={28} />
              </div>
              <div className="banner-content">
                <div className="banner-title">
                  {selectedNotif.extractedData.isFatalDeadline ? 'PRAZO FATAL IDENTIFICADO' : 'Prazo Processual'}
                </div>
                <div className="banner-dates">
                  <strong>{selectedNotif.extractedData.suggestedDeadlineDays} dias úteis</strong>
                  <span> — Limite Estimado: <strong>{selectedNotif.extractedData.estimatedFatalDate}</strong></span>
                </div>
                <div className="banner-subtext">
                  Cálculo automático de dias úteis pelo CPC com suspensão em fins de semana e feriados.
                </div>
              </div>
            </div>

            {/* Atribuição da Equipe / OAB */}
            {!isSoloMode && (
              <div className="lawyer-routing-box">
                <div className="routing-label">
                  <UserCheck size={14} color="#C9A86A" />
                  <span>Roteamento Inteligente por OAB:</span>
                </div>
                <div className="routing-value">
                  OAB citada no tribunal: <strong>{selectedNotif.extractedData.lawyerOAB || 'Não detectada'}</strong>
                  {selectedNotif.assignedLawyerName && (
                    <span> ➔ Atribuído a: <span className="highlight-lawyer">{selectedNotif.assignedLawyerName}</span></span>
                  )}
                </div>
              </div>
            )}

            {/* Análise Inteligente com Gemini */}
            <div className="gemini-analysis-section">
              <div className="gemini-header">
                <Sparkles size={16} color="#C9A86A" />
                <span>Resumo Executivo Gerado por IA (Google Gemini 1.5)</span>
              </div>
              <p className="gemini-summary-text">
                {selectedNotif.extractedData.summary}
              </p>

              <div className="keypoints-title">Pontos de Atenção Críticos:</div>
              <ul className="keypoints-list">
                {selectedNotif.extractedData.keyPoints.map((pt, idx) => (
                  <li key={idx}>
                    <ArrowRight size={13} color="#C9A86A" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="recommended-action-box">
                <div className="action-tag">AÇÃO RECOMENDADA:</div>
                <div className="action-text">{selectedNotif.extractedData.recommendedAction}</div>
              </div>
            </div>

            {/* Texto Original Recebido do Tribunal */}
            <div className="raw-email-section">
              <div className="raw-email-header">
                <FileText size={14} />
                <span>Teor Original do E-mail / DJE Recebido:</span>
              </div>
              <pre className="raw-email-content">
                {selectedNotif.rawBody}
              </pre>
            </div>
          </div>
        ) : (
          <div className="no-selection-card glass-panel">
            <FileText size={48} color="#64748B" />
            <p>Selecione uma intimação ao lado para ver a análise completa da decisão e os prazos.</p>
          </div>
        )}
      </div>
    </div>
  );
};
