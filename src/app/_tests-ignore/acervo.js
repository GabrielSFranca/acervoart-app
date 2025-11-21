// acervoUFSM-corrigido.js - Script ÚNICO com todas as correções

/**
 * FUNÇÃO PRINCIPAL CORRIGIDA - Busca obras com imagens e artistas
 */
async function buscarObrasCorrigidas(limite = 20) {
    const TAINACAN_API_URL = `https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/collection/2174/items?perpage=${limite}`;
    
    try {
        console.log('🎨 Buscando obras do Acervo UFSM (versão corrigida)...\n');
        
        const resposta = await fetch(TAINACAN_API_URL);
        
        if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status}`);
        }
        
        const dados = await resposta.json();
        
        if (!dados.items || !Array.isArray(dados.items)) {
            throw new Error('Formato de dados inválido');
        }

        console.log(`✅ ${dados.items.length} obras encontradas:\n`);

        // Processa cada obra com as correções
        const obrasProcessadas = await Promise.all(
            dados.items.map(async (obra, index) => {
                return await processarObraCorrigida(obra, index);
            })
        );

        // Exibe as obras processadas
        obrasProcessadas.forEach(obraInfo => {
            exibirObraNoConsole(obraInfo);
        });

        // Estatísticas finais
        exibirEstatisticas(obrasProcessadas);

        return obrasProcessadas;

    } catch (erro) {
        console.error('❌ Erro ao buscar obras:', erro.message);
        return [];
    }
}

/**
 * FUNÇÃO CORRIGIDA - Processa cada obra individualmente
 */
async function processarObraCorrigida(obra, index) {
    // CORREÇÃO 1: Extrair artista corretamente
    const artista = extrairArtistaCorrigido(obra);
    
    // CORREÇÃO 2: Múltiplas tentativas para imagem
    const imagemInfo = await extrairImagemCorrigida(obra);
    
    // Outros metadados
    const tecnica = extrairMetadado(obra, 'técnica') || 'Técnica não especificada';
    const dataObra = extrairMetadado(obra, 'data') || 'Sem data';
    const localizacao = extrairMetadado(obra, 'localização') || '';

    return {
        numero: index + 1,
        id: obra.id,
        titulo: obra.title || 'Sem título',
        artista: artista,
        tecnica: tecnica,
        data: dataObra,
        localizacao: localizacao,
        imagemUrl: imagemInfo.url,
        fonteImagem: imagemInfo.fonte,
        descricao: obra.description || '',
        urlCompleta: obra.url || ''
    };
}

/**
 * CORREÇÃO 1: Extrai artista CORRETAMENTE (resolve [object Object])
 */
function extrairArtistaCorrigido(obra) {
    if (!obra.metadata) return 'Artista não identificado';
    
    const metadados = Object.values(obra.metadata);
    
    // Busca por metadados de artista (autor, artista, etc.)
    const metadadoArtista = metadados.find(meta => {
        if (!meta.name) return false;
        const nomeMeta = meta.name.toLowerCase();
        return nomeMeta.includes('autor') || nomeMeta.includes('artista') || nomeMeta.includes('criador');
    });

    if (!metadadoArtista || !metadadoArtista.value) {
        return 'Artista não identificado';
    }

    // CORREÇÃO PRINCIPAL: Se o valor é um objeto, extrai o nome
    if (typeof metadadoArtista.value === 'object') {
        if (metadadoArtista.value.name) {
            return metadadoArtista.value.name;
        }
        if (metadadoArtista.value.title) {
            return metadadoArtista.value.title;
        }
        // Se for um objeto sem nome, tenta stringify para debug
        console.log(`   ⚠️  Artista objeto complexo: ${JSON.stringify(metadadoArtista.value).substring(0, 100)}`);
        return 'Artista (dados complexos)';
    }

    // Se já é string, retorna diretamente
    return metadadoArtista.value;
}

/**
 * CORREÇÃO 2: Múltiplas estratégias para extrair imagens
 */
async function extrairImagemCorrigida(obra) {
    // Estratégia 1: document_as_html (principal)
    const urlHtml = extrairUrlDoHtml(obra.document_as_html);
    if (urlHtml && await testarUrlImagem(urlHtml)) {
        return { url: urlHtml, fonte: 'HTML' };
    }

    // Estratégia 2: Thumbnail direto
    if (obra.thumbnail && await testarUrlImagem(obra.thumbnail)) {
        return { url: obra.thumbnail, fonte: 'Thumbnail' };
    }

    // Estratégia 3: API de Media do WordPress
    if (obra.document) {
        const urlMedia = await buscarUrlMedia(obra.document);
        if (urlMedia && await testarUrlImagem(urlMedia)) {
            return { url: urlMedia, fonte: 'API Media' };
        }
    }

    // Estratégia 4: _links
    if (obra._links && obra._links.image) {
        for (const link of obra._links.image) {
            if (link.href && await testarUrlImagem(link.href)) {
                return { url: link.href, fonte: '_links' };
            }
        }
    }

    // Estratégia 5: Tentar construir URL base
    if (obra.document) {
        const urlConstruida = `https://tainacan.ufsm.br/acervo-artistico/wp-content/uploads/sites/5/tainacan-items/2174/${obra.id}/`;
        // Tentar extensões comuns
        const extensoes = ['.jpg', '.jpeg', '.png', '.webp'];
        for (const ext of extensoes) {
            const urlTeste = urlConstruida + 'imagem' + ext;
            if (await testarUrlImagem(urlTeste)) {
                return { url: urlTeste, fonte: 'URL Construída' };
            }
        }
    }

    return { url: null, fonte: 'Nenhuma' };
}

/**
 * Função para extrair URL do HTML
 */
function extrairUrlDoHtml(htmlString) {
    if (!htmlString) return null;
    const regex = /src=["']([^"']+)["']/i;
    const match = htmlString.match(regex);
    return match ? match[1] : null;
}

/**
 * Testa se uma URL de imagem é acessível
 */
async function testarUrlImagem(url) {
    if (!url) return false;
    
    try {
        const resposta = await fetch(url, { method: 'HEAD' });
        return resposta.ok && resposta.headers.get('content-type')?.startsWith('image/');
    } catch {
        return false;
    }
}

/**
 * Busca URL da mídia via API do WordPress
 */
async function buscarUrlMedia(mediaId) {
    try {
        const resposta = await fetch(
            `https://tainacan.ufsm.br/acervo-artistico/wp-json/wp/v2/media/${mediaId}`
        );
        if (!resposta.ok) return null;
        
        const media = await resposta.json();
        return media.source_url || null;
    } catch {
        return null;
    }
}

/**
 * Função auxiliar para metadados genéricos
 */
function extrairMetadado(obra, chave) {
    if (!obra.metadata) return null;
    
    const metadados = Object.values(obra.metadata);
    const meta = metadados.find(m => 
        m.name && m.name.toLowerCase().includes(chave.toLowerCase())
    );
    
    if (meta && meta.value) {
        if (typeof meta.value === 'object' && meta.value.name) {
            return meta.value.name;
        }
        return meta.value;
    }
    
    return null;
}

/**
 * Exibe uma obra formatada no console
 */
function exibirObraNoConsole(obra) {
    console.log(`📋 OBRA ${obra.numero}:`);
    console.log(`   ID: ${obra.id}`);
    console.log(`   Título: ${obra.titulo}`);
    console.log(`   Artista: ${obra.artista}`);
    console.log(`   Técnica: ${obra.tecnica}`);
    console.log(`   Data: ${obra.data}`);
    
    if (obra.localizacao) {
        console.log(`   Localização: ${obra.localizacao}`);
    }
    
    console.log(`   Imagem: ${obra.imagemUrl ? '✅ Disponível' : '❌ Não disponível'}`);
    
    if (obra.imagemUrl) {
        console.log(`   URL: ${obra.imagemUrl}`);
        console.log(`   Fonte: ${obra.fonteImagem}`);
    }
    
    if (obra.descricao) {
        const descricaoResumida = obra.descricao.length > 100 
            ? obra.descricao.substring(0, 100) + '...' 
            : obra.descricao;
        console.log(`   Descrição: ${descricaoResumida}`);
    }
    
    console.log(`   URL completa: ${obra.urlCompleta}`);
    console.log('   ──────────────────────────────────────────');
}

/**
 * Exibe estatísticas finais
 */
function exibirEstatisticas(obras) {
    const obrasComImagem = obras.filter(o => o.imagemUrl).length;
    const obrasComArtista = obras.filter(o => 
        o.artista && o.artista !== 'Artista não identificado'
    ).length;
    
    // Contagem por fonte de imagem
    const fontes = {};
    obras.forEach(obra => {
        if (obra.fonteImagem && obra.fonteImagem !== 'Nenhuma') {
            fontes[obra.fonteImagem] = (fontes[obra.fonteImagem] || 0) + 1;
        }
    });

    console.log('\n📊 ESTATÍSTICAS CORRIGIDAS:');
    console.log(`   • Total de obras processadas: ${obras.length}`);
    console.log(`   • Obras com imagem: ${obrasComImagem}`);
    console.log(`   • Obras com artista identificado: ${obrasComArtista}`);
    
    if (Object.keys(fontes).length > 0) {
        console.log(`   • Fontes de imagem:`);
        Object.entries(fontes).forEach(([fonte, count]) => {
            console.log(`      - ${fonte}: ${count} obras`);
        });
    }
}

/**
 * Função para debug detalhado de uma obra específica
 */
async function debugObra(obraId) {
    console.log(`\n🔍 DEBUG DETALHADO - OBRA ${obraId}:`);
    
    try {
        const resposta = await fetch(
            `https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/items/${obraId}`
        );
        const obra = await resposta.json();
        
        console.log('📖 METADADOS COMPLETOS:');
        if (obra.metadata) {
            Object.values(obra.metadata).forEach(meta => {
                console.log(`   "${meta.name}":`, JSON.stringify(meta.value).substring(0, 100));
            });
        }
        
        console.log('\n🖼️  INFORMAÇÕES DE IMAGEM:');
        console.log(`   document_as_html: ${obra.document_as_html ? 'PRESENTE' : 'AUSENTE'}`);
        console.log(`   thumbnail: ${obra.thumbnail || 'AUSENTE'}`);
        console.log(`   document: ${obra.document || 'AUSENTE'}`);
        console.log(`   _links.image:`, obra._links?.image || 'AUSENTE');
        
        // Processar com as funções corrigidas
        const artista = extrairArtistaCorrigido(obra);
        const imagemInfo = await extrairImagemCorrigida(obra);
        
        console.log('\n🎯 RESULTADO DAS CORREÇÕES:');
        console.log(`   Artista extraído: ${artista}`);
        console.log(`   Imagem encontrada: ${imagemInfo.url ? '✅' : '❌'}`);
        console.log(`   Fonte da imagem: ${imagemInfo.fonte}`);
        if (imagemInfo.url) {
            console.log(`   URL da imagem: ${imagemInfo.url}`);
        }
        
    } catch (erro) {
        console.error(`❌ Erro no debug: ${erro.message}`);
    }
}

// EXECUÇÃO PRINCIPAL
async function main() {
    const argumentos = process.argv.slice(2);
    const limite = argumentos[0] ? parseInt(argumentos[0]) : 20;
    const modoDebug = argumentos.includes('--debug');
    const obraDebug = argumentos.find(arg => arg.startsWith('--obra='));
    
    if (obraDebug) {
        const obraId = obraDebug.split('=')[1];
        await debugObra(obraId);
    } else if (modoDebug) {
        // Debug de algumas obras problemáticas
        await debugObra(28513); // Obra sem imagem
        await debugObra(29831); // Obra com imagem
    } else {
        await buscarObrasCorrigidas(limite);
    }
}

// Configuração para Node.js
if (require.main === module) {
    main().catch(erro => {
        console.error('❌ Erro na execução:', erro);
        process.exit(1);
    });
}

module.exports = {
    buscarObrasCorrigidas,
    extrairArtistaCorrigido,
    extrairImagemCorrigida
};