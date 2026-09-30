import type { Metadata } from 'next';
import CarrinhoConteudo from '@/components/loja/CarrinhoConteudo';
import AvisoDemonstracao from '@/components/loja/AvisoDemonstracao';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Carrinho',
  description: `Seu carrinho na loja da ${site.nomeCompleto}: confira os produtos, a entrega e o total do pedido.`,
  alternates: { canonical: '/carrinho/' },
  robots: { index: false, follow: true },
};

export default function Carrinho() {
  return (
    <section className="section tema-claro carrinho-pagina">
      <div className="wrap">
        <p className="mono eyebrow">Sua cesta</p>
        <h1 className="carrinho__titulo">
          <span className="display fs-xl">Seu</span> <span className="serif-i fs-xl accent">carrinho</span>
        </h1>
        <AvisoDemonstracao />
        <CarrinhoConteudo />
      </div>
    </section>
  );
}
