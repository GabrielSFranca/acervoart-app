import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <h3>404 - Página não encontrada</h3>
      <p>Desculpe, a página que você está procurando não existe.</p>
      <p>
        Volte para a <Link href="/">Página Inicial</Link>.
      </p>
    </div>
  );
}