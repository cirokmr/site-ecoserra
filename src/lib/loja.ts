// Vitrine da loja. O catálogo vem de conteudo/loja/catalogo.json, gravado pelo Tombo CMS
// (Loja → Produtos → "Publicar catálogo no site"). As páginas de produto são geradas no
// build a partir dele; preço e estoque AO VIVO o navegador busca na API do CMS
// (`${api}/api/loja/${site}/precos`). Este arquivo é puro: serve ao servidor e ao navegador.
import dados from '@conteudo/loja/catalogo.json';

export type UnidadeVenda = 'un' | 'kg' | 'maco' | 'bandeja' | 'pote' | 'pacote' | 'cesta';

export type Categoria = { id: string; nome: string; slug: string; descricao: string | null; ordem: number };

export type Produto = {
  id: string;
  categoria_id: string | null;
  nome: string;
  slug: string;
  descricao: string | null;
  origem: string | null;
  unidade_venda: UnidadeVenda;
  vendido_por_peso: boolean;
  peso_medio_g: number | null;
  descricao_peso: string | null;
  preco_centavos: number;
  preco_promocional_centavos: number | null;
  limite_por_pedido: number | null;
  organico: boolean;
  congelado: boolean;
  conservacao: string | null;
  destaque: boolean;
  ordem: number;
  imagens: { url: string; alt: string }[];
  safra: { mes_inicio: number; mes_fim: number; pico_inicio: number | null; pico_fim: number | null } | null;
};

export type Catalogo = {
  /** true = catálogo de exemplo (antes do primeiro "Publicar catálogo"): mostra o aviso e não chama a API */
  demonstracao?: boolean;
  api: string;
  site: string;
  loja: { nome: string; whatsapp: string | null };
  categorias: Categoria[];
  produtos: Produto[];
};

export const catalogo = dados as unknown as Catalogo;
export const demonstracao = catalogo.demonstracao === true;
export const urlApi = (rota: string) => `${catalogo.api.replace(/\/+$/, '')}/api/loja/${encodeURIComponent(catalogo.site)}/${rota}`;

const ordenar = <T extends { ordem: number; nome: string }>(a: T, b: T) => a.ordem - b.ordem || a.nome.localeCompare(b.nome, 'pt-BR');

export const categorias: Categoria[] = [...catalogo.categorias].sort(ordenar);
export const produtos: Produto[] = [...catalogo.produtos].sort(ordenar);

/** Categorias que têm produto (as vazias não viram banca nem página). */
export const bancas = categorias
  .map((c) => ({ ...c, produtos: produtos.filter((p) => p.categoria_id === c.id) }))
  .filter((c) => c.produtos.length > 0);
export const semCategoria = produtos.filter((p) => !p.categoria_id || !categorias.some((c) => c.id === p.categoria_id));

export const getProduto = (slug: string) => produtos.find((p) => p.slug === slug);
export const getProdutoPorId = (id: string) => produtos.find((p) => p.id === id);
export const getBanca = (slug: string) => bancas.find((c) => c.slug === slug);
export const categoriaDe = (p: Produto) => categorias.find((c) => c.id === p.categoria_id) ?? null;

/** Número da banca (01, 02…) na ordem das categorias: é o que aparece nos rótulos. */
export const numeroDaBanca = (slug: string) => String(bancas.findIndex((c) => c.slug === slug) + 1).padStart(2, '0');

/** A cesta em destaque (1º produto vendido por cesta); os outros destaques vão para os cards. */
export const cestaDestaque = produtos.find((p) => p.unidade_venda === 'cesta') ?? null;
export const destaques = (quantidade: number) => {
  const marcados = produtos.filter((p) => p.destaque && p.id !== cestaDestaque?.id);
  const lista = marcados.length ? marcados : produtos.filter((p) => p.id !== cestaDestaque?.id);
  return lista.slice(0, quantidade);
};

// ---------- dinheiro e unidades ----------
const fmtReais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const formatarReais = (centavos: number) => fmtReais.format(centavos / 100).replace(/ /g, ' ');
/** Preço que vale agora (promocional, se houver). */
export const precoAtual = (p: Pick<Produto, 'preco_centavos' | 'preco_promocional_centavos'>) =>
  p.preco_promocional_centavos ?? p.preco_centavos;

export const NOME_UNIDADE: Record<UnidadeVenda, { um: string; varios: string }> = {
  un: { um: 'unidade', varios: 'unidades' },
  kg: { um: 'kg', varios: 'kg' },
  maco: { um: 'maço', varios: 'maços' },
  bandeja: { um: 'bandeja', varios: 'bandejas' },
  pote: { um: 'pote', varios: 'potes' },
  pacote: { um: 'pacote', varios: 'pacotes' },
  cesta: { um: 'cesta', varios: 'cestas' },
};
export const quantidadeTexto = (n: number, u: UnidadeVenda) => `${n} ${n === 1 ? NOME_UNIDADE[u].um : NOME_UNIDADE[u].varios}`;

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
/** "Safra: mai a ago" (null quando o produto não tem safra cadastrada). */
export const textoSafra = (p: Produto) =>
  p.safra ? `${MESES[p.safra.mes_inicio - 1]} a ${MESES[p.safra.mes_fim - 1]}` : null;
