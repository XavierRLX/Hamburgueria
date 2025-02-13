process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
require('dotenv').config();

const supabaseUrl = '1';
const apiKey = '1';
const serviceRole = '1' ;const agent = new https.Agent({ rejectUnauthorized: false });
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
