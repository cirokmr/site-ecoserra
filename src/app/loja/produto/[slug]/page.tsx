import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Foto from '@/components/loja/Foto';
import PrecoVivo from '@/components/loja/PrecoVivo';
import BotaoAdicionar from '@/components/loja/BotaoAdicionar';
import CardProduto from '@/components/loja/CardProduto';
import AvisoDemonstracao from '@/components/loja/AvisoDemonstracao';
import { categoriaDe, demonstracao, getProduto, NOME_UNIDADE, numeroDaBanca, precoAtual, produtos, textoSafra } from '@/lib/loja';
import { descricaoCurta, VAZIO } from '@/lib/content';
import { site, textosLoja } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return produtos.length ? produtos.map((p) => ({ slug: p.slug })) : [{ slug: VAZIO }];
}

const descricaoDe = (p: NonNullable<ReturnType<typeof getProduto>>) =>
  descricaoCurta(
    p.descricao ||
      `${p.nome}${p.organico ? ' orgânico certificado' : ''} das famílias cooperadas, na loja da ${site.nomeCompleto}. ${textosLoja.entrega}`,
  );

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduto(slug);
  if (!p) return {};
  return {
    title: p.nome,
    description: descricaoDe(p),
    alternates: { canonical: `/loja/produto/${p.slug}/` },
    openGraph: { images: p.imagens[0] ? [{ url: p.imagens[0].url, alt: p.imagens[0].alt }] : undefined },
  };
}

export default async function PaginaProduto({ params }: Params) {
  const { slug } = await params;
  const p = getProduto(slug);
  if (!p) notFound();
  const cat = categoriaDe(p);
  const vizinhos = produtos.filter((x) => x.id !== p.id && x.categoria_id === p.categoria_id).slice(0, 3);
  const un = NOME_UNIDADE[p.unidade_venda];
  const safra = textoSafra(p);

  // Dados estruturados de produto só com preço de verdade (fora da demonstração).
  const schema = demonstracao
    ? null
    : {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.nome,
        description: descricaoDe(p),
        image: p.imagens.map((i) => new URL(i.url, site.url).toString()),
        brand: { '@type': 'Organization', name: site.nomeCompleto },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BRL',
          price: (precoAtual(p) / 100).toFixed(2),
          url: new URL(`/loja/produto/${p.slug}/`, site.url).toString(),
        },
      };

  const ficha: { rotulo: string; valor: string }[] = [
    ...(p.organico ? [{ rotulo: 'Certificação', valor: textosLoja.selo }] : []),
    { rotulo: 'Quem plantou', valor: p.origem || textosLoja.procedenciaPadrao },
    ...(safra ? [{ rotulo: 'Safra', valor: safra }] : []),
    {
      rotulo: 'Vendido por',
      valor: `${un.um}${p.descricao_peso ? ` (${p.descricao_peso})` : ''}${p.vendido_por_peso ? ' · peso variável: o valor final é ajustado na separação' : ''}`,
    },
    ...(p.conservacao ? [{ rotulo: 'Como conservar', valor: p.conservacao }] : []),
    ...(textosLoja.entrega ? [{ rotulo: 'Entrega', valor: textosLoja.entrega }] : []),
  ].filter((f) => f.valor);

  return (
    <>
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      )}
      <section className="section tema-claro produto">
        <div className="wrap">
          <nav className="produto__trilha mono" aria-label="Você está em">
            <Link href="/loja/" className="u-link">
              Loja
            </Link>
            {cat && (
              <>
                {' / '}
                <Link href={`/loja/${cat.slug}/`} className="u-link">
                  Banca {numeroDaBanca(cat.slug)} — {cat.nome}
                </Link>
              </>
            )}
          </nav>
          <AvisoDemonstracao />
          <div className="produto__grade">
            <div className="produto__foto">
              <Foto produto={p} prioridade />
            </div>
            <div className="produto__info">
              {p.organico && <span className="certif">✓ {textosLoja.selo}</span>}
              <h1 className="produto__nome display">{p.nome}</h1>
              <p className="proc">{p.origem || textosLoja.procedenciaPadrao}</p>
              <div className="produto__preco">
                <PrecoVivo produto={p} tamanho="grande" />
              </div>
              <BotaoAdicionar produto={p} completo />
              {p.descricao && <p className="produto__descricao">{p.descricao}</p>}

              <div className="ficha">
                <h2 className="mono ficha__titulo">Ficha de procedência</h2>
                <dl>
                  {ficha.map((f) => (
                    <div key={f.rotulo}>
                      <dt className="mono">{f.rotulo}</dt>
                      <dd>{f.valor}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {vizinhos.length > 0 && cat && (
            <section className="banca produto__mais" aria-labelledby="mais-da-banca">
              <div className="banca__cab">
                <h2 id="mais-da-banca" className="banca__titulo">
                  <span className="mono banca__num">Banca {numeroDaBanca(cat.slug)}</span>
                  <span className="display">Mais {cat.nome.toLowerCase()}</span>
                </h2>
                <Link href={`/loja/${cat.slug}/`} className="arrow-link mono">
                  Ver a banca <span className="arrow">→</span>
                </Link>
              </div>
              <div className="pgrade">
                {vizinhos.map((v) => (
                  <CardProduto key={v.id} produto={v} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
