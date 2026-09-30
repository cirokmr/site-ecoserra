import { demonstracao } from '@/lib/loja';
import { textosLoja } from '@/lib/site';

// Faixa que aparece enquanto o catálogo for de exemplo (antes do 1º "Publicar catálogo").
export default function AvisoDemonstracao() {
  if (!demonstracao) return null;
  return (
    <p className="aviso-demo mono" role="note">
      {textosLoja.demonstracao}
    </p>
  );
}
