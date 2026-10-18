import React, { useState } from 'react';
import { 
  FolderOpen, 
  Search, 
  Scale, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { LegalCase } from '../types';

interface ProcessosListProps {
  cases: LegalCase[];
  isSoloMode: boolean;
}

export const ProcessosList: React.FC<ProcessosListProps> = ({
  cases,
  isSoloMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCases = cases.filter(c => 
    c.cnjNumber.includes(searchTerm) ||
    c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.court.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyCNJ = (cnj: string) => {
    navigator.clipboard.writeText(cnj);
    setCopiedId(cnj);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="cases-container glass-panel">
      <div className="cases-header">
        <div>
          <h2 className="section-title">Processos e Dossiês Virtuais</h2>
          <p className="section-desc">
            Organização centralizada de todas as pastas judiciais vinculadas às intimações recebidas.
          </p>
        </div>

        <div className="search-box">
          <Search size={16} color="#64748B" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por CNJ, cliente ou tribunal..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="cases-table-wrapper">
        <table className="cases-table">
          <thead>
            <tr>
              <th>Número CNJ Unificado</th>
              <th>Cliente / Requerente</th>
              <th>Tribunal & Vara</th>
              <th>Área</th>
              {!isSoloMode && <th>Advogado Responsável</th>}
              <th>Andamentos</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map(c => (
              <tr key={c.id}>
                <td>
                  <div className="cnj-cell">
                    <span className="cnj-text">{c.cnjNumber}</span>
                    <button 
                      className="copy-mini-btn"
                      onClick={() => handleCopyCNJ(c.cnjNumber)}
                      title="Copiar CNJ"
                    >
                      {copiedId === c.cnjNumber ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                    </button>
                  </div>
                </td>
                <td>
                  <div className="client-cell">
                    <strong>{c.clientName}</strong>
                  </div>
                </td>
                <td>
                  <span className="court-cell-text">{c.court}</span>
                </td>
                <td>
                  <span className={`area-badge ${c.caseArea.toLowerCase()}`}>
                    {c.caseArea}
                  </span>
                </td>
                {!isSoloMode && (
                  <td>
                    <div className="lawyer-cell">
                      <span>{c.responsibleLawyerName}</span>
                      <small>OAB: {c.responsibleOAB}</small>
                    </div>
                  </td>
                )}
                <td>
                  <span className="events-count-badge">
                    {c.eventsCount} eventos
                  </span>
                </td>
                <td>
                  <span className="status-active-pill">
                    Ativo
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
