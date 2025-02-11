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
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao buscar pedidos!");

        const pedidos = await response.json();
        const elemento = document.getElementById(elementoID);
        
        if (!elemento) return;

        // Exibir pedidos em cards
        elemento.innerHTML = pedidos.length === 0 
            ? "<p class='text-muted text-center'>Nenhum pedido encontrado.</p>"
            : `<div class="row">
            ${pedidos.map(pedido => `
                <div class="col-12 col-md-6">
                    <div class="card mb-3 shadow-sm">
                        <div class="card-header bg-light fw-bold">
                            Pedido #${pedido.pkPedido}
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item"><strong>Itens:</strong> ${pedido.itensPedido}</li>
                                <li class="list-group-item"><strong>Detalhes:</strong> ${pedido.detalhes}</li>
                                <li class="list-group-item"><strong>Cliente:</strong> ${pedido.nome}</li>
                                <li class="list-group-item"><strong>Forma de Pagamento:</strong> ${pedido.formaPagamento}</li>
                                <li class="list-group-item"><strong>Taxas:</strong> <span class="badge bg-warning">R$ ${pedido.taxas.toFixed(2)}</span></li>
                                <li class="list-group-item"><strong>Total:</strong> <span class="badge bg-success">R$ ${pedido.totalPedido.toFixed(2)}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>`

    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        document.getElementById(elementoID).innerHTML = "<p class='text-danger text-center'>Erro ao carregar pedidos.</p>";
    }
}

async function buscarContagem() {
    try {
        const response = await fetch('/api/pedidosAdm/contagem');
        if (!response.ok) throw new Error("Erro ao buscar contagem!");

        const contagem = await response.json();
        document.getElementById("contagemPedidos").innerHTML = `
            <span class="badge bg-warning">Aberto: ${contagem.aberto}</span> 
            <span class="badge bg-info">Atendimento: ${contagem.atendimento}</span> 
            <span class="badge bg-success">Finalizado: ${contagem.finalizado}</span> 
            <span class="badge bg-danger">Cancelado: ${contagem.cancelado}</span>
        `;
    } catch (error) {
        console.error("Erro ao buscar contagem:", error);
        document.getElementById("contagemPedidos").innerHTML = "<p class='text-danger'>Erro ao carregar contagem.</p>";
    }
}