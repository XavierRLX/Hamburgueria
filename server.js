const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const port = process.env.PORT || 3000;

//  SSL autoassinado 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use(cors({
  origin: isProduction ? 'https:/hamburgueria-production-445d.up.railway.app' : '*',
  credentials: true
}));


// Middleware para parsing de JSON e formulários
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Rotas
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const admPedidosRoutes = require('./routes/admPedidosRoutes');
const alterarStatusLoja = require('./routes/alterarStatusRoutes')
const admProdutoRoutes = require('./routes/admProdutoRoutes');
const admCategoriaRoutes = require('./routes/admCategoriaRoutes');

// Configuração do Supabase com variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const apiKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, apiKey);

// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'chaveSuperSecreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction, 
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax', 
    maxAge: 24 * 60 * 60 * 1000,
  }
}));



// Adicionando as rotas
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', admPedidosRoutes);
app.use('/api', alterarStatusLoja);
app.use('/api', admProdutoRoutes);
app.use('/api', admCategoriaRoutes);

// Servindo arquivos estáticos
app.use('/style', express.static(path.join(__dirname, 'public/style')));
app.use('/javaScript', express.static(path.join(__dirname, 'public/javaScript')));
app.use('/projeto-base', express.static(path.join(__dirname, 'projeto-base/src')));


// Rotas públicas e protegidas
const routes = [
  { path: '/', file: 'index.html' },
  { path: '/cardapio', file: 'index.html' },
  { path: '/admPedidos', file: 'admPedidos.html'},
  { path: '/admProdutos', file: 'admProdutos.html' },
  { path: '/statusPedido', file: 'statusPedidos.html'},
  { path: '/login', file: 'login.html' }
];

function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
      return next(); 
  }
  res.redirect('/login'); 
}

app.get('/admPedidos', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/admPedidos.html'));
});

app.get('/admProdutos', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/admProdutos.html'));
});


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

// 🔹 Inicializando o servidor
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
