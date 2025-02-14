const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testarConexao() {
    try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1);

        if (error) {
            throw new Error(`Erro ao conectar: ${error.message}`);
        }

        console.log("✅ Conexão bem-sucedida!", data);
    } catch (error) {
        console.error("❌ Erro de conexão:", error.message);
        console.error("Detalhes:", error);
    }
}

testarConexao();
