document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");
    const sessionExpiration = localStorage.getItem("sessionExpiration");

    if (!userId || !sessionExpiration || Date.now() > sessionExpiration) {
        // Se não há usuário ou a sessão expirou, remove e redireciona
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("sessionExpiration");
        window.location.href = "/login";
    }
});
