"use client";
import React, { useEffect, useState } from "react";
import { buscarObras } from "./lib/tainacan-api";
import Link from "next/link";
import styles from "./styles/page.module.css";

// SOLICITAÇÃO 1: Componente Header modificado para incluir as guias
function Header({ activeTab, setActiveTab }) {
  return (
    <header className={styles.topbar}>
      <h1 className={styles.heading}>🎨 Obras</h1>
      
      <nav className={styles.navtabs}>
        <button
          className={activeTab === 'tudo' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('tudo')}
        >
          Tudo
        </button>
        <button
          className={activeTab === 'destaques' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('destaques')}
        >
          Destaques da semana
        </button>
        <button
          className={activeTab === 'pinturas' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('pinturas')}
        >
          Pinturas
        </button>
      </nav>
    </header>
  );
}

// SOLICITAÇÃO 2: CardObra modificado
function CardObra({ obra }) {
  return (
    // O Link agora envolve todo o card
    <Link href={`/obras/${obra.id}`} className={styles.card}>
      {/* A imagem agora é o primeiro elemento filho */}
      {obra.imgSrc ? (
        <img 
          src={obra.imgSrc} 
          alt={obra.titulo} 
          className={styles.image} 
       />
      ) : (
        // Placeholder caso não haja imagem
        <div className={styles.imagePlaceholder}>🖼️</div>
      )}
      
      {/* O título agora é uma legenda dentro do card */}
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{obra.titulo}</h3>
      </div>
    </Link>
  );
}

export default function Home() {
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 20;

  // SOLICITAÇÃO 1: Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState('tudo');

  useEffect(() => {
    // A busca de obras agora também depende da aba ativa.
    // (Nota: A função buscarObras() precisará ser atualizada futuramente
    // para aceitar o 'activeTab' e filtrar os resultados da API)
    
    setCarregando(true); // Mostra o loading ao trocar de aba
    buscarObras(perPage, page)
      .then(setObras)
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [page, activeTab]); // Adicionamos activeTab às dependências

  // Estado de carregamento
  if (carregando) {
    return (
      <div className={styles.page}>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className={styles.appcontainer}>
          <p>Carregando...</p>
        </main>
      </div>
    );
  }

  // Estado de sucesso
  return (
    <div className={styles.page}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className={styles.appcontainer}>
        <div className={styles.obraslist}>
          {obras.map((obra) => (
            <CardObra key={obra.id} obra={obra} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, margin: "2rem 0" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            anterior
          </button>
          <span>página {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={obras.length < perPage}
          >
            próximo
          </button>
        </div>
      </main>
    </div>
  );
}