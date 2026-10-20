import React, { useState, useMemo } from 'react';
import { 
  FolderOpen, 
  Search, 
  Scale, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Copy, 
  Check,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  DollarSign,
  Layers
} from 'lucide-react';
import { LegalCase } from '../types';

interface ProcessosListProps {
  cases: LegalCase[];
  isSoloMode: boolean;
}

type SortKey = 
  | 'cnjNumber' 
  | 'clientName' 
  | 'opposingParty' 
  | 'court' 
  | 'caseArea' 
  | 'phase' 
  | 'caseValue' 
  | 'distributionDate' 
  | 'lastUpdateDate' 
  | 'eventsCount' 
  | 'status';

export const ProcessosList: React.FC<ProcessosListProps> = ({
  cases,
  isSoloMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('lastUpdateDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleCopyCNJ = (cnj: string) => {
    navigator.clipboard.writeText(cnj);
    setCopiedId(cnj);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      if (
        key === 'caseValue' || 
        key === 'lastUpdateDate' || 
        key === 'distributionDate' || 
        key === 'eventsCount'
      ) {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    }
  };

  const filteredCases = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return cases.filter(c => 
      c.cnjNumber.toLowerCase().includes(term) ||
      c.clientName.toLowerCase().includes(term) ||
      (c.opposingParty && c.opposingParty.toLowerCase().includes(term)) ||
      c.court.toLowerCase().includes(term) ||
      c.caseArea.toLowerCase().includes(term) ||
      (c.phase && c.phase.toLowerCase().includes(term))
    );
  }, [cases, searchTerm]);

  const sortedCases = useMemo(() => {
    return [...filteredCases].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      return sortOrder === 'asc' 
        ? strA.localeCompare(strB, 'pt-BR') 
        : strB.localeCompare(strA, 'pt-BR');
    });
  }, [filteredCases, sortKey, sortOrder]);

  const totalValue = useMemo(() => {
    return sortedCases.reduce((acc, curr) => acc + (curr.caseValue || 0), 0);
  }, [sortedCases]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '—';
    return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderSortHeader = (key: SortKey, label: string) => {
    const isActive = sortKey === key;
    return (
      <th 
        className={`sortable ${isActive ? 'sorted-active' : ''}`}
        onClick={() => handleSort(key)}
        title={`Clique para ordenar por ${label}`}
      >
        <div className="th-sort-wrapper">
          <span>{label}</span>
          <span className="sort-icon-indicator">
            {isActive ? (
              sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
            ) : (
              <ArrowUpDown size={12} />
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="cases-container glass-panel">
      {/* Header com Totais e Busca */}
      <div className="cases-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 className="section-title">Processos</h2>
            <span className="gold-badge" style={{ fontSize: '0.72rem' }}>
              {sortedCases.length} {sortedCases.length === 1 ? 'processo' : 'processos'}
            </span>
          </div>
          <p className="section-desc">
            Pastas judiciais com colunas auto-organizáveis (clique nos cabeçalhos para ordenar).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Métricas Rápidas */}
          <div className="cases-summary-stats">
            <div className="summary-stat-pill" title="Soma do valor das causas exibidas">
              <span>Valor da Carteira:</span>
              <strong style={{ color: '#047857' }}>
                {formatCurrency(totalValue)}
              </strong>
            </div>
          </div>

          <div className="search-box">
            <Search size={16} color="#64748B" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por CNJ, cliente, réu, vara ou fase..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabela de Processos com Novas Colunas Ordenáveis */}
      <div className="cases-table-wrapper">
        <table className="cases-table">
          <thead>
            <tr>
              {renderSortHeader('cnjNumber', 'Processo / CNJ')}
              {renderSortHeader('clientName', 'Cliente')}
              {renderSortHeader('opposingParty', 'Parte Contrária')}
              {renderSortHeader('court', 'Tribunal / Vara')}
              {renderSortHeader('caseArea', 'Área')}
              {renderSortHeader('phase', 'Fase Processual')}
              {renderSortHeader('caseValue', 'Valor da Causa')}
              {renderSortHeader('distributionDate', 'Distribuição')}
              {renderSortHeader('lastUpdateDate', 'Últ. Andamento')}
              {renderSortHeader('eventsCount', 'Eventos')}
              {renderSortHeader('status', 'Status')}
            </tr>
          </thead>
          <tbody>
            {sortedCases.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  Nenhum processo encontrado para a busca realizada.
                </td>
              </tr>
            ) : (
              sortedCases.map(c => (
                <tr key={c.id}>
                  {/* CNJ */}
                  <td>
                    <div className="cnj-cell">
                      <span className="cnj-text">{c.cnjNumber}</span>
                      <button 
                        type="button"
                        className="copy-mini-btn"
                        onClick={() => handleCopyCNJ(c.cnjNumber)}
                        title="Copiar número CNJ"
                      >
                        {copiedId === c.cnjNumber ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </td>

                  {/* Cliente */}
                  <td>
                    <div className="client-cell">
                      <strong style={{ color: 'var(--text-primary)' }}>{c.clientName}</strong>
                    </div>
                  </td>

                  {/* Parte Contrária */}
                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {c.opposingParty || 'Não informada'}
                    </span>
                  </td>

                  {/* Tribunal / Vara */}
                  <td>
                    <span className="court-cell-text" style={{ fontSize: '0.8rem' }}>
                      {c.court}
                    </span>
                  </td>

                  {/* Área do Direito */}
                  <td>
                    <span className={`area-badge ${c.caseArea.toLowerCase()}`}>
                      {c.caseArea}
                    </span>
                  </td>

                  {/* Fase Processual */}
                  <td>
                    <span className={`phase-badge ${(c.phase || 'inicial').toLowerCase()}`}>
                      {c.phase || 'INICIAL'}
                    </span>
                  </td>

                  {/* Valor da Causa */}
                  <td>
                    <span className="case-value-cell">
                      {formatCurrency(c.caseValue)}
                    </span>
                  </td>

                  {/* Data de Distribuição */}
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatDate(c.distributionDate)}
                    </span>
                  </td>

                  {/* Última Atualização */}
                  <td>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {formatDate(c.lastUpdateDate)}
                    </span>
                  </td>

                  {/* Quantidade de Andamentos */}
                  <td>
                    <span className="events-count-badge">
                      {c.eventsCount} atos
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <span className="status-active-pill">
                      ● Ativo
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
