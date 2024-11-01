async function criarPedido() {
    produtosCarrinho = [];
    const produtos = document.querySelectorAll('.produtos');
    produtos.forEach((produto) => {
        const nomeProduto = produto.querySelector('#nomeProdutoCarrinho').value;
        const quantidadeProduto = produto.querySelector('#quantidadeCarrinho').value;
        const precoProduto = produto.querySelector('#precoTotalQuantidade').value;
        produtosCarrinho.push({ nome: nomeProduto, quantidade: quantidadeProduto, preco: parseFloat(precoProduto) });
    });
  
    // Coleta as informações do formulário
    const nome = document.getElementById("nome").value;
    const entrega = document.getElementById("entrega").checked;
    const enderecoRua = document.getElementById("enderecoRua").value;
    const referencia = document.getElementsByName("referencia")[0].value;
    const pagamento = document.getElementById("pagamento").value;
    const pagarDinheiro = document.getElementsByName("pagarDinheiro")[0].value;
    const totalCarrinho = parseFloat(document.getElementById("total-carrinho").value);
    const taxasCarrinho = parseFloat(document.getElementById("taxas-carrinho").value);
    const totalPedido = parseFloat(document.getElementById("total-pedido").value);
    const detalhes = document.getElementById("detalhes").value;
    const mesa = document.getElementById("mesa").value;
    const numeroCelular = document.getElementById("numeroCelular").value;
  
    // Consulta o último pkPedido
    const urlUltimoPedido = `${supabaseUrl}/rest/v1/pedidos?select=pkPedido&order=pkPedido.desc&limit=1`;
    const responseUltimoPedido = await fetch(urlUltimoPedido, {
        headers: {
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        }
    });
    const ultimoPedidoData = await responseUltimoPedido.json();
    const novoPkPedido = ultimoPedidoData.length ? ultimoPedidoData[0].pkPedido + 1 : 1;
  
    // Criação do relatório e envio para WhatsApp
    let relatorio = `Pedido #${novoPkPedido}:\n\n`;
    let itensPedido = '';
    produtosCarrinho.forEach((produto) => {
        itensPedido += ` #${produto.nome} (x ${produto.quantidade}) = R$ ${produto.preco}.\n\n`;
    });
  
    relatorio += itensPedido;
    relatorio += ". Observação: " + detalhes + "\n\n";
    relatorio += ". Nome: " + nome + "\n\n";
  
    if (mesa) {
        relatorio += ". Mesa: " + mesa + "\n\n";
    }
  
    const endereco = `${enderecoRua} - ${referencia ? referencia : ''}`;
    if (entrega && (enderecoRua || referencia)) {
        relatorio += ". Endereço: " + endereco + "\n\n";
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
    
    // Envio dos dados ao Supabase
    const urlPedido = `${supabaseUrl}/rest/v1/pedidos`;
    const response = await fetch(urlPedido, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            pkPedido: novoPkPedido,
            itensPedido,
            detalhes,
            nome,
            endereco,
            mesa,
            numeroCelular,
            formaPagamento: pagamento,
            taxas: taxasCarrinho,
            totalPedido,
        }),
    });
  
    if (response.ok) {
        alert(`Pedido cadastrado com sucesso! Seu número de pedido é #${novoPkPedido}.`);
        localStorage.removeItem('carrinho'); 
        localStorage.setItem('pkPedido', novoPkPedido); 
        // Recarregar a página atual
        location.reload();
        window.open(url, "_blank");
    } else {
        const data = await response.json();
        alert('Erro ao cadastrar pedido: ' + data.message || data.error);
    }
  }

//   window.onload = async function () {
//     const pkPedido = localStorage.getItem('pkPedido');

//     if (pkPedido) {
//         const urlPedido = `${supabaseUrl}/rest/v1/pedidos?pkPedido=eq.${pkPedido}`;

//         const response = await fetch(urlPedido, {
//             headers: {
//                 'apikey': apiKey,
//                 'Authorization': `Bearer ${apiKey}`
//             }
//         });

//         if (response.ok) {
//             const data = await response.json();
//             if (data.length > 0) {
//                 const pedido = data[0];
//                 const detalhesPedido = `
//                     <div class="card-header bg-${pedido.status === 'aberto' ? 'primary' : pedido.status === 'atendimento' ? 'warning' : 'success'} text-white">
//                         Pedido #${pedido.pkPedido}
//                     </div>
//                     <div class="card-body">
//                         <ul class="list-group">
//                             <li class="list-group-item">
//                                 <strong>Itens:</strong>
//                                 ${pedido.itensPedido.split('#').filter(item => item.trim() !== '').map(item => {
//                                     item = item.trim();
//                                     return '> ' + (item.endsWith('.') ? item : item + '.');
//                                 }).join('<br>')}
//                             </li>
//                             <li class="list-group-item">
//                                 <strong>Total:</strong> <span class="badge bg-success">R$ ${pedido.totalPedido.toFixed(2)}</span>
//                             </li>
//                             <li class="list-group-item">
//                                 <strong>Status:</strong> ${pedido.status}
//                             </li>
//                         </ul>
//                     </div>
//                 `;
//                 document.getElementById('detalhesPedido').innerHTML = detalhesPedido;
//                 document.getElementById('resultadoPedido').style.display = 'block';
//             } else {
//                 document.getElementById('detalhesPedido').textContent = 'Pedido não encontrado.';
//                 document.getElementById('resultadoPedido').style.display = 'block';
//             }
//         } else {
//             document.getElementById('detalhesPedido').textContent = 'Erro ao buscar o pedido.';
//             document.getElementById('resultadoPedido').style.display = 'block';
//         }
//     }
// };