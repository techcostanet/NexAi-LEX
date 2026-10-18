# Diretrizes do Projeto NexAi-LEX

## Regras Obrigatórias de Desenvolvimento

1. **Auto-Versionamento:** A cada deploy ou alteração de código, a versão do sistema deve ser incrementada (patch, minor ou major).
2. **Deploy Contínuo:** Toda modificação, correção de bug ou melhoria deve ser acompanhada de deploy com build testado.
3. **Registro no CHANGELOG.md:** Todo deploy deve registrar detalhadamente as melhorias, novidades e correções no arquivo `CHANGELOG.md`.
4. **Script de Deploy:** Para executar essa rotina de forma padronizada, utilize o script `node scripts/deploy.js --type=patch|minor|major --title="..." --changes="..."`.
