'use client';

// Carrinho no navegador (localStorage): só produto e quantidade. Preço, estoque, frete e
// total quem calcula é a API do Tombo CMS, a mesma conta que o checkout vai fazer.
import { useSyncExternalStore } from 'react';
import { demonstracao, urlApi } from './loja';

// o carrinho da demonstração não passa para a loja de verdade (os ids dos produtos mudam)
const CHAVE = demonstracao ? 'ecoserra-carrinho-demo' : 'ecoserra-carrinho';
const EVENTO = 'carrinho-mudou';
export const MAX_QUANTIDADE = 999;
export const MAX_ITENS = 60;

export type Itens = Record<string, number>;
const VAZIO: Itens = {};

let cache: { bruto: string | null; itens: Itens } = { bruto: null, itens: VAZIO };

function ler(): Itens {
  let bruto: string | null = null;
  try {
    bruto = window.localStorage.getItem(CHAVE);
  } catch {
    return cache.itens;
  }
  if (bruto === cache.bruto) return cache.itens;
  let itens: Itens = {};
  try {
    const obj = bruto ? JSON.parse(bruto) : {};
    for (const [id, q] of Object.entries(obj ?? {})) {
      const n = Math.floor(Number(q));
      if (/^\d{1,18}$/.test(id) && n > 0) itens[id] = Math.min(n, MAX_QUANTIDADE);
    }
  } catch {
    itens = {};
  }
  cache = { bruto, itens };
  return itens;
}

function gravar(itens: Itens) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(itens));
  } catch {
    // modo privado ou armazenamento cheio: o carrinho vale só nesta página
    cache = { bruto: JSON.stringify(itens), itens };
  }
  window.dispatchEvent(new Event(EVENTO));
}

function assinar(aviso: () => void) {
  window.addEventListener(EVENTO, aviso);
  window.addEventListener('storage', aviso);
  return () => {
    window.removeEventListener(EVENTO, aviso);
    window.removeEventListener('storage', aviso);
  };
}

export function useCarrinho(): Itens {
  return useSyncExternalStore(assinar, ler, () => VAZIO);
}

export const totalDeItens = (itens: Itens) => Object.keys(itens).length;

export function definirQuantidade(id: string, quantidade: number) {
  const itens = { ...ler() };
  const n = Math.max(0, Math.min(MAX_QUANTIDADE, Math.floor(quantidade)));
  if (n === 0) delete itens[id];
  else {
    if (!(id in itens) && Object.keys(itens).length >= MAX_ITENS) return false;
    itens[id] = n;
  }
  gravar(itens);
  return true;
}

export const adicionar = (id: string, quantidade = 1) => definirQuantidade(id, (ler()[id] ?? 0) + quantidade);
export const remover = (id: string) => definirQuantidade(id, 0);
export const esvaziar = () => gravar({});

// ---------- preços ao vivo ----------
export type PrecoVivo = {
  id: string;
  preco_centavos: number;
  preco_promocional_centavos: number | null;
  /** null = sob demanda */
  disponivel: number | null;
  limite_por_pedido: number | null;
};

let precos: Promise<Map<string, PrecoVivo> | null> | null = null;

/** Busca os preços uma vez por visita. null = sem API (demonstração, loja fechada, sem rede). */
export function buscarPrecos(): Promise<Map<string, PrecoVivo> | null> {
  if (demonstracao) return Promise.resolve(null);
  precos ??= fetch(urlApi('precos'), { headers: { Accept: 'application/json' } })
    .then((r) => (r.ok ? r.json() : null))
    .then((j: { ok?: boolean; produtos?: PrecoVivo[] } | null) =>
      j?.ok && Array.isArray(j.produtos) ? new Map(j.produtos.map((p) => [String(p.id), p])) : null,
    )
    .catch(() => null);
  return precos;
}
