

// Passa os dados do card(produto) para o modal.
// Seleciona todos os botões de compra
const botoesCompra = document.querySelectorAll('[id^="comprarProduto"]');

// Itera sobre os botões e adiciona um manipulador de eventos a cada um
botoesCompra.forEach((botao, index) => {
  botao.addEventListener("click", function () {
    // Obtém os valores dos campos do produto correspondente ao botão de compra clicado
    var nome = document.querySelectorAll(".nomeProduto")[index].textContent;
    var desc = document.querySelectorAll(".descProduto")[index].textContent;
    var preco = document.querySelectorAll(".preçoProduto")[index].value;

    // Define os valores dos campos do modal com os valores do produto correspondente
    document.querySelector(".nomeProdutoModal").textContent = nome;
    document.querySelector(".descProdutoModal").textContent = desc;
    document.querySelector(".precoProdutoModal").value = preco;
    document.querySelector(".totalProdutoModal").value = preco;
    document.querySelector(".quantidade").value = 1;
  });
});

// Pega o valor do produto e faz multiplicação.
// seleciona os elementos HTML
const btnMais = document.querySelector('.mais');
const btnMenos = document.querySelector('.menos');
const inputQuantidade = document.querySelector('.quantidade');
const inputPreco = document.querySelector('.precoProdutoModal');
const inputTotal = document.querySelector('.totalProdutoModal');

// adiciona evento de clique no botão "mais"
btnMais.addEventListener('click', function () {
  // incrementa o valor da quantidade
  inputQuantidade.value++;

  // calcula o valor total e atualiza o campo
  const valorTotal = inputQuantidade.value * inputPreco.value;
  inputTotal.value = valorTotal.toFixed(2);
});

// adiciona evento de clique no botão "menos"
btnMenos.addEventListener('click', function () {
  // decrementa o valor da quantidade, mas não permite que seja menor que 1
  if (inputQuantidade.value > 1) {
    inputQuantidade.value--;

    // calcula o valor total e atualiza o campo
    const valorTotal = inputQuantidade.value * inputPreco.value;
    inputTotal.value = valorTotal.toFixed(2);
  }
});

// seleciona o botão "Adicionar ao carrinho"
const btnAdicionar = document.querySelector(".btn-adc-carrinho");

// Seleciona os botões de abrir e fechar carrinho, a lista de produtos e o campo de total do carrinho
const btnAbrirCarrinho = document.querySelector("#btn-abrir-carrinho");
const btnFecharCarrinho = document.querySelector("#btn-fechar-carrinho");
const listaProdutos = document.querySelector("#lista-produtos");
const totalCarrinho = document.querySelector("#total-carrinho");

// Obtém os produtos do LocalStorage ou cria uma lista vazia
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

// adiciona evento de clique no botão "Adicionar ao carrinho"
btnAdicionar.addEventListener("click", function () {
  // Cria um objeto produto com o nome, preço e quantidade selecionados no modal
  const nomeProduto = document.querySelector(".nomeProdutoModal").textContent;
  const precoProduto = parseFloat(document.querySelector(".totalProdutoModal").value);
  const quantidadeProduto = document.querySelector(".quantidade").value;
 

  const produto = {
    nome: nomeProduto,
    preco: precoProduto,
    quantidade: quantidadeProduto
  };

  produtos.push(produto);
  console.log(nomeProduto, precoProduto, quantidadeProduto)

});

// Validação do checkbox da entrega
  const checkboxEntrega = document.querySelector('#entrega');
  const campoEndereco = document.querySelector('#endereco');

  checkboxEntrega.addEventListener('change', function () {
    if (this.checked) {
      campoEndereco.style.display = 'block';
    } else {
      campoEndereco.style.display = 'none';
    }
  });


// Validação pagamento em dinheiro
const pagamentoSelect = document.getElementById('pagamento');
const pagamentoDinheiroDiv = document.getElementById('PagamentoDinheiro');

pagamentoSelect.addEventListener('change', function() {
  if (this.value === 'dinheiro') {
    pagamentoDinheiroDiv.style.display = 'block';
  } else {
    pagamentoDinheiroDiv.style.display = 'none';
  }
});
