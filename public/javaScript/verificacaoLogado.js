document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/auth/session', { 
            credentials: 'include'  
        });

        const data = await response.json();

        if (data.authenticated) {
            return;  
        }

        window.location.href = "/login"; 
    } catch (error) {
        console.error("Erro ao verificar sessão:", error.message);
        window.location.href = "/login"; 
    }
});
