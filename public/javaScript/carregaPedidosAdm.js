
async function carregaPedido() {
    // Busca todos os produtos
    const url = `${supabaseUrl}/rest/v1/pedidos?select=*`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        },
    });

    function formatarData(dataString) {
        const data = new Date(dataString);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        
        return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    }

    if (response.ok) {
        const data = await response.json();
        const pedidoList = document.getElementById('rowPed')
        pedidoList.innerHTML = ""; // Limpa a lista de pedido


        data.forEach(pedido => {
            const pedidoItem = document.createElement('div');
            pedidoItem.className = 'mb-3';
            pedidoItem.innerHTML = `
                <div class="card ">
                    <div class="card-body p-0">
                    <div class="card-header">
                    <h5 class="card-title">Pedido #${pedido.pkPedido}</h5>
                </div>
                <div class="card-body">
                    <div class="pedido-info">
                        <div class="info-item"><strong>Itens:</strong> ${pedido.itensPedido}</div>
                        <div class="info-item"><strong>Detalhes:</strong> ${pedido.detalhes}</div>
                        <div class="info-item"><strong>Cliente:</strong> ${pedido.nome}</div>
                        <div class="info-item"><strong>Endereço:</strong> ${pedido.endereco}</div>
                        <div class="info-item"><strong>Mesa:</strong> ${pedido.mesa}</div>
                        <div class"info-item"><strong>Data:</strong> ${formatarData(pedido.data)}</div>
                        <div class="info-item"><strong>Forma de Pagamento:</strong> ${pedido.formaPagamento}</div>
                        <div class="info-item"><strong>Taxas:</strong> R$ ${pedido.taxas.toFixed(2)}</div>
                        <div class="info-item"><strong>Total:</strong> R$ ${pedido.totalPedido.toFixed(2)}</div>
                    </div>
                </div>
                    </div>
                </div>
            `;
            pedidoList.appendChild(pedidoItem);
        });
    } else {
        alert('Erro ao carregar a lista de pedido');
    }
}

document.addEventListener('DOMContentLoaded', carregaPedido);
