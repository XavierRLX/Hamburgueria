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

        elemento.innerHTML = pedidos.length === 0 
        ? "<p class='text-muted text-center'>Nenhum pedido encontrado.</p>"
        : `<div class="row">
            ${pedidos.map(pedido => `
                <div class="col-12 col-md-6">
                    <div class="card mb-3 shadow-sm border-${getBorderColor(status)}">
                        <div class="card-header bg-${getHeaderColor(status)} text-white fw-bold d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-basket-fill"></i> Pedido #${pedido.pkPedido}</span>
                        </div>
                        <div class="card-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                            <i class="bi bi-burger"></i> <strong>Itens:</strong>
                            <ul class="mt-1 ps-3">
                                ${pedido.itensPedido.split("#").filter(item => item.trim() !== "").map(item => `<li>${item.trim()}</li>`).join("")}
                            </ul>
                        </li>
                        <li class="list-group-item"><i class="bi bi-clipboard"></i> <strong>Detalhes:</strong> ${pedido.detalhes}</li>
                        <li class="list-group-item"><i class="bi bi-person"></i> <strong>Cliente:</strong> ${pedido.nome}</li>
                        <li class="list-group-item"><i class="bi bi-geo-alt"></i> <strong>Entrega:</strong> ${pedido.endereco ? pedido.endereco : `<span class="badge bg-primary">Mesa ${pedido.mesa}</span>`}</li>
                        <li class="list-group-item"><i class="bi bi-calendar-event"></i> <strong>Data:</strong> ${formatarData(pedido.data)}</li>
                        <li class="list-group-item"><i class="bi bi-phone"></i> <strong>Telefone:</strong> ${formatarTelefone(pedido.numeroCelular)}</li>
                        <li class="list-group-item"><i class="bi bi-credit-card"></i> <strong>Forma de Pagamento:</strong> ${pedido.formaPagamento}</li>
                        <li class="list-group-item"><i class="bi bi-currency-dollar"></i> <strong>Taxas:</strong> <span class="badge bg-warning">R$ ${pedido.taxas.toFixed(2)}</span></li>
                        <li class="list-group-item text-center">
                            <strong>Total:</strong> 
                            <span class="badge bg-success p-2 fs-5">R$ ${pedido.totalPedido.toFixed(2)}</span>
                        </li>
                    </ul>
                        </div>
                        <div class="card-footer text-center">
                            ${status === "aberto" || status === "atendimento" ? getBotaoStatus(pedido.pkPedido, status) : ""}
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>`;

    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        document.getElementById(elementoID).innerHTML = "<p class='text-danger text-center'>Erro ao carregar pedidos.</p>";
    }
}
// Função para formatar a data do pedido
function formatarData(dataString) {
    if (!dataString) return "Data não informada";
    
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Função para formatar o número de telefone
function formatarTelefone(numero) {
    if (!numero) return "Sem telefone";
    
    // Formata para padrão (XX) XXXXX-XXXX
    return numero.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
}

function getBorderColor(status) {
    switch (status) {
        case "aberto": return "warning";
        case "atendimento": return "info";
        case "finalizado": return "success";
        case "cancelado": return "danger";
        default: return "secondary";
    }
}

// Função para definir a cor do cabeçalho do card
function getHeaderColor(status) {
    switch (status) {
        case "aberto": return "warning";
        case "atendimento": return "info";
        case "finalizado": return "success";
        case "cancelado": return "danger";
        default: return "secondary";
    }
}

// Função para gerar os botões com base no status do pedido
function getBotaoStatus(pkPedido, status) {
    if (status === "aberto") {
        return `
            <div>
                <button class="btn btn-sm btn-success" onclick="atualizarStatusPedido(${pkPedido}, 'atendimento')">Aceitar</button>
                <button class="btn btn-sm btn-danger" onclick="atualizarStatusPedido(${pkPedido}, 'cancelado')">Recusar</button>
            </div>
        `;
    } else if (status === "atendimento") {
        return `
            <div>
                <button class="btn btn-sm btn-primary" onclick="atualizarStatusPedido(${pkPedido}, 'finalizado')">Finalizar</button>
                <button class="btn btn-sm btn-danger" onclick="atualizarStatusPedido(${pkPedido}, 'cancelado')">Cancelar</button>
            </div>
        `;
    }
    return "";
}

// Função para atualizar o status do pedido
async function atualizarStatusPedido(pkPedido, novoStatus) {
    try {
        const response = await fetch(`/api/pedidosAdm/atualizar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pkPedido, novoStatus })
        });

        if (!response.ok) throw new Error("Erro ao atualizar pedido!");

        alert("Pedido atualizado com sucesso!");
        buscarContagem(); // Atualiza a contagem dos pedidos
        buscarPedidos("aberto", "pedidosAberto");
        buscarPedidos("atendimento", "pedidosAtendimento");
        buscarPedidos("finalizado", "pedidosFinalizado");
        buscarPedidos("cancelado", "pedidosCancelado");

    } catch (error) {
        console.error("Erro ao atualizar pedido:", error);
        alert("Erro ao atualizar pedido. Tente novamente.");
    }
}

// Função para buscar contagem de pedidos
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


let ultimoTotalPedidosAbertos = null; // Armazena a última contagem válida

// Função para verificar se há novos pedidos em aberto
async function verificarNovosPedidos() {
    try {
        const response = await fetch('/api/pedidosAdm/contagem');
        if (!response.ok) throw new Error("Erro ao buscar contagem!");

        const contagem = await response.json();
        const notificacao = document.getElementById("notificationIcon");

        if (ultimoTotalPedidosAbertos === null) {
            ultimoTotalPedidosAbertos = contagem.aberto;
            return;
        }

        if (contagem.aberto > ultimoTotalPedidosAbertos) {
            notificacao.style.display = "block"; // Mostra a notificação
            notificacao.classList.add("sino-animado"); // Adiciona o efeito de balanço
        }

        ultimoTotalPedidosAbertos = contagem.aberto;

    } catch (error) {
        console.error("Erro ao verificar novos pedidos:", error);
    }
}

// Quando o usuário clicar na notificação, remover a animação
document.getElementById("notificationIcon").addEventListener("click", () => {
    buscarPedidos("aberto", "pedidosAberto");
    buscarPedidos("atendimento", "pedidosAtendimento");
    buscarPedidos("finalizado", "pedidosFinalizado");
    buscarPedidos("cancelado", "pedidosCancelado");
    buscarContagem();

    const notificacao = document.getElementById("notificationIcon");
    notificacao.style.display = "none"; 
    notificacao.classList.remove("sino-animado"); // Remove a animação após o clique
});

// Executa imediatamente ao carregar a página para armazenar a contagem inicial
document.addEventListener("DOMContentLoaded", async () => {
    await buscarContagem(); // Obtém a contagem real ao carregar a página
    await verificarNovosPedidos(); // Faz a primeira verificação

    // A cada 10 segundos, verifica se há novos pedidos
    setInterval(verificarNovosPedidos, 10000);
});

