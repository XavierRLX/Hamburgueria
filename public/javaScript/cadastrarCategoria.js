const supabaseUrl = 'https://uweicybzciidmyumejzm.supabase.co';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3ZWljeWJ6Y2lpZG15dW1lanptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MjYzOTgsImV4cCI6MjA0NTMwMjM5OH0.xxcr3nzb0_bHISQvlBwiV0kDSNOieQa6eem7hbLc8Zk';

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

    // Envia os dados ao Supabase
    const url = `${supabaseUrl}/rest/v1/categoria`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ nome: nomeCategoria, ativo: true }), // Inclui o nome e um campo ativo
    });

    if (response.ok) {
        alert('Categoria cadastrada com sucesso!'); // Mensagem de sucesso
        carregaCategoria();  // Recarrega a lista de categorias
        limparFormulario(); // Limpa o formulário
        listCategoria();
    } else {
        const data = await response.json();
        alert('Erro: ' + data.error); // Mensagem de erro
    }
});

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById("categoriaForm").reset();
}
