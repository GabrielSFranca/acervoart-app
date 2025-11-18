"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// import styles from './ObraHeader.module.css'; // Usando seu próprio CSS Module

// icons do Material UI
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite'; // cora preenchido
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // cora borda
import ShareIcon from '@mui/icons-material/Share';

export default function ObraHeader() {
  const router = useRouter();
  const [liked, setLiked] = useState(false); // Estado para o botão "Curtir"

  // 1. Função SAIR (X)
  const handleBack = () => {
    router.push("/"); // Volta para a página inicial (galeria)
  };

  // 2. Função CURTIR (Coração)
  const handleLike = () => {
    setLiked(!liked); // Alterna o estado de 'liked'
  };

  // 3. Função COMPARTILHAR
  const handleShare = async () => {
    // Tenta usar a API de compartilhamento nativa do navegador
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title, // Título da página (ex: "Obra X | mosai")
          text: 'Confira esta obra do Acervo Artístico da UFSM!',
          url: window.location.href, // URL atual
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para desktops ou navegadores sem suporte
      // (Idealmente, você mostraria um pop-up com a URL para copiar)
      alert('Use o botão de compartilhar do seu navegador para copiar o link.');
    }
  };

  return (
    <header className={styles.topbar}>
      {/* Botão Sair (X) */}
      <button 
        onClick={handleBack} 
        aria-label="Voltar para a galeria" 
        className={styles.actionBtn}
      >
        <CloseIcon className={styles.icon} />
      </button>

      {/* Botão Curtir (Coração) */}
      <button 
        onClick={handleLike} 
        aria-label="Curtir obra" 
        className={styles.actionBtn}
      >
        {liked ? (
          <FavoriteIcon className={styles.iconLiked} />
        ) : (
          <FavoriteBorderIcon className={styles.icon} />
        )}
      </button>

      {/* Botão Compartilhar */}
      <button 
        onClick={handleShare} 
        aria-label="Compartilhar obra" 
        className={styles.actionBtn}
      >
        <ShareIcon className={styles.icon} />
      </button>
    </header>
  );
}








// const TAINACAN_BASE='https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2';

// function itemUrl(id){
//     return `${TAINACAN_BASE}/item/${id}`;
// }

// function collectionItemsUrl(collection = 2174, perpage = 30, page = 1) {
//   return `${TAINCAN_BASE}/collection/${collection}/items?perpage=${perpage}&page=${page}`;
// }


// function normalizeAuthor(item) {
//   // quick-access fields based on your JSON structure
//   const meta = item.metadata || {};
//   // example from your dump: metadata.taxonomia.value[0].name or metadata.taxonomia.value_as_string
//   if (meta.taxonomia) {
//     try {
//       const t = meta.taxonomia;
//       if (Array.isArray(t.value) && t.value.length) {
//         const v0 = t.value[0];
//         if (v0 && typeof v0 === 'object' && v0.name) return v0.name;
//       }
//       if (t.value_as_string) return t.value_as_string;
//     } catch (e) {}
//   }
//   // fallback: common fields
//   if (item.author_name) return item.author_name;
//   if (item.authors && Array.isArray(item.authors) && item.authors.length) {
//     const a0 = item.authors[0];
//     if (typeof a0 === 'string') return a0;
//     if (a0 && a0.name) return a0.name;
//   }
//   return null;
// }


// function normalizeDate(item){
//     return item.creation_date;
// }

// function fetchImg(html){
    
// }


// async function itemToMinimal(item){
//     const titulo=item.title;
//     const artist=normalizeAuthor(item);
//     const dataCriacao=normalizeDate(item);


// }