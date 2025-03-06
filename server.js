const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session); // Usando o connect-pg-simple
const { Pool } = require('pg'); // Biblioteca para conexão com o PostgreSQL
const cors = require('cors');
require('dotenv').config();

// Variáveis de ambiente
const isProduction = process.env.NODE_ENV === 'production';
const SUPABASE_DATABASE_URL = process.env.SUPABASE_DATABASE_URL;
const SESSION_SECRET = process.env.SESSION_SECRET || 'chaveSuperSecreta';
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

// Configuração do banco de dados (usando Supabase PostgreSQL)
const pool = new Pool({
  connectionString: SUPABASE_DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Usando o connect-pg-simple para armazenar sessões no banco de dados
const store = new pgSession({
  pool: pool, // A conexão com o banco de dados do Supabase
  tableName: 'sessions', // Nome da tabela que vai armazenar as sessões
});

// Configuração da sessão usando o PostgreSQL
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store, // Usando o armazenamento do PostgreSQL
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

// Rotas
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const admPedidosRoutes = require('./routes/admPedidosRoutes');
const alterarStatusLoja = require('./routes/alterarStatusRoutes');
const admProdutoRoutes = require('./routes/admProdutoRoutes');
const admCategoriaRoutes = require('./routes/admCategoriaRoutes');

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
