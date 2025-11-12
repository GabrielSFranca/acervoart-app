"use client";
import React, { useEffect, useState } from "react";
import { buscarObras } from "./lib/tainacan-api";
import Link from "next/link";
import styles from "./styles/page.module.css";

function Header() {
  return (
    <header className={styles.topbar}>
      <h1 className={styles.heading}>🎨 Destaques da Semana</h1>
      {/* <p>mosai | Acervo Artístico UFSM</p> */}
    </header>
  );
}

function CardObra({ obra }) {
  return (
    <div className={styles.containerobra}>
      {obra.imgSrc ? (
        <img 
          src={obra.imgSrc} 
          alt={obra.titulo} 
          className={styles.image} 
       />
      ) : (
        <div className={styles.obraimgph}>🖼️</div>
      )}
      <Link 
        href={`/obras/${obra.id}`}
        className={styles.link}
      >
        {obra.titulo}
      </Link>
    </div>
  );
}

export default function Home() {
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    buscarObras(perPage, page)
      .then(setObras)
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [page]);

  if (carregando) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.appcontainer}>
          <p>Carregando...</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
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