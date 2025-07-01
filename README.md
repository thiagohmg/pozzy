# Pozzy - Plataforma de Moda Inteligente ✨

O Pozzy é uma plataforma completa de moda que usa IA para análise de paleta de cores, try-on virtual, geração de looks e integração com múltiplas lojas em tempo real.

## 🚀 Status Atual

✅ **100% Funcional e Real** - Todas as funcionalidades estão integradas com APIs reais:

- 🔍 **Busca Multi-Fonte**: Mercado Livre, Dafiti, Netshoes, Google Shopping
- 🎨 **Análise de Paleta com IA**: OpenAI GPT-4 Vision
- 👗 **Try-On Virtual**: Processamento real de imagem
- 🛍️ **Wishlist Real**: Integração com banco de dados
- 💄 **Beauty Integration**: Recomendações de maquiagem e penteado
- 🎯 **Gerador de Looks**: IA para combinar peças
- 📱 **PWA Completo**: Instalável como app
- 💳 **Sistema de Pagamento**: Stripe integrado
- 📊 **Analytics**: Google Analytics e Hotjar
- 🔐 **Autenticação**: Supabase Auth

## 🛠️ Configuração Rápida

### 1. Clone e Instale

```bash
git clone https://github.com/seu-usuario/pozzy.git
cd pozzy
npm install
```

### 2. Configure as APIs (Obrigatório)

Execute o script de configuração:

```bash
npm run setup
```

Isso criará o arquivo `.env` com todas as variáveis necessárias.

### 3. Configure as Chaves de API

Edite o arquivo `.env` e adicione suas chaves reais:

```env
# Supabase (Obrigatório)
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima

# Stripe (Para pagamentos)
VITE_STRIPE_PUBLIC_KEY=sua_chave_publica_stripe

# OpenAI (Para IA)
VITE_OPENAI_API_KEY=sua_chave_openai

# APIs de Produtos
VITE_MERCADO_LIVRE_API_KEY=sua_chave_mercadolivre
VITE_GOOGLE_SHOPPING_API_KEY=sua_chave_google_shopping
```

### 4. Configure o Supabase

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Execute as migrações:

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```

### 5. Popule o Banco com Dados

```bash
npm run seed
```

### 6. Execute o Projeto

```bash
npm run dev
```

## 🔧 APIs Necessárias

### Supabase (Obrigatório)
- **URL**: https://supabase.com
- **Uso**: Banco de dados, autenticação, storage
- **Configuração**: Criar projeto e executar migrações

### Stripe (Pagamentos)
- **URL**: https://stripe.com
- **Uso**: Assinaturas premium
- **Configuração**: Criar produtos e webhooks

### OpenAI (IA)
- **URL**: https://platform.openai.com
- **Uso**: Análise de paleta, geração de texto
- **Configuração**: Obter API key

### Mercado Livre (Produtos)
- **URL**: https://developers.mercadolivre.com.br
- **Uso**: Busca de produtos reais
- **Configuração**: Criar aplicação e obter token

### Google Shopping (Produtos)
- **URL**: https://console.cloud.google.com
- **Uso**: Busca de produtos
- **Configuração**: Ativar API Shopping

### Pinterest (Inspiração)
- **URL**: https://developers.pinterest.com
- **Uso**: Mood boards e inspiração
- **Configuração**: Criar aplicação

### Unsplash (Imagens)
- **URL**: https://unsplash.com/developers
- **Uso**: Imagens de produtos
- **Configuração**: Obter Client ID

## 📱 Funcionalidades Principais

### 🔍 Busca Inteligente
- Busca em múltiplas lojas em tempo real
- Filtros avançados por cor, tamanho, preço
- Recomendações baseadas na paleta do usuário

### 🎨 Análise de Paleta
- IA analisa fotos do usuário
- Determina estação e subtom
- Sugere cores ideais e a evitar

### 👗 Try-On Virtual
- Upload de foto do usuário
- IA processa e aplica roupas
- Visualização 3D realista

### 🛍️ Wishlist Inteligente
- Salva produtos favoritos
- Organiza por prioridade
- Compartilhamento social

### 💄 Beauty Integration
- Recomendações de maquiagem
- Sugestões de penteado
- Baseado no look escolhido

### 🎯 Gerador de Looks
- IA combina peças automaticamente
- Considera ocasião e estilo
- Calcula preço total

### 📊 Analytics Avançado
- Rastreamento de comportamento
- Relatórios de conversão
- Otimização de UX

## 🏗️ Arquitetura

```
src/
├── components/
│   ├── RealProductSearch.tsx    # Busca real multi-fonte
│   ├── RealWishlist.tsx         # Wishlist com banco
│   ├── RealTryOn.tsx           # Try-on com IA
│   ├── RealOutfitGenerator.tsx # Gerador de looks
│   ├── RealBeautyIntegration.tsx # Integração beleza
│   ├── RealMoodBoard.tsx       # Mood board real
│   └── RealPlanModal.tsx       # Planos e pagamento
├── integrations/
│   ├── realAPIs.ts             # APIs reais
│   ├── payment.ts              # Sistema de pagamento
│   └── supabase/               # Configuração Supabase
├── utils/
│   └── realDataSeeder.ts       # Populador de dados
└── hooks/                      # Hooks personalizados
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

### Railway
```bash
railway login
railway init
railway up
```

## 📊 Monitoramento

### Google Analytics 4
- Rastreamento de eventos
- Conversões e funis
- Relatórios personalizados

### Hotjar
- Heatmaps
- Gravações de sessão
- Feedback de usuários

### Sentry (Opcional)
- Monitoramento de erros
- Performance tracking
- Alertas em tempo real

## 🔒 Segurança

- ✅ Autenticação Supabase
- ✅ HTTPS obrigatório
- ✅ Validação de dados
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Sanitização de inputs

## 📈 Performance

- ✅ Lazy loading
- ✅ Code splitting
- ✅ Image optimization
- ✅ Caching inteligente
- ✅ PWA para offline
- ✅ CDN para assets

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📝 Scripts Úteis

```bash
# Popular banco com dados
npm run seed

# Verificar status do banco
npm run status

# Limpar dados de teste
npm run clear

# Configurar projeto
npm run setup
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- 📧 Email: suporte@pozzy.com.br
- 💬 Discord: [Pozzy Community](https://discord.gg/pozzy)
- 📖 Docs: [docs.pozzy.com.br](https://docs.pozzy.com.br)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/pozzy/issues)

## 🎯 Roadmap

- [ ] Integração com mais marketplaces
- [ ] IA para recomendação de tamanho
- [ ] Modo offline avançado
- [ ] Integração com redes sociais
- [ ] Sistema de afiliados
- [ ] App nativo (React Native)

---

**Pozzy** - Transformando a experiência de moda com IA ✨

[Website](https://pozzy.com.br) | [Documentação](https://docs.pozzy.com.br) | [Status](https://status.pozzy.com.br)

