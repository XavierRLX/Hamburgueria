const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Middleware para parsing de JSON e formulários
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const indexRoutes = require('./routes/indexRoutes');


// Configuração do Supabase com variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const apiKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, apiKey);

// Configuração da sessão
// Configuração da sessão (DEVE VIR ANTES DAS ROTAS!)
app.use(session({
  secret: process.env.SESSION_SECRET || 'chaveSuperSecreta',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Cookies seguros apenas em produção
    httpOnly: true, // Protege contra ataques XSS
  }
}));

app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);


// Servindo arquivos estáticos
app.use('/style', express.static(path.join(__dirname, 'public/style')));
app.use('/javaScript', express.static(path.join(__dirname, 'public/javaScript')));
app.use('/projeto-base', express.static(path.join(__dirname, 'projeto-base/src')));

// Middleware para verificar autenticação e papel de administrador
async function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/loginAuth');
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

async function verificarLogin() {
  const response = await fetch('/api/auth/loginAuth', {  // Agora está dentro de uma função async
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
  });
}


// Inicializando o servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
