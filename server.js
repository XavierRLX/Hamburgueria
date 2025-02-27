const express = require('express'); // Importa o Express para criar o servidor web
const bodyParser = require('body-parser'); // Middleware para parsing do corpo das requisições (para JSON e URL encoded)
const path = require('path'); // Utilitário para lidar com caminhos de arquivos
const session = require('express-session'); // Middleware para gerenciar sessões de usuários
const RedisStore = require('connect-redis'); // Para armazenar sessões no Redis
const { createClient: createRedisClient } = require('redis'); // Cliente Redis para conectar com o servidor Redis
const { createClient: createSupabaseClient } = require('@supabase/supabase-js'); // Para se conectar ao Supabase
const cors = require('cors'); // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
require('dotenv').config(); // Carrega variáveis de ambiente a partir do arquivo .env

// Definindo se o ambiente de execução é de produção ou desenvolvimento
const isProduction = process.env.NODE_ENV === 'production';

// Verificando variáveis de ambiente obrigatórias para o funcionamento da aplicação
const supabaseUrl = process.env.SUPABASE_URL;
const apiKey = process.env.SUPABASE_KEY;
const redisUrl = process.env.REDIS_URL;

const app = express(); // Cria a instância do servidor Express
const port = process.env.PORT || 3000; // Define a porta do servidor, podendo ser configurada via variáveis de ambiente

// Configuração de SSL autoassinado, usado para evitar erros em ambientes de desenvolvimento (não recomendado em produção)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Configuração do CORS para permitir requisições de origens específicas, especialmente útil para APIs
app.use(cors({
  origin: isProduction ? 'https://hamburgueria-production-445d.up.railway.app' : '*', // Para produção, permite apenas a URL do Railway, e para desenvolvimento permite qualquer origem
  credentials: true // Permite o envio de cookies (necessário para sessões)
}));

// Configuração para confiar em proxies (como o Railway) que gerenciam conexões HTTPS
app.set('trust proxy', 1); // Quando a aplicação estiver atrás de um proxy (como no caso do Railway)

// Middleware para parsing de JSON e formulários
app.use(express.json()); // Para poder lidar com dados no formato JSON
app.use(bodyParser.urlencoded({ extended: false })); // Para lidar com formulários enviados via URL-encoded (método POST)


// Importando rotas (aqui você provavelmente separa a lógica das rotas em arquivos diferentes)
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const admPedidosRoutes = require('./routes/admPedidosRoutes');
const alterarStatusLoja = require('./routes/alterarStatusRoutes');
const admProdutoRoutes = require('./routes/admProdutoRoutes');
const admCategoriaRoutes = require('./routes/admCategoriaRoutes');

// Configuração do Supabase (um serviço de banco de dados e autenticação)
const supabase = createSupabaseClient(supabaseUrl, apiKey);

// Middleware para verificar se há múltiplos cookies `connect.sid` (usados para sessões). Se sim, remove os antigos.
app.use((req, res, next) => {
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').map(c => c.trim()); // Divide os cookies recebidos
    const sidCookies = cookies.filter(c => c.startsWith('connect.sid=')); // Filtra cookies de sessão

    // Se houver mais de um cookie `connect.sid`, remove o antigo para evitar conflitos
    if (sidCookies.length > 1) {
      console.warn("🔴 Detectados múltiplos cookies connect.sid. Removendo antigos.");
      res.clearCookie('connect.sid'); // Remove o cookie de sessão antigo
    }
  }
  next(); // Passa para o próximo middleware
});

// Configuração do Redis no ambiente de produção (para armazenar as sessões)
if (isProduction) {
  // Conectando-se ao Redis usando a URL configurada nas variáveis de ambiente
  const redisClient = createRedisClient({
    url: redisUrl,
    legacyMode: true // Habilita compatibilidade com versões mais antigas do Redis
  });

  // Tentando conectar ao Redis
  redisClient.connect().then(() => {
    console.log("Redis conectado com sucesso!");
  }).catch(console.error);

  // Usando o RedisStore para armazenar as sessões no Redis
  app.use(session({
    store: new RedisStore({ client: redisClient }), // Define o Redis como a store de sessões
    secret: process.env.SESSION_SECRET || 'chaveSuperSecreta', // Chave secreta para assinar a sessão
    resave: false, // Não resave a sessão se não houver alterações
    saveUninitialized: false, // Não salve a sessão se não houver dados modificados
    cookie: {
      secure: true, // Força o uso de HTTPS
      httpOnly: true, // Impede o acesso ao cookie via JavaScript no cliente
      sameSite: 'none', // Permite o compartilhamento de cookies entre domínios
      maxAge: 24 * 60 * 60 * 1000, // Define o tempo de vida do cookie (24 horas)
      domain: 'hamburgueria-production-445d.up.railway.app' // Domínio onde o cookie é válido
    }
  }));
} else {
  // Configuração de sessão no ambiente de desenvolvimento
  app.use(session({
    secret: process.env.SESSION_SECRET || 'chaveSuperSecreta', // Chave secreta
    resave: false,
    saveUninitialized: true, // Salva a sessão mesmo que não haja dados modificados
    cookie: {
      secure: false, // Em desenvolvimento não precisa de HTTPS
      httpOnly: true, // Impede o acesso ao cookie via JavaScript
      sameSite: 'lax' // Permite cookies entre subdomínios
    }
  }));
}

// Middleware para verificar se a sessão existe
app.use((req, res, next) => {
  console.log("🟢 Verificando sessão no middleware:", req.session); // Log de depuração para verificar a sessão
  next(); // Passa para o próximo middleware
});

// Adicionando as rotas à aplicação (chamando os arquivos de rotas já configurados)
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', admPedidosRoutes);
app.use('/api', alterarStatusLoja);
app.use('/api', admProdutoRoutes);
app.use('/api', admCategoriaRoutes);

// Servindo arquivos estáticos (como imagens e arquivos JS/CSS) a partir da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Definindo rotas para páginas HTML
const routes = [
  { path: '/', file: 'index.html' },
  { path: '/cardapio', file: 'index.html' },
  { path: '/admPedidos', file: 'admPedidos.html'},
  { path: '/admProdutos', file: 'admProdutos.html'},
  { path: '/statusPedido', file: 'statusPedidos.html' },
  { path: '/login', file: 'login.html' }
];

// Função de autenticação para proteger rotas
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) { // Verifica se a sessão contém um ID de usuário
    return next(); // Se estiver autenticado, permite o acesso
  }
  res.redirect('/login'); // Se não autenticado, redireciona para a página de login
}

// Usando as rotas protegidas e não protegidas
routes.forEach(route => {
  app.get(route.path, route.protected ? isAuthenticated : (req, res) => {
    res.sendFile(path.join(__dirname, `public/html/${route.file}`)); // Envia o arquivo HTML correspondente
  });
});

// Inicializa o servidor Express
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
