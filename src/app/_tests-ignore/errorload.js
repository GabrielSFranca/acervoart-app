"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// --- Ícones (Material UI) ---
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";

// Ícones para os detalhes
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BrushIcon from '@mui/icons-material/Brush';
import StraightenIcon from '@mui/icons-material/Straighten'; // Régua para dimensões
import LayersIcon from '@mui/icons-material/Layers'; // Para suporte/material
import CategoryIcon from '@mui/icons-material/Category'; // Para técnica
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { buscaObraPorId } from "@/app/lib/tainacan-api";
import styles from './page.module.css';

// --- Componente Reutilizável: DetalheItem ---
function DetalheItem({ icon, label, valor }) {
  // Não renderiza se o valor for vazio, nulo ou "null" (string da API)
  if (!valor || valor === "null" || valor === "") return null;

  return (
    <div className={styles.detalheItem}>
      <div className={styles.detalheHeader}>
        <span className={styles.iconWrapper}>{icon}</span>
        <span className={styles.detalheLabel}>{label}</span>
      </div>
      <p className={styles.detalheValor}>{valor}</p>
    </div>
  );
}

function HeaderObra() {
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  function voltar() { router.push('/'); }
  function curtir() { setLiked(!liked); }

  async function compartilhar() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: 'Confira esta obra do Acervo Artístico da UFSM',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Erro ao compartilhar', err);
      }
    } else {
      alert('Compartilhamento não suportado neste navegador.');
    }
  }

  return (
    <header className={styles.topbar}>
      <button onClick={voltar} aria-label="Voltar" className={styles.actionbtn}>
        <CloseIcon className={styles.icon} />
      </button>
      <button onClick={curtir} aria-label="Curtir" className={styles.actionbtn}>
        {liked ? <FavoriteIcon className={styles.iconliked} /> : <FavoriteBorderIcon className={styles.icon} />}
      </button>
      <button onClick={compartilhar} aria-label="Compartilhar" className={styles.actionbtn}>
        <ShareIcon className={styles.icon} />
      </button>
    </header>
  );
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
          <div className={styles.loadingState}><p>Carregando obra...</p></div>
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
          {/* Área da Imagem */}
          <div className={styles.imageWrapper}>
            {obra.imgSrc ? (
              <img
                src={obra.imgSrc}
                alt={obra.titulo}
                className={styles.image}
              />
            ) : (
              <div className={styles.obraimgph}>🖼️</div>
            )}
          </div>

          {/* Área de Informações */}
          <div className={styles.info}>
            
            {/* Cabeçalho da Obra */}
            <div className={styles.infoHeader}>
              <h1 className={styles.titulo}>{obra.titulo}</h1>
              <h2 className={styles.artista}>{obra.artista}</h2>
            </div>

            <hr className={styles.divider} />

            {/* Grid de Detalhes (Dicionário Visual) */}
            <div className={styles.detalhesGrid}>
              <DetalheItem 
                icon={<CalendarMonthIcon fontSize="small" />} 
                label="Data" 
                valor={obra.datAno} 
              />
              <DetalheItem 
                icon={<CategoryIcon fontSize="small" />} 
                label="Técnica" 
                valor={obra.tec} 
              />
              <DetalheItem 
                icon={<LayersIcon fontSize="small" />} 
                label="Suporte" 
                valor={obra.sup} 
              />
              <DetalheItem 
                icon={<BrushIcon fontSize="small" />} 
                label="Material" 
                valor={obra.material} 
              />
              <DetalheItem 
                icon={<StraightenIcon fontSize="small" />} 
                label="Dimensões" 
                valor={obra.dimensoes} 
              />
              <DetalheItem 
                icon={<LocationOnIcon fontSize="small" />} 
                label="Localização" 
                valor={obra.loc} 
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}