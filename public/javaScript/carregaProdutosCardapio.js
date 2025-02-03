async function carregaProdutosCardapio(categoria = '') {
    try {
        let url = `/api/produtos`;
        if (categoria) {
            url += `?categoria=${encodeURIComponent(categoria)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao carregar produtos.');
        }

        const data = await response.json();
        const produtoList = document.querySelector('.produtosCaradapio');
        produtoList.innerHTML = ''; // Limpa a lista de produtos

        data.forEach(produto => {
            const produtoItem = document.createElement('div');
            produtoItem.className = 'col-md-4 mb-4';
            produtoItem.innerHTML = `
                <article class="container card p-0 w-75">
                    <img src="${produto.fotoUrl}" class="card-img-top img-card" alt="...">
                    <div class="card-body">
                        <h5 class="nomeProduto card-title">${produto.nome}</h5>
                        <p class="descProduto card-text">${produto.descricao}</p>
                        <div class="flex">
                            <p>R$:</p>
                            <div><input value="${produto.preco.toFixed(2)}" class="preçoProduto" readonly></div>
                        </div>
                        <a data-bs-toggle="modal" id="comprarProduto${produto.id}" href="#exampleModalToggle"
                            class="botaoComprar btn">Comprar</a>
                    </div>
                </article>`;
            produtoList.appendChild(produtoItem);
        });

        // Adiciona eventos de clique para os botões "Comprar"
        document.querySelectorAll('[id^="comprarProduto"]').forEach((botao, index) => {
            botao.addEventListener("click", function () {
                const nome = document.querySelectorAll(".nomeProduto")[index].textContent;
                const desc = document.querySelectorAll(".descProduto")[index].textContent;
                const preco = document.querySelectorAll(".preçoProduto")[index].value;

                document.querySelector(".nomeProdutoModal").textContent = nome;
                document.querySelector(".descProdutoModal").textContent = desc;
                document.querySelector(".precoProdutoModal").value = preco;
                document.querySelector(".totalProdutoModal").value = preco;
                document.querySelector(".quantidade").value = 1;
            });
        });

    } catch (error) {
        console.error(error);
        alert('Erro ao carregar a lista de produtos.');
    }
}

document.addEventListener('DOMContentLoaded', () => carregaProdutosCardapio());
