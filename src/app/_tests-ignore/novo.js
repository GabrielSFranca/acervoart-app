"use client"
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Função melhorada para extrair URL da imagem
  const extrairUrlImagem = (htmlString) => {
    if (!htmlString) return null;
    

    const match = htmlString.match(regex);
    
    return match ? match[1] : null;
  };

  // Função para buscar os dados da API
  const buscarObras = async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      const TAINACAN_API_URL = 'https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/collection/2174/items?perpage=5';
      
      console.log('🔍 Iniciando busca na API...');
      const resposta = await fetch(TAINACAN_API_URL);
      
      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }
      
      const dados = await resposta.json();
      console.log('📦 Dados brutos da API:', dados);
      
      // Verifica se temos items no retorno
      if (!dados.items || !Array.isArray(dados.items)) {
        throw new Error('Formato de dados inválido da API');
      }
      
      console.log(`🎨 Número de obras retornadas: ${dados.items.length}`);
      
      // Processa cada obra
      const obrasProcessadas = dados.items.map((obra, index) => {
        console.log(`📝 Processando obra ${index + 1}:`, {
          id: obra.id,
          titulo: obra.title,
          temDocumentHtml: !!obra.document_as_html,
          documentHtml: obra.document_as_html ? obra.document_as_html.substring(0, 100) + '...' : 'N/A'
        });
        
        const imagemUrl = extrairUrlImagem(obra.document_as_html);
        
        console.log(`🖼️ Obra ${index + 1} - URL da imagem:`, imagemUrl);
        
        return {
          id: obra.id,
          titulo: obra.title || 'Sem título',
          imagemUrl: imagemUrl,
          // Mantém os dados originais para debug
          dadosCompletos: obra
        };
      });
      
      console.log('✅ Obras processadas:', obrasProcessadas);
      setObras(obrasProcessadas);
      
    } catch (erro) {
      console.error('❌ Erro ao buscar obras:', erro);
      setErro(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarObras();
  }, []);

  // Estado de carregamento
  if (carregando) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1>🎨 Acervo Artístico UFSM</h1>
        <p>Carregando obras...</p>
        <div style={{ marginTop: '1rem' }}>⏳</div>
      </div>
    );
  }

  // Estado de erro
  if (erro) {
    return (
      <div style={{ 
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1>🎨 Acervo Artístico UFSM</h1>
        <p style={{ color: 'red' }}>Erro: {erro}</p>
        <button 
          onClick={buscarObras}
          style={{
            padding: '0.5rem 1rem',
            marginTop: '1rem',
            backgroundColor: '#4a6fa5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  // Estado de sucesso
  return (
    <div style={{ 
      padding: '1rem',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        padding: '1rem 0',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0',
          color: '#2c3e50'
        }}>
          🎨 Acervo Artístico UFSM
        </h1>
        <p style={{ 
          margin: 0,
          color: '#666',
          fontSize: '0.9rem'
        }}>
          {obras.length} obras em destaque
        </p>
      </header>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem' 
      }}>
        {obras.map(obra => (
          <div 
            key={obra.id}
            style={{ 
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              backgroundColor: 'white'
            }}
          >
            {/* Imagem da obra */}
            {obra.imagemUrl ? (
              <div style={{
                width: '100%',
                height: '200px',
                overflow: 'hidden'
              }}>
                <img 
                  src={obra.imagemUrl} 
                  alt={obra.titulo}
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    // Fallback se a imagem não carregar
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                {/* Placeholder se a imagem falhar */}
                <div 
                  style={{
                    display: 'none',
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                  }}
                >
                  🖼️ Imagem não disponível
                </div>
              </div>
            ) : (
              // Placeholder quando não há imagem
              <div 
                style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                🖼️ Sem imagem
              </div>
            )}
            
            {/* Informações da obra */}
            <div style={{ padding: '1rem' }}>
              <h3 style={{ 
                margin: '0 0 0.5rem 0',
                color: '#2c3e50',
                fontSize: '1.1rem'
              }}>
                {obra.titulo}
              </h3>
              
              {/* Debug info - pode remover depois */}
              <div style={{ 
                fontSize: '0.7rem', 
                color: '#888',
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>
                ID: {obra.id} | Imagem: {obra.imagemUrl ? '✅' : '❌'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botão para recarregar */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem',
        padding: '1rem'
      }}>
        <button 
          onClick={buscarObras}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4a6fa5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          🔄 Atualizar Lista
        </button>
      </div>
    </div>
  );
}