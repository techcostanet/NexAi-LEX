/**
 * Script de Auto-Versionamento e Deploy Automatizado — NexAi-LEX
 * Executa a atualização de versão, registro no CHANGELOG.md, compilação e deploy.
 * 
 * Uso:
 *   node scripts/deploy.js --type=patch|minor|major --title="Descrição curta" --changes="Melhoria A; Correção B"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const versionFilePath = path.join(rootDir, 'version.json');
const webVersionFilePath = path.join(rootDir, 'web', 'src', 'version.json');
const changelogFilePath = path.join(rootDir, 'CHANGELOG.md');

// 1. Processar argumentos da linha de comando
const args = process.argv.slice(2);
let bumpType = 'patch';
let releaseTitle = 'Atualização e melhorias do sistema';
let changesList = [];

for (const arg of args) {
  if (arg.startsWith('--type=')) {
    bumpType = arg.replace('--type=', '').toLowerCase();
  } else if (arg.startsWith('--title=')) {
    releaseTitle = arg.replace('--title=', '');
  } else if (arg.startsWith('--changes=')) {
    changesList = arg.replace('--changes=', '').split(';').map(s => s.trim()).filter(Boolean);
  }
}

// 2. Ler versão atual e calcular próxima
const currentVersionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
const parts = currentVersionData.version.split('.').map(Number);
let [major, minor, patch] = parts;

if (bumpType === 'major') {
  major += 1;
  minor = 0;
  patch = 0;
} else if (bumpType === 'minor') {
  minor += 1;
  patch = 0;
} else {
  patch += 1;
}

const newVersion = `${major}.${minor}.${patch}`;
const now = new Date();
const formattedDate = now.toISOString().split('T')[0];
const timestamp = now.toISOString();

console.log(`\n=================================================`);
console.log(`🚀 INICIANDO NOVO DEPLOY NEXAI-LEX: v${newVersion}`);
console.log(`=================================================`);
console.log(`Tipo de Versão: ${bumpType.toUpperCase()}`);
console.log(`Data: ${formattedDate} (${timestamp})`);
console.log(`Título da Versão: ${releaseTitle}\n`);

// 3. Atualizar arquivos version.json
const updatedVersionData = {
  version: newVersion,
  buildDate: timestamp,
  channel: 'production',
  title: releaseTitle
};

fs.writeFileSync(versionFilePath, JSON.stringify(updatedVersionData, null, 2) + '\n');
fs.writeFileSync(webVersionFilePath, JSON.stringify(updatedVersionData, null, 2) + '\n');
console.log(`✓ Versão atualizada em version.json e web/src/version.json para v${newVersion}`);

// 4. Atualizar CHANGELOG.md
let changelogContent = fs.readFileSync(changelogFilePath, 'utf8');

const changelogEntry = `
## [${newVersion}] — ${formattedDate}

### ⚡ ${releaseTitle}
${changesList.length > 0 ? changesList.map(c => `* ${c}`).join('\n') : '* Atualizações de código, melhorias de desempenho e estabilidade.'}
`;

// Insere logo abaixo da introdução (antes do primeiro ## [X.X.X])
const insertIndex = changelogContent.indexOf('## [');
if (insertIndex !== -1) {
  changelogContent = changelogContent.slice(0, insertIndex) + changelogEntry.trim() + '\n\n' + changelogContent.slice(insertIndex);
} else {
  changelogContent += '\n' + changelogEntry;
}

fs.writeFileSync(changelogFilePath, changelogContent);
console.log(`✓ Alterações registradas no CHANGELOG.md`);

// 5. Executar Build de Produção
console.log(`\n🔨 Compilando aplicação web para produção...`);
try {
  execSync('npm.cmd --prefix web run build', { stdio: 'inherit', cwd: rootDir });
  console.log(`✓ Build de produção gerado com sucesso.`);
} catch (error) {
  console.error(`❌ Erro durante a compilação do projeto web:`, error);
  process.exit(1);
}

// 6. Registrar no Git se houver repositório ativo
try {
  execSync('git add .', { cwd: rootDir });
  execSync(`git commit -m "deploy(v${newVersion}): ${releaseTitle}"`, { cwd: rootDir });
  execSync(`git tag -a v${newVersion} -m "Versão v${newVersion}: ${releaseTitle}"`, { cwd: rootDir });
  console.log(`✓ Commit e Tag git v${newVersion} criados com sucesso.`);
} catch (gitErr) {
  console.warn(`ℹ️ Git registro concluído ou sem alterações pendentes.`);
}

// 7. Publicar site no Google Firebase Hosting e Cloud Firestore (100% Google Cloud)
console.log(`\n🔥 Publicando aplicação no Google Firebase Hosting e Cloud Firestore (projeto: nexai-lex)...`);
try {
  execSync('npx.cmd --yes firebase deploy --only hosting,firestore --project nexai-lex', { stdio: 'inherit', cwd: rootDir });
  console.log(`✓ Aplicação e Banco de Dados Firestore sincronizados com sucesso no Google Cloud!`);
} catch (pubErr) {
  console.error(`❌ Erro durante o deploy no Firebase:`, pubErr.message);
  process.exit(1);
}

// 8. Sincronizar cópia do código e tags no repositório GitHub (backup do código)
console.log(`\n☁️ Sincronizando cópia do código com o GitHub (https://github.com/techcostanet/NexAi-LEX)...`);
try {
  execSync('git push origin main --tags', { stdio: 'inherit', cwd: rootDir });
  console.log(`✓ Cópia do código sincronizada no GitHub com sucesso.`);
} catch (pushErr) {
  console.error(`⚠️ Atenção no push ao GitHub:`, pushErr.message);
}

console.log(`\n=================================================`);
console.log(`✅ DEPLOY v${newVersion} CONCLUÍDO COM SUCESSO!`);
console.log(`🔥 Hospedagem Oficial: https://nexai-lex.web.app`);
console.log(`🔥 Domínio Secundário: https://nexai-lex.firebaseapp.com`);
console.log(`☁️ Repositório Código: https://github.com/techcostanet/NexAi-LEX`);
console.log(`=================================================\n`);

