const apiBaseUrl = "/api/produtoAdm"; // Base da API para os produtos

// 🔹 Carregar produtos
async function carregaProdutos() {
    const buscaNome = document.getElementById("buscaNome").value.toLowerCase();

    try {
        const response = await fetch(`${apiBaseUrl}/listar`);
        if (!response.ok) throw new Error("Erro ao buscar produtos!");

        const data = await response.json();
        const produtoList = document.querySelector(".row");
        produtoList.innerHTML = "";

        const produtosFiltrados = data.filter(produto =>
            produto.nome.toLowerCase().includes(buscaNome)
        );

        produtosFiltrados.forEach(produto => {
            const produtoItem = document.createElement("div");
            produtoItem.className = "col-md-4 mb-3";
            produtoItem.innerHTML = `
                <div class="card">
                    <div class="card-body p-0">
                        <h5 class="cor-fundo-btn card-title p-1">${produto.nome}</h5>
                        <div class="p-2">
                          <p class="card-text">${produto.descricao}</p>
                          <p class="card-text"><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
                          <p class="card-text"><strong>Categoria:</strong> ${produto.fkCategoria?.nome || "Sem categoria"}</p>
                          <button class="btn btn-danger me-2" onclick="excluirProduto('${produto.pkProduto}')">Excluir</button>
                          <button class="btn ${produto.ativo ? 'btn-warning' : 'btn-success'}" onclick="toggleAtivo('${produto.pkProduto}', ${produto.ativo})">
                            ${produto.ativo ? 'Inativar' : 'Ativar'}
                          </button>
                        </div>
                    </div>
                </div>
            `;
            produtoList.appendChild(produtoItem);
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert("Erro ao carregar produtos.");
    }
}

// 🔹 Excluir produto
async function excluirProduto(pkProduto) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
        const response = await fetch(`${apiBaseUrl}/excluir/${pkProduto}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erro ao excluir produto!");

        alert("Produto excluído com sucesso!");
        carregaProdutos();
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir o produto.");
    }
}

// 🔹 Ativar/Inativar produto
async function toggleAtivo(pkProduto, ativo) {
    try {
        const response = await fetch(`${apiBaseUrl}/toggleAtivo/${pkProduto}`, {
            method: "PATCH"
        });

        if (!response.ok) throw new Error("Erro ao alterar estado do produto!");

        alert(`Produto ${!ativo ? "ativado" : "inativado"} com sucesso!`);
        carregaProdutos();
    } catch (error) {
        console.error("Erro ao alterar estado do produto:", error);
        alert("Erro ao alterar o estado do produto.");
    }
}

// 🔹 Inicia carregamento dos produtos ao carregar a página
document.addEventListener("DOMContentLoaded", carregaProdutos);
document.getElementById("buscaNome").addEventListener("input", carregaProdutos);
