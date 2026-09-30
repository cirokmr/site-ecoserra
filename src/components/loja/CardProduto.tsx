import Link from 'next/link';
import Foto from './Foto';
import PrecoVivo from './PrecoVivo';
import BotaoAdicionar from './BotaoAdicionar';
import { textosLoja } from '@/lib/site';
import type { Produto } from '@/lib/loja';

// Card da vitrine: foto, selo de certificação, nome, procedência, etiqueta e "Adicionar".
export default function CardProduto({ produto }: { produto: Produto }) {
  const href = `/loja/produto/${produto.slug}/`;
  return (
    <article className="pcard">
      <Link href={href} className="pcard__link" data-cursor="Ver" tabIndex={-1} aria-hidden="true">
        <Foto produto={produto} />
      </Link>
      <div className="pcard__corpo">
        {produto.organico && <span className="certif">✓ {textosLoja.selo}</span>}
        <h3 className="pcard__nome">
          <Link href={href}>{produto.nome}</Link>
        </h3>
        <p className="proc">{produto.origem || textosLoja.procedenciaPadrao}</p>
        <div className="pcard__linha">
          <PrecoVivo produto={produto} />
          <BotaoAdicionar produto={produto} />
        </div>
      </div>
    </article>
  );
}
