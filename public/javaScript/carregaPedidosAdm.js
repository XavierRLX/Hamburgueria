async function carregaPedidosPorStatus(status, containerId, loadingId, filterDate = null) {
    const url = status 
        ? `/api/pedidosAdm?status=${status}` 
        : `/api/pedidosAdm`;  // 🔹 Busca pedidos por status

    const loadingIndicator = document.getElementById(loadingId);
    loadingIndicator.style.display = 'block'; // 🔹 Mostra indicador de carregamento

    try {
        const response = await fetch(url, { method: "GET" });

        loadingIndicator.style.display = "none";

        if (!response.ok) {
            throw new Error('Erro ao carregar pedidos');
        }

        const data = await response.json();
        const pedidoList = document.getElementById(containerId);
        pedidoList.innerHTML = ""; // 🔹 Limpa pedidos antigos

        function formatarData(dataString) {
            const data = new Date(dataString);
            return data.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        }

        let pedidosFiltrados = data;
        
        // 🔹 Filtro por data (caso necessário)
        if (filterDate) {
            const selectedDate = new Date(filterDate).toISOString().split('T')[0]; // YYYY-MM-DD format
            pedidosFiltrados = pedidosFiltrados.filter(pedido => 
                new Date(pedido.data).toISOString().split('T')[0] === selectedDate
            );
        }

        pedidosFiltrados.forEach(pedido => {
            const pedidoItem = document.createElement('div');
            pedidoItem.className = 'col-12 col-md-6 col-lg-4 mb-3';
            pedidoItem.innerHTML = `
                <div class="card">
                    <div class="card-header bg-${pedido.status === 'aberto' ? 'primary' : 
                                                pedido.status === 'atendimento' ? 'warning' : 
                                                pedido.status === 'cancelado' ? 'danger' : 'success'} text-white">
                        <h5 class="card-title">Pedido #${pedido.pkPedido}</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Itens:</strong> ${pedido.itensPedido.replace(/#/g, '<br>')}</li>
                            <li class="list-group-item"><strong>Detalhes:</strong> ${pedido.detalhes}</li>
                            <li class="list-group-item"><strong>Cliente:</strong> ${pedido.nome}</li>
                            <li class="list-group-item"><strong>Número:</strong> ${pedido.numeroCelular || '0'}</li>
                            <li class="list-group-item"><strong>Endereço:</strong> ${pedido.endereco || 'No local'}</li>
                            <li class="list-group-item"><strong>Mesa:</strong> ${pedido.mesa || 'Entrega'}</li>
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
                            ${pedido.status === 'aberto' ? `
                            <button class="btn btn-warning" onclick="atualizarStatus(${pedido.pkPedido}, 'atendimento')">Atender</button>
                            <button class="btn btn-danger" onclick="atualizarStatus(${pedido.pkPedido}, 'cancelado')">Cancelar</button>
                            ` : pedido.status === 'atendimento' ? `
                            <button class="btn btn-success" onclick="atualizarStatus(${pedido.pkPedido}, 'finalizado')">Finalizar</button>
                            <button class="btn btn-danger" onclick="atualizarStatus(${pedido.pkPedido}, 'cancelado')">Cancelar</button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            pedidoList.appendChild(pedidoItem);
        });

    } catch (error) {
        alert('Erro ao carregar a lista de pedidos. Tente novamente mais tarde.');
    }
}

async function carregaPedidosContagem() {
    const url = '/api/pedidosAdm/contagem';  // Rota que você criou no Express
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (response.ok) {
        const data = await response.json();
        
        // Inicializa as contagens
        let totalAbertos = 0;
        let totalAtendimento = 0;
        let totalFinalizado = 0;

        // Conta os pedidos por status
        data.forEach(pedido => {
            if (pedido.status === 'aberto') totalAbertos++;
            if (pedido.status === 'atendimento') totalAtendimento++;
            if (pedido.status === 'finalizado') totalFinalizado++;
        });

        const totalContainer = document.getElementById('contagemPedido');
        totalContainer.className = 'mb-3';
        totalContainer.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-around">
                        <div class="badge bg-primary">Abertos: ${totalAbertos}</div>
                        <div class="badge bg-warning">Em Atendimento: ${totalAtendimento}</div>
                        <div class="badge bg-success">Finalizados: ${totalFinalizado}</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        alert('Erro ao carregar a lista de pedidos. Tente novamente mais tarde.');
    }
}


function confirmarAtualizacao(pkPedido, novoStatus) {
    if (confirm(`Tem certeza que deseja atualizar o pedido #${pkPedido} para "${novoStatus}"?`)) {
        atualizarStatus(pkPedido, novoStatus);
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
        // Reload relevant lists
        carregaPedidosPorStatus('aberto', 'rowPed', 'loadingPed');
        carregaPedidosPorStatus('atendimento', 'rowPedAt', 'loadingPedAt');
        carregaPedidosPorStatus('finalizado', 'rowPedFd', 'loadingPedFd');
    } else {
        alert('Erro ao atualizar o status do pedido. Tente novamente mais tarde.');
    }
    carregaPedidosContagem();
}

document.addEventListener('DOMContentLoaded', () => {
    carregaPedidosPorStatus('aberto', 'rowPed', 'loadingPed');
    carregaPedidosPorStatus('atendimento', 'rowPedAt', 'loadingPedAt');
    carregaPedidosPorStatus('finalizado', 'rowPedFd', 'loadingPedFd');

    // Chamar a função para contagem
    carregaPedidosContagem();

    document.getElementById('filterButton').addEventListener('click', () => {
        const filterDate = document.getElementById('filterDate').value;
        carregaPedidosPorStatus('finalizado', 'rowPedFd', 'loadingPedFd', filterDate);
        carregaPedidosContagem(); // Atualiza a contagem após o filtro
    });

    let loadingMore = false; // To prevent multiple triggers

    window.addEventListener('scroll', async () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loadingMore) {
            loadingMore = true;
            const status = 'finalizado'; // Alterar se precisar carregar outros status
            const currentPedidos = document.querySelectorAll('#rowPedFd .card').length;
            
            await carregaMaisPedidos(status, currentPedidos);
            loadingMore = false;
        }
    });
});

async function carregaMaisPedidos(status, offset) {
    const url = `${supabaseUrl}/rest/v1/pedidos?select=*&order=data.asc&status=eq.${status}&offset=${offset}&limit=20`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        },
    });

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


let lastCount = 0; // Variável para armazenar o número anterior de pedidos

async function verificaNovosPedidos() {
    const url = `${supabaseUrl}/rest/v1/pedidos?select=status`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        },
    });

    if (response.ok) {
        const data = await response.json();
        let novoCount = data.length; // Contagem atual de pedidos

        if (novoCount > lastCount) {
          // Se novos pedidos foram adicionados
          document.getElementById("notificationIcon").style.display = "block";
        }

        lastCount = novoCount; // Atualiza a contagem anterior
    } else {
        console.error('Erro ao verificar novos pedidos');
    }
}

// Chama a função a cada 5 segundos
setInterval(verificaNovosPedidos, 5000);

// Ao clicar no ícone de notificação, carrega os pedidos
document.getElementById('notificationIcon').addEventListener('click', () => {
    carregaPedidosPorStatus('aberto', 'rowPed', 'loadingPed'); // Carrega pedidos abertos
    document.getElementById('notificationIcon').style.display = 'none'; // Esconde o ícone
    carregaPedidosContagem();
});

document.getElementById("deleteAllButton").addEventListener("click", async function () {
    const confirmacao = confirm("Tem certeza que deseja excluir TODOS os pedidos? Essa ação não pode ser desfeita.");
    
    if (!confirmacao) return; // Se o usuário cancelar, não faz nada

    const url = `${supabaseUrl}/rest/v1/pedidos?pkPedido=gt.0`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({}) // Enviar um objeto vazio para deletar todos os registros
    });
    

    if (response.ok) {
        alert("Todos os pedidos foram excluídos com sucesso!");
        location.reload(); // Atualiza a página para refletir as mudanças
    } else {
        alert("Erro ao excluir pedidos. Tente novamente.");
        console.error("Erro ao excluir:", response.statusText);
    }
});


