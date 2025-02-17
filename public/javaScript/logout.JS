document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                const response = await fetch('/api/auth/logout');
                const data = await response.json();

                if (response.ok) {
                    // Remover dados do LocalStorage
                    localStorage.removeItem("userId");
                    localStorage.removeItem("role");
                    localStorage.removeItem("sessionExpiration");

                    // Redirecionar para a página de login
                    window.location.href = "/login";
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Erro ao fazer logout:", error);
                alert("Erro ao sair da conta.");
            }
        });
    }
});
