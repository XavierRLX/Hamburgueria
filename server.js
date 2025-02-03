const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Middleware para parsing de JSON e formulários
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configuração do Supabase com variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const apiKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, apiKey);

// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'chaveSuperSecreta',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Cookies seguros apenas em produção
    httpOnly: true, // Protege contra ataques XSS
  }
}));

// Servindo arquivos estáticos
app.use('/style', express.static(path.join(__dirname, 'public/style')));
app.use('/javaScript', express.static(path.join(__dirname, 'public/javaScript')));
app.use('/projeto-base', express.static(path.join(__dirname, 'projeto-base/src')));

// Middleware para verificar autenticação e papel de administrador
async function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  if (!req.session.role) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.session.userId)
      .single();

    if (error || !data) {
      return res.status(403).send('Acesso negado');
    }

    req.session.role = data.role; // Armazena o papel do usuário na sessão
  }

  if (req.session.role !== 'admin') {
    return res.status(403).send('Acesso negado');
  }

  next();
}

// Rotas públicas e protegidas
const routes = [
  { path: '/', file: 'index.html' },
  { path: '/cardapio', file: 'index.html' },
  { path: '/admPedidos', file: 'admPedidos.html', protected: true },
  { path: '/admProdutos', file: 'admProdutos.html', protected: true },
  { path: '/login', file: 'login.html' }
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

// Rota de login
app.post('/login', async (req, res) => {
  console.log("Recebendo tentativa de login...");

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.log("Erro no login:", error.message);
    let errorMessage = "Usuário ou senha incorretos.";

    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "E-mail ou senha inválidos.";
    } else if (error.message.includes("User not confirmed")) {
      errorMessage = "Confirme seu e-mail antes de entrar.";
    }

    return res.status(400).json({ message: errorMessage });
  }

  console.log("Login bem-sucedido para:", data.user.email);
  
  req.session.userId = data.user.id;

  // Busca e armazena o papel do usuário
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (!profileError && profile) {
    req.session.role = profile.role;
  }

  res.json({ message: "Login bem-sucedido", redirect: "/" });
});

// Rota de logout
app.get('/logout', async (req, res) => {
  if (req.session.userId) {
    await supabase.auth.signOut(); // Invalida o token no Supabase
  }

  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Inicializando o servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
