import fs from 'node:fs';
import path from 'node:path';
import type { NextConfig } from 'next';

// Loja: as páginas dela (src/app/loja/**, src/app/carrinho/) se chamam "page.loja.tsx" e só
// viram rota com a loja ligada (conteudo/site.json → loja.ativa diferente de false). Desligada,
// o Next nem compila essas páginas: o export não gera /loja/ nem /carrinho/.
const siteJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'conteudo', 'site.json'), 'utf8'));
const lojaAtiva = !!siteJson.loja && siteJson.loja.ativa !== false;

// Export 100% estático: o site não precisa de servidor. Sai tudo em ./out,
// que qualquer hospedagem estática publica (Vercel, Netlify, Cloudflare).
// O único recurso dinâmico — o formulário de contato — é resolvido no navegador.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', ...(lojaAtiva ? ['loja.tsx'] : [])],
};

export default nextConfig;
