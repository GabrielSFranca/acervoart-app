"use client";
import React, { useEffect, useState } from "react";
import { buscarObras } from '../lib/tainacan-api';
import Link from "next/link";
import styles from './page.module.css';

function Header({ activeTab, setActiveTab }) {
  return (
    <header className={styles.topbar}>
      <h1 className={styles.heading}>Obras</h1>
      <nav className={styles.navi}>
        <button
          className={activeTab === "all" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("all")}
        >
          Tudo
        </button>
        <button
          className={activeTab === "high" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("high")}
        >
          Destaques
        </button>
        <button
          className={activeTab === "pin" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("pin")}
        >
          Pinturas
        </button>
      </nav>
    </header>
  );
}

function CardObra({ obra }) {
  return (
    <Link 
      href={`/obras/${obra.id}`} 
      className={styles.card}
    >
      {obra.imgSrc ? (
        <img 
          src={obra.imgSrc} 
          alt={obra.titulo} 
          className={styles.image} 
      />
      ) : null}
      {/* placeholder caso nao haja imagem */}
      <div className={styles.imgph}>🖼️</div>
      <div className={styles.info}>
        <h3>{obra.titulo}</h3>
      </div>
    </Link>
  );
}

export default function Page() {
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [page, setPage] = useState(1);

  const [activeTab, setActiveTab]=useState('all')

  const perPage = 20;

  useEffect(() => {
    buscarObras(perPage, page)
      .then(setObras)
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [page]);
  // estado de carregamento (loading.....)
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

  // estado de sucesso
  return (
    <div className={styles.page}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab}/>
      <main className={styles.appcontainer}>
        <div className={styles.obraslist}>
          {obras.map((obra) => (
            <CardObra key={obra.id} obra={obra} />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            margin: "2rem 0",
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span>Página {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={obras.length < perPage}
          >
            Próximo
          </button>
        </div>
      </main>
    </div>
  );
}


