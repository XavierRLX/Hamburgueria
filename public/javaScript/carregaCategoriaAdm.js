async function carregaCategoria() {
    const url = "/api/categoriaAdm/listar";
    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
        const data = await response.json();
        const categoriaList = document.querySelector(".rowCat");
        categoriaList.innerHTML = ""; // Limpa a lista

        data.forEach(categoria => {
            const categoriaItem = document.createElement("div");
            categoriaItem.className = "mb-3";
            categoriaItem.innerHTML = `
                <div class="card">
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
        alert("Erro ao carregar a lista de categorias");
    }
}

async function excluirCategoria(pkCategoria) {
    const url = `/api/categoriaAdm/categoria/excluir/${pkCategoria}`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
        alert("Categoria excluída com sucesso!");
        carregaCategoria(); // Atualiza a lista
        listCategoria()
    } else {
        alert("Erro ao excluir a categoria");
    }
}

// Carregar as categorias ao abrir a página
document.addEventListener("DOMContentLoaded", carregaCategoria);
