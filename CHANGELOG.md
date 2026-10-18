# Registro de Mudanças (Changelog) — NexAi-LEX

Todas as alterações, melhorias, correções e novos recursos lançados no sistema são documentados neste arquivo a cada deploy.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e este projeto segue o [Versionamento Semântico](https://semver.org/lang/pt-BR/) (`MAJOR.MINOR.PATCH`).

---

## [1.4.0] — 2026-10-18

### ⚡ Sistema de Autenticacao com Usuario e Senha (Master SaaS e Demonstracao para Clientes)
* Criacao do sistema de autenticacao nativo com Google Firebase Auth e Cloud Firestore
* Acesso Master exclusivo do Administrador do SaaS para contato@techcosta.net com redirecionamento direto ao Cockpit SuperAdmin
* Acesso dedicado de demonstracao para clientes advogados com demo@nexai.com.br
* Botoes de acesso rapido e preenchimento de 1 clique na tela de login para apresentacoes comerciais
* Ocultacao inteligente do painel SuperAdmin para clientes da banca, preservando confidencialidade
* Opcao de logout segura no Navbar e no topo do painel SuperAdmin

## [1.3.1] — 2026-10-18

### ⚡ Conexao oficial do App Web e Cloud Firestore no projeto nexai-lex
* Leitura automatica e integracao das credenciais oficiais do App Web (App ID: 1:23616077470:web:e4b60ba65eb1ea9838858f)
* Conexao nativa em tempo real com o banco Cloud Firestore do projeto nexai-lex
* Criacao e deploy das regras de seguranca firestore.rules e firestore.indexes.json
* Semeadura e sincronizacao em tempo real das colecoes notifications_inbox, deadlines e cases
* Atualizacao do script de deploy com suporte a deploy conjunto de Hosting e Firestore

## [1.3.0] — 2026-10-18

### ⚡ Painel SuperAdmin Master do SaaS e Central de Configuracoes da Banca
* Criacao do Painel Master Admin do SaaS independente da tela do cliente advogado
* Modulo Financeiro completo com MRR, ARR, fluxo de caixa e transacoes
* Gestao integral de clientes e bancas com controle de assinaturas e bloqueio/ativacao
* Cockpit executivo com margem bruta, custos da API Gemini e metricas unitarias
* Central de Configuracoes da Banca dedicada com 6 modulos (Dados da Banca, Inbound, Equipe/OAB, Google Agenda, Regras CPC e Faturamento)
* Descongestionamento da tela de trabalho do advogado para acomodar novos recursos
* Deploy oficial no Google Firebase Hosting

## [1.2.1] — 2026-10-18

### ⚡ Hospedagem 100% Google Firebase Hosting no projeto nexai-lex
* Migracao definitiva da hospedagem para Google Firebase Hosting (nexai-lex.web.app)
* Repositorio GitHub mantido estritamente para backup de codigo e tags
* Configuracao do .firebaserc e project number 23616077470
* Atualizacao das regras do projeto em AGENTS.md e .agents/rules

## [1.2.0] — 2026-10-18

### ⚡ Design System Claro (Light Theme) e Publicacao Online
* Redesign completo do Design System para modo claro (Executive Light Tech)
* Alta legibilidade com paleta bronze nobre e fundos limpos
* Configuracao de base relativa para publicacao multiplataforma
* Publicacao e hospedagem automatizada no GitHub Pages via branch gh-pages
* Configuracao de hosting no firebase.json

## [1.1.0] — 2026-10-18

### ⚡ Arquitetura 100% Online Cloud Firestore e Sincronização GitHub
* Integração nativa com Firebase Cloud Firestore em tempo real
* Eliminação total de armazenamento local (zero localStorage)
* Sincronização automática contínua com o repositório remoto https://github.com/techcostanet/NexAi-LEX
* Atualização das regras permanentes do projeto

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
