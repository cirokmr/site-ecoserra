#!/usr/bin/env node
// Lê redirects.json e gera os arquivos que as hospedagens entendem como redirecionamento:
//   public/_redirects  -> Netlify e Cloudflare Pages
//   vercel.json        -> Vercel
// Todos saem como 301 (permanente), menos os endereços listados em "temporarios"
// (ex.: uma página que volta depois), que saem como 302:
//   { "redirects": { "/produtos": "/sobre/" }, "temporarios": ["/produtos"] }
// Roda sozinho antes de cada "npm run build". Não edite os arquivos gerados.
import fs from 'node:fs';

const { redirects = {}, temporarios = [] } = JSON.parse(fs.readFileSync('redirects.json', 'utf8'));
const pares = Object.entries(redirects).filter(([de, para]) => de.startsWith('/') && para);
const temporario = new Set(Array.isArray(temporarios) ? temporarios : []);

const linhas = [
  '# GERADO AUTOMATICAMENTE a partir de redirects.json. Não edite aqui.',
  ...pares.map(([de, para]) => `${de}  ${para}  ${temporario.has(de) ? 302 : 301}`),
];
// só grava se mudou (para não disparar builds à toa)
const gravar = (arq, conteudo) => {
  if (!fs.existsSync(arq) || fs.readFileSync(arq, 'utf8') !== conteudo) fs.writeFileSync(arq, conteudo);
};
fs.mkdirSync('public', { recursive: true });
gravar('public/_redirects', linhas.join('\n') + '\n');

let vercel = {};
if (fs.existsSync('vercel.json')) {
  try { vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8')); } catch { vercel = {}; }
}
// Curinga no formato Netlify/Cloudflare ("/news/*" → "/noticias/:splat") vira o da Vercel
// ("/news/:splat*" → "/noticias/:splat*").
const paraVercel = (c) => c.replace(/\/\*$/, '/:splat*').replace(/:splat(?!\*)/g, ':splat*');
vercel.redirects = pares.map(([de, para]) => ({ source: paraVercel(de), destination: paraVercel(para), permanent: !temporario.has(de) }));
gravar('vercel.json', JSON.stringify(vercel, null, 2) + '\n');

const nTemp = pares.filter(([de]) => temporario.has(de)).length;
console.log(`[redirects] ${pares.length} redirect(s) gerados em public/_redirects e vercel.json${nTemp ? ` (${nTemp} temporário(s), 302)` : ''}`);
