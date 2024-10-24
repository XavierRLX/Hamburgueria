
const supabaseUrl = 'https://uweicybzciidmyumejzm.supabase.co';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3ZWljeWJ6Y2lpZG15dW1lanptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MjYzOTgsImV4cCI6MjA0NTMwMjM5OH0.xxcr3nzb0_bHISQvlBwiV0kDSNOieQa6eem7hbLc8Zk';

//Carrega a lista de categorias da pagina Adm

document.getElementById('cadastrarCat').addEventListener('click', async (event) => {
    event.preventDefault();

    // Captura o valor do campo de código de cadastro
    const senhaCadastro = document.getElementById('senhaCadastroCat').value;

    // Captura os dados do formulário
    const pkCategoria = document.getElementById('descricaoCat').value;

    // Verifica se o código está correto
    if (senhaCadastro !== '2000') {  // Comparação de string, senhaCadastro precisa ser igual a "2020"
        alert('Código incorreto. Tente novamente.');
        return;  // Se o código estiver errado, a função para por aqui
    }

    // Verifica se todos os campos foram preenchidos corretamente
    if (!pkCategoria) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    // Envia os dados ao Supabase
    const url = `${supabaseUrl}/rest/v1/categoria`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ pkCategoria }),
    });

    if (response.ok) {
        alert('Produto cadastrado com sucesso!');
        carregaProdutos();
        carregaCategoria();  // Recarrega a lista de produtos
        limparFormulario(); // Limpa o formulário
    } else {
        const data = await response.json();
        alert('Erro: ' + data.error);
    }
});

// Função para limpar o formulário

function limparFormulario() {
    document.getElementById("categoriaForm").reset();
  }
  