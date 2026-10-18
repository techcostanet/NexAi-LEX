# Regras Mandatórias: Auto-Versionamento, Deploy Contínuo, GitHub Sync e Arquitetura 100% Online

Estas regras devem ser seguidas com rigor absoluto em **todas** as interações no projeto **NexAi-LEX**:

## 1. Auto-Versionamento a Cada Deploy
* Toda vez que ocorrer uma alteração de código (melhorias, correções de bugs, novos módulos ou refatorações), a versão do sistema deve ser incrementada automaticamente seguindo o Versionamento Semântico (`MAJOR.MINOR.PATCH`).
* A versão deve ser refletida em:
  - `version.json` (raiz)
  - `web/src/version.json` (frontend)
  - Tag do Git (`vX.Y.Z`)

## 2. Deploy Contínuo a Cada Mudança de Código
* Não acumular código alterado sem versionar e realizar o deploy correspondente.
* Após qualquer modificação, executar a rotina de validação e compilação de produção (`node scripts/deploy.js` ou `npm run build`).

## 3. Registro Obrigatório de Mudanças no CHANGELOG.md
* É estritamente proibido lançar uma versão sem registrar no `CHANGELOG.md`:
  - Número da versão e data exata do lançamento.
  - Lista clara de **Melhorias**, **Novas Funcionalidades** e **Correções de Bugs**.
  - Motivo da versão para rastreabilidade completa.

## 4. Sincronização Obrigatória com o Repositório GitHub
* Todo deploy deve enviar automaticamente as atualizações e tags Git para o repositório oficial:
  `https://github.com/techcostanet/NexAi-LEX` (`git push origin main --tags`).

## 5. Arquitetura 100% Online (Zero LocalStorage / Zero Mocks Locais)
* **Proibido o uso de `localStorage` ou `sessionStorage`:** Nenhuma informação de processos, prazos, intimações ou perfil pode ser guardada na memória local do navegador.
* **SaaS Multi-advogado:** Quando um advogado do escritório aprovar um prazo ou receber uma intimação, todos os outros advogados do mesmo escritório devem ver o dado atualizado em tempo real na nuvem através do **Google Cloud Firestore** (`onSnapshot`).
