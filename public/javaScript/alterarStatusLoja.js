async function alterarStatusLoja() {
    // Pegando o status atual
    const statusLoja = await obterStatusLoja();

    // Invertendo o status
    const novoStatus = !statusLoja;

    // URL para a API, certificando-se de que o filtro está correto
    const url = `${supabaseUrl}/rest/v1/statusLoja?pkstatusloja=eq.1`;    // O pkstatusLoja = 1, conforme seu código original

    const response = await fetch(url, {
        method: "PATCH", // Usando PATCH para atualizar
        headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            online: novoStatus
        })
    });

    if (response.ok) {
        console.log(`Status da loja alterado para: ${novoStatus ? "Online" : "Offline"}`);
       // verificarStatusLoja(); // Atualiza o status na interface
    } else {
        console.error("Erro ao alterar status da loja.");
    }
}

// Função para pegar o status atual da loja
async function obterStatusLoja() {
    const url = `${supabaseUrl}/rest/v1/statusLoja?select=online&limit=1`;  // Selecionando o campo online e limitando para 1
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        return data.length > 0 ? data[0].online : false;
    } else {
        console.error("Erro ao buscar status da loja.");
        return false;
    }
}

// Evento de clique no botão para alterar o status da loja
document.getElementById("toggleStatusBtn").addEventListener("click", alterarStatusLoja);
