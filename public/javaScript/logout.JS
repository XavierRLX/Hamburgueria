document.getElementById('logoutBtn').addEventListener('click', () => {
    fetch('/logout', { method: 'GET' })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(error => console.error('Erro ao fazer logout:', error));
});
