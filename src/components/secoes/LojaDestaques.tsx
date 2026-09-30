import Link from 'next/link';
import CardProduto from '@/components/loja/CardProduto';
import Cesta from '@/components/loja/Cesta';
import AvisoDemonstracao from '@/components/loja/AvisoDemonstracao';
import { cestaDestaque, destaques, produtos } from '@/lib/loja';
import type { SecaoLojaDestaques } from '@/lib/site';

// "Banca 02 — Da roça": a cesta da semana em destaque + os produtos marcados como
// destaque no catálogo da loja (conteudo/loja/catalogo.json).
export default function LojaDestaques({ dados }: { dados: SecaoLojaDestaques }) {
  if (!produtos.length) return null;
  const lista = destaques(dados.quantidade ?? 6);
  return (
    <section className={`section tema-${dados.tema ?? 'claro'} loja-destaques`} aria-labelledby="loja-destaques-title">
      <div className="wrap">
        <div className="sec-head">
          <div>
            {dados.rotulo && <p className="mono eyebrow">{dados.rotulo}</p>}
            <h2 id="loja-destaques-title" className="sec-head__title">
              <span className="display fs-xl" data-split="lines">
                {dados.titulo.display}
              </span>
              {dados.titulo.serif && (
                <span className="serif-i fs-xl accent" data-split="words" data-delay="0.15">
                  {dados.titulo.serif}
                </span>
              )}
            </h2>
          </div>
          <Link href="/loja/" className="arrow-link mono" data-fade>
            {dados.link ?? 'Ver a loja'} ({produtos.length}) <span className="arrow">→</span>
          </Link>
        </div>
        <AvisoDemonstracao />
        {cestaDestaque && <Cesta produto={cestaDestaque} />}
        <div className="pgrade" data-stagger>
          {lista.map((p) => (
            <CardProduto key={p.id} produto={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
