document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o recarregamento da página

    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    if (!email || !password) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = data.redirect;
        } else {
            alert(data.message || "Erro ao fazer login");
        }
    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        alert("Erro ao conectar com o servidor.");
    }
});
