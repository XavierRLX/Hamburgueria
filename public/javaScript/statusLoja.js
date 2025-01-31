document.addEventListener("DOMContentLoaded", async () => {
    const toggleButton = document.getElementById('toggleStatusBtn');
    const statusLabel = document.getElementById('statusLabel');

    if (!toggleButton || !statusLabel) {
        console.error("Elementos não encontrados! Verifique se os IDs estão corretos no HTML.");
        return;
    }

    // Função para buscar o status atual da loja
    async function obterStatusLoja() {
        try {
            const response = await fetch('/api/statusLoja'); // Faz a requisição ao backend

            if (!response.ok) {
                throw new Error('Erro ao buscar status da loja.');
            }

            const data = await response.json();
            return data.online; // Retorna true (online) ou false (offline)
        } catch (error) {
            console.error(error.message);
            return false; // Retorna offline por padrão em caso de erro
        }
    }

    // Função para alterar o status da loja
    async function alterarStatusLoja() {
        try {
            const novoStatus = toggleButton.checked; // Obtém o novo status

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
            statusLabel.textContent = novoStatus ? "Loja Online" : "Loja Offline";
        } catch (error) {
            console.error(error.message);
        }
    }

    // Inicializa o estado do botão ao carregar a página
    const statusLoja = await obterStatusLoja();
    statusLabel.textContent = statusLoja ? "Loja Online" : "Loja Offline";
    toggleButton.checked = statusLoja;

    // Adiciona o evento de clique no botão de alternância
    toggleButton.addEventListener('change', alterarStatusLoja);
});
