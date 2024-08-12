const supabaseUrl = 'https://xuanbixiwzjcyaynaatx.supabase.co';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1YW5iaXhpd3pqY3lheW5hYXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMzk1NzUsImV4cCI6MjAzODcxNTU3NX0.pKTm6WXH6waNUeSd5W6vvxlDVCxwQqrgkUCmmaeptWU';

document.getElementById('cadastrarProduto').addEventListener('click', async (event) => {
    event.preventDefault();

    // Captura o valor do campo de código de cadastro
    const senhaCadastro = document.getElementById('senhaCadastro').value;

    // Captura os dados do formulário
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const categoria = document.getElementById('categoria').value;

    // Verifica se o código está correto
    if (senhaCadastro !== '2000') {  // Comparação de string, senhaCadastro precisa ser igual a "2020"
        alert('Código incorreto. Tente novamente.');
        return;  // Se o código estiver errado, a função para por aqui
    }

    // Verifica se todos os campos foram preenchidos corretamente
    if (!nome || !descricao || isNaN(preco) || !categoria) {
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
        body: JSON.stringify({ nome, descricao, preco, categoria }),
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
  