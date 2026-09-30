'use client';

import Link from 'next/link';
import { useState } from 'react';
import { adicionar, useCarrinho, MAX_QUANTIDADE } from '@/lib/carrinho';
import { NOME_UNIDADE, type Produto } from '@/lib/loja';
import { usePrecoVivo } from './PrecoVivo';

// "Adicionar" do card (compacto) e da página do produto (com a quantidade).
export default function BotaoAdicionar({ produto, completo = false }: { produto: Produto; completo?: boolean }) {
  const itens = useCarrinho();
  const vivo = usePrecoVivo(produto.id);
  const [qtd, setQtd] = useState(1);
  const [aviso, setAviso] = useState('');
  const noCarrinho = itens[produto.id] ?? 0;
  const teto = Math.min(
    MAX_QUANTIDADE,
    vivo?.disponivel ?? MAX_QUANTIDADE,
    vivo?.limite_por_pedido ?? produto.limite_por_pedido ?? MAX_QUANTIDADE,
  );
  const esgotado = teto <= 0;
  const un = NOME_UNIDADE[produto.unidade_venda];

  const clicar = () => {
    const quer = completo ? qtd : 1;
    if (noCarrinho + quer > teto) {
      setAviso(`Dá para levar no máximo ${teto} ${teto === 1 ? un.um : un.varios}.`);
      return;
    }
    setAviso(adicionar(produto.id, quer) ? '' : 'O carrinho está cheio: finalize ou tire algum item.');
  };

  if (esgotado) return <span className="mono badd__esgotado">Esgotado nesta semana</span>;

  return (
    <div className={`badd${completo ? ' badd--completo' : ''}`}>
      {completo && (
        <div className="qtd" role="group" aria-label={`Quantidade em ${un.varios}`}>
          <button type="button" onClick={() => setQtd((q) => Math.max(1, q - 1))} aria-label="Diminuir" disabled={qtd <= 1}>
            −
          </button>
          <output aria-live="polite">
            {qtd} <small>{qtd === 1 ? un.um : un.varios}</small>
          </output>
          <button type="button" onClick={() => setQtd((q) => Math.min(teto, q + 1))} aria-label="Aumentar" disabled={qtd >= teto}>
            +
          </button>
        </div>
      )}
      <button type="button" className="badd__btn" onClick={clicar} aria-label={`Adicionar ${produto.nome} ao carrinho`}>
        {noCarrinho > 0 && !completo ? `+1 · ${noCarrinho} no carrinho` : 'Adicionar'}
      </button>
      {completo && noCarrinho > 0 && (
        <Link href="/carrinho/" className="u-link mono badd__ver">
          {noCarrinho} {noCarrinho === 1 ? un.um : un.varios} no carrinho · ver carrinho →
        </Link>
      )}
      {aviso && (
        <p className="badd__aviso" role="status">
          {aviso}
        </p>
      )}
    </div>
  );
}
