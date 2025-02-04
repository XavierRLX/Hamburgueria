async function verificarSessao() {
    const response = await fetch('/api/auth/verificarSessao'); 
    const data = await response.json();
    
    if (data.logado) {
        window.location.href = "/admPedidos"; // Redireciona se estiver logado
    }
}

verificarSessao();
