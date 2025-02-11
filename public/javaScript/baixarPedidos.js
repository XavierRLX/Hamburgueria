async function baixarPedidos() {
    const url = `/api/pedidosAdm/baixarPedidos`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error("Erro ao obter dados do Supabase");

        const data = await response.json();

        if (!data || data.length === 0) {
            alert("Nenhum pedido disponível para download.");
            return;
        }

        // Criar um cabeçalho personalizado para a planilha
        const ws = XLSX.utils.json_to_sheet(data, {
            header: ["pkPedido", "nome", "itensPedido", "detalhes", "formaPagamento", "totalPedido", "status", "data"]
        });

        // Criar o arquivo Excel
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Pedidos");

        // Baixar o arquivo
        XLSX.writeFile(wb, "pedidos.xlsx");

    } catch (error) {
        alert('Erro ao baixar os pedidos.');
        console.error(error);
    }
}
