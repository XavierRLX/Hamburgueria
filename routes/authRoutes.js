const express = require('express');
const router = express.Router();  // 🔹 Correção: Definir a variável router
const { supabase } = require('../supabaseClient');
require('dotenv').config();


router.post('/loginAuth', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return res.status(400).json({ message: "Usuário ou senha incorretos." });
    }

    req.session.userId = data.user.id; // Salva o ID do usuário na sessão

    req.session.save(err => {
        if (err) {
            console.error("Erro ao salvar sessão:", err);
            return res.status(500).json({ message: "Erro interno ao salvar sessão." });
        }
        res.json({ message: "Login bem-sucedido", redirect: "/admPedidos" });
    });
});



// Rota de logout
router.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Erro ao sair." });
        }
        res.json({ message: "Logout realizado com sucesso" });
    });
});


module.exports = router;  // 🔹 Exportando corretamente o router
