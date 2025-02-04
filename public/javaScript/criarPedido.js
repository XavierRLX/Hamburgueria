async function criarPedido() {
    let produtosCarrinho = [];
    document.querySelectorAll('.produtos').forEach((produto) => {
        produtosCarrinho.push({
            nome: produto.querySelector('#nomeProdutoCarrinho').value,
            quantidade: produto.querySelector('#quantidadeCarrinho').value,
            preco: parseFloat(produto.querySelector('#precoTotalQuantidade').value)
        });
    });

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
        detalhes: document.getElementById("detalhes").value,
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
