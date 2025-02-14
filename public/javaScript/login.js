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
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('role', data.role);
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
