let lojaOnline = false; // Variável para armazenar o status da loja

async function verificarStatusLoja() {
    try {
        const response = await fetch('/api/statusLoja'); // Agora chama o backend

        if (!response.ok) {
            throw new Error('Erro ao buscar status da loja.');
        }

        const data = await response.json();
        lojaOnline = data.online; // Atualiza a variável

        const statusIcon = document.getElementById("statusIcon");
        const statusText = document.getElementById("statusText");
        const finalizarBtn = document.getElementById("finalizar");

        if (lojaOnline) {
            statusIcon.innerHTML = "🟢"; 
            statusText.innerHTML = "Loja Online";
            finalizarBtn.disabled = false;
            finalizarBtn.title = "Clique para finalizar o pedido";
        } else {
            statusIcon.innerHTML = "🔴";
            statusText.innerHTML = "Loja Offline";
            finalizarBtn.disabled = true;
            finalizarBtn.title = "A loja está offline. Não é possível finalizar o pedido.";
        }
    } catch (error) {
        console.error(error);
    }
}

// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", verificarStatusLoja);

// Atualizar o status da loja a cada 10 segundos
setInterval(verificarStatusLoja, 10000);

// Evento de clique para finalizar o pedido
document.getElementById("finalizar").addEventListener("click", function() {
    if (lojaOnline) {
        console.log("Pedido finalizado.");
    } else {
        console.log("Não é possível finalizar o pedido, a loja está offline.");
    }
});
