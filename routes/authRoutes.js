const express = require('express');
const router = express.Router();  
const { supabase } = require('../supabaseClient');
require('dotenv').config();


router.post('/loginAuth', async (req, res) => {
    console.log("📌 Sessão antes da autenticação:", req.session); // 👀 Log da sessão

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
        return res.status(400).json({ message: "Usuário ou senha incorretos." });
    }

    if (!req.session) {
        return res.status(500).json({ message: "Erro: Sessão não inicializada corretamente." });
    }

    req.session.userId = data.user.id;
    req.session.save(err => {
        if (err) {
            console.error("Erro ao salvar sessão:", err);
            return res.status(500).json({ message: "Erro ao salvar sessão." });
        }
        console.log("✅ Sessão salva com sucesso:", req.session);
        res.json({ message: "Login bem-sucedido", redirect: "/admPedidos" });
    });
});


router.get('/session', (req, res) => {
    console.log("🔍 Verificando sessão:", req.session); 
    if (req.session && req.session.userId) {
        return res.json({ authenticated: true, userId: req.session.userId });
    } 
    res.status(401).json({ authenticated: false });
});

// Rota de logout
router.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Erro ao sair." });
        }
        res.clearCookie('connect.sid'); 
        res.json({ message: "Logout realizado com sucesso" });
    });
});

module.exports = router;  
