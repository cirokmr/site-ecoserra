import type { MetadataRoute } from 'next';
import { lojaAtiva, site } from '@/lib/site';
import { noticias, paginas, projetos } from '@/lib/content';
import { bancas, produtos } from '@/lib/loja';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => new URL(p, site.url).href;
  // a loja só entra no sitemap ligada (site.json → loja.ativa)
  const loja = lojaAtiva
    ? [
        ...(produtos.length ? [{ url: url('/loja/'), priority: 0.9 }] : []),
        ...bancas.map((b) => ({ url: url(`/loja/${b.slug}/`), priority: 0.8 })),
        ...produtos.map((p) => ({ url: url(`/loja/produto/${p.slug}/`), priority: 0.7 })),
      ]
    : [];
  return [
    { url: url('/'), priority: 1 },
    ...loja,
    ...paginas.map((p) => ({ url: url(`/${p.slug}/`), priority: 0.8 })),
    ...(projetos.length ? [{ url: url('/projetos/'), priority: 0.8 }] : []),
    ...projetos.map((p) => ({ url: url(`/projetos/${p.slug}/`), priority: 0.7 })),
    ...(noticias.length ? [{ url: url('/noticias/'), priority: 0.7 }] : []),
    ...noticias.map((n) => ({ url: url(`/noticias/${n.slug}/`), lastModified: n.data, priority: 0.6 })),
    { url: url('/contato/'), priority: 0.6 },
  ];
}
