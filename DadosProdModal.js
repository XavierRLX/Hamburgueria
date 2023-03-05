// Passa os dados do card(produto) para o modal.
// Seleciona todos os botões de compra
const botoesCompra = document.querySelectorAll('[id^="comprarProduto"]');

// Itera sobre os botões e adiciona um manipulador de eventos a cada um
botoesCompra.forEach((botao, index) => {
  botao.addEventListener("click", function() {
    var nome = document.querySelectorAll(".nomeProduto")[index].textContent;
    var desc = document.querySelectorAll(".descProduto")[index].textContent;
    var preco = document.querySelectorAll(".preçoProduto")[index].value;

    document.querySelector(".nomeProdutoModal").textContent = nome;
    document.querySelector(".descProdutoModal").textContent = desc;
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

// selecione o botão "Adicionar ao carrinho"
const btnAdicionar = document.querySelector(".btn-adc-carrinho");


const btnAbrirCarrinho = document.querySelector("#btn-abrir-carrinho");
const btnFecharCarrinho = document.querySelector("#btn-fechar-carrinho");
const listaProdutos = document.querySelector("#lista-produtos");
const totalCarrinho = document.querySelector("#total-carrinho");

let carrinho = [];

let produtos = [];

btnAdicionar.addEventListener("click", function() {
  const nomeProduto = document.querySelector(".nomeProdutoModal").textContent;
  const precoProduto = parseFloat(document.querySelector(".totalProdutoModal").value);

  const produto = {
    nome: nomeProduto,
    preco: precoProduto
  };

  produtos.push(produto);
  exibirCarrinho();
});

function exibirCarrinho() {
  listaProdutos.innerHTML = "";
  let total = 0;

  produtos.forEach(function(produto, index) {
    const itemLista = document.createElement("li");
    const nomeProdutoSpan = document.createElement("span");
    nomeProdutoSpan.textContent = produto.nome;
    const precoProdutoSpan = document.createElement("span");
    precoProdutoSpan.textContent = "R$ " + produto.preco.toFixed(2);
    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "X";
    botaoExcluir.addEventListener("click", function() {
      produtos.splice(index, 1);
      exibirCarrinho();
    });
    itemLista.appendChild(nomeProdutoSpan);
    itemLista.appendChild(precoProdutoSpan);
    itemLista.appendChild(botaoExcluir);
    listaProdutos.appendChild(itemLista);

    total += produto.preco;
  });

  totalCarrinho.textContent = total.toFixed(2);



  document.querySelector("#modal-carrinho").style.display = "block";
}

const AbrirCarrinhoFlut = document.querySelector(".carrinho-compras");
AbrirCarrinhoFlut.addEventListener("click", function () {
  const tituloCar = document.querySelector("#lista-produtos");
  const titloCarVazio = document.getElementById("tituloCarrinhoVazio");
  if (tituloCar.textContent.trim() === "") {
    console.log("O parágrafo está vazio");
  } else {
    titloCarVazio.style.display = "none";
  }
});


