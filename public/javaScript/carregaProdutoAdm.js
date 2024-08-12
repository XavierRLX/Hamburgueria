async function carregaProdutos() {
    const url = `${supabaseUrl}/rest/v1/produtos?select=*`;
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
        const produtoList = document.querySelector('.row'); // Seleciona a div com classe 'row'
        produtoList.innerHTML = ''; // Limpa a lista de produtos

        data.forEach(produto => {
            const produtoItem = document.createElement('div');
            produtoItem.className = 'col-md-4 mb-3';
            produtoItem.innerHTML = `
                <div class="card">
                    <div class="card-body p-0">
                        <h5 class="cor-fundo-btn card-title p-1">${produto.nome}</h5>
                        <div class="p-2">
                          <p class="card-text">${produto.descricao}</p>
                          <p class="card-text"><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
                          <p class="card-text"><strong>Categoria:</strong> ${produto.categoria}</p>
                          <button class="btn btn-danger me-2" onclick="excluirProduto('${produto.id}')">Excluir</button>
                          <button class="btn ${produto.ativo ? 'btn-warning' : 'btn-success'}" onclick="toggleAtivo('${produto.id}', ${produto.ativo})">
                            ${produto.ativo ? 'Inativar' : 'Ativar'}
                          </button>
                        </div>
                    </div>
                </div>
            `;
            produtoList.appendChild(produtoItem);
        });
    } else {
        alert('Erro ao carregar a lista de produtos');
    }
}
async function excluirProduto(id) {
    const url = `${supabaseUrl}/rest/v1/produtos?id=eq.${id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        },
    });

    if (response.ok) {
        alert('Produto excluído com sucesso!');
        carregaProdutos(); // Recarrega a lista de produtos
    } else {
        alert('Erro ao excluir o produto');
    }
}

async function toggleAtivo(id, ativo) {
    const url = `${supabaseUrl}/rest/v1/produtos?id=eq.${id}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ ativo: !ativo })
    });

    if (response.ok) {
        alert(`Produto ${!ativo ? 'ativado' : 'inativado'} com sucesso!`);
        carregaProdutos(); // Recarrega a lista de produtos
    } else {
        alert('Erro ao alterar o estado do produto');
    }
}

document.addEventListener('DOMContentLoaded', carregaProdutos);

