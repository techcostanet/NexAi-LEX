import React from 'react';
import { 
  Calendar, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { DeadlineEvent } from '../types';

interface PrazosAgendaProps {
  deadlines: DeadlineEvent[];
  isSoloMode: boolean;
}

export const PrazosAgenda: React.FC<PrazosAgendaProps> = ({
  deadlines,
  isSoloMode
}) => {
  return (
    <div className="deadlines-container glass-panel">
      <div className="deadlines-header">
        <div>
          <h2 className="section-title">Prazos</h2>
          <p className="section-desc">
            Controle oficial de prazos processuais e audiências judiciais.
          </p>
        </div>

        <div className="google-sync-card">
          <ShieldCheck size={18} color="#10B981" />
          <div>
            <div className="sync-title">Agenda Conectada</div>
            <div className="sync-desc">Lembretes automáticos</div>
          </div>
        </div>
      </div>

      <div className="deadlines-grid">
        {deadlines.map(d => {
          const isUrgent = d.daysRemaining <= 10;

          return (
            <div key={d.id} className={`deadline-card ${d.isFatal ? 'fatal' : ''}`}>
              <div className="deadline-card-top">
                <div className="deadline-date-box">
                  <span className="date-month">Vencimento</span>
                  <span className="date-day">{d.deadlineDate}</span>
                </div>

                <div className="deadline-status-col">
                  {isUrgent ? (
                    <span className="fatal-badge">
                      <AlertTriangle size={13} />
                      {d.daysRemaining} dias
                    </span>
                  ) : (
                    <span className="gold-badge">
                      <Clock size={13} />
                      {d.daysRemaining} dias
                    </span>
                  )}
                  <span className="synced-tag">
                    <CheckCircle2 size={12} color="#10B981" />
                    Agendado
                  </span>
                </div>
              </div>

              <div className="deadline-title">{d.title}</div>
              
              <div className="deadline-case-meta">
                <div className="meta-row">
                  <span className="meta-label">Processo:</span>
                  <span className="meta-val">{d.cnjNumber}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Cliente:</span>
                  <span className="meta-val">{d.clientName}</span>
                </div>
                {!isSoloMode && (
                  <div className="meta-row">
                    <span className="meta-label">Responsável:</span>
                    <span className="meta-val highlight">{d.responsibleLawyerName}</span>
                  </div>
                )}
              </div>

              <div className="deadline-card-footer">
                <button className="btn-secondary mini-btn">
                  <span>Processo</span>
                </button>
                <button className="btn-success mini-btn">
                  <CheckCircle2 size={13} />
                  <span>Concluir</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
