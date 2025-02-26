let lojaOnline = false;

async function verificarStatusLoja() {
    const url = "/api/status-loja"; 
    
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            lojaOnline = data.online; 

            const statusIcon = document.getElementById("statusIcon");
            const statusText = document.getElementById("statusText");
            const finalizarBtn = document.getElementById("finalizar");

            // Atualiza a interface com base no status da loja
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
        } else {
            throw new Error("Erro na resposta do servidor");
        }
    } catch (error) {
        console.error("Erro ao verificar status da loja:", error);

        lojaOnline = false;
        
        const statusIcon = document.getElementById("statusIcon");
        const statusText = document.getElementById("statusText");
        const finalizarBtn = document.getElementById("finalizar");

        if (statusIcon && statusText && finalizarBtn) {
            statusIcon.innerHTML = "🔴"; 
            statusText.innerHTML = "Erro ao carregar status"; 
            finalizarBtn.disabled = true; 
            finalizarBtn.title = "Erro ao obter status da loja"; 
        }
    }
}


// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", verificarStatusLoja);

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
