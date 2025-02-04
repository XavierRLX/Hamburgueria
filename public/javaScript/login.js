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
        const response = await fetch('api/auth/loginAuth', {  // Melhor usar caminho relativo
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = data.redirect;
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor.");
    } finally {
        button.disabled = false;
        button.innerText = "Entrar";
    }
});
