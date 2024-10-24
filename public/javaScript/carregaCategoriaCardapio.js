
async function carregaCategoriaCardapio() {
    const url = `${supabaseUrl}/rest/v1/categoria?select=*`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        },
    });

    if (response.ok) {
        const data = await response.json();
        const categoriaList = document.querySelector('.catItensCard');
        categoriaList.innerHTML = ''; // Limpa a lista de categorias

        data.forEach(categoria => {
            const categoriaItem = document.createElement('div');
            categoriaItem.innerHTML = `<p class="opc-item">${categoria.nome}</p>`;
            categoriaItem.addEventListener('click', () => {
                carregaProdutosCardapio(categoria.pkCategoria); // Ajustado para usar pkCategoria
            });
            categoriaList.appendChild(categoriaItem);
        });
    } else {
        const errorData = await response.json(); // Para exibir informações detalhadas do erro
        alert('Erro ao carregar a lista de categorias: ' + errorData.message);
    }
}

document.addEventListener('DOMContentLoaded', carregaCategoriaCardapio);
