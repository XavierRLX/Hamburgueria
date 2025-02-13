async function verificarSessao() {
    const response = await fetch('/api/auth/verificarSessao'); 
    const data = await response.json();
    
    
}
verificarSessao();
