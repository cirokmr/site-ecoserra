import Link from 'next/link';
import type { SecaoLogos } from '@/lib/site';

// Grade de logotipos (selos, parceiros, apoiadores), em grupos com nome.
// Cada cartão usa a cor de fundo do próprio arquivo (campo "fundo"), assim o
// logotipo não fica dentro de uma "caixa" de outra cor.
export default function Logos({ dados }: { dados: SecaoLogos }) {
  return (
    <section className={`section tema-${dados.tema ?? 'claro'} logos`}>
      <div className="wrap">
        {dados.rotulo && <p className="mono eyebrow muted">{dados.rotulo}</p>}
        {dados.titulo && (
          <h2 className="logos__title">
            <span className="display fs-l" data-split="lines">
              {dados.titulo.display}
            </span>
            {dados.titulo.serif && (
              <span className="serif-i fs-l accent" data-split="words" data-delay="0.15">
                {dados.titulo.serif}
              </span>
            )}
          </h2>
        )}
        {dados.texto && (
          <p className="logos__texto muted" data-fade>
            {dados.texto}
          </p>
        )}
        {dados.grupos.map((g, gi) => (
          <div key={gi} className="logos__grupo">
            {g.nome && <p className="mono muted logos__nome">{g.nome}</p>}
            <ul className="logos__grade" data-stagger>
              {g.itens.map((l) => {
                const img = (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.src} alt={l.alt} loading="lazy" />
                );
                return (
                  <li key={l.src} className="logos__item" style={l.fundo ? { background: l.fundo } : undefined}>
                    {l.href ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer">
                        {img}
                      </a>
                    ) : (
                      img
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {dados.link && (
          <div data-fade>
            <Link href={dados.link.href} className="arrow-link u-link logos__link">
              {dados.link.rotulo} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
