async function alterarStatusLoja() {
    // Pegando o status atual
    const statusLoja = await obterStatusLoja();

    // Invertendo o status
    const novoStatus = !statusLoja;

    // URL para a API, certificando-se de que o filtro está correto
    const url = `${supabaseUrl}/rest/v1/statusLoja?pkstatusloja=eq.1`;  // O pkstatusLoja = 1, conforme seu código original

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

        // Atualizando o texto e o estado do toggle conforme o novo status
        const statusLabel = document.getElementById("statusLabel");
        const toggleButton = document.getElementById("toggleStatusBtn");

        if (novoStatus) {
            statusLabel.textContent = "Loja Online";
            toggleButton.checked = true;
        } else {
            statusLabel.textContent = "Loja Offline";
            toggleButton.checked = false;
        }
    } else {
        console.error("Erro ao alterar status da loja.");
    }
}

// Função para pegar o status atual da loja
async function obterStatusLoja() {
    const url = `${supabaseUrl}/rest/v1/statusLoja?select=online&limit=1`; 
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
document.getElementById("toggleStatusBtn").addEventListener("change", alterarStatusLoja);

// Inicializando o estado do botão assim que a página carrega
(async () => {
    const statusLoja = await obterStatusLoja();
    const statusLabel = document.getElementById("statusLabel");
    const toggleButton = document.getElementById("toggleStatusBtn");

    if (statusLoja) {
        statusLabel.textContent = "Loja Online";
        toggleButton.checked = true;
    } else {
        statusLabel.textContent = "Loja Offline";
        toggleButton.checked = false;
    }
})();
