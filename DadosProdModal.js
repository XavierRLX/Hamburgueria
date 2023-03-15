// colocar o input da seleceção pagamendo como nenhum selecionado
// atualizar o totalPedido quando colocar o total



// Atualiza o LocalStorage assim que a pag é carregada.
window.addEventListener("load", function () {
  exibirCarrinho();
});



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
  exibirCarrinho();

});

function exibirCarrinho() {
  listaProdutos.innerHTML = "";  // Limpa a lista de produtos
  let total = 0;
  let taxas = 0; 
  let totalPedido = document.getElementById("total-pedido");

  produtos.forEach(function (produto, index) { // Itera pelos produtos e cria elementos HTML para cada um deles
    const itemLista = document.createElement("li");

    const nomeProdutoSpan = document.createElement("span");
    nomeProdutoSpan.textContent = produto.nome;

    const quantidadeProdutoSpan = document.createElement("span");
    quantidadeProdutoSpan.textContent = " " + produto.quantidade + "x";

    const precoProdutoSpan = document.createElement("span");
    precoProdutoSpan.textContent = "  R$: " + produto.preco;

    const botaoExcluir = document.createElement("button");  // Cria um botão para excluir o produto da lista
    botaoExcluir.textContent = "";  // Define o texto do botão como vazio
    botaoExcluir.classList.add("botao-excluir");  // Adiciona uma classe CSS ao botão
    document.body.appendChild(botaoExcluir);    // Adiciona o botão ao DOM
    botaoExcluir.addEventListener("click", function () {  // Adiciona um event listener ao botão que remove o produto da lista quando clicado
      totalPedido = taxas + total;
      document.getElementById("total-pedido").value = totalPedido.toFixed(2); produtos.splice(index, 1);  // Remove o produto da lista de produtos
      localStorage.setItem("produtos", JSON.stringify(produtos)); // Atualiza o localStorage com a nova lista de produtos
      exibirCarrinho();  // Chama a função exibirCarrinho() novamente para atualizar a lista de produtos exibidos
    });
    itemLista.appendChild(nomeProdutoSpan);  // Adiciona o nome do produto ao item da lista
    itemLista.appendChild(quantidadeProdutoSpan);  // Adiciona a quantidade do produto ao item da lista
    itemLista.appendChild(precoProdutoSpan);  // Adiciona o preço do produto ao item da lista
    itemLista.appendChild(botaoExcluir);  // Adiciona o botão de excluir ao item da lista
    listaProdutos.appendChild(itemLista);  // Adiciona o item da lista à lista de produtos exibidos na tela

    total += produto.preco;  // Soma o preço do produto ao total da compra
    totalPedido = taxas + total;
    document.getElementById("total-pedido").value = totalPedido.toFixed(2);

  });

  const entregaInput = document.getElementById('entrega');
  const taxasCarrinho = document.getElementById('taxas-carrinho');
  // Adiciona um listener para detectar mudanças no estado do input "entrega"
  entregaInput.addEventListener('change', () => {
    if (entregaInput.checked) {
      // Adiciona R$ 5 ao valor total da compra
      taxas += 5;
    } else {
      // Remove R$ 5 do valor total da compra
      taxas -= 5;
    }
    taxasCarrinho.value = taxas.toFixed(2);
    totalPedido = taxas + total;
    document.getElementById("total-pedido").value = totalPedido.toFixed(2);
  });


  // Contador de produtos do icone.
  const carrinhoCount = document.querySelector("#carrinho-count");  // Seleciona o elemento HTML que exibe o número de produtos no carrinho
  carrinhoCount.textContent = produtos.reduce((total, produto) => total + parseInt(produto.quantidade), 0); // Soma a quantidade de cada produto no carrinho e exibe o resultado no elemento selecionado acima



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
let taxaCartaoCredito = 1;
let adicionouTaxa = false;

pagamentoSelect.addEventListener('change', function() {
  if (this.value === 'dinheiro') {
    pagamentoDinheiroDiv.style.display = 'block';
  } else {
    pagamentoDinheiroDiv.style.display = 'none';
  }
  
  if (this.value === 'cartao_credito' && !adicionouTaxa) {
    taxas += taxaCartaoCredito;
    adicionouTaxa = true;
  } else if (this.value !== 'cartao_credito' && adicionouTaxa) {
    taxas -= taxaCartaoCredito;
    adicionouTaxa = false;
  }
  taxasCarrinho.value = taxas.toFixed(2);
  totalPedido = taxas + total;
  document.getElementById("total-pedido").value = totalPedido.toFixed(2);
});

totalCarrinho.value = total.toFixed(2);  // Exibe o total da compra na tela com duas casas decimais

// Faz a verifição se o carrinho está vázio.
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

console.log(totalPedido);

//
  localStorage.setItem("produtos", JSON.stringify(produtos));  // Atualiza o localStorage com a nova lista de produtos

  document.querySelector("#modal-carrinho").style.display = "block";  // Exibe o modal do carrinho na tela

  const btnFinalizar = document.querySelector("#finalizar"); // Seleciona o botão "Finalizar"

  btnFinalizar.addEventListener("click", function () {

    totalPedido = taxas + total;
    document.getElementById("total-pedido").value = totalPedido.toFixed(2);

    let mensagem = "Produtos adicionados:\n";

    produtos.forEach(function (produto) {
      mensagem += `- ${produto.nome} (${produto.quantidade}x) - R$: ${produto.preco.toFixed(2)}\n`;
    });

    mensagem += `\nTotal da compra: R$ ${total.toFixed(2)}`;

    // Substitua o número abaixo pelo seu número de WhatsApp, incluindo o código do país e da área
    const numero = "+5521964734161";

    // Substitua a mensagem abaixo pela mensagem que você deseja enviar para o WhatsApp
    const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagem)}`;

    // Abre a URL do WhatsApp em uma nova aba
    window.open(url, "_blank");
  });

}