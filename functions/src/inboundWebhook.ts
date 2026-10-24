import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { extractLegalDataWithGemini } from './geminiExtractor';
import { CaseNotification, Tenant } from './types';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Webhook HTTP chamado quando um novo e-mail de intimação chega ao gateway
 * Ex: POST /api/inbound-email
 */
export const handleInboundEmail = onRequest({ cors: true }, async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).send({ error: 'Method Not Allowed' });
      return;
    }

    const { to, from, subject, body } = req.body;

    if (!to || !body) {
      res.status(400).send({ error: 'Campos "to" e "body" são obrigatórios' });
      return;
    }

    // 1. Identificar o Escritório (Tenant) a partir do e-mail de destino
    // Ex: "silva-advogados@inbox.nexai.com.br"
    const destinationEmail = String(to).toLowerCase().trim();
    
    const tenantQuery = await db.collection('tenants')
      .where('inboundEmail', '==', destinationEmail)
      .limit(1)
      .get();

    if (tenantQuery.empty) {
      console.warn(`Nenhum escritório encontrado para o e-mail: ${destinationEmail}`);
      res.status(404).send({ error: 'Escritório não localizado para este endereço' });
      return;
    }

    const tenantDoc = tenantQuery.docs[0];
    const tenant = tenantDoc.data() as Tenant;
    const tenantId = tenantDoc.id;

    // 2. Extrair dados jurídicos com Google Gemini 1.5
    const extractedData = await extractLegalDataWithGemini(subject || '', body);

    // 3. Roteamento inteligente: Encontrar advogado pela OAB
    let assignedLawyerId: string | undefined;
    let assignedLawyerName: string | undefined;

    if (extractedData.lawyerOAB) {
      const cleanOAB = extractedData.lawyerOAB.replace(/\D/g, '');
      const lawyersSnapshot = await db.collection('users')
        .where('tenantId', '==', tenantId)
        .get();

      for (const doc of lawyersSnapshot.docs) {
        const user = doc.data();
        if (user.oabNumber && user.oabNumber.replace(/\D/g, '').includes(cleanOAB)) {
          assignedLawyerId = doc.id;
          assignedLawyerName = user.name;
          break;
        }
      }
    }

    // 4. Salvar na coleção de intimações pendentes (Human-in-the-loop)
    const notificationRef = db.collection('notifications_inbox').doc();
    const newNotification: CaseNotification = {
      id: notificationRef.id,
      tenantId,
      rawSubject: subject || 'Intimação Eletrônica Recebida',
      rawSender: from || 'Tribunal / DJE',
      rawBody: body,
      receivedAt: new Date().toISOString(),
      extractedData,
      status: 'PENDING_REVIEW',
      assignedLawyerId,
      assignedLawyerName
    };

    await notificationRef.set(newNotification);

    // 5. Incrementar contador de notificações do mês no escritório
    await tenantDoc.ref.update({
      monthlyNotificationsCount: admin.firestore.FieldValue.increment(1)
    });

    res.status(200).send({
      success: true,
      notificationId: notificationRef.id,
      extractedData,
      assignedTo: assignedLawyerName || tenant.name || 'Geral do Escritório'
    });
  } catch (error: any) {
    console.error('Erro no processamento do inbound email:', error);
    res.status(500).send({ error: error.message || 'Erro interno no servidor' });
  }
});
