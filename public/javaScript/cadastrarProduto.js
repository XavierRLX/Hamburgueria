async function listCategoria() {
    try {
        const response = await fetch("/api/produtoAdm/categoria/listar", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Erro ao carregar a lista de categorias");
        }

        const categorias = await response.json();
        const listaCategoria = document.getElementById("categoria");

        listaCategoria.innerHTML = '<option selected>Escolha uma categoria</option>';

        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.pkCategoria;
            option.textContent = categoria.nome;
            listaCategoria.appendChild(option);
        });
    } catch (error) {
        console.error(error.message);
    }
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", listCategoria);

async function uploadImagem(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/api/produtoAdm/upload/imagem", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Erro ao fazer upload da imagem");
        }

        const data = await response.json();
        return data.url; // Retorna a URL da imagem no Supabase
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

document.getElementById("cadastrarProduto").addEventListener("click", async (event) => {
    event.preventDefault();

    const senhaCadastro = document.getElementById("senhaCadastro").value;
    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const fkCategoria = document.getElementById("categoria").value;
    const imagemFile = document.getElementById("imagemProduto").files[0];

    if (senhaCadastro !== "2000") {
        alert("Código incorreto. Tente novamente.");
        return;
    }

    if (!nome || !descricao || isNaN(preco) || !fkCategoria || !imagemFile) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    try {
        // Faz o upload da imagem e obtém a URL
        const fotoUrl = await uploadImagem(imagemFile);

        // Envia os dados do produto para a API
        const response = await fetch("/api/produtoAdm/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, descricao, preco, fkCategoria, fotoUrl, senhaCadastro }),
        });

        if (response.ok) {
            alert("Produto cadastrado com sucesso!");
            listCategoria(); // Recarrega a lista de categorias
            limparFormulario(); // Limpa o formulário
            carregaProdutos()
        } else {
            const data = await response.json();
            alert("Erro: " + data.erro);
        }
    } catch (error) {
        alert("Erro ao cadastrar o produto: " + error.message);
    }
});

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById("produtoForm").reset();
}
