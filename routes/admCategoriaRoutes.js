const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient"); // Certifique-se de importar o Supabase corretamente

// 🔹 Rota para listar categorias
router.get("/categoriaAdm/listar", async (req, res) => {
    const { data, error } = await supabase
        .from("categoria")
        .select("*");

    if (error) {
        console.error("Erro ao buscar categorias:", error.message);
        return res.status(500).json({ erro: "Erro ao buscar categorias." });
    }

    res.json(data);
});

// 🔹 Rota para excluir categoria
router.delete("/categoriaAdm/categoria/excluir/:pkCategoria", async (req, res) => {
    const { pkCategoria } = req.params;

    const { error } = await supabase
        .from("categoria")
        .delete()
        .match({ pkCategoria });

    if (error) {
        console.error("Erro ao excluir categoria:", error.message);
        return res.status(500).json({ erro: "Erro ao excluir categoria." });
    }

    res.json({ sucesso: true, mensagem: "Categoria excluída com sucesso!" });
});

// 🔹 Rota para cadastrar uma categoria
router.post("/produtoAdm/categoria/cadastrar", async (req, res) => {
    const { nome, senhaCadastro } = req.body;

    if (senhaCadastro !== "2000") {
        return res.status(403).json({ erro: "Código de acesso incorreto." });
    }

    if (!nome) {
        return res.status(400).json({ erro: "Preencha todos os campos corretamente." });
    }

    const { data, error } = await supabase
        .from("categoria")
        .insert([{ nome }]);

    if (error) {
        console.error("Erro ao cadastrar categoria:", error.message);
        return res.status(500).json({ erro: "Erro ao cadastrar categoria." });
    }

    res.status(201).json({ sucesso: true, mensagem: "Categoria cadastrada com sucesso!" });
});

module.exports = router;
