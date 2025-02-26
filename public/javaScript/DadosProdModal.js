// Pega o valor do produto e faz multiplicação.
const btnMais = document.querySelector('.mais');
const btnMenos = document.querySelector('.menos');
const inputQuantidade = document.querySelector('.quantidade');
const inputPreco = document.querySelector('.precoProdutoModal');
const inputTotal = document.querySelector('.totalProdutoModal');

const meuCarrinho = document.querySelector('.meu-carrinho');
const btnAdicionar = document.querySelector('.btn-adc-carrinho');
const precoTotalElement = document.querySelector('#total-carrinho');
const ResultadoItens = document.querySelector('#carrinho-count');

let precoTotalProdutos = 0;
let SomaItens = 0;

// Função para atualizar o preço total de produtos
function atualizaPrecoTotalProdutos() {
    precoTotalProdutos = 0;
    const produtos = document.querySelectorAll('.produtos');
    produtos.forEach((produto) => {
        const totalProduto = parseFloat(produto.querySelector('#precoTotalQuantidade').value);
        if (!isNaN(totalProduto)) {
            precoTotalProdutos += totalProduto;
        }
    });
    precoTotalElement.value = precoTotalProdutos.toFixed(2);
    carrinhoVazio();
}

// Função para somar itens
function somaritens() {
    SomaItens = 0;
    const produtos = document.querySelectorAll('.produtos');
    produtos.forEach((produto) => {
        const TotalItens = parseFloat(produto.querySelector('#quantidadeCarrinho').value);
        if (!isNaN(TotalItens)) {
            SomaItens += TotalItens;
        }
    });
    ResultadoItens.value = SomaItens;
}

// Adiciona evento de clique no botão "mais"
btnMais.addEventListener('click', function () {
    inputQuantidade.value++;
    const valorTotal = inputQuantidade.value * inputPreco.value;
    inputTotal.value = valorTotal.toFixed(2);
});

// Adiciona evento de clique no botão "menos"
btnMenos.addEventListener('click', function () {
    if (inputQuantidade.value > 1) {
        inputQuantidade.value--;
        const valorTotal = inputQuantidade.value * inputPreco.value;
        inputTotal.value = valorTotal.toFixed(2);
    }
});

// Função para adicionar item ao carrinho
btnAdicionar.addEventListener('click', function () {
    const nomeProduto = document.querySelector('.nomeProdutoModal').textContent;
    const quantidade = inputQuantidade.value;
    const total = inputTotal.value;

    const divProduto = document.createElement('div');
    divProduto.classList.add('produtos');

    divProduto.innerHTML = `
    <div class="container border-bottom py-2">
        <div class="row align-items-center">
            <div class="col-5">
                <input type="text" class="form-control-plaintext fw-bold" value="${nomeProduto}" readonly id="nomeProdutoCarrinho">
            </div>
            <div class="col-3 d-flex align-items-center">
                <input type="number" class="form-control text-center me-2" value="${quantidade}" readonly id="quantidadeCarrinho">
                <span class="fw-bold">X</span>
            </div>
            <div class="col-3 d-flex align-items-center">
                <span class="fw-bold me-2">R$:</span>
                <input type="number" class="form-control text-center" value="${total}" readonly id="precoTotalQuantidade">
            </div>
            <div class="col-1 text-end">
                <img class="imgLixeira" src="https://uweicybzciidmyumejzm.supabase.co/storage/v1/object/public/imgs/lixeira.png" alt="Remover" id="imgLix" style="cursor:pointer; width:24px;">
            </div>
        </div>
        <div class="row mt-2">
            <div class="col">
                <input type="text" class="form-control" placeholder="Observação (Ex: Sem cebola, mais molho...)" id="observacaoProduto">
            </div>
        </div>
    </div>
`;

    
    meuCarrinho.appendChild(divProduto);
    // Salva no localStorage
    salvarCarrinho();

    atualizaPrecoTotalProdutos();
    somaritens();
});

// Função para salvar carrinho no localStorage
function salvarCarrinho() {
    const produtosCarrinho = [];
    const produtos = document.querySelectorAll('.produtos');
    produtos.forEach(produto => {
        const nome = produto.querySelector('#nomeProdutoCarrinho').value;
        const quantidade = produto.querySelector('#quantidadeCarrinho').value;
        const precoTotal = produto.querySelector('#precoTotalQuantidade').value;
        produtosCarrinho.push({ nome, quantidade, precoTotal });
    });
    localStorage.setItem('carrinho', JSON.stringify(produtosCarrinho));
}

// Função para carregar carrinho do localStorage
function carregarCarrinho() {
    const produtosCarrinho = JSON.parse(localStorage.getItem('carrinho'));
    if (produtosCarrinho) {
        produtosCarrinho.forEach(produto => {
            const divProduto = document.createElement('div');
            divProduto.classList.add('produtos');

            divProduto.innerHTML = `
    <div class="container border-bottom py-2">
        <div class="row align-items-center">
            <div class="col-5">
                <input type="text" class="form-control-plaintext fw-bold" value="${produto.nome}" readonly id="nomeProdutoCarrinho">
            </div>
            <div class="col-3 d-flex align-items-center">
                <input type="number" class="form-control text-center me-2" value="${produto.quantidade}" readonly id="quantidadeCarrinho">
                <span class="fw-bold">X</span>
            </div>
            <div class="col-3 d-flex align-items-center">
                <span class="fw-bold me-2">R$:</span>
                <input type="number" class="form-control text-center" value="${produto.precoTotal}" readonly id="precoTotalQuantidade">
            </div>
            <div class="col-1 text-end">
                <img class="imgLixeira" src="https://uweicybzciidmyumejzm.supabase.co/storage/v1/object/public/imgs/lixeira.png" alt="Remover" id="imgLix" style="cursor:pointer; width:24px;">
            </div>
        </div>
        <div class="row mt-2">
            <div class="col">
                <input type="text" class="form-control" placeholder="Observação (Ex: Sem cebola, mais molho...)" id="observacaoProduto">
            </div>
        </div>
    </div>
`;
            meuCarrinho.appendChild(divProduto);
        });
    }
    atualizaPrecoTotalProdutos();
    somaritens(); // Atualiza a contagem de itens
}

// Carrega o carrinho ao iniciar
document.addEventListener('DOMContentLoaded', carregarCarrinho);

// Remover produto do carrinho
meuCarrinho.addEventListener('click', function(event) {
    if (event.target.id === 'imgLix') {
        event.target.parentElement.parentElement.remove();
        salvarCarrinho();
        atualizaPrecoTotalProdutos();
        somaritens();
    }
});

// Finalizar pedido
document.getElementById("finalizar").addEventListener("click", function() {
    if (!verificaCampos()) {
        alert("Por favor, preencha todos os campos obrigatórios e adicione itens ao pedido.");
        return;
    }

    const confirmacao = confirm("Você tem certeza que deseja finalizar o pedido?");
    if (confirmacao) {
       
        criarPedido();        
    }
});

// Função para verificar campos obrigatórios
function verificaCampos() {
    const produtos = document.querySelectorAll('.produtos');
    if (produtos.length === 0) return false;

    const nome = document.getElementById("nome").value.trim();
    const mesa = document.getElementById("mesa").value.trim();
    const enderecoRua = document.getElementById("enderecoRua").value.trim();
    const pagamento = document.getElementById("pagamento").value.trim();

    return nome && (mesa || enderecoRua) && pagamento;
}

// Validação do checkbox da entrega
const checkboxEntrega = document.querySelector('#entrega');
const campoEndereco = document.querySelector('#endereco');
const CampoMesa = document.querySelector("#Nmesa");
const CampoMesaText = document.querySelector("mesa");

checkboxEntrega.addEventListener('change', function () {
    if (this.checked) {
        campoEndereco.style.display = 'block';
        CampoMesa.style.display = 'none';
        CampoMesaText.value = '';
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

// Elemento checkbox e o elemento que exibe o total da compra
var checkbox = document.getElementById("entrega");
let taxa = 0;
var taxaCarrinho = document.getElementById("taxas-carrinho");

// Adicione um manipulador de eventos para o checkbox
checkbox.addEventListener("change", function() {
    if (checkbox.checked) {
        taxa += 5;
    } else {
        taxa -= 5;
    }
    atualizarTotalTaxas();
    atualizarTotalGeral();
});

// Elemento select e o elemento que exibe o total da compra
let taxa2 = 0;
pagamentoSelect.addEventListener("change", function() {
    if (pagamentoSelect.value === "CartaoCredito") {
        taxa2 = 2;
    } else {
        taxa2 = 0;
    }
    atualizarTotalTaxas();
    atualizarTotalGeral();
});

let totalTaxas = 0;
function atualizarTotalTaxas() {
    totalTaxas = taxa + taxa2;
    taxaCarrinho.value = totalTaxas.toFixed(2).toString();
}

// Total do pedido
var totalPedido = document.querySelector('#total-pedido');
function atualizarTotalGeral() {
    let totalGeral = precoTotalProdutos + totalTaxas;
    totalPedido.value = totalGeral.toFixed(2);
}

// Verifica se o carrinho está vazio
function carrinhoVazio() {
    const tituloCarrinho = document.getElementById("tituloCarrinhoVazio");
    if (precoTotalProdutos >= 1) {
        tituloCarrinho.style.display = 'none';
    } else {
        tituloCarrinho.style.display = 'inline';
    }
}