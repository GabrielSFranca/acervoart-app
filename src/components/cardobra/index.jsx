// components/ObraCard.jsx
'use client'
import Link from 'next/link';
import { tainacanUFSM } from '@/app/lib/tainacan';
import './cardobra.css';

export default function CardObra({ obra }) {
  const titulo = obra.title || 'Sem título';
  const imagem = tainacanUFSM.getImageUrl(obra);
  const autor = tainacanUFSM.getMetadataValue(obra, 'autor') || 'Artista não identificado';
  const tecnica = tainacanUFSM.getMetadataValue(obra, 'técnica') || 'Técnica não especificada';
  const dataObra = tainacanUFSM.getMetadataValue(obra, 'data') || '';

  return (
    <Link href={`/obra/${obra.id}`} className="obra-card">
      <div className="obra-image">
        <img 
          src={imagem} 
          alt={titulo}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      </div>
      
      <div className="obra-info">
        <h3 className="obra-title">{titulo}</h3>
        <p className="obra-artist">{autor}</p>
        <p className="obra-technique">{tecnica}</p>
        {dataObra && <p className="obra-date">{dataObra}</p>}
        
        {/* Mostrar alguns metadados importantes */}
        <div className="obra-metadata-preview">
          {tainacanUFSM.getMetadataValue(obra, 'dimensões') && (
            <span>📏 {tainacanUFSM.getMetadataValue(obra, 'dimensões')}</span>
          )}
          {tainacanUFSM.getMetadataValue(obra, 'localização') && (
            <span>📍 {tainacanUFSM.getMetadataValue(obra, 'localização')}</span>
          )}
        </div>
      </div>
    </Link>
  );
}