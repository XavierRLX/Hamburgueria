async function carregaCategoria() {
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
        const categoriaList = document.querySelector('.rowCat'); // Seleciona a div com classe 'row'
        categoriaList.innerHTML = ''; // Limpa a lista de produtos


        data.forEach(categoria => {
            const categoriaItem = document.createElement('div');
            categoriaItem.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-2';
            categoriaItem.innerHTML = `
                <div class="card">
                    <div class="card-body p-0">
                        <div class="p-2">
                          <p class="card-text">${categoria.descricao}</p>
                          <button class="btn btn-danger me-2" onclick="excluirCategoria('${categoria.id}')">Excluir</button>
                        </div>
                    </div>
                </div>
            `;
            categoriaList.appendChild(categoriaItem);
        });
    } else {
        alert('Erro ao carregar a lista de categoria');
    }
}


//apagar produto
async function excluirCategoria(id) {
    const url = `${supabaseUrl}/rest/v1/categoria?id=eq.${id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        },
    });

    if (response.ok) {
        alert('Categoria excluído com sucesso!');
        carregaProdutos();
        carregaCategoria(); // Recarrega a lista de categoria
    } else {
        alert('Erro ao excluir a categoria');
    }
}


document.addEventListener('DOMContentLoaded', carregaCategoria);

