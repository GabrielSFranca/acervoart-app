'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// icons do Material UI
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite'; // cora preenchido
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // cora borda
import ShareIcon from '@mui/icons-material/Share';
import styles from './page.module.css';

function HeaderObra(){
    const rota=useRouter()
    const[liked, setLiked]=useState(false) // estado do btn 'curtir'
    function voltar(){ rota.push('/pagelink') }
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