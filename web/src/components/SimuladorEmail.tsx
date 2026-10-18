import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  CheckCircle, 
  Loader2, 
  FileText, 
  Mail, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { sampleCourtTemplates } from '../mockData';
import { CaseNotification, ExtractedLegalData, Tenant } from '../types';

interface SimuladorEmailProps {
  tenant: Tenant;
  onEmailProcessed: (notification: CaseNotification) => void;
}

export const SimuladorEmail: React.FC<SimuladorEmailProps> = ({
  tenant,
  onEmailProcessed
}) => {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [subject, setSubject] = useState(sampleCourtTemplates[0].subject);
  const [sender, setSender] = useState(sampleCourtTemplates[0].sender);
  const [body, setBody] = useState(sampleCourtTemplates[0].body);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<number>(0);

  const handleSelectTemplate = (index: number) => {
    setSelectedTemplateIndex(index);
    setSubject(sampleCourtTemplates[index].subject);
    setSender(sampleCourtTemplates[index].sender);
    setBody(sampleCourtTemplates[index].body);
  };

  const handleSimulate = async () => {
    setIsProcessing(true);
    setProcessingStep(1);

    // Etapa 1: Ingestão no Gateway
    await new Promise(r => setTimeout(r, 600));
    setProcessingStep(2);

    // Etapa 2: Identificação do Tenant
    await new Promise(r => setTimeout(r, 650));
    setProcessingStep(3);

    // Etapa 3: Gemini 1.5 Flash extraindo
    await new Promise(r => setTimeout(r, 1100));
    setProcessingStep(4);

    // Etapa 4: Roteamento OAB
    await new Promise(r => setTimeout(r, 550));
    setProcessingStep(5);

    await new Promise(r => setTimeout(r, 400));

    // Determina dados extraídos com base no conteúdo
    let extracted: ExtractedLegalData;
    let assignedLawyer = 'Dr. Carlos Renato Silva';

    if (body.includes('0001452-98.2023.5.02.0044')) {
      extracted = {
        cnjNumber: '0001452-98.2023.5.02.0044',
        court: 'TRT-2 - 44ª Vara do Trabalho de São Paulo',
        lawyerOAB: '345678/SP',
        intimationType: 'DESPACHO',
        suggestedDeadlineDays: 8,
        isFatalDeadline: true,
        estimatedFatalDate: '2026-10-30',
        summary: 'Intimação trabalhista para apresentação de contraminuta ao Agravo de Petição da reclamada em 8 dias úteis.',
        keyPoints: [
          'Agravo de petição pendente de contraminuta.',
          'Prazo improrrogável de 8 dias úteis (CLT).',
          'Atribuído ao especialista trabalhista Dr. Roberto Lima.'
        ],
        recommendedAction: 'Apresentar contraminuta ao Agravo de Petição refutando teses da reclamada.'
      };
      assignedLawyer = 'Dr. Roberto Lima';
    } else if (body.includes('5012390-88.2024.4.03.6100')) {
      extracted = {
        cnjNumber: '5012390-88.2024.4.03.6100',
        court: 'TRF-3 - 14ª Vara das Execuções Fiscais Federais',
        lawyerOAB: '234567/SP',
        intimationType: 'CITAÇÃO / INTIMAÇÃO',
        suggestedDeadlineDays: 30,
        isFatalDeadline: true,
        estimatedFatalDate: '2026-11-28',
        summary: 'Intimação da penhora em execução fiscal federal promovida pela Fazenda Nacional. Prazo de 30 dias para Embargos à Execução.',
        keyPoints: [
          'Penhora formalizada no evento 42 da Execução Fiscal.',
          'Prazo de 30 dias (Art. 16 da LEF) para oposição de Embargos.',
          'Garantia do juízo já assegurada nos autos.'
        ],
        recommendedAction: 'Elaborar peça de Embargos à Execução Fiscal demonstrando excesso de execução.'
      };
      assignedLawyer = 'Dra. Mariana Souza';
    } else {
      extracted = {
        cnjNumber: '1029384-12.2024.8.26.0001',
        court: 'TJSP - 1ª Vara Cível do Foro Regional de Santana',
        lawyerOAB: '123456/SP',
        intimationType: 'SENTENÇA',
        suggestedDeadlineDays: 15,
        isFatalDeadline: true,
        estimatedFatalDate: '2026-11-09',
        summary: 'Sentença favorável julgando procedente o pedido para condenar a ré em R$ 145.000,00 mais honorários de 15%. Prazo de 15 dias para eventual apelação ou cumprimento.',
        keyPoints: [
          'Vitória integral da ação com condenação de R$ 145.000,00.',
          'Honorários fixados em 15% sobre o valor da condenação.',
          'Prazo de 15 dias úteis de apelação para a parte contrária.'
        ],
        recommendedAction: 'Avisar o cliente sobre a vitória na sentença e monitorar eventual apelação da ré.'
      };
      assignedLawyer = 'Dr. Carlos Renato Silva';
    }

    const newNotification: CaseNotification = {
      id: `notif_sim_${Date.now()}`,
      tenantId: tenant.id,
      rawSubject: subject,
      rawSender: sender,
      rawBody: body,
      receivedAt: 'Agora mesmo',
      extractedData: extracted,
      status: 'PENDING_REVIEW',
      assignedLawyerName: assignedLawyer
    };

    setIsProcessing(false);
    setProcessingStep(0);
    onEmailProcessed(newNotification);
  };

  return (
    <div className="simulator-container glass-panel">
      <div className="simulator-header">
        <div className="simulator-badge">
          <Sparkles size={14} color="#C9A86A" />
          <span>Laboratório de Testes em Tempo Real</span>
        </div>
        <h2 className="section-title">Simulador de Ingestão de E-mails com Google Gemini</h2>
        <p className="section-desc">
          Este painel permite testar a chegada de intimações reais de tribunais como se tivessem sido enviadas para 
          o e-mail exclusivo do escritório (<code>{tenant.inboundEmail}</code>).
        </p>
      </div>

      {/* Seletor de Modelos Oficiais */}
      <div className="template-picker-row">
        <label className="picker-label">Escolha um modelo de intimação real:</label>
        <div className="template-cards-grid">
          {sampleCourtTemplates.map((tpl, i) => (
            <button
              key={i}
              className={`template-chip ${selectedTemplateIndex === i ? 'active' : ''}`}
              onClick={() => handleSelectTemplate(i)}
            >
              <FileText size={14} />
              <span>{tpl.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor do E-mail */}
      <div className="email-editor-grid">
        <div className="form-group">
          <label className="input-label">Remetente (Tribunal / DJE):</label>
          <input 
            type="text" 
            className="text-input" 
            value={sender} 
            onChange={e => setSender(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="input-label">Destinatário (Seu Sistema):</label>
          <input 
            type="text" 
            className="text-input readonly" 
            value={tenant.inboundEmail} 
            readOnly 
          />
        </div>

        <div className="form-group full-width">
          <label className="input-label">Assunto da Intimação:</label>
          <input 
            type="text" 
            className="text-input" 
            value={subject} 
            onChange={e => setSubject(e.target.value)}
          />
        </div>

        <div className="form-group full-width">
          <label className="input-label">Corpo do E-mail / Publicação do Diário Oficial:</label>
          <textarea 
            rows={7} 
            className="text-area" 
            value={body} 
            onChange={e => setBody(e.target.value)}
          />
        </div>
      </div>

      {/* Ação de Disparo */}
      <div className="simulator-actions">
        <button 
          className="btn-primary trigger-btn"
          onClick={handleSimulate}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="spin-icon" />
              <span>Processando com Gemini...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Simular Envio de E-mail para o NexAi-LEX</span>
            </>
          )}
        </button>
      </div>

      {/* Pipeline de Processamento Visual */}
      {isProcessing && (
        <div className="pipeline-radar-card">
          <div className="pipeline-title">
            <Sparkles size={16} color="#C9A86A" />
            <span>Execução da Pipeline Google Cloud:</span>
          </div>

          <div className="pipeline-steps">
            <div className={`step-item ${processingStep >= 1 ? 'active' : ''}`}>
              <div className="step-circle">{processingStep > 1 ? '✓' : '1'}</div>
              <span>1. E-mail recebido no Inbound Gateway</span>
            </div>

            <div className={`step-item ${processingStep >= 2 ? 'active' : ''}`}>
              <div className="step-circle">{processingStep > 2 ? '✓' : '2'}</div>
              <span>2. Identificação do Escritório ({tenant.slug})</span>
            </div>

            <div className={`step-item ${processingStep >= 3 ? 'active' : ''}`}>
              <div className="step-circle">{processingStep > 3 ? '✓' : '3'}</div>
              <span>3. Extração com Google Gemini 1.5 Flash</span>
            </div>

            <div className={`step-item ${processingStep >= 4 ? 'active' : ''}`}>
              <div className="step-circle">{processingStep > 4 ? '✓' : '4'}</div>
              <span>4. Roteamento por OAB para Advogado Responsável</span>
            </div>

            <div className={`step-item ${processingStep >= 5 ? 'active' : ''}`}>
              <div className="step-circle">{processingStep >= 5 ? '✓' : '5'}</div>
              <span>5. Gravação no Firestore & Pronto para Validação</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
