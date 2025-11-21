// components/TopBarObra.js
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// ícones do Material UI
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';

export default function TopBarObra() {
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  const handleBack = () => {
    router.push('/'); // volta para a página inicial
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    // API de compartilhamento do navegador (funciona em mobile)
    if (navigator.share) {
      navigator.share({
        title: 'Obra do Acervo Artístico UFSM',
        text: 'Confira esta obra incrível!',
        url: window.location.href,
      });
    } else {
      alert('Compartilhamento não suportado neste navegador');
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '60px',
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid #ddd',
        zIndex: 1000
      }}
    >
      {/* botão voltar */}
      <button
        onClick={handleBack}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
        aria-label="Voltar"
      >
        <CloseIcon style={{ fontSize: 28 }} />
      </button>

      {/* botão curtir */}
      <button
        onClick={handleLike}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
        aria-label="Curtir"
      >
        {liked ? (
          <FavoriteIcon style={{ fontSize: 28, color: '#e53935' }} />
        ) : (
          <FavoriteBorderIcon style={{ fontSize: 28 }} />
        )}
      </button>

      {/* botão compartilhar */}
      <button
        onClick={handleShare}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
        aria-label="Compartilhar"
      >
        <ShareIcon style={{ fontSize: 26 }} />
      </button>
    </header>
  );
}
