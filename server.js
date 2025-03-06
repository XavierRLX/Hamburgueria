const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// Verificando variáveis de ambiente obrigatórias
const supabaseUrl = process.env.SUPABASE_URL;
const apiKey = process.env.SUPABASE_KEY;
const app = express();
const port = process.env.PORT || 3000;

// SSL autoassinado
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Configuração do CORS
app.use(cors({
  origin: isProduction ? 'https://hamburgueria-production-445d.up.railway.app' : '*',
  credentials: true
}));

app.set('trust proxy', 1); // Confia nos proxies do Railway

// Middleware para parsing de JSON e formulários
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Rotas
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const admPedidosRoutes = require('./routes/admPedidosRoutes');
const alterarStatusLoja = require('./routes/alterarStatusRoutes');
const admProdutoRoutes = require('./routes/admProdutoRoutes');
const admCategoriaRoutes = require('./routes/admCategoriaRoutes');

// Configuração da sessão (sem Redis)
app.use(session({
  secret: process.env.SESSION_SECRET || 'chaveSuperSecreta',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax'
  }
}));

// Verifica a sessão
app.use((req, res, next) => {
  console.log("🟢 Verificando sessão no middleware:", req.session);
  next();
});

// Adicionando as rotas
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', admPedidosRoutes);
app.use('/api', alterarStatusLoja);
app.use('/api', admProdutoRoutes);
app.use('/api', admCategoriaRoutes);

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Roteamento das páginas HTML
const routes = [
  { path: '/', file: 'index.html' },
  { path: '/cardapio', file: 'index.html' },
  { path: '/admPedidos', file: 'admPedidos.html'},
  { path: '/admProdutos', file: 'admProdutos.html'},
  { path: '/statusPedido', file: 'statusPedidos.html' },
  { path: '/login', file: 'login.html' }
];

// Função de autenticação
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

// Usando as rotas protegidas e não protegidas
routes.forEach(route => {
  app.get(route.path, route.protected ? isAuthenticated : (req, res) => {
    res.sendFile(path.join(__dirname, `public/html/${route.file}`));
  });
});

// Inicializando o servidor
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
