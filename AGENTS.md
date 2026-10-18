# Diretrizes do Projeto NexAi-LEX

## Regras Obrigatórias de Desenvolvimento

1. **Auto-Versionamento:** A cada deploy ou alteração de código, a versão do sistema deve ser incrementada (patch, minor ou major).
2. **Deploy Contínuo:** Toda modificação, correção de bug ou melhoria deve ser acompanhada de deploy com build testado.
3. **Registro no CHANGELOG.md:** Todo deploy deve registrar detalhadamente as melhorias, novidades e correções no arquivo `CHANGELOG.md`.
4. **Sincronização com GitHub:** A cada deploy, o repositório remoto `https://github.com/techcostanet/NexAi-LEX` deve receber uma cópia com todas as tags de versão.
5. **Arquitetura 100% Online (Zero LocalStorage / Zero Mocks Locais):** 
   - Proibido o uso de `localStorage`, `sessionStorage` ou armazenamento no navegador para persistência de dados do sistema.
   - Todo o sistema é SaaS multi-usuário. Múltiplos advogados do mesmo escritório devem ter dados compartilhados em tempo real na nuvem através do **Google Cloud Firestore**.
6. **Hospedagem 100% Google Cloud / Firebase (Zero Hosting no GitHub):**
   - O sistema é hospedado e servido exclusivamente na infraestrutura Google (**Google Firebase Hosting** no projeto oficial `nexai-lex`: `https://nexai-lex.web.app`).
   - O GitHub (`https://github.com/techcostanet/NexAi-LEX`) é utilizado estritamente para backup e versionamento do código-fonte e tags.
7. **Script de Deploy:** Para executar essa rotina de forma padronizada, utilize o script `node scripts/deploy.js --type=patch|minor|major --title="..." --changes="..."`.

