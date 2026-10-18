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

// 7. Enviar cópia e tags automaticamente para o GitHub
console.log(`\n☁️ Enviando versão v${newVersion} para o GitHub (https://github.com/techcostanet/NexAi-LEX)...`);
try {
  execSync('git push origin main --tags', { stdio: 'inherit', cwd: rootDir });
  console.log(`✓ Cópia remota sincronizada no GitHub com sucesso.`);
} catch (pushErr) {
  console.error(`⚠️ Atenção no push ao GitHub:`, pushErr.message);
}

// 8. Publicar site no GitHub Pages (branch gh-pages)
console.log(`\n🌐 Publicando site no GitHub Pages (https://techcostanet.github.io/NexAi-LEX/)...`);
try {
  const ghPagesTempDir = path.join(rootDir, '.gh-pages-temp');
  if (fs.existsSync(ghPagesTempDir)) {
    try { execSync(`git worktree remove "${ghPagesTempDir}" --force`, { cwd: rootDir, stdio: 'ignore' }); } catch (_) {}
    fs.rmSync(ghPagesTempDir, { recursive: true, force: true });
  }

  execSync(`git worktree add -B gh-pages "${ghPagesTempDir}"`, { stdio: 'pipe', cwd: rootDir });

  // Limpar conteúdo antigo do worktree (exceto .git)
  for (const file of fs.readdirSync(ghPagesTempDir)) {
    if (file !== '.git') {
      fs.rmSync(path.join(ghPagesTempDir, file), { recursive: true, force: true });
    }
  }

  // Copiar build de web/dist
  const distDir = path.join(rootDir, 'web', 'dist');
  fs.cpSync(distDir, ghPagesTempDir, { recursive: true });

  // Adicionar arquivo .nojekyll
  fs.writeFileSync(path.join(ghPagesTempDir, '.nojekyll'), '');

  // Commit e push para o GitHub gh-pages
  execSync('git add -A', { cwd: ghPagesTempDir, stdio: 'pipe' });
  execSync(`git commit -m "deploy(v${newVersion}): ${releaseTitle}"`, { cwd: ghPagesTempDir, stdio: 'pipe' });
  execSync('git push -u origin gh-pages --force', { cwd: ghPagesTempDir, stdio: 'inherit' });

  // Limpar worktree
  execSync(`git worktree remove "${ghPagesTempDir}" --force`, { cwd: rootDir, stdio: 'pipe' });
  console.log(`✓ Site publicado com sucesso no GitHub Pages: https://techcostanet.github.io/NexAi-LEX/`);
} catch (pubErr) {
  console.warn(`⚠️ Aviso na publicação gh-pages:`, pubErr.message);
  try {
    const ghPagesTempDir = path.join(rootDir, '.gh-pages-temp');
    if (fs.existsSync(ghPagesTempDir)) {
      execSync(`git worktree remove "${ghPagesTempDir}" --force`, { cwd: rootDir, stdio: 'ignore' });
    }
  } catch (_) {}
}

console.log(`\n=================================================`);
console.log(`✅ DEPLOY v${newVersion} CONCLUÍDO COM SUCESSO!`);
console.log(`🌐 URL Pública: https://techcostanet.github.io/NexAi-LEX/`);
console.log(`=================================================\n`);

