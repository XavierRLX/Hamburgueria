const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express(); // 🔴 Defina app primeiro!
const port = 3000;

// Adicionando middleware de parsing (DEPOIS de definir app)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configuração do Supabase
const supabaseUrl = 'https://uweicybzciidmyumejzm.supabase.co';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3ZWljeWJ6Y2lpZG15dW1lanptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MjYzOTgsImV4cCI6MjA0NTMwMjM5OH0.xxcr3nzb0_bHISQvlBwiV0kDSNOieQa6eem7hbLc8Zk';
const agent = new https.Agent({ rejectUnauthorized: false });
const supabase = createClient(supabaseUrl, apiKey, { global: { fetch: (url, options) => fetch(url, { ...options, agent }) } });

// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'chaveSuperSecreta',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Servindo arquivos estáticos
app.use('/style', express.static(path.join(__dirname, 'public/style')));
app.use('/javaScript', express.static(path.join(__dirname, 'public/javaScript')));
app.use('/projeto-base', express.static(path.join(__dirname, 'projeto-base/src')));

// Middleware para verificar autenticação e role de admin
async function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', req.session.userId)
    .single();

  if (error || !data || data.role !== 'admin') {
    return res.status(403).send('Acesso negado');
  }

  next();
}

// Rotas do site
const routes = [
  { path: '/', file: 'index.html' },
  { path: '/cardapio',    file: 'index.html' },
  { path: '/admPedidos',  file: 'admPedidos.html', protected: true },
  { path: '/admProdutos', file: 'admProdutos.html', protected: true },
  { path: '/login',       file: 'login.html'}
];

routes.forEach(route => {
  if (route.protected) {
    app.get(route.path, isAuthenticated, (req, res) => {
      res.sendFile(path.join(__dirname, `public/html/${route.file}`));
    });
  } else {
    app.get(route.path, (req, res) => {
      res.sendFile(path.join(__dirname, `public/html/${route.file}`));
    });
  }
});

// Página de login
app.post('/login', async (req, res) => {
  console.log("Recebendo tentativa de login..."); // Verifica se a requisição chega
  
  const { email, password } = req.body;
  console.log("Dados recebidos:", { email, password }); // Mostra os dados recebidos

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data?.user) {
    console.log("Erro no login:", error?.message);
    return res.status(400).json({ message: "Erro no login: " + (error?.message || "Usuário não encontrado") });
  }

  console.log("Login bem-sucedido para:", data.user.email);

  req.session.userId = data.user.id;

  res.json({ message: "Login bem-sucedido", redirect: "/" });
});


// Rota para logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Inicializando o servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
