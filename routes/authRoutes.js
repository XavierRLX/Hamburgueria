const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

router.post('/loginAuth', async (req, res) => {  // Alterado para loginAuth
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return res.status(400).json({ message: "Usuário ou senha incorretos." });
    }

    req.session.userId = data.user.id;

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

    if (!profileError && profile) {
        req.session.role = profile.role;
    }

    req.session.save(err => {
        if (err) {
            console.error("Erro ao salvar sessão:", err);
            return res.status(500).json({ message: "Erro interno ao salvar sessão." });
        }
        res.json({ message: "Login bem-sucedido", redirect: "/" });
    });
});

// Rota de logout corrigida
router.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Erro ao sair." });
        }
        res.redirect('/login');
    });
});

module.exports = router;
