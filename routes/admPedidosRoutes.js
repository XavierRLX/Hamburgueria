const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient'); 

// 🔹 Buscar pedidos (com status opcional)
router.get('/pedidosAdm', async (req, res) => {
    try {
        console.log("🔹 Rota '/api/pedidosAdm' foi chamada!");
        const { status } = req.query;
        console.log("🔹 Status recebido:", status);

        let query = supabase.from('pedidos').select('*').order('data', { ascending: true });

        if (status && status !== "todos") {
            query = query.eq('status', status);
        }

        const { data, error } = await query;
        
        if (error) throw error;

        console.log("✅ Pedidos retornados:", data);
        res.json(data);
    } catch (err) {
        console.error("🔴 Erro na requisição:", err.message);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});


// 🔹 Contar pedidos por status
router.get('/pedidosAdm/contagem', async (req, res) => {
    console.log("🔹 Rota '/api/pedidosAdm/contagem' foi chamada!");

    // Consulta correta para contar pedidos por status
    const { data, error } = await supabase
        .from('pedidos')
        .select('status', { count: 'exact' });

    if (error) {
        console.error("🔴 Erro no Supabase ao buscar status:", error.message);
        return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
        console.warn("⚠️ Nenhum pedido encontrado!");
    }

    console.log("✅ Status dos pedidos retornados:", data);

    // Inicializa os contadores para cada status
    const contagem = {
        aberto: 0,
        atendimento: 0,
        finalizado: 0,
        cancelado: 0
    };

    // Agrupa a contagem manualmente
    data.forEach(pedido => {
        if (contagem[pedido.status] !== undefined) {
            contagem[pedido.status]++;
        } else {
            console.warn(`⚠️ Status desconhecido encontrado: ${pedido.status}`);
        }
    });

    res.json(contagem);
});




module.exports = router;
