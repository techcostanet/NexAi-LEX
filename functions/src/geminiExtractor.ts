import { GoogleGenAI, Type } from '@google/genai';
import { ExtractedLegalData } from './types';

// O Google GenAI SDK oficial
const ai = new GoogleGenAI({});

export const LEGAL_INTIMATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    cnjNumber: {
      type: Type.STRING,
      description: "Número do processo unificado no padrão CNJ (ex: 1234567-89.2024.8.26.0100). Deixe em branco se não encontrar."
    },
    court: {
      type: Type.STRING,
      description: "Identificação do Tribunal, Vara ou Comarca (ex: TJSP - 4ª Vara Cível da Capital)."
    },
    lawyerOAB: {
      type: Type.STRING,
      description: "Número da OAB e estado do advogado citado na publicação (ex: 123456/SP ou OAB/RJ 98765)."
    },
    intimationType: {
      type: Type.STRING,
      enum: [
        "DESPACHO",
        "DECISÃO INTERLOCUTÓRIA",
        "SENTENÇA",
        "AUDIÊNCIA",
        "CITAÇÃO / INTIMAÇÃO",
        "ACÓRDÃO",
        "OUTROS"
      ],
      description: "Natureza jurídica principal do ato processual."
    },
    suggestedDeadlineDays: {
      type: Type.INTEGER,
      description: "Prazo fixado em dias para manifestação ou recurso (ex: 5, 10, 15). 0 se não houver prazo expresso."
    },
    isFatalDeadline: {
      type: Type.BOOLEAN,
      description: "Verdadeiro se houver risco de preclusão, revelia, trânsito em julgado ou sanção processual."
    },
    estimatedFatalDate: {
      type: Type.STRING,
      description: "Data limite calculada no formato YYYY-MM-DD considerando dias úteis a partir de hoje."
    },
    summary: {
      type: Type.STRING,
      description: "Resumo executivo em 2 a 3 parágrafos claros explicando o que o juiz decidiu e o que o advogado precisa fazer."
    },
    keyPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de 3 a 4 pontos mais críticos e imediatos da decisão."
    },
    recommendedAction: {
      type: Type.STRING,
      description: "Ação prática recomendada para o advogado (ex: Interpor Agravo de Instrumento, Apresentar Réplica à Contestação, Pagar custas)."
    }
  },
  required: [
    "cnjNumber",
    "court",
    "intimationType",
    "suggestedDeadlineDays",
    "isFatalDeadline",
    "summary",
    "recommendedAction"
  ]
};

export async function extractLegalDataWithGemini(
  emailSubject: string,
  emailBody: string
): Promise<ExtractedLegalData> {
  const prompt = `
Você é um especialista sênior em Direito Processual Civil, Trabalhista e leitura de Diários Oficiais e intimações no Brasil.
Analise a seguinte publicação/intimação judicial recebida por e-mail e extraia com precisão cirúrgica os dados solicitados.

Assunto do E-mail: ${emailSubject}
Texto da Intimação:
${emailBody}

Instruções Específicas:
1. Extraia o número exato do processo no padrão CNJ (NNNNNNN-DD.YYYY.J.TR.OOOO).
2. Identifique o número da OAB citada para fins de atribuição do advogado responsável.
3. Classifique a natureza do ato (Despacho, Decisão, Sentença, Audiência).
4. Verifique com rigor se há prazo fixado pelo juiz ou pelo Código de Processo Civil (CPC/CLT) para manifestação.
5. Calcule a data estimada (em dias úteis a partir de hoje) e redija um resumo claro para o advogado economizar tempo.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: LEGAL_INTIMATION_SCHEMA,
        temperature: 0.1 // Precisão e determinismo
      }
    });

    const parsedData = JSON.parse(response.text || '{}') as ExtractedLegalData;
    return parsedData;
  } catch (error) {
    console.error('Erro na extração com Gemini:', error);
    throw error;
  }
}
