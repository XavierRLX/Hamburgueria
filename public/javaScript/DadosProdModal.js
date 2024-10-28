
// Pega o valor do produto e faz multiplicação.

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

// Validação do checkbox da entrega
  const checkboxEntrega = document.querySelector('#entrega');
  const campoEndereco = document.querySelector('#endereco');
  const CampoMesa = document.querySelector("#Nmesa");
  const CampoMesaText = document.querySelector("mesa");

  checkboxEntrega.addEventListener('change', function () {
    if (this.checked) {
      campoEndereco.style.display = 'block';
      CampoMesa.style.display = 'none' ;
      CampoMesaText.value = '' ;
      
    } else {
      campoEndereco.style.display = 'none';
      CampoMesa.style.display = 'inline';
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


// Criando a lista de produtos do carrinho
let precoTotalProdutos = 0;
let SomaItens = 0;

const meuCarrinho = document.querySelector('.meu-carrinho');
const btnAdicionar = document.querySelector('.btn-adc-carrinho');

const precoTotalElement = document.querySelector('#total-carrinho');
const ResultadoItens = document.querySelector('#carrinho-count')

function atualizaPrecoTotalProdutos() {
  precoTotalProdutos = 0;
  const produtos = document.querySelectorAll('.produtos');
  produtos.forEach((produto) => {
    const totalProduto = parseFloat(produto.querySelector('#precoTotalQuantidade').value);
    if(!isNaN(totalProduto)) {
    precoTotalProdutos += totalProduto;
    }
  });
  precoTotalElement.value = precoTotalProdutos.toFixed(2);
  carrinhoVazio();
}

 function somaritens(){
   SomaItens = 0 
   const produtos = document.querySelectorAll('.produtos');
   produtos.forEach((produto) => {
     const TotalItens = parseFloat(produto.querySelector('#quantidadeCarrinho').value);
     if(!isNaN(TotalItens)) {
       SomaItens += TotalItens;
     }
   });
   ResultadoItens.value = SomaItens;
  }

btnAdicionar.addEventListener('click', function() {
  const nomeProduto = document.querySelector('.nomeProdutoModal').textContent;
  const quantidade = document.querySelector('.quantidade').value;
  const total = document.querySelector('.totalProdutoModal').value;

  const divProduto = document.createElement('div');
  divProduto.classList.add('produtos');

  const inputNomeProduto = document.createElement('input');
  inputNomeProduto.type = 'text';
  inputNomeProduto.value = nomeProduto;
  inputNomeProduto.readOnly = true;
  inputNomeProduto.id = 'nomeProdutoCarrinho';

  const divQuantidade = document.createElement('div');
  divQuantidade.classList.add('flex');
  
  const inputQuantidade = document.createElement('input');
  inputQuantidade.type = 'number';
  inputQuantidade.value = quantidade;
  inputQuantidade.readOnly = true;
  inputQuantidade.id = 'quantidadeCarrinho';

  const textX = document.createElement('input');
  textX.type = 'text';
  textX.value = 'X';

  const divTotal = document.createElement('div');
  const inputTotalLabel = document.createElement('input');
  inputTotalLabel.type = 'text';
  inputTotalLabel.value = 'R$:';
  const inputTotal = document.createElement('input');
  inputTotal.type = 'number';
  inputTotal.value = total;
  inputTotal.readOnly = true;
  inputTotal.id = 'precoTotalQuantidade';

  const imgLixeira = document.createElement('img');
  imgLixeira.src = 'projeto-base/src/img/lixeira.png';
  imgLixeira.alt = '';
  imgLixeira.id = 'imgLix';

  divProduto.appendChild(inputNomeProduto);
  divQuantidade.appendChild(inputQuantidade);
  divQuantidade.appendChild(textX);
  divTotal.appendChild(inputTotalLabel);
  divTotal.appendChild(inputTotal);
  divProduto.appendChild(divQuantidade);
  divProduto.appendChild(divTotal);
  divProduto.appendChild(imgLixeira);
  meuCarrinho.appendChild(divProduto);


  atualizaPrecoTotalProdutos();
  atualizarTotalGeral();
  somaritens();
  carrinhoVazio();

  console.log(precoTotalProdutos, SomaItens);

});

meuCarrinho.addEventListener('click', function(event) {
  if (event.target.id === 'imgLix') {
    event.target.parentElement.remove();
    atualizaPrecoTotalProdutos();
    somaritens();
    atualizarTotalGeral();
  }

});

//Verifica se o carrinho esta vazio
function carrinhoVazio(){
  const tituloCarrinho = document.getElementById("tituloCarrinhoVazio");
  if (precoTotalProdutos >= 1) {
    tituloCarrinho.style.display = 'none';
  } else {
    tituloCarrinho.style.display = 'inline'
  }
}

// Elemento checkbox e o elemento que exibe o total da compra
var checkbox = document.getElementById("entrega");
let taxa = 0;
var taxaCarrinho = document.getElementById("taxas-carrinho");

// Adicione um manipulador de eventos para o checkbox
checkbox.addEventListener("change", function() {
  // Verifique se o checkbox está marcado
  if (checkbox.checked) {
    // Se estiver marcado, adicione a taxa de R$5 ao total da compra
    taxa += 5;
  } else {
    // Se não estiver marcado, remova a taxa de R$5 do total da compra
    taxa -= 5;
  }
  atualizarTotalTaxas();
  atualizarTotalGeral();
});

// Elemento select e o elemento que exibe o total da compra
// Adicione um manipulador de eventos para o select
let taxa2 = 0;
pagamentoSelect.addEventListener("change", function() {
  // Verifique se a opção "cartao_credito" está selecionada
  if (pagamentoSelect.value === "cartao_credito") {
    // Se estiver selecionada, adicione a taxa de R$2 ao total da compra
    taxa2 = 2;
  } else {
    // Se outra opção for selecionada, remova a taxa de R$2 do total da compra
    taxa2 = 0;
  }
  atualizarTotalTaxas();
  atualizarTotalGeral();
});

let totalTaxas = 0
function atualizarTotalTaxas() {
  totalTaxas = taxa + taxa2;
  taxaCarrinho.value = totalTaxas.toFixed(2).toString();
  console.log(totalTaxas);
}

var totalPedido =  document.querySelector('#total-pedido') 
function atualizarTotalGeral() {
  let totalGeral = precoTotalProdutos + totalTaxas;
  totalPedido.value = totalGeral.toFixed(2);
}


// Mova a definição de produtosCarrinho para um escopo mais amplo
let produtosCarrinho = [];

// Adiciona um evento de clique ao botão "Finalizar"
document.getElementById("finalizar").addEventListener("click", function() {
  produtosCarrinho = []; // Limpa o array antes de adicionar novos produtos
  const produtos = document.querySelectorAll('.produtos');
  produtos.forEach((produto) => {
    const nomeProduto = produto.querySelector('#nomeProdutoCarrinho').value;
    const quantidadeProduto = produto.querySelector('#quantidadeCarrinho').value;
    const precoProduto = produto.querySelector('#precoTotalQuantidade').value;
    produtosCarrinho.push({ nome: nomeProduto, quantidade: quantidadeProduto, preco: precoProduto });
  });

  // Coleta as informações do formulário
  const nome = document.getElementById("nome").value;
  const entrega = document.getElementById("entrega").checked;
  const enderecoRua = document.getElementById("enderecoRua").value;
  const referencia = document.getElementsByName("referencia")[0].value;
  const pagamento = document.getElementById("pagamento").value;
  const pagarDinheiro = document.getElementsByName("pagarDinheiro")[0].value;
  const totalCarrinho = document.getElementById("total-carrinho").value;
  const taxasCarrinho = document.getElementById("taxas-carrinho").value;
  const totalPedido = document.getElementById("total-pedido").value;
  const detalhes = document.getElementById("detalhes").value;
  const mesa = document.getElementById("mesa").value;

  // Cria o relatório com as informações coletadas
  let relatorio = "Pedido:\n\n";
  relatorio += "Produtos:\n";
  produtosCarrinho.forEach((produto) => {
    relatorio += produto.nome + " (x " + produto.quantidade + ")" + " = R$ " + produto.preco + ".\n\n";
  });

  relatorio += ". Observação: " + detalhes + "\n\n";
  relatorio += ". Nome: " + nome + "\n\n";

  // Adiciona mesa se preenchida
  if (mesa) {
    relatorio += ". Mesa: " + mesa + "\n\n";
  }

  // Adiciona endereço se entrega estiver selecionada e endereço preenchido
  if (entrega && (enderecoRua || referencia)) {
    relatorio += ". Endereço: " + enderecoRua;
    if (referencia) {
      relatorio += " - " + referencia;
    }
    relatorio += "\n\n";
  }

  relatorio += ". Forma de Pagamento: " + pagamento + "\n\n";
  relatorio += "Pedido: R$ " + totalCarrinho + "\n\n";
  relatorio += "Taxa: R$ " + taxasCarrinho + "\n\n";
  relatorio += "Total: R$ " + totalPedido + "\n\n";

  if (pagamento === "dinheiro") {
    relatorio += "Valor a Pagar: " + pagarDinheiro + "\n\n";
  }

  const numero = "+5521964734161";
  const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(relatorio)}`;
  window.open(url, "_blank");

  // Chama a função para criar o pedido no Supabase
  criarPedido(nome, produtosCarrinho, enderecoRua, referencia, entrega, mesa, pagamento, taxasCarrinho, totalPedido, detalhes, pagarDinheiro);
});

// Função para criar um novo pedido no Supabase
async function criarPedido(nome, produtosCarrinho, enderecoRua, referencia, entrega, mesa, pagamento, taxasCarrinho, totalPedido, detalhes, pagarDinheiro) {
  // Coleta os dados do pedido
  const pedidoData = {
      itensPedido: produtosCarrinho.map(produto => `${produto.nome}, ${produto.quantidade}, R$ ${produto.preco}`).join('; '), // Formatação como texto
      detalhes: detalhes || null,  // Se detalhes não for obrigatório
      nome: nome || null,          // Adicione um valor padrão se necessário
      endereco: (entrega && (enderecoRua || referencia)) ? `${enderecoRua} - ${referencia}` : null,
      mesa: mesa || null,
      formaPagamento: pagamento || null, // Adicione um valor padrão se necessário
      taxa: parseFloat(taxasCarrinho) || 0,
      totalPedido: parseFloat(totalPedido),
  };

  console.log("Dados do pedido a serem enviados:", JSON.stringify(pedidoData)); // Log para depuração

  const url = `${supabaseUrl}/rest/v1/pedidos`;
  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(pedidoData),
  });

  if (response.ok) {
      alert('Pedido cadastrado com sucesso!');
  } else {
      const data = await response.json();
      alert('Erro ao cadastrar o pedido: ' + data.error);
  }
}
