async function carregaCategoriaCardapio() {
    // Busca todos os produtos
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
        const categoriaList = document.querySelector('.catItensCard'); // Seleciona a div com classe 'row'
        categoriaList.innerHTML = ''; // Limpa a lista de produtos

        data.forEach(categoria => {
            const categoriaItem = document.createElement('div');
            categoriaItem.innerHTML = `
                          <p class="opc-item border">${categoria.descricao} </p>`;
            categoriaList.appendChild(categoriaItem);
        });
    } else {
        alert('Erro ao carregar a lista de categoria');
    }
}

document.addEventListener('DOMContentLoaded', carregaCategoriaCardapio);