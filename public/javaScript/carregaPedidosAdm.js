async function carregaPedidosPorStatus(status, containerId) {
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
        const pedidoList = document.getElementById(containerId);
        pedidoList.innerHTML = ""; // Limpa a lista de pedidos

        const pedidosFiltrados = data.filter(pedido => pedido.status === status);

        pedidosFiltrados.forEach(pedido => {
            const pedidoItem = document.createElement('div');
            pedidoItem.className = 'mb-3';
            pedidoItem.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Pedido #${pedido.pkPedido}</h5>
                    </div>
                    <div class="card-body">
                        <div class="pedido-info">
                            <div class="info-item"><strong>Itens:</strong> ${pedido.itensPedido}</div>
                            <div class="info-item"><strong>Detalhes:</strong> ${pedido.detalhes}</div>
                            <div class="info-item"><strong>Cliente:</strong> ${pedido.nome}</div>
                            <div class="info-item"><strong>Endereço:</strong> ${pedido.endereco || 'No local' }</div>
                            <div class="info-item"><strong>Mesa:</strong> ${pedido.mesa || 'Entrega'}</div>
                            <div class="info-item"><strong>Data:</strong> ${formatarData(pedido.data)}</div>
                            <div class="info-item"><strong>Forma de Pagamento:</strong> ${pedido.formaPagamento}</div>
                            <div class="info-item"><strong>Taxas:</strong> R$ ${pedido.taxas.toFixed(2)}</div>
                            <div class="info-item"><strong>Total:</strong> R$ ${pedido.totalPedido.toFixed(2)}</div>
                        </div>
                        <div class="d-flex justify-content-between mt-3">
                            ${status === 'aberto' ? `
                                <button class="btn btn-danger" onclick="atualizarStatus('${pedido.pkPedido}', 'cancelado')">Cancelar</button>
                                <button class="btn btn-success" onclick="atualizarStatus('${pedido.pkPedido}', 'atendimento')">Atender</button>
                            ` : status === 'atendimento' ? `
                                <button class="btn btn-danger" onclick="atualizarStatus('${pedido.pkPedido}', 'cancelado')">Cancelar</button>
                                <button class="btn btn-success" onclick="atualizarStatus('${pedido.pkPedido}', 'finalizado')">Finalizar</button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            pedidoList.appendChild(pedidoItem);
        });
    } else {
        alert(`Erro ao carregar a lista de pedidos: ${response.status}`);
    }
}

async function atualizarStatus(pkPedido, novoStatus) {
    const url = `${supabaseUrl}/rest/v1/pedidos?pkPedido=eq.${pkPedido}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ status: novoStatus })
    });

    if (response.ok) {
        alert(`Pedido ${pkPedido} atualizado para status "${novoStatus}".`);
        // Recarrega apenas a lista relevante
        carregaPedidosPorStatus('aberto', 'rowPed');
        carregaPedidosPorStatus('atendimento', 'rowPedAt');
        carregaPedidosPorStatus('finalizado', 'rowPedFd');
    } else {
        alert('Erro ao atualizar o status do pedido');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregaPedidosPorStatus('aberto', 'rowPed');
    carregaPedidosPorStatus('atendimento', 'rowPedAt');
    carregaPedidosPorStatus('finalizado', 'rowPedFd');
});
