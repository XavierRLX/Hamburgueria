const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient'); 

// 🔹 Buscar pedidos (com status opcional)
router.get('/pedidosAdm', async (req, res) => {
    console.log("🔹 Rota '/api/pedidosAdm' foi chamada!");
    const { status } = req.query;

    let query = supabase.from('pedidos').select('*').order('data', { ascending: true });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;
    
    if (error) {
        console.error("🔴 Erro no Supabase:", error.message);
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

// 🔹 Atualizar status do pedido
router.patch('/pedidosAdm/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
        .from('pedidos')
        .update({ status })
        .eq('pkPedido', id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Status atualizado com sucesso', data });
});

// 🔹 Contar pedidos por status
router.get('/pedidosAdm/contagem', async (req, res) => {
    console.log("🔹 Rota '/api/pedidosAdm/contagem' foi chamada!");

    const { data, error } = await supabase.from('pedidos').select('status');

    if (error) {
        console.error("🔴 Erro no Supabase:", error.message);
        return res.status(500).json({ error: error.message });
    }

    // Contagem dos pedidos por status
    const contagem = {
        aberto: 0,
        atendimento: 0,
        finalizado: 0,
        cancelado: 0
    };

    data.forEach(pedido => {
        if (contagem[pedido.status] !== undefined) {
            contagem[pedido.status]++;
        }
    });

    res.json(contagem);
});

module.exports = router;
