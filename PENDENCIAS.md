# Pendências — Cooperativa Ecoserra

> **Loja desligada (01/10/2026):** a Ecoserra decidiu lançar a loja só no ano que vem. O site
> está no ar **sem loja** (`conteudo/site.json → loja.ativa: false`): não há /loja/ nem /carrinho/,
> nem link, carrinho, seção da home ou preço. O código e o catálogo continuam no repositório.
> Os endereços de produto do site antigo (`/produtos`, `/congelados/*`, `/frutas/*`,
> `/produtos-in-natura/*`) e `/loja/*`, `/carrinho/*` levam para `/sobre/` com redirecionamento
> **temporário (302)**. As pendências da loja abaixo ficam para o lançamento.

### Para religar a loja
1. `conteudo/site.json → loja.ativa: true`.
2. `redirects.json`: apagar as regras `/loja/*` e `/carrinho/*`; voltar `/produtos`,
   `/congelados/*`, `/frutas/*` e `/produtos-in-natura/*` para `/loja/` e tirá-las de
   `"temporarios"` (voltam a ser 301); rodar `node scripts/gerar-redirects.mjs`.
3. Home: renumerar os rótulos (`Banca 02 — EcoIlha` → `Banca 03`, `Banca 03 — Seja cooperado`
   → `Banca 04`), porque a vitrine volta a ser a Banca 02.
4. 404 (`naoEncontrada`): se quiser, voltar o botão "Ir para a loja" (`/loja/`).
5. Rodapé e descrição: voltar a falar da entrega quando as zonas estiverem no painel.
6. Conferir as pendências da loja abaixo (catálogo real, fotos, entrega, pagamento).

## Da cooperativa
- [ ] **Cadastrar os produtos reais no Tombo CMS** (Loja → Produtos): preço, unidade, estoque, foto, marcar "Orgânico" e preencher "Origem" (grupo de base · município). Depois clicar em **"Publicar catálogo no site"**: o catálogo de demonstração (preços de exemplo) é substituído e o aviso "Loja em demonstração" some.
- [ ] **Fotos dos produtos**: as do site antigo não existem mais no servidor (HTTP 404). Hoje só a maçã tem foto (recorte de uma foto do galpão); os outros mostram "Foto em breve".
- [ ] Fotos das famílias (toparam aparecer) para a procedência e a página Sobre.
- [ ] Logo em vetor (SVG/PDF): o atual é pequeno e tem fundo branco. Por isso o menu usa o nome em texto.
- [ ] Zonas e dias de entrega (Serra Catarinense e Florianópolis) no painel: Loja → Entrega.
- [ ] Confirmar o WhatsApp de pedidos (hoje o site mostra os dois telefones como telefone), o Instagram e o CNPJ da matriz (só o da filial EcoIlha aparece, na Transparência).
- [ ] Tamanho e preço da cesta da semana.

## Técnicas
- [ ] Conectar o repositório à Vercel e, no Tombo CMS (site ecoserra → Outros endereços), cadastrar o endereço de prévia da Vercel: sem isso a API da loja e o formulário recusam o site (CORS).
- [ ] Conferir se o identificador do site no Tombo CMS é `ecoserra` (usado em `formEndpoint` e em `conteudo/loja/catalogo.json → site`).
- [ ] Abrir a loja no painel quando os produtos estiverem cadastrados (API responde 503 com a loja fechada; o site continua mostrando o preço do catálogo).
- [ ] Pagamento (Pix pelo Mercado Pago): o botão "Finalizar pedido" está desligado até o checkout existir.
- [ ] Domínio: `site.json → url` já está como www.cooperativaecoserra.com.br; apontar o DNS para a Vercel na entrega.

## Foto da abertura (hero)
- [ ] A última foto do hero é provisória: araucária no Parque Nacional de São Joaquim, de Raphael
      Sombrio (CC BY-SA 4.0, crédito no rodapé). A Tombo vai fotografar a serra na próxima visita;
      quando chegar, trocar `public/img/home/araucaria-sao-joaquim.webp` (WebP ≤ 500 KB, ~2400 px de
      largura) e tirar o crédito de `site.json → creditos`.
- [ ] As outras duas fotos do hero (banca e estufa) têm ~1000 px e ficam suaves em telas grandes:
      pedir à cooperativa os originais em alta resolução.
