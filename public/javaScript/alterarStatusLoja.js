async function alterarStatusLoja() {
    try {
        // Obtendo o status atual
        const statusLoja = await obterStatusLoja();
        const novoStatus = !statusLoja; // Alterna o status

        // Chamada à API para atualizar o status
        const response = await fetch("/api/status-loja", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ online: novoStatus }),
        });

        if (!response.ok) {
            throw new Error("Erro ao alterar status da loja.");
        }

        console.log(`Status da loja alterado para: ${novoStatus ? "Online" : "Offline"}`);

        // Atualizando o texto e o estado do toggle no front-end
        const statusLabel = document.getElementById("statusLabel");
        const toggleButton = document.getElementById("toggleStatusBtn");

        statusLabel.textContent = novoStatus ? "Loja Online" : "Loja Offline";
        toggleButton.checked = novoStatus;
    } catch (error) {
        console.error(error);
    }
}


// Função para pegar o status atual da loja
async function obterStatusLoja() {
    try {
        const response = await fetch("/api/status-loja");
        if (!response.ok) {
            throw new Error("Erro ao buscar status da loja.");
        }

        const data = await response.json();
        return data.online; // Retorna o status online (true ou false)
    } catch (error) {
        console.error(error);
        return false; // Retorna offline por padrão em caso de erro
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
