'use client';

import React, {useState, useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';

// icons do Material UI
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite'; // cora preenchido
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // cora borda
import ShareIcon from '@mui/icons-material/Share';


// Ícones para os detalhes
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BrushIcon from '@mui/icons-material/Brush';
import StraightenIcon from '@mui/icons-material/Straighten'; // Régua para dimensões
import LayersIcon from '@mui/icons-material/Layers'; // Para suporte/material
import CategoryIcon from '@mui/icons-material/Category'; // Para técnica
import LocationOnIcon from '@mui/icons-material/LocationOn';
// funct de lib/tainacan-api
import { buscaObraPorId } from '@/app/lib/tainacan-api';
// import { buscaObraPorId } from '@/app/lib/api-tai2';
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
                    text: "Confira esta obra incrível do Acervo Artístico da UFSM!",
                    url: window.location.href, // url corrente
                })
            } catch (err){
                console.error('erro ao compartilhar', err)
            }
        } else {
            alert("Compartilhamento não suportado. Use o botão de compartilhar do seu navegador.")
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


function Detalhe({ icon, val, lbl }){
    if(val === null){ return null }
    return (
        <dl className={styles.detailItem}>
            <dt className={styles.detailHead}><span className={styles.detailIcon}>{icon}</span><span className={styles.label}>{lbl}</span></dt>
            <dd className={styles.val}><p>{val}</p></dd>
        </dl>   
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
        // debug msg
        console.log(normalizedObra);
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
          <div className={styles.load}><p>Carregando obra...</p></div>
        </main>
      </div>
    );
  }

  if (!obra) {
    return (
      <div className={styles.page}>
        <HeaderObra />
        <main className={styles.appcontainer}>
          <p>Obra não encontrada.</p>
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
                <section className={styles.info}>
                    <div className={styles.titArtist}>
                        <h1>{obra.titulo}</h1>
                        <h2><span className={styles.autor}>{obra.artista}</span><span className={styles.ano}>, {obra.datAno}</span></h2>
                    </div>
                    
                    <hr className={styles.divider} />

                    <div className={styles.detailGrid}>
                        <Detalhe 
                            icon={<CategoryIcon fontSize='small'/>} 
                            lbl='Técnica' 
                            val={obra.tec}
                        />
                        <Detalhe 
                            icon={<LayersIcon fontSize='small'/>} 
                            lbl='Suporte' 
                            val={obra.sup}
                        />
                        <Detalhe 
                            icon={<StraightenIcon fontSize='small'/>} 
                            lbl='Dimensões' 
                            val={obra.dimensoes}
                        />
                        <Detalhe 
                            icon={<LocationOnIcon fontSize='small'/>} 
                            lbl='Localização' 
                            val={obra.loc}
                        />

                    </div>

                    {/* <p><strong>Dimensoes: </strong>{obra.dimensoes}</p>
                    <p><strong>Descrição: </strong>{obra.desc}</p>
                    <p><strong>Ano: </strong>{obra.datAno}</p>
                    <p><strong>Suporte: </strong>{obra.sup}</p>
                    <p><strong>Material: </strong>{obra.material}</p> */}
                </section>
            </div>
        </main>
    </div>
  );
}








/**
 * 
 * 
 *     <section>
        <div>
            <h1>title</h1>
            <h2>author, <span>ano</span></h2>
        </div>

        <dl>
            <dt><p>detalhe</p></dt>
            <dd><p>value</p></dd>
        </dl>
    </section>
 */