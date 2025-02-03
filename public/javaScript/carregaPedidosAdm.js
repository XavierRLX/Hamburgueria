async function carregaPedidosPorStatus(status, containerId, loadingId, filterDate = null) {
    try {
        let url = `/api/pedidos?status=${encodeURIComponent(status)}`;
        if (filterDate) {
            url += `&data=${encodeURIComponent(filterDate)}`;
        }

        const loadingIndicator = document.getElementById(loadingId);
        loadingIndicator.style.display = "block"; // Exibe loading

        const response = await fetch(url);
        loadingIndicator.style.display = "none"; // Esconde loading

        if (!response.ok) {
            throw new Error("Erro ao carregar pedidos.");
        }

        const data = await response.json();
        const pedidoList = document.getElementById(containerId);
        pedidoList.innerHTML = ""; // Limpa a lista de pedidos

        function formatarData(dataString) {
            const data = new Date(dataString);
            return data.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        }

        data.forEach(pedido => {
            const pedidoItem = document.createElement("div");
            pedidoItem.className = "col-12 col-md-6 col-lg-4 mb-3";
            pedidoItem.innerHTML = `
                <div class="card">
                    <div class="card-header bg-${pedido.status === "aberto" ? "primary" : pedido.status === "atendimento" ? "warning" : pedido.status === "cancelado" ? "danger" : "success"} text-white">
                        <h5 class="card-title">Pedido #${pedido.pkPedido}</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Itens:</strong> ${pedido.itensPedido.replace(/#/g, "<br>")}</li>
                            <li class="list-group-item"><strong>Detalhes:</strong> ${pedido.detalhes}</li>
                            <li class="list-group-item"><strong>Cliente:</strong> ${pedido.nome}</li>
                            <li class="list-group-item"><strong>Número:</strong> ${pedido.numeroCelular || "0"}</li>
                            <li class="list-group-item"><strong>Endereço:</strong> ${pedido.endereco || "No local"}</li>
                            <li class="list-group-item"><strong>Mesa:</strong> ${pedido.mesa || "Entrega"}</li>
                            <li class="list-group-item"><strong>Data:</strong> ${formatarData(pedido.data)}</li>
                            <li class="list-group-item"><strong>Forma de Pagamento:</strong> ${pedido.formaPagamento}</li>
                            <li class="list-group-item">
                                <strong>Taxas:</strong> <span class="badge bg-warning text-dark">R$ ${pedido.taxas.toFixed(2)}</span>
                            </li>
                            <li class="list-group-item">
                                <strong>Total:</strong> <span class="badge bg-success">R$ ${pedido.totalPedido.toFixed(2)}</span>
                            </li>
                        </ul>
                        <div class="mt-3">
                            ${pedido.status === "aberto" ? `
                                <button class="btn btn-warning" onclick="atualizarStatus(${pedido.pkPedido}, 'atendimento')">Atender</button>
                                <button class="btn btn-danger" onclick="atualizarStatus(${pedido.pkPedido}, 'cancelado')">Cancelar</button>
                            ` : pedido.status === "atendimento" ? `
                                <button class="btn btn-success" onclick="atualizarStatus(${pedido.pkPedido}, 'finalizado')">Finalizar</button>
                                <button class="btn btn-danger" onclick="atualizarStatus(${pedido.pkPedido}, 'cancelado')">Cancelar</button>
                            ` : ""}
                        </div>
                    </div>
                </div>
            `;
            pedidoList.appendChild(pedidoItem);
        });

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar a lista de pedidos.");
    }
}

document.addEventListener("DOMContentLoaded", () => carregaPedidosPorStatus("aberto", "containerPedidosAbertos", "loadingPedidosAbertos"));

async function carregaPedidosContagem() {
    try {
        const response = await fetch('/api/pedidos/contagem');

        if (!response.ok) {
            throw new Error('Erro ao carregar contagem de pedidos.');
        }

        const { abertos, atendimento, finalizados } = await response.json();

        const totalContainer = document.getElementById('contagemPedido');
        totalContainer.className = 'mb-3';
        totalContainer.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-around">
                        <div class="badge bg-primary">Abertos: ${abertos}</div>
                        <div class="badge bg-warning">Em Atendimento: ${atendimento}</div>
                        <div class="badge bg-success">Finalizados: ${finalizados}</div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar a contagem de pedidos.');
    }
}

async function atualizarStatus(pkPedido, novoStatus) {
    try {
        const response = await fetch(`/api/pedidos/${pkPedido}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus }),
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar pedido.');
        }

        alert(`Pedido ${pkPedido} atualizado para "${novoStatus}".`);
        carregaPedidosContagem();
        carregaPedidosPorStatus('aberto', 'rowPed', 'loadingPed');
        carregaPedidosPorStatus('atendimento', 'rowPedAt', 'loadingPedAt');
        carregaPedidosPorStatus('finalizado', 'rowPedFd', 'loadingPedFd');
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar o status do pedido.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregaPedidosPorStatus('aberto', 'rowPed', 'loadingPed');
    carregaPedidosPorStatus('atendimento', 'rowPedAt', 'loadingPedAt');
    carregaPedidosPorStatus('finalizado', 'rowPedFd', 'loadingPedFd');
    carregaPedidosContagem();

    document.getElementById('filterButton').addEventListener('click', () => {
        const filterDate = document.getElementById('filterDate').value;
        carregaPedidosPorStatus('finalizado', 'rowPedFd', 'loadingPedFd', filterDate);
        carregaPedidosContagem();
    });

    let loadingMore = false;
    window.addEventListener('scroll', async () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loadingMore) {
            loadingMore = true;
            const status = 'finalizado';
            const currentPedidos = document.querySelectorAll('#rowPedFd .card').length;
            
            await carregaMaisPedidos(status, currentPedidos);
            loadingMore = false;
        }
    });
});

async function carregaMaisPedidos(status, offset) {
    const url = `/api/pedidos?status=${status}&offset=${offset}&limit=20`;
    
    const response = await fetch(url);
    
    if (response.ok) {
        const data = await response.json();
        const pedidoList = document.getElementById('rowPedFd');

        data.forEach(pedido => {
            const pedidoItem = document.createElement('div');
            pedidoItem.className = 'col-12 col-md-6 col-lg-4 mb-3';
            pedidoItem.innerHTML = `
                <div class="card">
                    <div class="card-header bg-success text-white">
                        <h5 class="card-title">Pedido #${pedido.pkPedido}</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Itens:</strong> ${pedido.itensPedido}</li>
                            <li class="list-group-item"><strong>Detalhes:</strong> ${pedido.detalhes}</li>
                            <li class="list-group-item"><strong>Cliente:</strong> ${pedido.nome}</li>
                            <li class="list-group-item"><strong>Endereço:</strong> ${pedido.endereco || 'No local'}</li>
                            <li class="list-group-item"><strong>Data:</strong> ${formatarData(pedido.data)}</li>
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
            `;
            pedidoList.appendChild(pedidoItem);
        });
    } else {
        alert('Erro ao carregar mais pedidos. Tente novamente mais tarde.');
    }
}


let lastCount = 0; // Armazena o número anterior de pedidos

async function verificaNovosPedidos() {
    try {
        const response = await fetch('/api/pedidos/contagem');

        if (!response.ok) {
            throw new Error('Erro ao verificar novos pedidos.');
        }

        const { totalPedidos } = await response.json();
        if (totalPedidos > lastCount) {
            document.getElementById("notificationIcon").style.display = "block";
        }
        
        lastCount = totalPedidos;
    } catch (error) {
        console.error(error);
    }
}

// Chama a função a cada 5 segundos
setInterval(verificaNovosPedidos, 5000);

// Ao clicar no ícone de notificação, carrega os pedidos
document.getElementById('notificationIcon').addEventListener('click', () => {
    carregaPedidosPorStatus('aberto', 'rowPed', 'loadingPed'); 
    document.getElementById('notificationIcon').style.display = 'none';
    carregaPedidosContagem();
});

// Excluir todos os pedidos
document.getElementById("deleteAllButton").addEventListener("click", async function () {
    const confirmacao = confirm("Tem certeza que deseja excluir TODOS os pedidos? Essa ação não pode ser desfeita.");
    
    if (!confirmacao) return;

    try {
        const response = await fetch('/api/pedidos/todos', { method: 'DELETE' });

        if (!response.ok) {
            throw new Error("Erro ao excluir pedidos.");
        }

        alert("Todos os pedidos foram excluídos com sucesso!");
        location.reload();
    } catch (error) {
        console.error(error);
        alert("Erro ao excluir pedidos. Tente novamente.");
    }
});

