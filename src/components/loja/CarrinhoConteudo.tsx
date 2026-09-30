'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Foto from './Foto';
import Etiqueta from './Etiqueta';
import { buscarPrecos, definirQuantidade, remover, useCarrinho, MAX_QUANTIDADE, type PrecoVivo } from '@/lib/carrinho';
import { demonstracao, formatarReais, getProdutoPorId, NOME_UNIDADE, precoAtual, urlApi } from '@/lib/loja';
import { textosLoja } from '@/lib/site';

type Zona = {
  id: string;
  nome: string;
  tipo: 'entrega' | 'retirada';
  frete_centavos: number;
  frete_gratis_acima_centavos: number | null;
  pedido_minimo_centavos: number;
  endereco_retirada: string | null;
  horario_retirada: string | null;
  datas: { data: string }[];
};
type Conta = {
  subtotal_centavos: number;
  desconto_centavos: number;
  frete_centavos: number | null;
  total_centavos: number;
  falta_frete_gratis_centavos: number | null;
  falta_minimo_centavos: number;
  linhas: { produto_id: string; aviso_texto?: string }[];
  avisos: string[];
};

const dataCurta = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'UTC' });
const fmtData = (iso: string) => dataCurta.format(new Date(`${iso.slice(0, 10)}T12:00:00Z`));

export default function CarrinhoConteudo() {
  const itens = useCarrinho();
  const [montado, setMontado] = useState(false);
  const [vivos, setVivos] = useState<Map<string, PrecoVivo> | null>(null);
  const [cep, setCep] = useState('');
  const [cepConsultado, setCepConsultado] = useState('');
  const [zonas, setZonas] = useState<Zona[] | null>(null);
  const [zonaId, setZonaId] = useState('');
  const [conta, setConta] = useState<Conta | null>(null);
  const [erro, setErro] = useState('');
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    setMontado(true);
    buscarPrecos().then(setVivos);
  }, []);

  const linhas = useMemo(
    () =>
      Object.entries(itens).map(([id, quantidade]) => {
        const p = getProdutoPorId(id) ?? null;
        const vivo = vivos?.get(id);
        const unit = p ? (vivo ? (vivo.preco_promocional_centavos ?? vivo.preco_centavos) : precoAtual(p)) : 0;
        return { id, quantidade, p, vivo, unit, subtotal: unit * quantidade };
      }),
    [itens, vivos],
  );
  const subtotal = linhas.reduce((s, l) => s + (l.p ? l.subtotal : 0), 0);
  const chaveItens = JSON.stringify(itens);

  // conta oficial do CMS (preços, frete, total) quando há zona escolhida
  useEffect(() => {
    setConta(null);
    if (demonstracao || !zonaId || !linhas.length) return;
    let ativo = true;
    fetch(urlApi('carrinho'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ itens: linhas.map((l) => ({ produto_id: l.id, quantidade: l.quantidade })), cep: cepConsultado, zona_id: zonaId }),
    })
      .then((r) => r.json())
      .then((j) => {
        if (!ativo) return;
        if (j?.ok) {
          setConta(j as Conta);
          setErro('');
        } else setErro(j?.erro || j?.message || 'Não deu para calcular agora. Tente de novo em instantes.');
      })
      .catch(() => ativo && setErro('Sem conexão com a loja. Tente de novo em instantes.'));
    return () => {
      ativo = false;
    };
  }, [zonaId, chaveItens]);

  const verEntrega = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setZonas(null);
    setZonaId('');
    const d = cep.replace(/\D/g, '');
    if (d.length !== 8) {
      setErro('Digite o CEP com 8 números.');
      return;
    }
    setBuscando(true);
    try {
      const r = await fetch(`${urlApi('frete')}?cep=${d}`, { headers: { Accept: 'application/json' } });
      const j = await r.json();
      if (!j?.ok) throw new Error(j?.erro || j?.message);
      const lista = (j.zonas ?? []) as Zona[];
      setZonas(lista);
      setCepConsultado(d);
      if (!j.atende_entrega)
        setErro(lista.length ? 'Ainda não entregamos nesse CEP. Veja a retirada abaixo.' : 'Ainda não entregamos nesse CEP.');
    } catch (err) {
      setErro(err instanceof Error && err.message ? err.message : 'Não deu para consultar a entrega agora.');
    } finally {
      setBuscando(false);
    }
  };

  if (!montado) return <p className="mono muted carrinho__carregando">Abrindo o carrinho…</p>;

  if (!linhas.length)
    return (
      <div className="carrinho__vazio">
        <p className="fs-m">Seu carrinho está vazio.</p>
        <Link href="/loja/" className="btn" data-magnetic>
          Ver a colheita da semana <span aria-hidden="true">→</span>
        </Link>
      </div>
    );

  const avisoDe = (id: string) => conta?.linhas.find((l) => l.produto_id === id)?.aviso_texto;

  return (
    <div className="carrinho">
      <ul className="carrinho__itens">
        {linhas.map(({ id, quantidade, p, vivo, unit, subtotal: sub }) => {
          if (!p)
            return (
              <li key={id} className="citem citem--fora">
                <p>Um produto do seu carrinho não está mais à venda.</p>
                <button type="button" className="u-link mono" onClick={() => remover(id)}>
                  Tirar do carrinho
                </button>
              </li>
            );
          const un = NOME_UNIDADE[p.unidade_venda];
          const teto = Math.min(MAX_QUANTIDADE, vivo?.disponivel ?? MAX_QUANTIDADE, vivo?.limite_por_pedido ?? p.limite_por_pedido ?? MAX_QUANTIDADE);
          const aviso = avisoDe(id);
          return (
            <li key={id} className="citem">
              <Link href={`/loja/produto/${p.slug}/`} className="citem__foto" tabIndex={-1} aria-hidden="true">
                <Foto produto={p} />
              </Link>
              <div className="citem__info">
                <Link href={`/loja/produto/${p.slug}/`} className="citem__nome">
                  {p.nome}
                </Link>
                <Etiqueta preco={unit} unidade={p.unidade_venda} />
                {aviso && <p className="citem__aviso">{aviso}</p>}
              </div>
              <div className="qtd" role="group" aria-label={`Quantidade de ${p.nome}`}>
                <button type="button" onClick={() => definirQuantidade(id, quantidade - 1)} aria-label="Diminuir">
                  −
                </button>
                <output aria-live="polite">
                  {quantidade} <small>{quantidade === 1 ? un.um : un.varios}</small>
                </output>
                <button type="button" onClick={() => definirQuantidade(id, quantidade + 1)} aria-label="Aumentar" disabled={quantidade >= teto}>
                  +
                </button>
              </div>
              <p className="citem__sub">{formatarReais(sub)}</p>
              <button type="button" className="citem__remover mono u-link" onClick={() => remover(id)} aria-label={`Tirar ${p.nome} do carrinho`}>
                Tirar
              </button>
            </li>
          );
        })}
      </ul>

      <aside className="carrinho__resumo tema-escuro" aria-label="Resumo do pedido">
        <h2 className="mono">Resumo</h2>
        <dl>
          <div>
            <dt>Produtos</dt>
            <dd>{formatarReais(conta?.subtotal_centavos ?? subtotal)}</dd>
          </div>
          {conta && conta.desconto_centavos > 0 && (
            <div>
              <dt>Desconto</dt>
              <dd>− {formatarReais(conta.desconto_centavos)}</dd>
            </div>
          )}
          <div>
            <dt>Entrega</dt>
            <dd>{conta?.frete_centavos != null ? (conta.frete_centavos === 0 ? 'Grátis' : formatarReais(conta.frete_centavos)) : 'a calcular'}</dd>
          </div>
          <div className="carrinho__total">
            <dt>Total</dt>
            <dd>{formatarReais(conta?.total_centavos ?? subtotal)}</dd>
          </div>
        </dl>

        {demonstracao ? (
          <p className="carrinho__nota">
            {textosLoja.entrega} O frete aparece aqui quando a loja abrir.
          </p>
        ) : (
          <form className="carrinho__cep" onSubmit={verEntrega}>
            <label htmlFor="cep" className="mono">
              CEP da entrega
            </label>
            <div>
              <input id="cep" name="cep" inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} maxLength={9} />
              <button type="submit" className="mono" disabled={buscando}>
                {buscando ? 'Buscando…' : 'Ver entrega'}
              </button>
            </div>
          </form>
        )}

        {zonas && zonas.length > 0 && (
          <fieldset className="carrinho__zonas">
            <legend className="mono">Como receber</legend>
            {zonas.map((z) => (
              <label key={z.id} className="zona">
                <input type="radio" name="zona" value={z.id} checked={zonaId === z.id} onChange={() => setZonaId(z.id)} />
                <span>
                  <strong>{z.nome}</strong> · {z.frete_centavos === 0 ? 'grátis' : formatarReais(z.frete_centavos)}
                  {z.datas[0] && <small> · próxima: {fmtData(z.datas[0].data)}</small>}
                  {z.tipo === 'retirada' && z.endereco_retirada && <small> · {z.endereco_retirada}</small>}
                </span>
              </label>
            ))}
          </fieldset>
        )}

        {conta?.falta_minimo_centavos ? <p className="carrinho__nota">Faltam {formatarReais(conta.falta_minimo_centavos)} para o pedido mínimo desta entrega.</p> : null}
        {conta?.falta_frete_gratis_centavos ? <p className="carrinho__nota">Faltam {formatarReais(conta.falta_frete_gratis_centavos)} para o frete grátis.</p> : null}
        {conta?.avisos.map((a) => (
          <p key={a} className="carrinho__nota">
            {a}
          </p>
        ))}
        {erro && (
          <p className="carrinho__erro" role="alert">
            {erro}
          </p>
        )}

        <button type="button" className="btn carrinho__finalizar" disabled aria-describedby="pix-em-breve">
          Finalizar pedido
        </button>
        <p id="pix-em-breve" className="mono carrinho__pix">
          Pagamento por Pix em breve
        </p>
      </aside>
    </div>
  );
}
