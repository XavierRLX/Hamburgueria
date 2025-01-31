process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
require('dotenv').config();

const supabaseUrl = 'https://uweicybzciidmyumejzm.supabase.co';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3ZWljeWJ6Y2lpZG15dW1lanptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MjYzOTgsImV4cCI6MjA0NTMwMjM5OH0.xxcr3nzb0_bHISQvlBwiV0kDSNOieQa6eem7hbLc8Zk';
const serviceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3ZWljeWJ6Y2lpZG15dW1lanptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTcyNjM5OCwiZXhwIjoyMDQ1MzAyMzk4fQ.LegQKtlJY5XyxAO09mc0mVmuKrx70PQneUrsz21at8E' ;
const agent = new https.Agent({ rejectUnauthorized: false });
const supabase = createClient(supabaseUrl, serviceRole, { global: { fetch: (url, options) => fetch(url, { ...options, agent }) } });

async function createUser(email, password, name, role = 'user') {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data?.user) {
    console.error('Erro ao criar usuário:', error?.message || 'Erro desconhecido');
    return;
  }

  const userId = data.user.id;

  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ id: userId, nameprofile: name, role }]);

  if (profileError) {
    console.error('Erro ao criar perfil:', profileError.message);
    return;
  }

  console.log(`Usuário ${email} criado com sucesso como ${role}!`);
}

// Criar um usuário admin para teste
createUser('dreamslanchesrj@gmail.com', 'lanchoneteDL24@', 'Administrador', 'admin');
