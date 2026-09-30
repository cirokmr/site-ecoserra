'use client';

import Link from 'next/link';
import { totalDeItens, useCarrinho } from '@/lib/carrinho';

// Link do carrinho no menu, com quantos produtos diferentes há nele.
export default function CarrinhoLink({ className = '' }: { className?: string }) {
  const n = totalDeItens(useCarrinho());
  return (
    <Link href="/carrinho/" className={`u-link carrinho-link ${className}`} aria-label={n ? `Carrinho, ${n} ${n === 1 ? 'produto' : 'produtos'}` : 'Carrinho'}>
      Carrinho
      {n > 0 && <sup>{String(n).padStart(2, '0')}</sup>}
    </Link>
  );
}
