# Plano da reconstrução — Cooperativa Ecoserra

Direção de arte: `DIRECAO.md` (aprovada em 30/09/2026).

## URLs antigas → destino novo

| URL antiga | Destino | Como |
|---|---|---|
| `/` | `/` | página nova |
| `/quem-somos` | `/sobre/` | redirect |
| `/galeria-de-fotos` | `/sobre/` | redirect (a galeria era um widget do Instagram; as fotos estão na página Sobre) |
| `/produtos` | `/loja/` | redirect |
| `/congelados/*` | `/loja/` | redirect (curinga: aipim, amora, morango) |
| `/frutas/*` | `/loja/` | redirect (curinga: bananas, maçã) |
| `/produtos-in-natura/*` | `/loja/` | redirect (curinga: abobrinha, açafrão, alface) |
| `/parceiros` | `/parceiros/` | página nova |
| `/transparencia` | `/transparencia/` | página nova |
| `/fale-conosco` | `/contato/` | redirect |

## Arquivos de conteúdo

- `conteudo/site.json` — identidade, menu, home (hero, manifesto, loja-destaques, faixa, EcoIlha, seja cooperado), rodapé, textos da loja
- `conteudo/paginas/sobre.md` — Quem somos, missão, visão, diretoria, fotos da sede e da equipe
- `conteudo/paginas/seja-cooperado.md` — requisitos (texto real da home antiga)
- `conteudo/paginas/parceiros.md` — texto + lista + logos
- `conteudo/paginas/transparencia.md` — texto integral (Lei 13.019/2014)
- `conteudo/loja/catalogo.json` — catálogo **de demonstração** (os 9 produtos do site antigo + a cesta da semana, preços de exemplo). O botão "Publicar catálogo no site" do Tombo CMS sobrescreve com o catálogo real.

## Loja (vitrine)

- `/loja/` — todas as bancas (categorias), cesta em destaque
- `/loja/<categoria>/` — uma banca
- `/loja/produto/<slug>/` — página do produto com a ficha de procedência
- `/carrinho/` — carrinho no navegador; frete e total pela API do Tombo CMS quando a loja estiver aberta
- Preço e estoque ao vivo: `GET <api>/api/loja/<site>/precos` (desligado no modo demonstração)
- Pagamento (Pix) ainda não existe: o botão de finalizar fica desligado
