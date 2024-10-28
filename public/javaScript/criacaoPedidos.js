// // Função para criar um novo pedido no Supabase
// async function criarPedido() {
//     // Coleta as informações do relatório
//     const pedidoData = {
//         itensPedido: JSON.stringify(produtosCarrinho.map(produto => ({
//             nome: produto.nome,
//             quantidade: produto.quantidade,
//             preco: produto.preco
//         }))), // Convertendo produtos em string
//         detalhes: detalhes,
//         nome: nome,
//         endereco: (entrega && (enderecoRua || referencia)) ? `${enderecoRua} - ${referencia}` : null,
//         mesa: mesa || null,
//         formaPagamento: pagamento,
//         taxa: parseFloat(taxasCarrinho) || 0,
//         totalPedido: parseFloat(totalPedido),
//         // pkProdutos: pode ser definido se você tiver um produto específico em mente
//     };

//     // Envia os dados ao Supabase
//     const url = `${supabaseUrl}/rest/v1/pedidos`;
//     const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'apikey': apiKey,
//             'Authorization': `Bearer ${apiKey}`
//         },
//         body: JSON.stringify(pedidoData),
//     });

//     if (response.ok) {
//         alert('Pedido cadastrado com sucesso!');
//         // Você pode redirecionar ou limpar o formulário aqui
//     } else {
//         const data = await response.json();
//         alert('Erro ao cadastrar o pedido: ' + data.error);
//     }
// }

// // Exemplo de uso: você pode chamar essa função quando o formulário for enviado
// document.getElementById('finalizar').addEventListener('click', (event) => {
//     event.preventDefault();
//     criarPedido();
// });
