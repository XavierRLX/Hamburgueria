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
        const statusLoja = data.length > 0 ? data[0].online : false;
        
        const statusIcon = document.getElementById("statusIcon");
        const statusText = document.getElementById("statusText");

        if (statusLoja) {
            statusIcon.innerHTML = "🟢"; // Ícone verde piscando
            statusText.innerHTML = "Loja Online"; // Texto fixo
        } else {
            statusIcon.innerHTML = "🔴"; // Ícone vermelho piscando
            statusText.innerHTML = "Loja Offline"; // Texto fixo
        }
    } else {
        console.error("Erro ao buscar status da loja.");
    }
}

// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", verificarStatusLoja);

// Atualizar o status da loja a cada 5 minutos (300.000ms)
setInterval(verificarStatusLoja, 10000);

