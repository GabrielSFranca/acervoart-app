"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from "./styles/page.module.css";
import { obterObras } from "./lib/apiTainacanufsm";

export default function Home() {
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const PERPAGE=50;

  useEffect(() => {
    obterObras(PERPAGE)
      .then(setObras)
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <div>
        <header>
          <h1>🎨 Acervo Artístico UFSM</h1>
        </header>
        <main>
          <p>Carregando...</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <h1 className={styles.headding}>🎨 Destaques da Semana</h1>
        <p>mosai | Acervo Artístico UFSM</p>
      </header>
      <main className={styles.appcontainer}>
        <div className={styles.obraslist}>
          {obras.map(obra => (
            <Link
              key={obra.id}
              href={`/obra/${obra.id}`}
              className={styles.obra}
            >
              <div className={styles.containerobra}>
                {obra.urlimg ? (
                  <img
                    src={obra.urlimg}
                    alt={obra.title}
                    className={styles.image}
                  />
                ) : null}
                <div className={styles.obraimgph}>
                  🖼️
                </div>
              </div>
              <div className={styles.info}>
                <p>{obra.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}