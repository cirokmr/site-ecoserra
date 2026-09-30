# Pendências — Cooperativa Ecoserra

## Da cooperativa
- [ ] **Cadastrar os produtos reais no Tombo CMS** (Loja → Produtos): preço, unidade, estoque, foto, marcar "Orgânico" e preencher "Origem" (grupo de base · município). Depois clicar em **"Publicar catálogo no site"**: o catálogo de demonstração (preços de exemplo) é substituído e o aviso "Loja em demonstração" some.
- [ ] **Fotos dos produtos**: as do site antigo não existem mais no servidor (HTTP 404). Hoje só a maçã tem foto (recorte de uma foto do galpão); os outros mostram "Foto em breve".
- [ ] Fotos das famílias (toparam aparecer) para a procedência e a página Sobre.
- [ ] Logo em vetor (SVG/PDF): o atual é pequeno e tem fundo branco. Por isso o menu usa o nome em texto.
- [ ] Zonas e dias de entrega (Serra Catarinense e Florianópolis) no painel: Loja → Entrega.
- [ ] Confirmar o WhatsApp de pedidos (hoje o site mostra os dois telefones como telefone), o Instagram e o CNPJ da matriz (só o da filial EcoIlha aparece, na Transparência).
- [ ] Tamanho e preço da cesta da semana.

## Técnicas
- [ ] `package-lock.json` foi apagado ao trocar as fontes (sem npm neste ambiente). Gerar um novo com `npm install` e commitar.
- [ ] Conectar o repositório à Vercel e, no Tombo CMS (site ecoserra → Outros endereços), cadastrar o endereço de prévia da Vercel: sem isso a API da loja e o formulário recusam o site (CORS).
- [ ] Conferir se o identificador do site no Tombo CMS é `ecoserra` (usado em `formEndpoint` e em `conteudo/loja/catalogo.json → site`).
- [ ] Abrir a loja no painel quando os produtos estiverem cadastrados (API responde 503 com a loja fechada; o site continua mostrando o preço do catálogo).
- [ ] Pagamento (Pix pelo Mercado Pago): o botão "Finalizar pedido" está desligado até o checkout existir.
- [ ] Domínio: `site.json → url` já está como www.cooperativaecoserra.com.br; apontar o DNS para a Vercel na entrega.
