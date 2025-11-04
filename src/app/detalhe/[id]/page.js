"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

function extractImgUrl(htmlStr){
  if(!htmlStr) return null;
  const regex = /src="([^"]+)"/;
  const match = htmlStr.match(regex);
  return match ? match[1] : null;
}

export default function ObraDetalhe() {
  const { id } = useParams();
  const [obra, setObra] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarObra() {
      try {
        const url = `https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/items/${id}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Erro ao buscar obra");
        const dados = await resp.json();
        setObra({
          ...dados,
          urlimg: extractImgUrl(dados.document_as_html)
        });
      } catch (e) {
        setObra(null);
      } finally {
        setCarregando(false);
      }
    }
    buscarObra();
  }, [id]);

  if (carregando) return <p>Carregando...</p>;
  if (!obra) return <p>Obra não encontrada.</p>;

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <h1 className={styles.headding}>{obra.title}</h1>
        <Link href="/" className={styles.secondary}>← Voltar</Link>
      </header>
      <main className={styles.appcontainer}>
        <div className={styles.containerobra}>
          {obra.urlimg ? (
            <img src={obra.urlimg} alt={obra.title} className={styles.image} />
          ) : (
            <div className={styles.obraimgph}>🖼️</div>
          )}
        </div>
        <div className={styles.info}>
          <p><strong>Descrição:</strong> {obra.description}</p>
          {/* Adicione outros campos conforme necessário */}
        </div>
      </main>
    </div>
  );
}