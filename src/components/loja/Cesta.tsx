import Link from 'next/link';
import Foto from './Foto';
import PrecoVivo from './PrecoVivo';
import BotaoAdicionar from './BotaoAdicionar';
import { textosLoja } from '@/lib/site';
import type { Produto } from '@/lib/loja';

// A cesta da semana em destaque (home e loja).
export default function Cesta({ produto }: { produto: Produto }) {
  const href = `/loja/produto/${produto.slug}/`;
  return (
    <article className="cesta">
      <Link href={href} className="cesta__foto" tabIndex={-1} aria-hidden="true">
        <Foto produto={produto} />
      </Link>
      <div className="cesta__corpo">
        <p className="mono eyebrow">Montada pela cooperativa</p>
        <h3 className="cesta__nome">
          <Link href={href}>
            <span className="display">{produto.nome}</span>
          </Link>
        </h3>
        {produto.descricao && <p className="cesta__texto">{produto.descricao}</p>}
        {produto.organico && <span className="certif">✓ {textosLoja.selo}</span>}
        <div className="pcard__linha">
          <PrecoVivo produto={produto} tamanho="grande" />
          <BotaoAdicionar produto={produto} />
        </div>
      </div>
    </article>
  );
}
