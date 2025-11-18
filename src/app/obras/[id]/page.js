'use client';

import React, {useState, useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';

// icons do Material UI
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite'; // cora preenchido
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // cora borda
import ShareIcon from '@mui/icons-material/Share';

// funct de lib/tainacan-api
import { buscaObraPorId } from '@/app/lib/tainacan-api';
import styles from './page.module.css';

function HeaderObra(){
    const rota=useRouter();
    const[liked, setLiked]=useState(false); // estado do btn 'curtir'
    function voltar(){ rota.push('/') }
    function curtir(){ setLiked(!liked) }

    async function compartilhar(){
        // tenta usar a API de compartilhamento nativa do navegador - funciona em mobile
        if(navigator.share){ // DOM window -> navigator / alert
            try {
                await navigator.share({
                    title: document.title, // titulo da pag
                    text: 'confira esta obra incrivel do acervo artistico da ufsm',
                    url: window.location.href, // url corrente
                })
            } catch (err){
                console.error('erro ao compartilhar', err)
            }
        } else {
            alert('compartilhamento nao suportado. use o botao de compartilhar do seu navegador')
        }
    }

    return (
        <header className={styles.topbar}>
            <button
                onClick={voltar} 
                aria-label="Voltar para a galeria"
                className={styles.actionbtn}
            >
                <CloseIcon className={styles.icon}/>
            </button>
            
            <button
                onClick={curtir}
                aria-label="Curtir obra"
                className={styles.actionbtn}
            >
                {liked ? (
                    <FavoriteIcon className={styles.iconliked} />
                ) : (
                    <FavoriteBorderIcon className={styles.icon} />
                )}
            </button>

            <button
                onClick={compartilhar} 
                aria-label="partilhar"
                className={styles.actionbtn}
            >
                <ShareIcon className={styles.icon}/>
            </button>
        </header>
    )
}

export default function ObraDetailPage() {
  const { id } = useParams();
  const [obra, setObra] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchObra() {
      try {
        const normalizedObra = await buscaObraPorId(id);
        setObra(normalizedObra);
      } catch (e) {
        setObra(null);
      } finally {
        setCarregando(false);
      }
    }
    fetchObra();
  }, [id]);

  if (carregando) {
    return (
      <div className={styles.page}>
        <HeaderObra />
        <main className={styles.appcontainer}>
          <p>Carregando...</p>
        </main>
      </div>
    );
  }

  if (!obra) {
    return (
      <div className={styles.page}>
        <HeaderObra />
        <main className={styles.appcontainer}>
          <p>Obra não encontrada</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <HeaderObra />
        <main className={styles.appcontainer}>
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
                <div className={styles.info}>
                    <h1>{obra.titulo}</h1>
                    <h3>{obra.artista}</h3>
                    {/* <p><strong>Dimensoes: </strong>{obra.dimensoes}</p> */}
                    {/* <p><strong>descript: </strong>{obra.desc}</p> */}
                    <p><strong>Ano: </strong>{obra.ano}</p>
                    {/* <p><strong>Suporte: </strong>{obra.suport}</p> */}
                    {/* <p><strong>Material: </strong>{obra.material}</p> */}
                </div>
            </div>
        </main>
    </div>
  );
}