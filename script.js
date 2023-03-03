// Passa os dados do card(produto) para o modal.
// Seleciona todos os botões de compra
const botoesCompra = document.querySelectorAll('[id^="comprarProduto"]');

// Itera sobre os botões e adiciona um manipulador de eventos a cada um
botoesCompra.forEach((botao, index) => {
  botao.addEventListener("click", function() {
    var nome = document.querySelectorAll(".nomeProduto")[index].textContent;
    var preco = document.querySelectorAll(".preçoProduto")[index].value;

    document.querySelector(".nomeProdutoModal").textContent = nome;
    document.querySelector(".precoProdutoModal").value = preco;
    document.querySelector(".totalProdutoModal").value = preco;
    document.querySelector(".quantidade").value = 1;
  });
});

// Pega o valor do produdo e faz multiplicação.
// seleciona os elementos HTML
const btnMais = document.querySelector('.mais');
const btnMenos = document.querySelector('.menos');
const inputQuantidade = document.querySelector('.quantidade');
const inputPreco = document.querySelector('.precoProdutoModal');
const inputTotal = document.querySelector('.totalProdutoModal');

// adiciona evento de clique no botão "mais"
btnMais.addEventListener('click', function() {
  // incrementa o valor da quantidade
  inputQuantidade.value++;

  // calcula o valor total e atualiza o campo
  const valorTotal = inputQuantidade.value * inputPreco.value;
  inputTotal.value = valorTotal.toFixed(2);
});

// adiciona evento de clique no botão "menos"
btnMenos.addEventListener('click', function() {
  // decrementa o valor da quantidade
  if (inputQuantidade.value > 1) {
    inputQuantidade.value--;
    
    // calcula o valor total e atualiza o campo
    const valorTotal = inputQuantidade.value * inputPreco.value;
    inputTotal.value = valorTotal.toFixed(2);
  }
});

  