// script para testar a api usando o comando 
// 'node test-api.js'
// o arquivo precisa estar no diretorio root

// A URL da API que queremos testar.
const TAINACAN_API_URL = "https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2/collection/2174/items?perpage=5";

// Criamos uma função 'async' para podermos usar 'await'.
async function buscarObras() {
  console.log("A iniciar a busca na API do Tainacan...");

  try {
    // 1. Faz a requisição (fetch) para a URL.
    const resposta = await fetch(TAINACAN_API_URL);

    // 2. Verifica se a requisição foi bem-sucedida.
    if (!resposta.ok) {
      // Se não foi, lança um erro com o status.
      throw new Error(`Erro na resposta da API: ${resposta.status} ${resposta.statusText}`);
    }

    // 3. Converte a resposta para o formato JSON.
    const dadosJson = await resposta.json();

    // 4. Imprime o JSON completo no terminal.
    console.log("\n--- SUCESSO! JSON recebido: ---\n");
    
    // Usamos JSON.stringify com formatação para ficar mais fácil de ler.
    console.log(JSON.stringify(dadosJson, null, 2)); 

  } catch (erro) {
    // Se qualquer passo falhar, o erro será capturado e impresso aqui.
    console.error("\n--- OCORREU UM ERRO AO BUSCAR OS DADOS: ---\n", erro);
  }
}

// Executa a função que acabamos de criar.
buscarObras();