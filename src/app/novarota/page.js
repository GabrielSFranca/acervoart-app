"use client"
import React, { useEffect, useState } from "react";

/** app/novarota/page.js
 * nosso rascunho
 * 
 * 
 * paginacao
 * 
 * transformar esta lógica para a página Inicial
 * 
 * 
 * criar o componente da pagina de detalhes
 * 
 * 
 */

export default function NovaRota() {
  const UFSM_ACERV = "tainacan.ufsm.br/acervo-artistico";
  const perPage = 100;
  const idCollection = 2174;
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function obterObras() {
      const BASE_URL = `https://${UFSM_ACERV}/wp-json/tainacan/v2/collection/${idCollection}/items?perpage=${perPage}&fetch_only=id,title,document,thumbnail,url`;
      try {
        const resposta = await fetch(BASE_URL);
        if (!resposta.ok) throw new Error("HTTP" + resposta.status);
        const dados = await resposta.json();

        //console.log('dados da api', JSON.stringify(dados));

        if (!dados.items) throw new Error("sem itens");

        console.log(dados.items.length + 'obras retornadas');

        const obrasFormatadas = dados.items.map((obraItem) => {
          const thumb = obraItem.thumbnail;
          const imgSrc = thumb?.medium?.[0] || null;
          return {
            id: obraItem.id,
            titulo: obraItem.title || "Sem título",
            imgSrc: imgSrc,
            fullDataObra: obraItem,
          };
        });

        console.log('obras formatadas', JSON.stringify(obrasFormatadas));

        setObras(obrasFormatadas);
      } catch (erro) {
        console.error("erro ao buscar obras", erro);
        setObras([]);
      } finally {
        setCarregando(false);
      }
    }
    obterObras();
  }, []);

  if (carregando) {
    return <main><p>Carregando obras...</p></main>;
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>Destaques do Acervo UFSM</h1>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        justifyContent: "center"
      }}>
        {obras.map((obra) => (
          <div key={obra.id} style={{
            width: 180,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 1px 4px #0001",
            padding: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            {obra.imgSrc ? (
              <img
                src={obra.imgSrc}
                alt={obra.titulo}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 6,
                  marginBottom: 8,
                  background: "#eee"
                }}
              />
            ) : (
              <div style={{
                width: "100%",
                height: 120,
                background: "#eee",
                borderRadius: 6,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#bbb",
                fontSize: 32
              }}>
                🖼️
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <strong>{obra.titulo}</strong>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}



  // function baseUrl(idCollection=2174){
  //     return `https://${UFSM_ACERV}/wp-json/tainacan/v2/collection/${idCollection}/items`
  // }

  // const idColec=2174
  // const BASE_URL=`https://${SITE_URL}/wp-json/tainacan/v2/collection/${idColec}/items`

  // const () => {
  //     return
  // }

  // const x='https://<YOUR-SITE-URL>/wp-json/tainacan/v2/collection/<YOUR-COLLECTION-ID>/items/?perpage=5&paged=1&fetch_only=thumbnail,document,author_name,title,description'