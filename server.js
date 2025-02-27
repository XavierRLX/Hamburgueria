const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const RedisStore = require('connect-redis');
const { createClient: createSupabaseClient } = require('@supabase/supabase-js'); // Supabase
const { createClient: createRedisClient } = require('redis'); // Redis
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

app.set('trust proxy', 1); // Confia nos proxies do Railway

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
const supabase = createSupabaseClient(supabaseUrl, apiKey);


app.use((req, res, next) => {
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').map(c => c.trim());
    const sidCookies = cookies.filter(c => c.startsWith('connect.sid='));

    if (sidCookies.length > 1) {
      console.warn("🔴 Detectados múltiplos cookies connect.sid. Removendo antigos.");
      res.clearCookie('connect.sid'); // Remove o cookie antigo
    }
  }
  next();
});

const redisClient = createRedisClient({
    url: process.env.REDIS_URL, 
    legacyMode: true
});

if (isProduction) {
  const redisClient = createRedisClient({
    url: process.env.REDIS_URL,
    legacyMode: true
  });

  redisClient.connect().then(() => {
    console.log("Redis conectado com sucesso!");
    app.use(session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET || 'chaveSuperSecreta',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
        domain: 'hamburgueria-production-445d.up.railway.app'
      }
    }));
  }).catch(console.error);
} else {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'chaveSuperSecreta',
    resave: false,
    saveUninitialized: true,  // Para funcionar localmente sem Redis
    cookie: { secure: false }
  }));
}


// Verifica se a sessão está sendo configurada corretamente
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
