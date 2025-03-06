const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Variáveis de ambiente
const isProduction = process.env.NODE_ENV === 'production';
const SUPABASE_DATABASE_URL = process.env.SUPABASE_DATABASE_URL;
const SESSION_SECRET = process.env.SESSION_SECRET || 'chaveSuperSecreta';
const app = express();
const port = process.env.PORT || 3000;

// SSL autoassinado (apenas se necessário)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Configuração do CORS
app.use(cors({
  origin: isProduction ? 'dreamlanchesrj.up.railway.app' : '*',
  credentials: true
}));

app.set('trust proxy', 1); // Confia nos proxies do Railway

// Middleware para parsing de JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuração do banco de dados (Supabase PostgreSQL)
const pool = new Pool({
  connectionString: SUPABASE_DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined, // Corrigido
});

// Teste de conexão ao banco de dados
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Conectado ao banco de dados PostgreSQL!");
    client.release();
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco de dados:", err.message);
  }
})();

// Configuração do armazenamento de sessões no PostgreSQL
const store = new pgSession({
  pool: pool,
  tableName: 'sessions',
});

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Apenas cria sessão quando necessário
  store: store,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax'
  }
}));

// Verifica a sessão no middleware (apenas em dev)
if (!isProduction) {
  app.use((req, res, next) => {
    console.log("🟢 Sessão ativa:", req.session);
    next();
  });
}

// Importação de rotas
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const admPedidosRoutes = require('./routes/admPedidosRoutes');
const alterarStatusLoja = require('./routes/alterarStatusRoutes');
const admProdutoRoutes = require('./routes/admProdutoRoutes');
const admCategoriaRoutes = require('./routes/admCategoriaRoutes');

// Definição das rotas
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', admPedidosRoutes);
app.use('/api', alterarStatusLoja);
app.use('/api', admProdutoRoutes);
app.use('/api', admCategoriaRoutes);

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Função de autenticação para rotas protegidas
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

// Roteamento de páginas HTML
const routes = [
  { path: '/', file: 'index.html' },
  { path: '/cardapio', file: 'index.html' },
  { path: '/admPedidos', file: 'admPedidos.html', protected: true },
  { path: '/admProdutos', file: 'admProdutos.html', protected: true },
  { path: '/statusPedido', file: 'statusPedidos.html' },
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

// Middleware global de erro
app.use((err, req, res, next) => {
  console.error("❌ Erro no servidor:", err.message);
  res.status(500).json({ error: "Erro interno no servidor" });
});

// Inicializando o servidor
app.listen(port, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${port}`);
});
