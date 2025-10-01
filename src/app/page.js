// src/app/page.js // Exemplo de integração com a API do Tainacan
"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from "./styles/page.module.css";

function extractImgUrl(htmlStr){
  if(!htmlStr)
    return (null);
  // Isso é uma Expressão Regular (Regex) que busca pelo padrão src="..."
  const regex = /src="([^"]+)"/;
  const match = htmlStr.match(regex);

  if(match)
    return match[1];

  return (null);
  //return match ? match[1] : null;
}
//https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/collection/2174/items?perpage=15

export default function Home() {

  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function obterObras(){
    const TAINCAN_API_URL="https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/collection/2174/items?perpage=5";

    try {
      //setCarregando(true);

      console.log('🔍 Iniciando busca na API...');
      const resposta = await fetch(TAINCAN_API_URL);

      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }
      const dados = await resposta.json();
      
      const obrasComImg = dados.items.map(obra => ({
          ...obra, // Mantém todos os dados originais da obra
          urlimg: extractImgUrl(obra.document_as_html) // E adiciona a URL da imagem extraída
        }));

      setObras(obrasComImg);

    } catch(erro) {
      console.error('❌ Erro ao buscar obras:', erro);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    obterObras();
  }, []);

  if(carregando) {
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
        <h1 className={styles.headding}>🎨 Acervo Artístico UFSM</h1>
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





/*function extractImgUrl(htmlStr){
  if(!htmlStr)
    return (null);
  // Isso é uma Expressão Regular (Regex) que busca pelo padrão src="..."
  const regex = /src="([^"]+)"/;
  const match = htmlStr.match(regex);

  if(match)
    return match[1];

  return (null);
  //return match ? match[1] : null;
}
//https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/collection/2174/items?perpage=15

export default function Home() {
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function obterObras(){
    const TAINCAN_API_URL="https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/collection/2174/items?perpage=5";

    try {
      
      
      console.log('🔍 Iniciando busca na API...');
      const resposta = await fetch(TAINCAN_API_URL);

      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }
      const dados = await resposta.json();
      
      const obrasComImg = dados.items.map(obra => ({
          ...obra, // Mantém todos os dados originais da obra
          urlimg: extractImgUrl(obra.document_as_html) // E adiciona a URL da imagem extraída
        }));

      setObras(obrasComImg);

    } catch(erro) {
      console.error('❌ Erro ao buscar obras:', erro);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    obterObras();
  }, []);

  if(carregando) {
    return (
    <>
    <header>
      <h1>🎨 Acervo Artístico UFSM</h1>
    </header>
    <main>
      <p>Carregando...</p>
    </main>
    </>
    );
  }

  return (
    <div>
      <header>
        <h1>🎨 Acervo Artístico UFSM</h1>
      </header>
      <main>
        <div>
        {obras.map(obra => (
          <div key={obra.id}>
            {obra.urlimg && (
              <img 
                src={obra.urlimg} 
                alt={obra.title}
              />
            )}
            <span style={ {color: 'blue'} } >
                  {obra.title}
            </span>
          </div>
        ))}
        </div>
      </main>
    </div>
  );
}
*/


/*



import styles from "./styles/page.module.css";

export default function Home(){
  return(
    <div className={styles.page}>
      <header className={styles.topbar}>
        <h1 className={styles.headding}>Header</h1>
      </header>
      <main className={styles.appcontainer}>
        <p>loremipsum</p>
        <p>dolor</p>
        <div>
          div qualquer
        </div>

      </main>

    </div>
  );
}





import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.js</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
*/