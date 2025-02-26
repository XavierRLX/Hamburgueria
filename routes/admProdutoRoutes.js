const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// 🔹 Rota para buscar produtos com filtro por nome
router.get("/produtoAdm/listar", async (req, res) => {
    const buscaNome = req.query.nome || ""; 

    const { data, error } = await supabase
        .from("produtos")
        .select("*, fkCategoria(nome)")
        .ilike("nome", `%${buscaNome}%`);

    if (error) {
        console.error("Erro ao buscar produtos:", error.message);
        return res.status(500).json({ erro: "Erro ao buscar produtos." });
    }

    res.json(data);
});

// 🔹 Rota para excluir um produto
router.delete("/produtoAdm/excluir/:pkProduto", async (req, res) => {
    const { pkProduto } = req.params;

    if (!pkProduto) {
        return res.status(400).json({ erro: "ID do produto não fornecido!" });
    }

    const { error } = await supabase
        .from("produtos")
        .delete()
        .eq("pkProduto", pkProduto);

    if (error) {
        console.error("Erro ao excluir produto:", error.message);
        return res.status(500).json({ erro: "Erro ao excluir produto." });
    }

    res.status(204).send(); 
});

// 🔹 Rota para ativar/inativar um produto
router.patch("/produtoAdm/toggleAtivo/:pkProduto", async (req, res) => {
    const { pkProduto } = req.params;
    const { ativo } = req.body;

    if (typeof ativo !== "boolean") {
        return res.status(400).json({ erro: "O status ativo deve ser booleano (true ou false)!" });
    }

    const { error } = await supabase
        .from("produtos")
        .update({ ativo })
        .eq("pkProduto", pkProduto);

    if (error) {
        console.error("Erro ao atualizar status do produto:", error.message);
        return res.status(500).json({ erro: "Erro ao atualizar status do produto." });
    }

    res.json({ sucesso: true, mensagem: `Produto ${ativo ? "ativado" : "inativado"} com sucesso!` });
});


// 🔹 Rota para listar categorias
router.get("/produtoAdm/categoria/listar", async (req, res) => {
    const { data, error } = await supabase
        .from("categoria")
        .select("pkCategoria, nome");

    if (error) {
        console.error("Erro ao buscar categorias:", error.message);
        return res.status(500).json({ erro: "Erro ao buscar categorias." });
    }

    res.json(data);
});

// 🔹 Rota para fazer upload de imagem
router.post("/produtoAdm/upload/imagem", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ erro: "Arquivo não enviado." });
    }

    const file = req.file;
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ erro: "Formato de imagem inválido." });
    }

    if (file.size > maxSize) {
        return res.status(400).json({ erro: "Arquivo muito grande. Máximo 5MB." });
    }

    const bucketName = "imgs";
    const fileName = `${Date.now()}-${file.originalname}`;

    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (error) {
            throw error;
        }

        // 🔹 Obtendo a URL pública corretamente
        const fotoUrl = `https://uweicybzciidmyumejzm.supabase.co/storage/v1/object/public/${bucketName}/${fileName}`;

        res.json({ url: fotoUrl });
    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error.message);
        res.status(500).json({ erro: "Erro ao fazer upload da imagem." });
    }
});


router.post("/produtoAdm/cadastrar", async (req, res) => {
    const { nome, descricao, preco, fkCategoria, fotoUrl, senhaCadastro } = req.body;

    if (!fotoUrl) {
        return res.status(400).json({ erro: "URL da imagem não foi enviada." });
    }

    try {
        const { data, error } = await supabase
            .from("produtos")
            .insert([{ nome, descricao, preco, fotoUrl, fkCategoria }]);

        if (error) throw error;

        res.status(201).json({ sucesso: true, mensagem: "Produto cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar produto:", error.message);
        res.status(500).json({ erro: "Erro ao cadastrar produto." });
    }
});

module.exports = router;
