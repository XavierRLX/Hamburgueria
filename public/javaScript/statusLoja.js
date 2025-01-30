let lojaOnline = false; // Variável para armazenar o status da loja

async function verificarStatusLoja() {
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
        lojaOnline = data.length > 0 ? data[0].online : false;
        
        const statusIcon = document.getElementById("statusIcon");
        const statusText = document.getElementById("statusText");
        const finalizarBtn = document.getElementById("finalizar");

        if (lojaOnline) {
            statusIcon.innerHTML = "🟢"; // Ícone verde
            statusText.innerHTML = "Loja Online"; // Texto fixo
            finalizarBtn.disabled = false; // Habilitar botão se online
            finalizarBtn.title = "Clique para finalizar o pedido"; // Mensagem de ajuda
        } else {
            statusIcon.innerHTML = "🔴"; // Ícone vermelho
            statusText.innerHTML = "Loja Offline"; // Texto fixo
            finalizarBtn.disabled = true; // Desabilitar botão se offline
            finalizarBtn.title = "A loja está offline. Não é possível finalizar o pedido."; // Mensagem de ajuda
        }
    } else {
        console.error("Erro ao buscar status da loja.");
    }
}

// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", verificarStatusLoja);

// Atualizar o status da loja a cada 10 segundos (10.000ms)
setInterval(verificarStatusLoja, 10000);

// Adicionar evento de clique para finalizar o pedido, caso o botão esteja habilitado
document.getElementById("finalizar").addEventListener("click", function() {
    if (lojaOnline) {
        // Lógica para finalizar o pedido
        console.log("Pedido finalizado.");
    } else {
        console.log("Não é possível finalizar o pedido, a loja está offline.");
    }
});
