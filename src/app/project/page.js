"use client"
import React, { useState, useEffect } from 'react';
import { Header } from "@/components/header";

// --- NOVA FUNÇÃO AUXILIAR ---
// Recebe uma string de HTML e extrai a URL da imagem de dentro dela.
function extrairUrldaImg(htmlString) {
  // Isso é uma Expressão Regular (Regex) que busca pelo padrão src="..."
  const regex = /src="([^"]+)"/;
  const match = htmlString.match(regex);
  
  // Se encontrar o padrão, retorna a URL capturada. Senão, retorna null.
  // A URL que queremos está na posição 1 do array 'match'.
  return match ? match[1] : null;
}


// --- COMPONENTE PRINCIPAL ATUALIZADO ---
export default function Home() {
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function obterObras() {
      const TAINACAN_API_URL = 'https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/collection/2174/items?perpage=15';
      
      try {
        const resposta = await fetch(TAINACAN_API_URL);
        if (!resposta.ok) throw new Error('Erro na rede');
        
        const dados = await resposta.json();
        
        // --- MODIFICAÇÃO IMPORTANTE AQUI ---
        // Agora, para cada obra, extraímos a URL da imagem antes de guardar no estado.
        const obrasComImagem = dados.items.map(obra => ({
          ...obra, // Mantém todos os dados originais da obra
          imagemUrl: extrairUrldaImg(obra.document_as_html) // E adiciona a URL da imagem extraída
        }));

        setObras(obrasComImagem);

      } catch (erro) {
        console.error("Falha ao buscar obras do Tainacan:", erro);
      } finally {
        setCarregando(false);
      }
    }

    obterObras();
  }, []);

  if (carregando) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Acervo Artístico UFSM</h1>
        <p>Carregando obras...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main style={{ padding: '2rem' }}>
      {/*<h1>Acervo Artístico UFSM</h1>
      <p>Agora com imagens!</p>*/}
      
      {/* Usamos um estilo simples para exibir a lista com imagens */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {obras.map(obra => (
          <div key={obra.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #ccc', padding: '0.5rem' }}>
            {/* A tag <img> agora usa a URL que extraímos */}
            {obra.imagemUrl && (
              <img src={obra.imagemUrl} 
                alt={obra.title} 
                style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
              />
            )}
            <span>{obra.title}</span>
          </div>
        ))}
        </div>
      </main>
    </>
  );
}





/*
//import styles from "/src/app/page.module.css";

// --- COMPONENTE PRINCIPAL ---
export default function Home() {
  // --- TAREFA 2: GERENCIAMENTO DE ESTADO ---
  // 'obras' vai guardar a lista de obras que vem da API. Começa como um array vazio.
  const [obras, setObras] = useState([]);
  // 'carregando' controla a mensagem de "carregando...". Começa como 'true'.
  const [carregando, setCarregando] = useState(true);

  // --- TAREFA 3: BUSCA DE DADOS ---
  // 'useEffect' executa o código aqui dentro uma única vez quando o componente é montado.
  useEffect(() => {
    // Esta é a nossa função que busca os dados, agora dentro do useEffect.
    async function getObrasAcervo() {
      const apiUrl = "https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/collection/2174/items?perpage=15";
      
      try {
        const resposta = await fetch(apiUrl);
        if (!resposta.ok) {
          throw new Error('Erro na rede');
        }
        const dados = await resposta.json();


        console.log(dados.items);
        // 4. Atualiza o estado com as obras recebidas
        setObras(dados.items);
      } catch (erro) {
        console.error("Falha ao buscar obras do Tainacan:", erro);
        // Em caso de erro, poderíamos definir um estado de erro aqui.
      } finally {
        // 5. Independentemente do resultado, para de carregar.
        setCarregando(false);
      }
    }

    getObrasAcervo(); // Chama a função.
  }, []); // O array vazio [] garante que isso só rode uma vez.

  // --- TAREFA 4: RENDERIZAÇÃO ---
  // O componente decide o que mostrar com base no estado 'carregando'.
  if (carregando) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Acervo Artístico UFSM</h1>
        <p>Carregando obras...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Acervo Artístico UFSM</h1>
      <p>A conexão com o Tainacan funcionou! Aqui estão os títulos:</p>
      <ul>
        {obras.map(obra => (
          <li key={obra.id}>
            {obra.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

//export default App;




import styles from "./page.module.css";
import React, {useEffect, useState } from "react";


export default function Home(){
  const [obras, setObras]=useState([]);
  const [loading, setLoading]=useState(true);

  useEffect(() => {
    async function fetchObras(){
      try{
        const response=await fetch("https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/collection/2174/items");
        const data=await response.json();
        setObras(data.items);
      } catch(erro){
        console.error("erro ao buscar obras: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchObras();
  }, []);

  if(loading) return <p>carregando obras...</p>;

  return (
    <div style={{ padding: "16px" }}>
      <h1> ArteON</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {obras.map((obra) => (
          <li
            key={obra.id}
            style={{
              marginBottom: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "8px"
            }}
          >
            <img
              src={obra.thumbnail}
              alt={obra.title.rendered}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <h2>{obra.title.rendered}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
}



async function getAcervObras(){
  const apiUrl = 'https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/collection/2174/items?perpage=15';


  try {
    // 'fetch' eh o comando do js p/ fazer uma requisicao na internet
    const response=await fetch(apiUrl);
    // se a resposta nao for bem-sucedida (ex. server fora do ar), um erro eh lancado
    if(!response.ok){
      throw new Error(`Erro na rede: ${response.status}`);
    }
    // convertemos a resposta, que vem em formato JSON, p/ um objeto q/ o JS entende.
    const data=await response.json();
    // a API retorna um objeto grande, mas a lista de obras esta dentro da chave "items"
    return data.items;
  } catch(erro){
    console.error("falha ao buscar obras", erro);
    return [];
  }



}




//import Image from "next/image";
//import styles from "./page.module.css";
import React from "react";

// func p/ buscar os dados reais da API do Tainacan

async function getAcervObras(){
  const apiUrl="https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/collection/2174/items?perpage=20";

  try{
    const response=await fetch(apiUrl, {
      // usamos o 'no-store p/ garantir q os dados sejam sempre os mais recentes durante o desenvolvimento
      cache: "no-store"
    });
    if (!response.ok){
      throw new Error("falha ao buscar dados da Tainacan API");
    }

    const data=await response.json();

    const obrasFormatadas=data.items.map(item=> {
      const autorInfo=item.metadata['5'];
      const autor=autorInfo ? autorInfo.value : "Autor desconhecido";

      return {
        id: item.id,
        titulo: item.title,
        autor: autor,
        imgUrl: item.document,
        descricao: item.description || "No desc"
      };
    });
    return obrasFormatadas;
  } catch(error){
    console.error("Erro ao conectar", error);
    return[];
  }
}

export default async function Home() {
  const obras=await getAcervObras();

  return (
    <main>
      <h1>Acervo Artistico UFSM</h1>
      <div className="artwork-grid">
        {obras.map(obra => (
          <div key={obra.id} className="artwork-item">
            <img src={obra.imgUrl} alt={obra.titulo} />
            <h4>{obra.titulo}</h4>
            <p>{obra.autor}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
*/