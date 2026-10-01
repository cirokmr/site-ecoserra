# Direção de arte — Cooperativa Ecoserra

> Status: **aprovada em 30/09/2026** (com as respostas da Ecoserra abaixo). Base: extração de 30/09/2026 (`extraido/`) e o
> protótipo da loja aprovado na conversa inicial.

> **01/10/2026 — loja adiada para o ano que vem.** O site está no ar sem a loja
> (`site.json → loja.ativa: false`; como religar em `PENDENCIAS.md`). Tudo o que esta direção
> diz sobre loja, vitrine, etiqueta de preço e carrinho continua valendo para o lançamento.
> Enquanto isso, a home fica: hero → manifesto (Banca 01) → faixa → EcoIlha (Banca 02) →
> Seja cooperado (Banca 03).

## 0. Respostas da Ecoserra (30/09/2026)

1. **Certificação:** todos os produtos à venda são orgânicos certificados → o selo
   `Orgânico certificado · Rede Ecovida` vale para todos (campo "Orgânico" do painel).
   Não há selo "em transição" por enquanto.
2. **Procedência:** atuam na Serra Catarinense; as famílias **topam aparecer em foto**.
   Grupo de base e município entram no campo "Origem" de cada produto.
3. **App de delivery:** não existe mais (a loja antiga do site saiu do ar). A loja nova
   começa do zero.
4. **Entrega:** Serra Catarinense e Florianópolis (zonas de entrega no painel).
5. **Cesta da semana:** sim.

## 1. Conceito: **a feira da serra**

A Ecoserra vive de levar o que as famílias da Serra Catarinense colhem até a mesa: PAA, PNAE,
lojas, **feiras** e agora a loja no site. O site inteiro se organiza como uma feira de rua:

- **Seções = bancas numeradas.** Rótulos em mono: `Banca 01 — Quem somos`, `Banca 02 — Da roça`,
  `Banca 03 — EcoIlha`… Na loja, cada categoria é uma banca (`Banca 04 — Frutas`).
- **Etiqueta de feira.** Preço sempre numa plaquinha amarela (`--destaque`) com letra mono:
  `R$ 9,90 / kg`. É o elemento-assinatura do site; aparece no card, na página do produto e no
  carrinho.
- **Procedência.** Cada produto mostra de onde vem (`Grupo de base São Joaquim`) como um
  carimbo, em mono, logo abaixo do nome. É o "quem plantou" que a feira tem e o supermercado não.
- **Ritmo.** Alterna "lona" (verde escuro) e "papel de embrulho" (claro), como as bancas cobertas
  e o balcão.

### Estratégia da loja (conversa de 30/09/2026)

- **Selo honesto por produto.** O site antigo diz que a Ecoserra é da Rede Ecovida
  (certificação participativa) e que o cooperado pode estar *em transição*. Então cada
  produto mostra `Orgânico certificado · Rede Ecovida` (fundo escuro) **ou**
  `Em transição agroecológica` (contorno tracejado). Nunca "orgânico" sem certificação.
- **Procedência concreta:** grupo de base + município no card e na página do produto.
- **Ficha de procedência** na página do produto, logo abaixo do preço: certificação,
  quem plantou, colheita (safra), entrega, como conservar.
- **Colheita da semana + cesta:** a vitrine mostra o que tem agora; a cesta pronta
  (montada pela cooperativa) aparece em destaque e pode virar assinatura semanal
  (o banco já tem `loja.safras` e `loja.assinaturas`).
- **A compra começa na abertura:** botão "Montar minha cesta →" no hero.
- **Painel (migração nova, 007):** campos `certificacao` (certificado / transição) e
  `grupo_base` + `municipio` no produto. Só depois das respostas da Ecoserra.

## 2. Palavra do hero e frase-conceito

- Palavra gigante: **ECOSERRA**
- Frase em itálico: *O que a serra colheu esta semana?*
- Legenda: **Da roça da família** / *para a sua mesa.*
- Topo: `Desde 1999` · `330+ famílias` · `Role para abrir ↓` (os dois fatos estão em `extraido/`).

## 3. Paleta (do logo)

| Token | Hex | De onde vem |
|---|---|---|
| `--escuro` | `#1C3A25` | verde das colinas e da araucária do logo |
| `--escuro-2` | `#244A30` | variação para cards sobre o escuro |
| `--claro` | `#F4EFE0` | papel de embrulho / neblina da serra |
| `--claro-2` | `#E7DFC8` | balcão (cards e faixas claras) |
| `--destaque` | `#F2C230` | o sol amarelo do logo — botões, etiqueta de preço, cursor |
| `--apoio` | `#B8352A` | o vermelho do letreiro "ECOSERRA" — só selos (Orgânico, Congelado) |

Contrastes calculados: claro × escuro **10,87:1** · escuro × destaque **7,46:1** · claro × apoio
**5,10:1** · escuro × claro-2 **9,39:1**. Todos acima de 4,5:1.

## 4. Tipografia (todas `@fontsource`)

| Papel | Fonte | Pacote | Observação |
|---|---|---|---|
| Display (títulos, caixa-alta) | Bricolage Grotesque | `@fontsource-variable/bricolage-grotesque` | eixo `wdth` 75–100 → `--display-largura: 100%`; faixa com `"estilo": "apagado"` |
| Serif itálica (acentos) | Newsreader | `@fontsource-variable/newsreader` (itálico) | a pergunta do hero e as "viradas" dos títulos |
| Mono (metadados, etiqueta, bancas) | DM Mono | `@fontsource/dm-mono` | preço, procedência, numeração das bancas |

Nada do trio do Tombô.

## 5. Home, seção a seção

| # | Seção do molde | Tema | Conteúdo |
|---|---|---|---|
| 1 | `hero` | escuro | ECOSERRA + pergunta + botão "Montar minha cesta"; fotos: presidente recortada (família na estufa, sem o banner) e quem-somos-2 (banca da Ecoserra) |
| 2 | `manifesto` | claro | "A Ecoserra é uma Cooperativa de Agricultores e Agricultoras Familiares Agroecológicos…" (texto real) + foto presidente |
| 3 | **`loja-destaques`** (nova, genérica) | claro-2 | "Banca 02 — Da roça": a cesta da semana em destaque + produtos do `conteudo/loja/catalogo.json` com selo de certificação, procedência e etiqueta de preço; botão "Ver a feira inteira" |
| 4 | `faixa` | destaque | Agroecologia · Agricultura familiar · Certificação participativa · Desde 1999 |
| 5 | `texto` | escuro | "Banca 03 — EcoIlha": a filial da Grande Florianópolis (texto real) + logo EcoIlha |
| 6 | `texto` | claro | "Banca 05 — Seja cooperado": requisitos (texto real) + botão para o contato |

A seção `loja-destaques` é criada genérica (lê o catálogo e um número de itens) para voltar ao molde.

## 6. Mapa do site

| Página nova | Vem de | Redirect das antigas |
|---|---|---|
| `/` | home | — |
| `/sobre/` | quem-somos (missão, visão, diretoria, fotos da sede e do escritório) | `/quem-somos` → `/sobre/`, `/galeria-de-fotos` → `/sobre/` |
| `/loja/` | produtos (agora a vitrine) | `/produtos` → `/loja/`; as 9 URLs de produto → `/loja/` |
| `/loja/<categoria>/` | nova | — |
| `/loja/produto/<slug>/` | nova (gerada do catálogo) | — |
| `/carrinho/` | nova | — |
| `/seja-cooperado/` | bloco da home antiga | — |
| `/parceiros/` | parceiros (lista + logos) | `/parceiros` → `/parceiros/` |
| `/transparencia/` | transparência (texto integral) | `/transparencia` → `/transparencia/` |
| `/contato/` | fale-conosco | `/fale-conosco` → `/contato/` |

## 7. Fotos

- Tratamento: **`natural`**. A cor é o conteúdo (hortaliça, fruta, feira).
- Usar: `presidente`, `quem-somos-2`, `whatsapp-image-2020-10-27-at-16.00.29`, `banner-home`
  (cortar o selo "Desde 1999" da esquerda), `quem-somos-1` e `escritorio` (página Sobre),
  `ecoilha` e `ecoserra` (logos), logos dos parceiros na página Parceiros.
- De fora: `seja-cooperado` (borrada), `slider-2` (banco de imagem com letreiro), `header-bg` e
  `footer-bg` (decoração do site antigo).
- Produtos: as 9 fotos de produto do site antigo **não existem mais no servidor** (todas dão
  HTTP 404, ver `extraido/baixar.resultado.json`). Para a demonstração, os cards usam as fotos
  da feira e das caixas; para a loja de verdade, precisamos de fotos novas dos produtos.

## 8. O que falta da Ecoserra

- Logo em vetor (SVG/PDF): o arquivo atual é pequeno e tem fundo.
- Fotos de produtos em boa resolução (as atuais são miniaturas) e fotos para a galeria.
- Cadastro real dos produtos no painel: preço, unidade, peso médio, estoque, origem.
- Confirmar o WhatsApp de pedidos, o Instagram e o CNPJ da matriz (só o da filial aparece).
- Quais produtos são certificados pela Ecovida e quais estão em transição.
- Quais grupos de base e municípios podem aparecer; se as famílias topam aparecer com foto.
- O "aplicativo de delivery" citado no site antigo: ainda funciona? A loja substitui ou
  convive? Quantos clientes compram por ele? (Se existir, a estratégia vira migrar esses
  clientes.)
- Cidades e dias de entrega (Serra e/ou Grande Florianópolis pela EcoIlha).
- Se querem a cesta da semana, e de que tamanho e frequência.

> Obs.: as fotos do banner da home e da família (`banner-home`, `presidente`) têm texto e
> logo gravados na imagem. Usar só recortes sem o texto.
