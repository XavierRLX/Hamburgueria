

async function carregaProdutosCardapio(categoria = '') {
    let url = '/api/produtosCardapio';

    if (categoria) {
        url += `?categoria=${encodeURIComponent(categoria)}`;
    }

    const response = await fetch(url, { method: 'GET' });

  if (response.ok) {
      const data = await response.json();
      const produtoList = document.querySelector('.produtosCaradapio');
      produtoList.innerHTML = ''; // Limpa a lista de produtos

      data.forEach(produto => {
          const produtoItem = document.createElement('div');
          produtoItem.className = 'col-md-4 mb-4'; // Ajustado para a classe de coluna correta
          produtoItem.innerHTML = `
          <article class="container card p-0 w-75">
              <img
                src="${produto.fotoUrl}"
                class="card-img-top img-card" alt="...">
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

      // Adiciona os eventos de clique para os botões "Comprar"
      const botoesCompra = document.querySelectorAll('[id^="comprarProduto"]');
      botoesCompra.forEach((botao, index) => {
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

  } else {
      const errorData = await response.json(); // Para obter informações mais detalhadas do erro
      alert('Erro ao carregar a lista de produtos: ' + errorData.message);
  }
}

document.addEventListener('DOMContentLoaded', () => carregaProdutosCardapio());
