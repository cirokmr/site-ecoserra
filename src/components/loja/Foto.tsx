import Marca from '@/components/Marca';
import type { Produto } from '@/lib/loja';

// Foto principal do produto; sem foto cadastrada, um quadro da marca com "Foto em breve".
export default function Foto({ produto, prioridade = false, className = '' }: { produto: Produto; prioridade?: boolean; className?: string }) {
  const img = produto.imagens[0];
  return (
    <div className={`pfoto ${className}`}>
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img.url} alt={img.alt || produto.nome} loading={prioridade ? 'eager' : 'lazy'} decoding="async" fetchPriority={prioridade ? 'high' : 'auto'} />
      ) : (
        <div className="pfoto__vazia" role="img" aria-label={`${produto.nome}: foto em breve`}>
          <Marca className="pfoto__marca" />
          <span className="mono">Foto em breve</span>
        </div>
      )}
      {produto.congelado && <span className="pselo">Congelado</span>}
    </div>
  );
}
