const BACKEND_URL = "https://meu-backend.railway.app";  // 🔹 Substitua pelo seu domínio real


async function verificarSessao() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/verificarSessao`, {
            credentials: "include", // 🔹 Permite que cookies de sessão sejam enviados
        });

        const data = await response.json();

        if (!data.logado || !localStorage.getItem('userId') || localStorage.getItem('role') !== 'admin') {
            localStorage.clear();  // 🔹 Remove dados inválidos
            window.location.href = '/login';
        }
    } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        window.location.href = '/login';
    }
}

// 🚀 Executa a verificação ao carregar a página
verificarSessao();
