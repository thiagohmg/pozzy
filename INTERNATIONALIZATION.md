# Sistema de Internacionalização do Pozzy

## Visão Geral

O Pozzy agora possui um sistema completo de internacionalização que suporta múltiplos idiomas, permitindo que o app seja usado por pessoas de todo o mundo enquanto mantém sua identidade brasileira.

## Idiomas Suportados

- 🇧🇷 **Português (Brasil)** - Idioma principal
- 🇺🇸 **English** - Idioma global
- 🇪🇸 **Español** - Idioma espanhol

## Estrutura do Sistema

### 1. Hook de Idioma (`src/hooks/useLanguage.ts`)

```typescript
const { currentLanguage, changeLanguage, t, getCurrentLanguage, LANGUAGES, isLoading } = useLanguage();
```

**Funcionalidades:**
- Detecção automática do idioma do navegador
- Persistência da escolha do usuário no localStorage
- Sistema de traduções centralizado
- Interface para mudança de idioma

### 2. Contexto de Idioma (`src/contexts/LanguageContext.tsx`)

Fornece o contexto de idioma para toda a aplicação, permitindo que qualquer componente acesse as traduções.

### 3. Traduções

As traduções estão organizadas por categoria:

```typescript
const translations = {
  'pt-BR': {
    // Navegação
    'discover': 'Descobrir',
    'consulting': 'Consultoria',
    
    // Perfil
    'edit_profile': 'Editar Perfil',
    'language': 'Idioma',
    
    // Marketing
    'global_technology': 'Tecnologia Global',
    'brazilian_heart': 'Coração Brasileiro',
    // ...
  }
}
```

## Como Usar

### 1. Em Componentes

```typescript
import { useLanguageContext } from '@/contexts/LanguageContext';

const MyComponent = () => {
  const { t } = useLanguageContext();
  
  return <h1>{t('discover')}</h1>;
};
```

### 2. Seleção de Idioma

O usuário pode alterar o idioma através do modal de edição de perfil:

1. Acesse o perfil
2. Clique em "Editar Perfil"
3. Escolha o idioma desejado
4. Salve as alterações

### 3. Detecção Automática

O sistema detecta automaticamente o idioma do navegador na primeira visita:
- `pt-BR` para português
- `en` para inglês
- `es` para espanhol
- Padrão: `pt-BR`

## Estratégia de Marketing

### Narrativa Global com Coração Brasileiro

O Pozzy se posiciona como:

1. **🌍 Tecnologia Global**: Usado por milhares de pessoas no mundo
2. **❤️ Coração Brasileiro**: Adaptado para o estilo e cultura brasileira
3. **🎯 Multicultural**: Suporte a múltiplos idiomas

### Componente de Marketing

O `GlobalMarketingBanner` mostra:
- Tecnologia avançada de IA
- Milhares de usuários globais
- Adaptação para o estilo brasileiro
- Disponibilidade em múltiplos idiomas

## Implementação Técnica

### 1. Provider Setup

```typescript
// App.tsx
<LanguageProvider>
  {/* Resto da aplicação */}
</LanguageProvider>
```

### 2. Persistência

```typescript
// Salvar idioma
localStorage.setItem('pozzy-language', language);

// Carregar idioma
const savedLanguage = localStorage.getItem('pozzy-language');
```

### 3. Detecção de Idioma

```typescript
const browserLang = navigator.language.split('-')[0];
if (browserLang === 'en') setCurrentLanguage('en');
else if (browserLang === 'es') setCurrentLanguage('es');
else setCurrentLanguage('pt-BR');
```

## Benefícios

1. **Alcance Global**: Permite expansão internacional
2. **Experiência Local**: Mantém identidade brasileira
3. **Flexibilidade**: Fácil adição de novos idiomas
4. **UX Consistente**: Interface adaptada para cada cultura
5. **Marketing Estratégico**: Posicionamento como tecnologia global

## Próximos Passos

1. **Mais Idiomas**: Adicionar francês, italiano, alemão
2. **Traduções Completas**: Expandir para todos os textos da aplicação
3. **i18n Library**: Migrar para react-i18next ou similar
4. **RTL Support**: Suporte para idiomas da direita para esquerda
5. **Localização**: Adaptar formatos de data, moeda, etc.

## Arquivos Principais

- `src/hooks/useLanguage.ts` - Hook principal
- `src/contexts/LanguageContext.tsx` - Contexto
- `src/components/profile-modals/EditProfileModal.tsx` - Interface de seleção
- `src/components/GlobalMarketingBanner.tsx` - Banner de marketing
- `src/App.tsx` - Setup do provider

## Exemplo de Uso

```typescript
// Componente que usa traduções
import { useLanguageContext } from '@/contexts/LanguageContext';

export const WelcomeMessage = () => {
  const { t, currentLanguage } = useLanguageContext();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>Idioma atual: {currentLanguage}</p>
    </div>
  );
};
```

Este sistema permite que o Pozzy seja verdadeiramente global enquanto mantém sua essência brasileira, criando uma experiência única para usuários de todo o mundo. 