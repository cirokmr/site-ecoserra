import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CardProduto from '@/components/loja/CardProduto';
import AvisoDemonstracao from '@/components/loja/AvisoDemonstracao';
import { bancas, getBanca, numeroDaBanca } from '@/lib/loja';
import { descricaoCurta, VAZIO } from '@/lib/content';
import { textosLoja } from '@/lib/site';

type Params = { params: Promise<{ categoria: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return bancas.length ? bancas.map((b) => ({ categoria: b.slug })) : [{ categoria: VAZIO }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { categoria } = await params;
  const b = getBanca(categoria);
  if (!b) return {};
  return {
    title: `${b.nome} — Loja`,
    description: descricaoCurta(
      b.descricao || `${b.nome} orgânicos das famílias cooperadas, na loja da Cooperativa Ecoserra: ${b.produtos.map((p) => p.nome).join(', ')}.`,
    ),
    alternates: { canonical: `/loja/${b.slug}/` },
  };
}

export default async function Banca({ params }: Params) {
  const { categoria } = await params;
  const b = getBanca(categoria);
  if (!b) notFound();
  return (
    <>
      <header className="page-hero tema-escuro loja-hero">
        <div className="wrap">
          <p className="mono eyebrow muted" data-fade data-now>
            <Link href="/loja/" className="u-link">
              {textosLoja.titulo} {textosLoja.destaque}
            </Link>{' '}
            · Banca {numeroDaBanca(b.slug)}
          </p>
          <h1 className="page-hero__title">
            <span className="display fs-xxl" data-split="chars" data-now>
              {b.nome}
            </span>
          </h1>
          {b.descricao && (
            <p className="page-hero__lead fs-m" data-fade data-now data-delay="0.4">
              {b.descricao}
            </p>
          )}
        </div>
      </header>
      <section className="section tema-claro loja-corpo">
        <div className="wrap">
          <AvisoDemonstracao />
          <div className="pgrade">
            {b.produtos.map((p) => (
              <CardProduto key={p.id} produto={p} />
            ))}
          </div>
          <p className="loja-voltar">
            <Link href="/loja/" className="arrow-link mono">
              <span className="arrow">←</span> Ver a feira inteira
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
