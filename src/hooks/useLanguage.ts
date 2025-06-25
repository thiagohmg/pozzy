import { useState, useEffect } from 'react';

export type Language = 'pt-BR' | 'en' | 'es';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    flag: '🇧🇷',
    description: 'Idioma principal do Brasil'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    description: 'Global language'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    description: 'Idioma espanhol'
  }
];

// Traduções básicas (em produção, usar i18n library)
const translations = {
  'pt-BR': {
    // Navegação
    'discover': 'Descobrir',
    'consulting': 'Consultoria',
    'closet': 'Closet',
    'profile': 'Perfil',
    
    // Botões
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'close': 'Fechar',
    'edit': 'Editar',
    'delete': 'Excluir',
    'search': 'Buscar',
    'filter': 'Filtrar',
    
    // Perfil
    'edit_profile': 'Editar Perfil',
    'profile_description': 'Veja seus dados e altere sua foto de perfil.',
    'name': 'Nome',
    'email': 'E-mail',
    'language': 'Idioma',
    'language_description': 'Escolha o idioma de sua preferência',
    'save_photo': 'Salvar foto',
    'saving': 'Salvando...',
    'photo_updated': 'Foto atualizada!',
    'photo_updated_description': 'Sua foto de perfil foi salva com sucesso.',
    'update_error': 'Erro ao atualizar',
    'update_error_description': 'Não foi possível salvar sua foto.',
    'language_updated': 'Idioma atualizado!',
    'language_updated_description': 'O idioma foi alterado com sucesso.',
    
    // Paleta
    'discover_palette': 'Descobrir Minha Paleta',
    'palette_analysis': 'Análise de Paleta de Cores',
    'palette_description': 'Envie uma foto sua com boa iluminação natural para descobrir as cores que mais valorizam sua beleza',
    
    // Feedback
    'send_feedback': 'Enviar Feedback',
    'feedback_title': 'Envie seu Feedback',
    'feedback_description': 'Ajude-nos a melhorar o Pozzy',
    
    // Tendências
    'trends': 'Tendências',
    'trends_title': 'Tendências do Momento',
    'trends_description': 'Clique em uma tendência para descobrir produtos incríveis que estão em alta agora!',
    
    // Marketing
    'global_technology': 'Tecnologia Global',
    'brazilian_heart': 'Coração Brasileiro',
    'used_worldwide': 'Usado por milhares de pessoas no mundo',
    'adapted_brazil': 'Adaptado para o estilo brasileiro',
    'thousands_users': 'Milhares de Usuários',
    'thousands_users_desc': 'Pessoas de todo o mundo já descobriram suas cores ideais',
    'advanced_technology': 'Tecnologia Avançada',
    'advanced_technology_desc': 'IA de última geração para análise de paleta de cores',
    'brazilian_style': 'Estilo Brasileiro',
    'brazilian_style_desc': 'Adaptado para o clima e cultura brasileira',
    'available_languages': 'Disponível em Português, Inglês e Espanhol'
  },
  'en': {
    // Navigation
    'discover': 'Discover',
    'consulting': 'Consulting',
    'closet': 'Closet',
    'profile': 'Profile',
    
    // Buttons
    'save': 'Save',
    'cancel': 'Cancel',
    'close': 'Close',
    'edit': 'Edit',
    'delete': 'Delete',
    'search': 'Search',
    'filter': 'Filter',
    
    // Profile
    'edit_profile': 'Edit Profile',
    'profile_description': 'View your data and change your profile photo.',
    'name': 'Name',
    'email': 'Email',
    'language': 'Language',
    'language_description': 'Choose your preferred language',
    'save_photo': 'Save photo',
    'saving': 'Saving...',
    'photo_updated': 'Photo updated!',
    'photo_updated_description': 'Your profile photo has been saved successfully.',
    'update_error': 'Update error',
    'update_error_description': 'Could not save your photo.',
    'language_updated': 'Language updated!',
    'language_updated_description': 'Language has been changed successfully.',
    
    // Palette
    'discover_palette': 'Discover My Palette',
    'palette_analysis': 'Color Palette Analysis',
    'palette_description': 'Send a photo of yourself with good natural lighting to discover the colors that best enhance your beauty',
    
    // Feedback
    'send_feedback': 'Send Feedback',
    'feedback_title': 'Send your Feedback',
    'feedback_description': 'Help us improve Pozzy',
    
    // Trends
    'trends': 'Trends',
    'trends_title': 'Current Trends',
    'trends_description': 'Click on a trend to discover amazing products that are trending now!',
    
    // Marketing
    'global_technology': 'Global Technology',
    'brazilian_heart': 'Brazilian Heart',
    'used_worldwide': 'Used by thousands of people worldwide',
    'adapted_brazil': 'Adapted for Brazilian style',
    'thousands_users': 'Thousands of Users',
    'thousands_users_desc': 'People from around the world have discovered their ideal colors',
    'advanced_technology': 'Advanced Technology',
    'advanced_technology_desc': 'Latest generation AI for color palette analysis',
    'brazilian_style': 'Brazilian Style',
    'brazilian_style_desc': 'Adapted for Brazilian climate and culture',
    'available_languages': 'Available in Portuguese, English and Spanish'
  },
  'es': {
    // Navegación
    'discover': 'Descubrir',
    'consulting': 'Consultoría',
    'closet': 'Armario',
    'profile': 'Perfil',
    
    // Botones
    'save': 'Guardar',
    'cancel': 'Cancelar',
    'close': 'Cerrar',
    'edit': 'Editar',
    'delete': 'Eliminar',
    'search': 'Buscar',
    'filter': 'Filtrar',
    
    // Perfil
    'edit_profile': 'Editar Perfil',
    'profile_description': 'Ve tus datos y cambia tu foto de perfil.',
    'name': 'Nombre',
    'email': 'Correo',
    'language': 'Idioma',
    'language_description': 'Elige tu idioma preferido',
    'save_photo': 'Guardar foto',
    'saving': 'Guardando...',
    'photo_updated': '¡Foto actualizada!',
    'photo_updated_description': 'Tu foto de perfil ha sido guardada exitosamente.',
    'update_error': 'Error al actualizar',
    'update_error_description': 'No se pudo guardar tu foto.',
    'language_updated': '¡Idioma actualizado!',
    'language_updated_description': 'El idioma ha sido cambiado exitosamente.',
    
    // Paleta
    'discover_palette': 'Descubrir Mi Paleta',
    'palette_analysis': 'Análisis de Paleta de Colores',
    'palette_description': 'Envía una foto tuya con buena iluminación natural para descubrir los colores que mejor realzan tu belleza',
    
    // Feedback
    'send_feedback': 'Enviar Comentarios',
    'feedback_title': 'Envía tus Comentarios',
    'feedback_description': 'Ayúdanos a mejorar Pozzy',
    
    // Tendencias
    'trends': 'Tendencias',
    'trends_title': 'Tendencias Actuales',
    'trends_description': '¡Haz clic en una tendencia para descubrir productos increíbles que están de moda ahora!',
    
    // Marketing
    'global_technology': 'Tecnología Global',
    'brazilian_heart': 'Corazón Brasileño',
    'used_worldwide': 'Usado por miles de personas en todo el mundo',
    'adapted_brazil': 'Adaptado para el estilo brasileño',
    'thousands_users': 'Miles de Usuarios',
    'thousands_users_desc': 'Personas de todo el mundo han descubierto sus colores ideales',
    'advanced_technology': 'Tecnología Avanzada',
    'advanced_technology_desc': 'IA de última generación para análisis de paleta de colores',
    'brazilian_style': 'Estilo Brasileño',
    'brazilian_style_desc': 'Adaptado para el clima y cultura brasileña',
    'available_languages': 'Disponible en Portugués, Inglés y Español'
  }
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('pt-BR');
  const [isLoading, setIsLoading] = useState(true);

  // Carregar idioma salvo
  useEffect(() => {
    const savedLanguage = localStorage.getItem('pozzy-language') as Language;
    if (savedLanguage && LANGUAGES.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Detectar idioma do navegador
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'en') {
        setCurrentLanguage('en');
      } else if (browserLang === 'es') {
        setCurrentLanguage('es');
      } else {
        setCurrentLanguage('pt-BR');
      }
    }
    setIsLoading(false);
  }, []);

  // Salvar idioma
  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('pozzy-language', language);
    
    // Em produção, aqui você recarregaria as traduções
    // e atualizaria o contexto de idioma
  };

  // Função de tradução
  const t = (key: string): string => {
    const langTranslations = translations[currentLanguage];
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  // Obter idioma atual
  const getCurrentLanguage = (): LanguageOption => {
    return LANGUAGES.find(lang => lang.code === currentLanguage) || LANGUAGES[0];
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    getCurrentLanguage,
    LANGUAGES,
    isLoading
  };
}; 