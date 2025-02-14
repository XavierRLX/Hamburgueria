const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session); // ✅ Certifique-se de importar aqui
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ⚠️ Se precisar de SSL autoassinado, mantenha isso. Caso contrário, remova esta linha!
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// const corsOptions = {
//   origin: "hamburgueria-production-d072.up.railway.app", // 🔹 Substitua pelo seu domínio real
//   credentials: true, // 🔹 Permite envio de cookies de sessão
// };
// app.use(cors(corsOptions));

// 🔹 Middleware para parsing de JSON e formulários
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 🔹 Rotas
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const admPedidosRoutes = require('./routes/admPedidosRoutes');
const alterarStatusLoja = require('./routes/alterarStatusRoutes')
const admProdutoRoutes = require('./routes/admProdutoRoutes');
const admCategoriaRoutes = require('./routes/admCategoriaRoutes');

// 🔹 Configuração do Supabase com variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const apiKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, apiKey);

// 🔹 Configuração da sessão
app.use(session({
  // store: new pgSession({
  //   conString: process.env.SUPABASE_DATABASE_URL, // 🔹 Certifique-se de definir essa variável no .env
  //   ssl: {
  //     rejectUnauthorized: false, // 🔹 Necessário para conexão com Supabase
  //   }
  // }),
  secret: process.env.SESSION_SECRET || 'chaveSuperSecreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // 🔒 Ativa HTTPS em produção
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));


// 🔹 Middleware para tornar o usuário disponível globalmente
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.user = req.session.userId;
  }
  next();
});

// 🔹 Adicionando as rotas
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', admPedidosRoutes);
app.use('/api', alterarStatusLoja);
app.use('/api', admProdutoRoutes);
app.use('/api', admCategoriaRoutes);

// 🔹 Servindo arquivos estáticos
app.use('/style', express.static(path.join(__dirname, 'public/style')));
app.use('/javaScript', express.static(path.join(__dirname, 'public/javaScript')));
app.use('/projeto-base', express.static(path.join(__dirname, 'projeto-base/src')));

// 🔹 Middleware para verificar autenticação e papel de administrador
async function isAuthenticated(req, res, next) {
  console.log("🔹 Verificando sessão do usuário:", req.session); // Depuração

  if (!req.session.userId) {
    return res.redirect('/login');
  }

  // Verifica se o papel do usuário já está na sessão
  if (!req.session.role) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.session.userId)
      .single();

    if (error || !data) {
      console.error("⚠️ Erro ao buscar papel do usuário:", error);
      return res.status(403).send('Acesso negado');
    }

    req.session.role = data.role; // Armazena o papel do usuário na sessão
  }

  if (req.session.role !== 'admin') {
    return res.status(403).send('Acesso negado');
  }

  next();
}

// 🔹 Rotas públicas e protegidas
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

// 🔹 Middleware para verificar sessão via API (para frontend)
app.get('/api/auth/verificarSessao', (req, res) => {
  res.json({ logado: !!req.session.userId, userId: req.session.userId || null });
});

// 🔹 Inicializando o servidor
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
