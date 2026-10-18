# NexAi-LEX — Visão do Produto, Arquitetura e Modelo de Negócio

## 1. Visão Geral
O **NexAi-LEX** é uma plataforma SaaS projetada para advogados autônomos e bancas de advocacia, cujo diferencial principal é a **ingestão e triagem passiva de intimações e andamentos judiciais via e-mail dedicado** alimentado por Inteligência Artificial (Google Gemini).

---

## 2. Estrutura Multi-Tenant: Advogado Solo vs. Escritório

O sistema adota o conceito universal de **Organização / Workspace (Tenant)**:

### 2.1 Cenário A: Advogado Autônomo (Solo)
* Cria sua conta e automaticamente ganha seu Workspace.
* É o único membro, atuando como `OWNER` (Dono/Administrador).
* Possui seu e-mail exclusivo de captura (ex: `dr.carlos-4f9a@inbox.nexai.com.br`).

### 2.2 Cenário B: Escritório com Múltiplos Advogados
* O escritório possui um Workspace único.
* O Sócio/Admin convida outros advogados e colaboradores.
* **Perfis de Acesso (RBAC):**
  * `ADMIN / SÓCIO`: Acesso irrestrito a configurações, planos, financeiro e todos os processos.
  * `ADVOGADO`: Acesso aos processos em que está atribuído (ou visibilidade total configurável) e gestão da sua própria agenda de prazos.
  * `ASSISTENTE / ESTAGIÁRIO`: Auxílio na triagem e upload de documentos; restrito para encerramento de prazos fatais.

### 2.3 Roteamento Inteligente de Intimações no Escritório
1. O e-mail do tribunal chega à caixa do escritório (`escritorio-silva@inbox.nexai.com.br`).
2. O **Gemini** lê a publicação e identifica a **OAB mencionada**.
3. O sistema cruza a OAB com os advogados cadastrados no escritório e **atribui a intimação automaticamente ao advogado responsável**.

---

## 3. Modelo de Negócio e Precificação (SaaS)

### 3.1 Estratégia de Preços (Tiered + Per-Seat)
* **Plano Solo:**
  * Ideal para advogados individuais.
  * 1 usuário, até 150 processos monitorados.
  * Faixa: R$ 97 a R$ 129 / mês.
* **Plano Escritório (Starter):**
  * Para pequenas bancas.
  * 3 usuários inclusos, até 500 processos monitorados.
  * Faixa: R$ 249 a R$ 299 / mês.
* **Assento Extra (Per-Seat Addon):**
  * +1 Advogado adicional com agenda própria: R$ 49 a R$ 69 / usuário / mês.
* **Plano Banca (Escala):**
  * Para médios e grandes escritórios (10+ advogados, processos ilimitados).
  * Faixa: R$ 690 a R$ 1.200 / mês.

### 3.2 Custos Operacionais (Google Cloud)
* **Gemini 1.5 Flash:** Custo estimado de ~R$ 0,005 a R$ 0,01 por intimação processada.
* **Firestore & Storage:** Custos irrisórios no plano Pay-as-you-go.
* **Margem Bruta Estimada:** > 90%.

---

## 4. Stack Tecnológica 100% Google
* **Frontend:** React / Next.js com Tailwind/CSS Moderno hospedado no Firebase App Hosting.
* **Backend:** Google Cloud Functions (TypeScript / Node.js).
* **Banco de Dados:** Cloud Firestore (NoSQL multi-tenant).
* **Arquivos e Anexos:** Cloud Storage for Firebase.
* **Inteligência Artificial:** Google Gemini 1.5 Flash + Google Document AI (OCR).
* **Autenticação:** Firebase Authentication (Login Google / Email).
* **Agenda:** Google Calendar API.
