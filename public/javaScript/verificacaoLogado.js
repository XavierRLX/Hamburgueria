document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/auth/session', { 
            credentials: 'include'  // 🔥 Garante que o cookie de sessão seja enviado
        });

        const data = await response.json();

        if (data.authenticated) {
            console.log("✅ Sessão ativa, carregando painel administrativo.");
            return;  // Se autenticado, não faz nada
        }

        console.log("🔴 Sessão expirada ou inexistente. Redirecionando...");
        window.location.href = "/login"; // Se não autenticado, vai para login
    } catch (error) {
        console.error("Erro ao verificar sessão:", error.message);
        window.location.href = "/login"; // Evita travamento
    }
});
