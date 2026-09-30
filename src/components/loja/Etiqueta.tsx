import { formatarReais, NOME_UNIDADE, type UnidadeVenda } from '@/lib/loja';

type Props = {
  preco: number;
  promocional?: number | null;
  unidade: UnidadeVenda;
  tamanho?: 'normal' | 'grande';
};

// A "plaquinha de feira": preço em mono sobre o amarelo. Elemento-assinatura da loja.
export default function Etiqueta({ preco, promocional = null, unidade, tamanho = 'normal' }: Props) {
  const vale = promocional ?? preco;
  return (
    <span className={`etiqueta${tamanho === 'grande' ? ' etiqueta--grande' : ''}`}>
      {promocional !== null && promocional < preco && (
        <s className="etiqueta__de">
          <span className="sr-only">De </span>
          {formatarReais(preco)}
        </s>
      )}
      <span>
        {promocional !== null && promocional < preco && <span className="sr-only">por </span>}
        {formatarReais(vale)}
      </span>
      <small> / {NOME_UNIDADE[unidade].um}</small>
    </span>
  );
}
