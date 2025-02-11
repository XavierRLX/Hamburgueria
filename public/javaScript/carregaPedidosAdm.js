

document.addEventListener("DOMContentLoaded", () => {
    buscarContagem();
    buscarPedidos("aberto", "pedidosAberto");
buscarPedidos("atendimento", "pedidosAtendimento");
buscarPedidos("finalizado", "pedidosFinalizado");
buscarPedidos("cancelado", "pedidosCancelado");
});

// Função para buscar pedidos por status
async function buscarPedidos(status, elementoID) {
    const url = `/api/pedidosAdm?status=${status}`;

    try {
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) throw new Error("Erro ao buscar pedidos!");

        const pedidos = await response.json();
        const elemento = document.getElementById(elementoID);
        
        if (!elemento) return;

        // Exibir os pedidos em um layout de card
        elemento.innerHTML = pedidos.length === 0 
            ? "<p class='text-muted'>Nenhum pedido encontrado.</p>"
            : pedidos.map(pedido => `
                <div class="card mb-3">
                    <div class="card-header bg-success text-white">
                        <h5 class="card-title">Pedido #${pedido.pkPedido}</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Itens:</strong> ${pedido.itensPedido}</li>
                            <li class="list-group-item"><strong>Detalhes:</strong> ${pedido.detalhes}</li>
                            <li class="list-group-item"><strong>Cliente:</strong> ${pedido.nome}</li>
                            <li class="list-group-item"><strong>Forma de Pagamento:</strong> ${pedido.formaPagamento}</li>
                            <li class="list-group-item">
                                <strong>Taxas:</strong> <span class="badge bg-warning text-dark">R$ ${pedido.taxas.toFixed(2)}</span>
                            </li>
                            <li class="list-group-item">
                                <strong>Total:</strong> <span class="badge bg-success">R$ ${pedido.totalPedido.toFixed(2)}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            `).join("");

    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        document.getElementById(elementoID).innerHTML = "<p class='text-danger'>Erro ao carregar pedidos.</p>";
    }
}


async function buscarContagem() {
    try {
        const response = await fetch('/api/pedidosAdm/contagem');
        if (!response.ok) throw new Error("Erro ao buscar contagem!");

        const contagem = await response.json();
        document.getElementById("contagemPedidos").innerHTML = `
            📊 Pedidos: Aberto (${contagem.aberto}) | Atendimento (${contagem.atendimento}) | 
            Finalizado (${contagem.finalizado}) | Cancelado (${contagem.cancelado})
        `;
    } catch (error) {
        console.error("Erro ao buscar contagem:", error);
        document.getElementById("contagemPedidos").innerHTML = "<p class='text-danger'>Erro ao carregar contagem.</p>";
    }
}