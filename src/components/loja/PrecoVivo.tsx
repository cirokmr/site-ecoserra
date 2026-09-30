'use client';

import { useEffect, useState } from 'react';
import Etiqueta from './Etiqueta';
import { buscarPrecos, type PrecoVivo as Vivo } from '@/lib/carrinho';
import type { Produto } from '@/lib/loja';

// Preço da página (gerado no build) trocado pelo preço ao vivo da API, quando ela responde.
/** `fora`: a API respondeu e o produto não está mais à venda (saiu da vitrine no painel). */
export function usePrecoVivo(id: string): { vivo: Vivo | null; fora: boolean } {
  const [estado, setEstado] = useState<{ vivo: Vivo | null; fora: boolean }>({ vivo: null, fora: false });
  useEffect(() => {
    let ativo = true;
    buscarPrecos().then((m) => {
      if (ativo) setEstado({ vivo: m?.get(id) ?? null, fora: Boolean(m && !m.has(id)) });
    });
    return () => {
      ativo = false;
    };
  }, [id]);
  return estado;
}

export default function PrecoVivo({ produto, tamanho }: { produto: Produto; tamanho?: 'normal' | 'grande' }) {
  const { vivo, fora } = usePrecoVivo(produto.id);
  const esgotado = fora || vivo?.disponivel === 0;
  return (
    <span className="preco-vivo">
      <Etiqueta
        preco={vivo?.preco_centavos ?? produto.preco_centavos}
        promocional={vivo ? vivo.preco_promocional_centavos : produto.preco_promocional_centavos}
        unidade={produto.unidade_venda}
        tamanho={tamanho}
      />
      {esgotado && <span className="mono preco-vivo__esgotado">{fora ? 'Fora da vitrine' : 'Esgotado'}</span>}
    </span>
  );
}
