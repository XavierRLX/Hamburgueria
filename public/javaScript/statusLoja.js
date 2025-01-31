// Função para alterar o status da loja
async function alterarStatusLoja() {
    try {
        // Obtém o status atual da loja
        const statusLoja = await obterStatusLoja();

        // Inverte o status (se estava online, fica offline e vice-versa)
        const novoStatus = !statusLoja;

        // Faz a requisição para o backend atualizar o status no banco
        const response = await fetch('/api/statusLoja', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ online: novoStatus })
        });

        if (!response.ok) {
            throw new Error('Erro ao alterar status da loja.');
        }

        console.log(`Status da loja alterado para: ${novoStatus ? "Online" : "Offline"}`);

        // Atualiza o texto e o estado do toggle conforme o novo status
        const statusLabel = document.getElementById('statusLabel');
        const toggleButton = document.getElementById('toggleStatusBtn');

        statusLabel.textContent = novoStatus ? "Loja Online" : "Loja Offline";
        toggleButton.checked = novoStatus;
    } catch (error) {
        console.error(error.message);
    }
}

// Função para buscar o status atual da loja
async function obterStatusLoja() {
    try {
        const response = await fetch('/api/statusLoja'); // Chama a API do backend

        if (!response.ok) {
            throw new Error('Erro ao buscar status da loja.');
        }

        const data = await response.json();
        return data.online;
    } catch (error) {
        console.error(error.message);
        return false; // Retorna offline por padrão em caso de erro
    }
}

// Evento de clique para alterar o status
document.getElementById('toggleStatusBtn').addEventListener('change', alterarStatusLoja);

// Inicializa o estado do botão quando a página carrega
(async () => {
    const statusLoja = await obterStatusLoja();
    const statusLabel = document.getElementById('statusLabel');
    const toggleButton = document.getElementById('toggleStatusBtn');

    statusLabel.textContent = statusLoja ? "Loja Online" : "Loja Offline";
    toggleButton.checked = statusLoja;
})();
