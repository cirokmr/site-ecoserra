import type { Metadata } from 'next';
import Link from 'next/link';
import CardProduto from '@/components/loja/CardProduto';
import Cesta from '@/components/loja/Cesta';
import AvisoDemonstracao from '@/components/loja/AvisoDemonstracao';
import { bancas, cestaDestaque, numeroDaBanca, semCategoria } from '@/lib/loja';
import { textosLoja } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Loja',
  description: textosLoja.descricao,
  alternates: { canonical: '/loja/' },
};

// A feira inteira: a cesta em destaque e cada categoria como uma banca numerada.
export default function Loja() {
  return (
    <>
      <header className="page-hero tema-escuro loja-hero">
        <div className="wrap">
          <p className="mono eyebrow muted" data-fade data-now>
            {textosLoja.rotulo}
          </p>
          <h1 className="page-hero__title">
            <span className="display fs-xxl" data-split="chars" data-now>
              {textosLoja.titulo}
            </span>
            {textosLoja.destaque && (
              <span className="serif-i fs-xl accent" data-split="words" data-now data-delay="0.35">
                {textosLoja.destaque}
              </span>
            )}
          </h1>
          {textosLoja.lead && (
            <p className="page-hero__lead fs-m" data-fade data-now data-delay="0.5">
              {textosLoja.lead}
            </p>
          )}
          {bancas.length > 1 && (
            <nav className="bancas-nav" aria-label="Bancas da feira" data-fade data-now data-delay="0.6">
              {bancas.map((b) => (
                <Link key={b.id} href={`/loja/${b.slug}/`} className="bancas-nav__item">
                  <span className="mono">{numeroDaBanca(b.slug)}</span> {b.nome}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      <section className="section tema-claro loja-corpo">
        <div className="wrap">
          <AvisoDemonstracao />

          {bancas.map((b) => {
            // a cesta da semana aparece grande, no topo da banca dela
            const temCesta = b.produtos.some((p) => p.id === cestaDestaque?.id);
            const cards = b.produtos.filter((p) => p.id !== cestaDestaque?.id);
            return (
            <section key={b.id} className="banca" aria-labelledby={`banca-${b.slug}`}>
              <div className="banca__cab">
                <h2 id={`banca-${b.slug}`} className="banca__titulo">
                  <span className="mono banca__num">Banca {numeroDaBanca(b.slug)}</span>
                  <span className="display">{b.nome}</span>
                </h2>
                <Link href={`/loja/${b.slug}/`} className="arrow-link mono">
                  Ver a banca ({b.produtos.length}) <span className="arrow">→</span>
                </Link>
              </div>
              {temCesta && cestaDestaque && <Cesta produto={cestaDestaque} />}
              {cards.length > 0 && (
                <div className="pgrade">
                  {cards.map((p) => (
                    <CardProduto key={p.id} produto={p} />
                  ))}
                </div>
              )}
            </section>
            );
          })}

          {semCategoria.length > 0 && (
            <section className="banca" aria-labelledby="banca-outros">
              <div className="banca__cab">
                <h2 id="banca-outros" className="banca__titulo">
                  <span className="display">Outros</span>
                </h2>
              </div>
              <div className="pgrade">
                {semCategoria.map((p) => (
                  <CardProduto key={p.id} produto={p} />
                ))}
              </div>
            </section>
          )}

          {textosLoja.entrega && <p className="loja-entrega mono">{textosLoja.entrega}</p>}
        </div>
      </section>
    </>
  );
}
