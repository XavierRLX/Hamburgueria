const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Rota para buscar o status da loja
router.get('/status-loja', async (req, res) => {
    const { data, error } = await supabase
        .from('statusLoja')
        .select('online')
        .limit(1)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Rota para alterar o status da loja
router.patch('/status-loja', async (req, res) => {
    try {
        // Buscar o status atual da loja
        const { data: statusData, error: fetchError } = await supabase
            .from('statusLoja')
            .select('online')
            .limit(1)
            .single();

        if (fetchError) return res.status(500).json({ error: fetchError.message });

        // Invertendo o status
        const novoStatus = !statusData.online;

        // Atualizando o status na base de dados
        const { error: updateError } = await supabase
            .from('statusLoja')
            .update({ online: novoStatus })
            .eq('pkstatusloja', 1);

        if (updateError) return res.status(500).json({ error: updateError.message });

        res.json({ message: 'Status da loja atualizado com sucesso!', online: novoStatus });
    } catch (error) {
        console.error('Erro ao atualizar status da loja:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

module.exports = router;
