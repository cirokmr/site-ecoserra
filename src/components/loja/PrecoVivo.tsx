'use client';

import { useEffect, useState } from 'react';
import Etiqueta from './Etiqueta';
import { buscarPrecos, type PrecoVivo as Vivo } from '@/lib/carrinho';
import type { Produto } from '@/lib/loja';

// Preço da página (gerado no build) trocado pelo preço ao vivo da API, quando ela responde.
export function usePrecoVivo(id: string) {
  const [vivo, setVivo] = useState<Vivo | null>(null);
  useEffect(() => {
    let ativo = true;
    buscarPrecos().then((m) => ativo && setVivo(m?.get(id) ?? null));
    return () => {
      ativo = false;
    };
  }, [id]);
  return vivo;
}

export default function PrecoVivo({ produto, tamanho }: { produto: Produto; tamanho?: 'normal' | 'grande' }) {
  const vivo = usePrecoVivo(produto.id);
  const esgotado = vivo?.disponivel === 0;
  return (
    <span className="preco-vivo">
      <Etiqueta
        preco={vivo?.preco_centavos ?? produto.preco_centavos}
        promocional={vivo ? vivo.preco_promocional_centavos : produto.preco_promocional_centavos}
        unidade={produto.unidade_venda}
        tamanho={tamanho}
      />
      {esgotado && <span className="mono preco-vivo__esgotado">Esgotado</span>}
    </span>
  );
}
