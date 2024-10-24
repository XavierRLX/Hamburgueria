
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
            categoriaItem.className = 'mb-3';
            categoriaItem.innerHTML = `
                <div class="card ">
                    <div class="card-body p-0">
                        <div class="p-2 d-flex justify-content-between">
                          <p class="card-text">${categoria.nome}</p>
                          <button class="btn btn-danger me-2" onclick="excluirCategoria('${categoria.pkCategoria}')">Excluir</button>
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
async function excluirCategoria(pkCategoria) {
    const url = `${supabaseUrl}/rest/v1/categoria?pkCategoria=eq.${pkCategoria}`;
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

