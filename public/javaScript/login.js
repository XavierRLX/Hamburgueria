document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");
    const sessionExpiration = localStorage.getItem("sessionExpiration");

    if (userId && sessionExpiration) {
        const now = Date.now();
        if (now < sessionExpiration) {
            window.location.href = "/admPedidos"; // Redireciona automaticamente
        } else {
            // Se a sessão expirou, remove do localStorage
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
            localStorage.removeItem("sessionExpiration");
        }
    }
});



document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const button = document.querySelector('button[type="submit"]');

    if (!email || !password) {
        alert("Preencha todos os campos!");
        return;
    }

    button.disabled = true;
    button.innerText = "Entrando...";

    try {
        const response = await fetch('/api/auth/loginAuth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
    
        const data = await response.json();
    
        if (response.ok) {
            // Salvar no LocalStorage com um tempo de expiração de 24 horas
            const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24h em milissegundos
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('role', data.role);
            localStorage.setItem('sessionExpiration', expirationTime);

            window.location.href = data.redirect;
        } else {
            alert(data.message || "Erro desconhecido");
        }
    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        alert("Erro ao conectar com o servidor.");
    } finally {
        button.disabled = false;
        button.innerText = "Entrar";
    }
});

