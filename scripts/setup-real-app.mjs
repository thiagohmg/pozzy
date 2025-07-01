#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Configurando Pozzy para produção real...\n');

// Função para verificar se um comando existe
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Função para executar comandos
function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} concluído!\n`);
  } catch (error) {
    console.error(`❌ Erro em ${description}:`, error.message);
    process.exit(1);
  }
}

// Função para criar arquivo .env
function createEnvFile() {
  console.log('🔧 Criando arquivo .env...');
  
  const envContent = `# Pozzy - Configuração de Produção
# Copie este arquivo para .env e preencha com suas chaves reais

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Payment APIs
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
VITE_STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Product APIs
VITE_MERCADO_LIVRE_API_KEY=your_mercadolivre_api_key_here
VITE_GOOGLE_SHOPPING_API_KEY=your_google_shopping_api_key_here
VITE_PINTEREST_ACCESS_TOKEN=your_pinterest_access_token_here
VITE_UNSPLASH_CLIENT_ID=your_unsplash_client_id_here

# AI APIs
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_REPLICATE_API_TOKEN=your_replicate_api_token_here

# Social Auth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_FACEBOOK_APP_ID=your_facebook_app_id_here

# Analytics
VITE_GOOGLE_ANALYTICS_ID=your_ga_id_here
VITE_HOTJAR_ID=your_hotjar_id_here

# Email Service
VITE_SENDGRID_API_KEY=your_sendgrid_api_key_here
VITE_FROM_EMAIL=noreply@pozzy.com.br

# App Configuration
VITE_APP_NAME=Pozzy
VITE_APP_URL=https://pozzy.com.br
VITE_API_URL=https://api.pozzy.com.br

# Feature Flags
VITE_ENABLE_REAL_PAYMENTS=true
VITE_ENABLE_AI_ANALYSIS=true
VITE_ENABLE_SOCIAL_AUTH=true
VITE_ENABLE_ANALYTICS=true
`;

  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', envContent);
    console.log('✅ Arquivo .env criado! Preencha com suas chaves reais.\n');
  } else {
    console.log('⚠️  Arquivo .env já existe. Verifique se todas as chaves estão configuradas.\n');
  }
}

// Função para instalar dependências
function installDependencies() {
  console.log('📦 Instalando dependências...');
  
  const dependencies = [
    '@stripe/stripe-js',
    '@supabase/supabase-js',
    'openai',
    'replicate',
    'sendgrid',
    'hotjar',
    'react-ga4',
    'input-otp',
    'lucide-react',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-select',
    '@radix-ui/react-slider',
    '@radix-ui/react-toast',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'date-fns',
    'react-hook-form',
    '@hookform/resolvers',
    'zod'
  ];

  try {
    execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Dependências instaladas!\n');
  } catch (error) {
    console.error('❌ Erro ao instalar dependências:', error.message);
    process.exit(1);
  }
}

// Função para configurar Supabase
function setupSupabase() {
  console.log('🗄️  Configurando Supabase...');
  
  const supabaseConfig = `
# Configuração do Supabase
# 1. Crie uma conta em https://supabase.com
# 2. Crie um novo projeto
# 3. Vá em Settings > API
# 4. Copie as URLs e chaves para o .env

# Exemplo de configuração:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Tabelas necessárias:
# - users
# - products
# - wishlists
# - wishlist_items
# - mood_boards
# - user_usage
# - user_searches
# - user_interactions
# - saved_outfits
# - subscriptions
`;

  console.log(supabaseConfig);
  console.log('📋 Execute as migrações do Supabase:\n');
  console.log('1. npx supabase login');
  console.log('2. npx supabase link --project-ref YOUR_PROJECT_REF');
  console.log('3. npx supabase db push\n');
}

// Função para configurar Stripe
function setupStripe() {
  console.log('💳 Configurando Stripe...');
  
  const stripeConfig = `
# Configuração do Stripe
# 1. Crie uma conta em https://stripe.com
# 2. Vá em Developers > API keys
# 3. Copie as chaves para o .env

# Produtos necessários:
# - price_premium_monthly (R$ 29,90/mês)
# - price_premium_yearly (R$ 299,90/ano)

# Webhook endpoints:
# - /api/stripe/webhook (para processar eventos)
`;

  console.log(stripeConfig);
}

// Função para configurar APIs de produtos
function setupProductAPIs() {
  console.log('🛍️  Configurando APIs de Produtos...');
  
  const apisConfig = `
# APIs de Produtos

## Mercado Livre
# 1. Acesse https://developers.mercadolivre.com.br
# 2. Crie uma aplicação
# 3. Obtenha o Access Token
# 4. Adicione ao .env: VITE_MERCADO_LIVRE_API_KEY

## Google Shopping
# 1. Acesse https://console.cloud.google.com
# 2. Ative a API Shopping
# 3. Crie credenciais
# 4. Adicione ao .env: VITE_GOOGLE_SHOPPING_API_KEY

## Pinterest
# 1. Acesse https://developers.pinterest.com
# 2. Crie uma aplicação
# 3. Obtenha o Access Token
# 4. Adicione ao .env: VITE_PINTEREST_ACCESS_TOKEN

## Unsplash
# 1. Acesse https://unsplash.com/developers
# 2. Crie uma aplicação
# 3. Obtenha o Client ID
# 4. Adicione ao .env: VITE_UNSPLASH_CLIENT_ID
`;

  console.log(apisConfig);
}

// Função para configurar IA
function setupAI() {
  console.log('🤖 Configurando APIs de IA...');
  
  const aiConfig = `
# APIs de Inteligência Artificial

## OpenAI
# 1. Acesse https://platform.openai.com
# 2. Crie uma conta e adicione créditos
# 3. Obtenha a API Key
# 4. Adicione ao .env: VITE_OPENAI_API_KEY

## Replicate
# 1. Acesse https://replicate.com
# 2. Crie uma conta
# 3. Obtenha o API Token
# 4. Adicione ao .env: VITE_REPLICATE_API_TOKEN

# Modelos utilizados:
# - gpt-4-vision-preview (análise de paleta)
# - dall-e-3 (geração de imagens)
# - stable-diffusion (try-on virtual)
`;

  console.log(aiConfig);
}

// Função para configurar analytics
function setupAnalytics() {
  console.log('📊 Configurando Analytics...');
  
  const analyticsConfig = `
# Analytics e Monitoramento

## Google Analytics 4
# 1. Acesse https://analytics.google.com
# 2. Crie uma propriedade
# 3. Obtenha o Measurement ID
# 4. Adicione ao .env: VITE_GOOGLE_ANALYTICS_ID

## Hotjar
# 1. Acesse https://hotjar.com
# 2. Crie uma conta
# 3. Obtenha o Site ID
# 4. Adicione ao .env: VITE_HOTJAR_ID

## SendGrid (Email)
# 1. Acesse https://sendgrid.com
# 2. Crie uma conta
# 3. Obtenha a API Key
# 4. Adicione ao .env: VITE_SENDGRID_API_KEY
`;

  console.log(analyticsConfig);
}

// Função para criar scripts úteis
function createUsefulScripts() {
  console.log('📝 Criando scripts úteis...');
  
  const scripts = {
    'scripts/seed-database.mjs': `
import { realDataSeeder } from '../src/utils/realDataSeeder.js';

async function seedDatabase() {
  try {
    await realDataSeeder.seedAllData();
    console.log('✅ Banco populado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
  }
}

seedDatabase();
`,
    'scripts/check-status.mjs': `
import { realDataSeeder } from '../src/utils/realDataSeeder.js';

async function checkStatus() {
  try {
    await realDataSeeder.checkDatabaseStatus();
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
  }
}

checkStatus();
`,
    'scripts/clear-test-data.mjs': `
import { realDataSeeder } from '../src/utils/realDataSeeder.js';

async function clearTestData() {
  try {
    await realDataSeeder.clearTestData();
    console.log('✅ Dados de teste removidos!');
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
  }
}

clearTestData();
`
  };

  Object.entries(scripts).forEach(([filename, content]) => {
    const dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filename, content);
  });

  console.log('✅ Scripts úteis criados!\n');
}

// Função para atualizar package.json
function updatePackageJson() {
  console.log('📦 Atualizando package.json...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Adicionar scripts úteis
    packageJson.scripts = {
      ...packageJson.scripts,
      'seed': 'node scripts/seed-database.mjs',
      'status': 'node scripts/check-status.mjs',
      'clear': 'node scripts/clear-test-data.mjs',
      'setup': 'node scripts/setup-real-app.mjs'
    };

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json atualizado!\n');
  }
}

// Função principal
async function main() {
  console.log('🎯 Iniciando configuração do Pozzy para produção...\n');

  // Verificar Node.js
  if (!commandExists('node')) {
    console.error('❌ Node.js não encontrado. Instale o Node.js primeiro.');
    process.exit(1);
  }

  // Verificar npm
  if (!commandExists('npm')) {
    console.error('❌ npm não encontrado. Instale o npm primeiro.');
    process.exit(1);
  }

  // Executar configurações
  createEnvFile();
  installDependencies();
  setupSupabase();
  setupStripe();
  setupProductAPIs();
  setupAI();
  setupAnalytics();
  createUsefulScripts();
  updatePackageJson();

  console.log('🎉 Configuração concluída!\n');
  console.log('📋 Próximos passos:');
  console.log('1. Preencha o arquivo .env com suas chaves reais');
  console.log('2. Configure o Supabase e execute as migrações');
  console.log('3. Configure o Stripe e crie os produtos');
  console.log('4. Configure as APIs de produtos');
  console.log('5. Configure as APIs de IA');
  console.log('6. Configure analytics e email');
  console.log('7. Execute: npm run seed (para popular o banco)');
  console.log('8. Execute: npm run dev (para testar)');
  console.log('\n🚀 Pozzy está pronto para produção!');
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main }; 