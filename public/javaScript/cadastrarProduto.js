async function listCategoria() {
    const url = `${supabaseUrl}/rest/v1/categoria?select=pkCategoria,nome`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
                'Authorization': `Bearer ${apiKey}` // Se o seu Supabase exige autenticação
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar a lista de categorias');
        }

        const categorias = await response.json();
        const listaCategoria = document.getElementById('categoria');

        // Limpa as opções anteriores (se houver)
        listaCategoria.innerHTML = '<option selected>Escolha uma categoria</option>';

        // Adiciona as novas opções
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.pkCategoria; // Agora armazenando o ID da categoria
            option.textContent = categoria.nome;
            listaCategoria.appendChild(option);
        });
    } catch (error) {
        console.error(error.message);
    }
}

// Chama a função para carregar as categorias quando a página carrega
document.addEventListener('DOMContentLoaded', listCategoria);



document.getElementById('cadastrarProduto').addEventListener('click', async (event) => {
    event.preventDefault();

    // Captura o valor do campo de código de cadastro
    const senhaCadastro = document.getElementById('senhaCadastro').value;

    // Captura os dados do formulário
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const fkCategoria = document.getElementById('categoria').value; // Agora captura o pkCategoria

    // Verifica se o código está correto
    if (senhaCadastro !== '2000') {
        alert('Código incorreto. Tente novamente.');
        return;
    }

    // Verifica se todos os campos foram preenchidos corretamente
    if (!nome || !descricao || isNaN(preco) || !fkCategoria) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    // Envia os dados ao Supabase
    const url = `${supabaseUrl}/rest/v1/produtos`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ nome, descricao, preco, fkCategoria }), // Agora fkCategoria é o ID da categoria
    });

    if (response.ok) {
        alert('Produto cadastrado com sucesso!');
        carregaProdutos();  // Recarrega a lista de produtos
        limparFormulario(); // Limpa o formulário
    } else {
        const data = await response.json();
        alert('Erro: ' + data.error);
    }
});


// Função para limpar o formulário

function limparFormulario() {
    document.getElementById("produtoForm").reset();
  }
  