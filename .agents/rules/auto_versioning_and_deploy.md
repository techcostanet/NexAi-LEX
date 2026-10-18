# Regras Mandatórias: Auto-Versionamento, Deploy Contínuo e Registro no Changelog

Estas regras devem ser seguidas com rigor absoluto em **todas** as interações no projeto **NexAi-LEX**:

## 1. Auto-Versionamento a Cada Deploy
* Toda vez que ocorrer uma alteração de código (melhorias, correções de bugs, novos módulos ou refatorações), a versão do sistema deve ser incrementada automaticamente seguindo o Versionamento Semântico (`MAJOR.MINOR.PATCH`):
  * **PATCH (`1.0.x`)**: Para correções de bugs, pequenas melhorias e ajustes de layout.
  * **MINOR (`1.x.0`)**: Para novos módulos, novas telas e integrações adicionadas.
  * **MAJOR (`x.0.0`)**: Para mudanças estruturais de arquitetura ou quebras de compatibilidade.
* A versão deve ser refletida em:
  - `version.json` (raiz)
  - `web/src/version.json` (frontend)
  - Tag do Git (`vX.Y.Z`)

## 2. Deploy a Cada Mudança de Código
* Não acumular código alterado sem versionar e realizar o deploy correspondente.
* Após qualquer modificação, executar a rotina de validação e compilação de produção (`node scripts/deploy.js` ou `npm run build`).

## 3. Registro Obrigatório de Mudanças no CHANGELOG.md
* É estritamente proibido lançar uma versão sem registrar no `CHANGELOG.md`:
  - Número da versão e data exata do lançamento.
  - Lista clara de **Melhorias**, **Novas Funcionalidades** e **Correções de Bugs**.
  - Motivo da versão para rastreabilidade completa.
