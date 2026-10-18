# Registro de Mudanças (Changelog) — NexAi-LEX

Todas as alterações, melhorias, correções e novos recursos lançados no sistema são documentados neste arquivo a cada deploy.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e este projeto segue o [Versionamento Semântico](https://semver.org/lang/pt-BR/) (`MAJOR.MINOR.PATCH`).

---

## [1.0.1] — 2026-10-18

### ⚡ Implementação do sistema de auto-versionamento e regras de deploy
* Criação do script de deploy automatizado
* Registro da regra em .agents/rules e AGENTS.md
* Exibição da versão dinâmica no Navbar

## [1.0.0] — 2026-10-18

### 🚀 Novas Funcionalidades (Lançamento Inicial)
* **Arquitetura 100% Google Cloud:** Ingestão passiva de e-mails, Cloud Functions, Cloud Firestore e Google Gemini AI.
* **Multi-tenant Híbrido:** Suporte nativo para **1 Advogado Solo** e **Bancas de Advocacia com Múltiplos Advogados**.
* **Inbox de Intimações (Human-in-the-Loop):** Leitura inteligente de publicações e intimações de tribunais pelo Gemini 1.5 Flash com botão de aprovação e agendamento em 1 clique.
* **Cálculo de Prazos Fatais:** Identificação de prazos em dias úteis pelo CPC/CLT e projeção de data fatal com alertas de preclusão.
* **Roteamento Inteligente por OAB:** A IA detecta a OAB citada no tribunal e atribui automaticamente a intimação ao advogado responsável da banca.
* **Sincronização com Google Agenda:** Prazos aprovados são integrados diretamente ao Google Calendar.
* **Simulador de E-mails ao Vivo:** Painel com publicações reais do TJSP, TRT-2 e TRF-3 para teste imediato do fluxo de IA e pipeline em tempo real.
* **Dossiês Virtuais de Processos:** Visualização unificada de casos com numeração padrão CNJ unificado.
* **Design System Executivo:** Interface desenvolvida em Vanilla CSS com estética Midnight Navy, Champagne Gold e glassmorphism.

### 🔧 Infraestrutura & Configurações
* Estrutura monorepo com `/functions` (Firebase Cloud Functions) e `/web` (React + TypeScript + Vite).
* Definição de esquema estrito de resposta JSON para a API do Google Gemini.
* Documentação de visão de produto, modelo de monetização e arquitetura em `/docs`.
