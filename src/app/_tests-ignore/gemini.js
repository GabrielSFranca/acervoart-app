// pages/index.js
import React from 'react';
import Image from 'next/image'; // Componente otimizado de imagem
import styles from '../styles/Home.module.css'; // Opcional, para estilização

// Esta é a função principal da sua página
export default function Home({ obras }) {
  // 'obras' são as props que recebemos da função 'getStaticProps' abaixo
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Acervo Artístico da UFSM</h1>
      
      <div className={styles.gallery}>
        {obras.map((obra) => (
          <div key={obra.id} className={styles.card}>
            <Image
              src={obra.imageUrl}
              alt={obra.title}
              title={obra.title}
              width={300} // Você precisa definir largura e altura
              height={300}
              objectFit="cover" // Garante que a imagem cubra o espaço
            />
            <p>{obra.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- A MÁGICA DO NEXT.JS ACONTECE AQUI ---

// Esta função roda no servidor *apenas no momento do build*
export async function getStaticProps() {
  const API_URL = 'https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/collection/2174/items';
  const CAMPOS = 'id,title,thumbnail';
  const url = `${API_URL}?perpage=100&fetch_only=${encodeURIComponent(CAMPOS)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.items) {
      throw new Error("Não foi possível encontrar os itens");
    }

    // Processar os dados (igual ao código original)
    const obrasFormatadas = data.items.map((item) => {
      const t = item.thumbnail;
      
      // Lógica exata do código de referência
      // Pega a URL do tamanho 'medium'
      // (Usando "optional chaining" ?. para segurança)
      const imageUrl = t?.medium?.[0] || null; 

      return {
        id: item.id,
        title: item.title,
        imageUrl: imageUrl,
      };
    }).filter(obra => obra.imageUrl); // Filtra obras que não têm imagem

    // Retorna os dados como 'props' para o componente 'Home'
    return {
      props: {
        obras: obrasFormatadas,
      },
      revalidate: 60 * 60 * 24, // Opcional: Regenera a página a cada 24h
    };

  } catch (error) {
    console.error("Erro ao buscar dados do Tainacan:", error);
    return {
      props: {
        obras: [], // Retorna vazio em caso de erro
      },
    };
  }
}