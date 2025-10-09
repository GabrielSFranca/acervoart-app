// src/app/Galeria.js

"use client"; // Mágica! Isto transforma o componente para correr no navegador.

import Link from 'next/link';
import { useEffect } from 'react';

export default function Galeria({ obras }) {
  // Vamos usar este useEffect para verificar se os dados chegaram ao navegador.
  useEffect(() => {
    console.log("--- Ponto de Verificação 4: Dados recebidos no NAVEGADOR ---", obras);
  }, [obras]);

  // Se o array de obras estiver vazio ou não existir, mostramos uma mensagem.
  if (!obras || obras.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <p>Nenhuma obra para exibir. Verifique o console do navegador (F12).</p>
      </div>
    );
  }

  // Se as obras chegaram, renderizamos a galeria.
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
      {obras.map(obra => (
        <Link key={obra.id} href={`/obra/${obra.id}`} passHref>
          <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
            <img src={obra.imagemUrl} alt={obra.titulo} loading="lazy" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', color: 'white', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <h3>{obra.titulo}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}