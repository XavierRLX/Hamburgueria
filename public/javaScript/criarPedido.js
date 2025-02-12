async function criarPedido() {
    let produtosCarrinho = [];
    let observacoes = [];

    document.querySelectorAll('.produtos').forEach((produto) => {
        const nome = produto.querySelector('#nomeProdutoCarrinho').value;
        const quantidade = produto.querySelector('#quantidadeCarrinho').value;
        const preco = parseFloat(produto.querySelector('#precoTotalQuantidade').value);
        const observacao = produto.querySelector('#observacaoProduto').value.trim(); // Captura observação

        produtosCarrinho.push({ nome, quantidade, preco });

        if (observacao) {
            observacoes.push(`${nome}: ${observacao}`); // Nome do produto antes da observação
        }
    });

    // Junta todas as observações separadas por uma linha
    const detalhesPedido = observacoes.length > 0 ? observacoes.join("\n") : "Nenhuma observação.";

    // Coleta as informações do formulário
    const pedidoData = {
        produtosCarrinho,
        nome: document.getElementById("nome").value,
        entrega: document.getElementById("entrega").checked,
        enderecoRua: document.getElementById("enderecoRua").value,
        referencia: document.getElementsByName("referencia")[0].value,
        pagamento: document.getElementById("pagamento").value,
        pagarDinheiro: document.getElementsByName("pagarDinheiro")[0].value,
        totalCarrinho: parseFloat(document.getElementById("total-carrinho").value),
        taxasCarrinho: parseFloat(document.getElementById("taxas-carrinho").value),
        totalPedido: parseFloat(document.getElementById("total-pedido").value),
        detalhes: detalhesPedido, // Agora inclui o nome do produto antes da observação
        mesa: document.getElementById("mesa").value,
        numeroCelular: document.getElementById("numeroCelular").value
    };

    try {
        const response = await fetch('/api/Criarpedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            localStorage.removeItem('carrinho');
            localStorage.setItem('pkPedido', result.pkPedido);
            location.reload();
            window.open(result.whatsappUrl, "_blank");
        } else {
            alert('Erro ao cadastrar pedido: ' + result.error);
        }
    } catch (error) {
        console.error("Erro ao enviar pedido:", error);
        alert("Erro ao enviar o pedido. Tente novamente.");
    }
}
