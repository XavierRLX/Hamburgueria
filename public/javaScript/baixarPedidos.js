async function baixarPedidos() {
    const url = `${supabaseUrl}/rest/v1/pedidos?select=*`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) throw new Error("Erro ao obter dados do Supabase");

        const data = await response.json();

        // Criar a planilha com SheetJS
        const ws = XLSX.utils.json_to_sheet(data);

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