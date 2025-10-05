"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ObraDetalhes() {
  const params = useParams();
  const obraId = params.id;
  
  const [obra, setObra] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Função para extrair URL da imagem
  const extrairUrlImagem = (htmlString) => {
    if (!htmlString) return null;
    const regex = /src=["']([^"']+)["']/i;
    const match = htmlString.match(regex);
    return match ? match[1] : null;
  };

  // Função para extrair metadados
  const extrairMetadado = (metadados, chave) => {
    if (!metadados) return null;
    const meta = Object.values(metadados).find(m => 
      m.name?.toLowerCase().includes(chave.toLowerCase())
    );
    return meta?.value || null;
  };

  // Buscar obra específica
  const buscarObra = async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      console.log(`Buscando obra ID: ${obraId}`);
      const response = await fetch(
        `https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/items/${obraId}`
      );
      
      if (!response.ok) throw new Error('Obra não encontrada');
      
      const obraData = await response.json();
      console.log('Obra detalhada:', obraData);

      const imagemUrl = extrairUrlImagem(obraData.document_as_html);

      setObra({
        id: obraData.id,
        titulo: obraData.title || 'Sem título',
        imagemUrl: imagemUrl,
        artista: extrairMetadado(obraData.metadata, 'autor') || 'Artista não identificado',
        tecnica: extrairMetadado(obraData.metadata, 'técnica') || '',
        data: extrairMetadado(obraData.metadata, 'data') || '',
        localizacao: extrairMetadado(obraData.metadata, 'localização') || '',
        dimensoes: extrairMetadado(obraData.metadata, 'dimensões') || '',
        descricao: obraData.description || '',
        dadosCompletos: obraData
      });
      
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (obraId) {
      buscarObra();
    }
  }, [obraId]);

  if (carregando) {
    return (
      <div className="container">
        <header className="header">
          <Link href="/" className="voltar-link">← Voltar</Link>
          <h1>Carregando obra...</h1>
        </header>
      </div>
    );
  }

  if (erro || !obra) {
    return (
      <div className="container">
        <header className="header">
          <Link href="/" className="voltar-link">← Voltar</Link>
          <h1>Obra não encontrada</h1>
        </header>
        <div className="erro">
          <p>{erro || 'A obra solicitada não existe.'}</p>
          <button onClick={buscarObra} className="btn">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <Link href="/" className="voltar-link">← Voltar para a lista</Link>
        <h1>Detalhes da Obra</h1>
      </header>

      <div className="detalhes-conteudo">
        {/* Imagem Principal */}
        <div className="imagem-principal">
          {obra.imagemUrl ? (
            <img 
              src={obra.imagemUrl} 
              alt={obra.titulo}
              className="imagem-obra"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="imagem-placeholder">
            🖼️ Imagem não disponível
          </div>
        </div>

        {/* Informações da Obra */}
        <div className="informacoes-obra">
          <div className="info-principal">
            <h2 className="titulo-obra">{obra.titulo}</h2>
            <p className="artista-obra">{obra.artista}</p>
          </div>

          {/* Metadados */}
          <div className="metadados">
            {obra.tecnica && (
              <div className="metadado-item">
                <span className="metadado-label">Técnica</span>
                <span className="metadado-valor">{obra.tecnica}</span>
              </div>
            )}
            
            {obra.data && (
              <div className="metadado-item">
                <span className="metadado-label">Data</span>
                <span className="metadado-valor">{obra.data}</span>
              </div>
            )}
            
            {obra.localizacao && (
              <div className="metadado-item">
                <span className="metadado-label">Localização</span>
                <span className="metadado-valor">{obra.localizacao}</span>
              </div>
            )}
            
            {obra.dimensoes && (
              <div className="metadado-item">
                <span className="metadado-label">Dimensões</span>
                <span className="metadado-valor">{obra.dimensoes}</span>
              </div>
            )}
          </div>

          {/* Descrição */}
          {obra.descricao && (
            <div className="descricao">
              <h3>Descrição</h3>
              <p>{obra.descricao}</p>
            </div>
          )}

          {/* Debug (opcional) */}
          <details className="debug-info">
            <summary>Informações técnicas</summary>
            <pre>{JSON.stringify(obra.dadosCompletos, null, 2)}</pre>
          </details>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 1rem;
          min-height: 100vh;
        }

        .header {
          margin-bottom: 1.5rem;
        }

        .voltar-link {
          display: inline-block;
          margin-bottom: 1rem;
          color: #4a6fa5;
          text-decoration: none;
          font-size: 1rem;
        }

        .voltar-link:hover {
          text-decoration: underline;
        }

        .header h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.3rem;
        }

        .erro {
          text-align: center;
          padding: 2rem 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          background-color: #4a6fa5;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 1rem;
        }

        .detalhes-conteudo {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .imagem-principal {
          position: relative;
          width: 100%;
          height: 300px;
          background: #f8f9fa;
        }

        .imagem-obra {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .imagem-placeholder {
          display: none;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 1.2rem;
          background: #f8f9fa;
        }

        .informacoes-obra {
          padding: 1.5rem;
        }

        .info-principal {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .titulo-obra {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 1.4rem;
        }

        .artista-obra {
          margin: 0;
          color: #4a6fa5;
          font-size: 1.1rem;
        }

        .metadados {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .metadado-item {
          display: flex;
          justify-content: space-between;
          padding: 0.8rem 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .metadado-label {
          font-weight: 600;
          color: #2c3e50;
        }

        .metadado-valor {
          color: #666;
          text-align: right;
          max-width: 60%;
        }

        .descricao {
          margin-bottom: 1.5rem;
        }

        .descricao h3 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .descricao p {
          margin: 0;
          color: #666;
          line-height: 1.5;
        }

        .debug-info {
          margin-top: 2rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          font-size: 0.8rem;
        }

        .debug-info summary {
          cursor: pointer;
          font-weight: 600;
          color: #4a6fa5;
        }

        .debug-info pre {
          margin: 1rem 0 0 0;
          white-space: pre-wrap;
          font-size: 0.7rem;
          color: #666;
        }

        @media (max-width: 480px) {
          .container {
            padding: 0.5rem;
          }
          
          .imagem-principal {
            height: 250px;
          }
          
          .informacoes-obra {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}