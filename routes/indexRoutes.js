const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Buscar categorias
router.get('/categorias', async (req, res) => {
    const { data, error } = await supabase.from('categoria').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Buscar produtos com filtro opcional por categoria
router.get('/produtosCardapio', async (req, res) => {
    const { categoria } = req.query; // Pegando o ID da categoria da query string

    let query = supabase.from('produtos').select('*').eq('ativo', true);

    if (categoria) {
        query = query.eq('fkCategoria', categoria); // Filtra por categoria, se fornecida
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Buscar status da loja
router.get('/status-loja', async (req, res) => {
    const { data, error } = await supabase
        .from('statusLoja')
        .select('online')
        .limit(1)
        .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
});

// Criar pedido
router.post('/Criarpedido', async (req, res) => {
    try {
        const {
            produtosCarrinho,
            nome,
            entrega,
            enderecoRua,
            referencia,
            pagamento,
            pagarDinheiro,
            totalCarrinho,
            taxasCarrinho,
            totalPedido,
            detalhes,
            mesa,
            numeroCelular
        } = req.body;

        // Consulta o último pedido para definir a nova chave primária (pkPedido)
        const { data: ultimoPedido, error: pedidoError } = await supabase
            .from('pedidos')
            .select('pkPedido')
            .order('pkPedido', { ascending: false })
            .limit(1)
            .single();

        if (pedidoError && pedidoError.code !== 'PGRST116') {
            return res.status(500).json({ error: 'Erro ao buscar último pedido' });
        }

        const novoPkPedido = ultimoPedido ? ultimoPedido.pkPedido + 1 : 1;

        // Formatar itens do pedido
        let itensPedido = produtosCarrinho.map(produto => 
            `#${produto.nome} (x ${produto.quantidade}) = R$ ${produto.preco}`
        ).join("\n\n");

        // Construir relatório do pedido para WhatsApp
        let relatorio = `Pedido #${novoPkPedido}:\n\n${itensPedido}\n\n`;
        relatorio += `. Observação: ${detalhes}\n\n. Nome: ${nome}\n\n`;

        if (mesa) relatorio += `. Mesa: ${mesa}\n\n`;

        const endereco = entrega && (enderecoRua || referencia) ? `${enderecoRua} - ${referencia}` : '';
        if (endereco) relatorio += `. Endereço: ${endereco}\n\n`;

        relatorio += `. Forma de Pagamento: ${pagamento}\n\n`;
        relatorio += `Pedido: R$ ${totalCarrinho}\n\n`;
        relatorio += `Taxa: R$ ${taxasCarrinho}\n\n`;
        relatorio += `Total: R$ ${totalPedido}\n\n`;

        if (pagamento === "dinheiro") {
            relatorio += `Valor a Pagar: ${pagarDinheiro}\n\n`;
        }

        const numeroWhatsApp = "+5521964734161";
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(relatorio)}`;

        // Inserir pedido no banco de dados
        const { data, error } = await supabase
            .from('pedidos')
            .insert([{
                pkPedido: novoPkPedido,
                itensPedido,
                detalhes,
                nome,
                endereco,
                mesa,
                numeroCelular,
                formaPagamento: pagamento,
                taxas: taxasCarrinho,
                totalPedido
            }]);

        if (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar pedido' });
        }

        // Retorna sucesso e a URL do WhatsApp
        res.json({
            message: `Pedido cadastrado com sucesso! Seu número de pedido é #${novoPkPedido}.`,
            pkPedido: novoPkPedido,
            whatsappUrl: urlWhatsApp
        });

    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

module.exports = router;

