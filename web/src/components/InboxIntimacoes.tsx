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
  ArrowRight,
  Columns,
  Maximize2,
  X,
  Copy,
  Check
} from 'lucide-react';
import { CaseNotification } from '../types';

interface InboxIntimacoesProps {
  notifications: CaseNotification[];
  onApproveNotification: (id: string) => void;
  isSoloMode: boolean;
}

export type IntimationViewMode = 'RESUMO' | 'SPLIT' | 'MODAL';

export const InboxIntimacoes: React.FC<InboxIntimacoesProps> = ({
  notifications,
  onApproveNotification,
  isSoloMode
}) => {
  const [selectedNotif, setSelectedNotif] = useState<CaseNotification | null>(
    notifications[0] || null
  );
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [viewMode, setViewMode] = useState<IntimationViewMode>('SPLIT');
  const [showOriginalModal, setShowOriginalModal] = useState<boolean>(false);
  const [copiedModalText, setCopiedModalText] = useState<boolean>(false);

  const filtered = notifications.filter(n => {
    if (filter === 'PENDING') return n.status === 'PENDING_REVIEW';
    if (filter === 'APPROVED') return n.status === 'APPROVED';
    return true;
  });

  const handleCopyRaw = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedModalText(true);
    setTimeout(() => setCopiedModalText(false), 2000);
  };

  return (
    <div className="inbox-layout">
      {/* Coluna da Esquerda: Lista de Intimações */}
      <div className="inbox-list-col">
        <div className="inbox-list-header">
          <div>
            <h2 className="section-title">Intimações</h2>
            <p className="section-desc">
              Publicações recebidas e processadas automaticamente.
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
                    {notif.extractedData.cnjNumber || 'Sem número'}
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
                        Fatal: {notif.extractedData.suggestedDeadlineDays}d
                      </span>
                    ) : (
                      <span className="gold-badge">
                        <Clock size={12} />
                        Prazo: {notif.extractedData.suggestedDeadlineDays}d
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
                  <span>Aprovar</span>
                </button>
              ) : (
                <div className="status-approved-box">
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Aprovado</span>
                </div>
              )}
            </div>

            {/* Barra de Seleção do Modo de Visualização */}
            <div className="intimation-view-toolbar">
              <div className="intimation-view-label">
                <Sparkles size={14} color="#B47E20" />
                <span>Visualização:</span>
              </div>

              <div className="intimation-view-options">
                <button 
                  type="button"
                  className={`intimation-view-btn ${viewMode === 'RESUMO' ? 'active' : ''}`}
                  onClick={() => setViewMode('RESUMO')}
                  title="Exibir somente o resumo inteligente e prazos da IA"
                >
                  <Sparkles size={13} />
                  <span>Só Resumo</span>
                </button>

                <button 
                  type="button"
                  className={`intimation-view-btn ${viewMode === 'SPLIT' ? 'active' : ''}`}
                  onClick={() => setViewMode('SPLIT')}
                  title="Exibir resumo da IA e texto original completo"
                >
                  <Columns size={13} />
                  <span>Ambos (Resumo + Original)</span>
                </button>

                <button 
                  type="button"
                  className={`intimation-view-btn ${viewMode === 'MODAL' ? 'active' : ''}`}
                  onClick={() => setViewMode('MODAL')}
                  title="Exibir resumo e botão para abrir a publicação em modal popup"
                >
                  <Maximize2 size={13} />
                  <span>Resumo + Botão Modal</span>
                </button>
              </div>
            </div>

            {/* Banner de Risco / Prazo Fatal */}
            <div className={`deadline-banner ${selectedNotif.extractedData.isFatalDeadline ? 'fatal' : 'normal'}`}>
              <div className="banner-icon-area">
                <Calendar size={28} />
              </div>
              <div className="banner-content">
                <div className="banner-title">
                  {selectedNotif.extractedData.isFatalDeadline ? 'FATAL' : 'PRAZO'}
                </div>
                <div className="banner-dates">
                  <strong>{selectedNotif.extractedData.suggestedDeadlineDays} dias úteis</strong>
                  <span> — Limite: <strong>{selectedNotif.extractedData.estimatedFatalDate}</strong></span>
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
                  <UserCheck size={14} color="#B47E20" />
                  <span>Responsável:</span>
                </div>
                <div className="routing-value">
                  OAB: <strong>{selectedNotif.extractedData.lawyerOAB || 'Geral'}</strong>
                  {selectedNotif.assignedLawyerName && (
                    <span> ➔ <span className="highlight-lawyer">{selectedNotif.assignedLawyerName}</span></span>
                  )}
                </div>
              </div>
            )}

            {/* Análise Inteligente (Visível em todos os modos) */}
            <div className="gemini-analysis-section">
              <div className="gemini-header">
                <Sparkles size={16} color="#B47E20" />
                <span>Resumo da Inteligência Artificial</span>
              </div>
              <p className="gemini-summary-text">
                {selectedNotif.extractedData.summary}
              </p>

              <div className="keypoints-title">Destaques:</div>
              <ul className="keypoints-list">
                {selectedNotif.extractedData.keyPoints.map((pt, idx) => (
                  <li key={idx}>
                    <ArrowRight size={13} color="#B47E20" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="recommended-action-box">
                <div className="action-tag">AÇÃO SUGERIDA:</div>
                <div className="action-text">{selectedNotif.extractedData.recommendedAction}</div>
              </div>
            </div>

            {/* MODO 2: Ambos (Resumo + Texto Original Abaixo) */}
            {viewMode === 'SPLIT' && (
              <div className="raw-email-section">
                <div className="raw-email-header" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} />
                    <span>Teor da Publicação Recebida:</span>
                  </div>
                  <button 
                    type="button"
                    className="btn-secondary mini-btn"
                    onClick={() => setShowOriginalModal(true)}
                    style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                    title="Ampliar em tela cheia"
                  >
                    <Maximize2 size={12} />
                    <span>Ver em Modal</span>
                  </button>
                </div>
                <pre className="raw-email-content">
                  {selectedNotif.rawBody}
                </pre>
              </div>
            )}

            {/* MODO 3: Resumo com Botão que Abre Modal com o Original */}
            {viewMode === 'MODAL' && (
              <div className="modal-original-trigger-box">
                <div className="modal-original-trigger-info">
                  <FileText size={22} color="#B47E20" />
                  <div>
                    <div className="modal-original-trigger-title">Publicação Oficial do Tribunal</div>
                    <div className="modal-original-trigger-desc">Texto integral recebido para auditoria e conferência.</div>
                  </div>
                </div>

                <button 
                  type="button"
                  className="btn-primary mini-btn"
                  onClick={() => setShowOriginalModal(true)}
                  style={{ gap: '8px' }}
                >
                  <Maximize2 size={14} />
                  <span>Ver Publicação Original</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="no-selection-card glass-panel">
            <FileText size={48} color="#64748B" />
            <p>Selecione uma intimação ao lado para ver a análise completa da decisão e os prazos.</p>
          </div>
        )}
      </div>

      {/* Modal Popup para Leitura do Texto Original */}
      {showOriginalModal && selectedNotif && (
        <div className="intimation-modal-backdrop" onClick={() => setShowOriginalModal(false)}>
          <div className="intimation-modal-card" onClick={e => e.stopPropagation()}>
            <div className="intimation-modal-header">
              <div className="intimation-modal-title">
                <FileText size={20} color="#B47E20" />
                <span>Publicação Oficial — {selectedNotif.extractedData.cnjNumber}</span>
              </div>
              <button 
                type="button"
                className="copy-mini-btn" 
                onClick={() => setShowOriginalModal(false)}
                title="Fechar (Esc)"
                style={{ padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="intimation-modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', background: '#F1F5F9', padding: '10px 14px', borderRadius: '8px' }}>
                <div><strong>Origem:</strong> {selectedNotif.rawSender}</div>
                <div><strong>Recebido:</strong> {selectedNotif.receivedAt}</div>
                <div><strong>Tipo:</strong> {selectedNotif.extractedData.intimationType}</div>
              </div>

              <pre className="intimation-modal-pre">
                {selectedNotif.rawBody}
              </pre>
            </div>

            <div className="intimation-modal-footer">
              <button 
                type="button"
                className="btn-secondary mini-btn"
                onClick={() => handleCopyRaw(selectedNotif.rawBody)}
              >
                {copiedModalText ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                <span>{copiedModalText ? 'Texto Copiado!' : 'Copiar Inteiro Teor'}</span>
              </button>

              <button 
                type="button"
                className="btn-primary mini-btn"
                onClick={() => setShowOriginalModal(false)}
              >
                <span>Fechar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
