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

// Função para fazer o upload da imagem ao Supabase Storage
async function uploadImagem(file) {
    const allowedTypes = ['image/jpeg', 'image/png']; // Tipos MIME permitidos
    const maxSize = 5 * 1024 * 1024; // Limite de 5MB (em bytes)

    // Verificar o tipo de arquivo
    if (!allowedTypes.includes(file.type)) {
        alert('Por favor, envie uma imagem no formato JPG ou PNG.');
        return; // Não continua com o upload se o formato não for aceito
    }

    // Verificar o tamanho do arquivo
    if (file.size > maxSize) {
        alert('O arquivo é muito grande. O tamanho máximo permitido é 5MB.');
        return; // Não continua com o upload se o tamanho for maior que 5MB
    }

    const bucketName = "imgs"; // Nome do bucket
    const fileName = `${Date.now()}-${file.name}`; // Nome único para o arquivo
    const filePath = `${fileName}`; // Caminho dentro do bucket (apenas o nome do arquivo)

    try {
        const url = `${supabaseUrl}/storage/v1/object/${bucketName}/${filePath}`; // URL corrigida
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'apikey': apiKey,
                'Content-Type': file.type // Tipo do arquivo
            },
            body: file // O arquivo é enviado diretamente no corpo
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro no Supabase:", errorData);
            throw new Error('Erro ao fazer upload da imagem');
        }

        // Retorna a URL pública da imagem
        return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}



// Atualiza o evento de cadastro para incluir o upload da imagem
document.getElementById('cadastrarProduto').addEventListener('click', async (event) => {
    event.preventDefault();

    const senhaCadastro = document.getElementById('senhaCadastro').value;
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const fkCategoria = document.getElementById('categoria').value;
    const imagemFile = document.getElementById('imagemProduto').files[0];

    if (senhaCadastro !== '2000') {
        alert('Código incorreto. Tente novamente.');
        return;
    }

    if (!nome || !descricao || isNaN(preco) || !fkCategoria || !imagemFile) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    try {
        // Faz o upload da imagem e obtém a URL
        const fotoUrl = await uploadImagem(imagemFile);

        // Envia os dados ao Supabase
        const url = `${supabaseUrl}/rest/v1/produtos`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ nome, descricao, preco, fotoUrl, fkCategoria }),
        });

        if (response.ok) {
            alert('Produto cadastrado com sucesso!');
            carregaProdutos(); // Recarrega a lista de produtos
            limparFormulario(); // Limpa o formulário
        } else {
            const data = await response.json();
            alert('Erro: ' + data.error);
        }
    } catch (error) {
        alert('Erro ao cadastrar o produto: ' + error.message);
    }
});



// Função para limpar o formulário

function limparFormulario() {
    document.getElementById("produtoForm").reset();
  }
  