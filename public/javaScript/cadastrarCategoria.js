// Carrega a lista de categorias da página Adm
document.getElementById('cadastrarCat').addEventListener('click', async (event) => {
    event.preventDefault();

    // Captura o valor do campo de código de cadastro
    const senhaCadastro = document.getElementById('senhaCadastroCat').value;

    // Captura os dados do formulário
    const nomeCategoria = document.getElementById('descricaoCat').value; // Alterado para capturar o nome da categoria

    // Verifica se o código está correto
    if (senhaCadastro !== '2000') {
        alert('Código incorreto. Tente novamente.');
        return;  // Se o código estiver errado, a função para por aqui
    }

    // Verifica se todos os campos foram preenchidos corretamente
    if (!nomeCategoria) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    // Envia os dados ao backend (Express)
    const url = "/api/produtoAdm/categoria/cadastrar"; // Chama a rota de cadastro
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: nomeCategoria, senhaCadastro: senhaCadastro }), // Envia nome e senhaCadastro
    });

    if (response.ok) {
        alert('Categoria cadastrada com sucesso!'); // Mensagem de sucesso
        carregaCategoria();  // Recarrega a lista de categorias
        limparFormulario(); // Limpa o formulário
        listCategoria();
    } else {
        const data = await response.json();
        alert('Erro: ' + data.erro); // Mensagem de erro
    }
});

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById("categoriaForm").reset();
}
