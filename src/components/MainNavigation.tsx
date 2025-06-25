
import React from 'react';
import { Search, Sparkles, User } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface NavigationItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  subItems: Array<{
    title: string;
    description: string;
    action?: string;
    anchorId?: string;
  }>;
}

interface MainNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onSubSectionChange?: (section: string, subAction: string) => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ 
  activeSection, 
  onSectionChange,
  onSubSectionChange 
}) => {
  const menuItems: NavigationItem[] = [
    {
      id: 'descobrir',
      title: 'Descobrir',
      icon: Search,
      description: 'Analise sua paleta e busque produtos',
      subItems: [
        { 
          title: 'Análise de Paleta', 
          description: 'Descubra suas cores perfeitas',
          action: 'palette',
          anchorId: 'palette-section'
        },
        { 
          title: 'Buscar Produtos', 
          description: 'Encontre roupas ideais para você',
          action: 'search',
          anchorId: 'search-section'
        },
        { 
          title: 'Recomendações', 
          description: 'Sugestões personalizadas',
          action: 'recommendations',
          anchorId: 'recommendations-section'
        }
      ]
    },
    {
      id: 'consultoria',
      title: 'Consultoria',
      icon: Sparkles,
      description: 'IA personalizada e prova virtual',
      subItems: [
        { 
          title: 'Consultoria IA', 
          description: 'Conselhos personalizados de moda',
          action: 'ai-advice',
          anchorId: 'ai-advice-section'
        },
        { 
          title: 'Vestuário Virtual', 
          description: 'Veja como fica em você',
          action: 'try-on',
          anchorId: 'try-on-section'
        },
        { 
          title: 'Explore seu Estilo', 
          description: 'Explore seu estilo',
          action: 'style-analysis',
          anchorId: 'style-analysis-section'
        }
      ]
    },
    {
      id: 'perfil',
      title: 'Meu Closet',
      icon: User,
      description: 'Seu arquivo pessoal de moda',
      subItems: [
        { 
          title: 'Paletas Salvas', 
          description: 'Suas análises de cores salvas',
          action: 'saved-palettes',
          anchorId: 'saved-palettes-section'
        },
        { 
          title: 'Fotos Salvas', 
          description: 'Suas fotos organizadas',
          action: 'photos',
          anchorId: 'photos-section'
        },
        { 
          title: 'Consultorias Salvas', 
          description: 'Seus conselhos e análises salvos',
          action: 'saved-advice',
          anchorId: 'saved-advice-section'
        },
        { 
          title: 'Lista de Desejos', 
          description: 'Produtos e inspirações favoritas',
          action: 'desejos',
          anchorId: 'desejos-section'
        }
      ]
    }
  ];

  const scrollToSection = (anchorId: string) => {
    console.log('DEBUG: scrollToSection called with:', anchorId);
    const element = document.getElementById(anchorId);
    console.log('DEBUG: element found:', !!element);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const handleSubItemClick = (event: React.MouseEvent, sectionId: string, subAction?: string, anchorId?: string) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log(`DEBUG: Sub-item clicked: ${sectionId} -> ${subAction} (${anchorId})`);
    
    console.log('DEBUG: Changing section to:', sectionId);
    onSectionChange(sectionId);
    
    setTimeout(() => {
      if (anchorId) {
        console.log('DEBUG: Scrolling to:', anchorId);
        scrollToSection(anchorId);
      }
      
      if (subAction && onSubSectionChange) {
        console.log('DEBUG: Calling onSubSectionChange with:', sectionId, subAction);
        onSubSectionChange(sectionId, subAction);
      }
    }, 200);
  };

  const handleMainMenuClick = (sectionId: string) => {
    console.log('DEBUG: Main menu clicked:', sectionId);
    console.log('DEBUG: Current activeSection:', activeSection);
    console.log('DEBUG: onSectionChange type:', typeof onSectionChange);
    
    try {
      onSectionChange(sectionId);
      console.log('DEBUG: onSectionChange called successfully');
    } catch (error) {
      console.error('DEBUG: Error calling onSectionChange:', error);
    }
  };

  return (
    <div className="mb-12">
      {/* Menu Principal com novo estilo */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {menuItems.map((item) => (
          <HoverCard key={item.id}>
            <HoverCardTrigger asChild>
              <button
                className={`px-8 py-4 text-base font-medium transition-all duration-200 rounded-2xl flex items-center shadow-soft hover-lift ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-purple-dark to-purple-medium text-white shadow-card' 
                    : 'bg-white text-text-primary hover:bg-gray-50 border border-gray-100'
                }`}
                onClick={() => handleMainMenuClick(item.id)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.title}
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 z-50 rounded-2xl shadow-card border-gray-100">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <item.icon className="h-4 w-4 mr-2 text-purple-medium" />
                    {item.description}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {item.subItems.map((subItem, index) => (
                    <button
                      key={index}
                      className="w-full p-3 rounded-xl border border-gray-100 hover:bg-purple-50 hover:border-purple-200 transition-all cursor-pointer text-left shadow-soft hover-lift"
                      onClick={(e) => handleSubItemClick(e, item.id, subItem.action, subItem.anchorId)}
                    >
                      <div className="font-medium text-text-primary text-sm mb-1">
                        {subItem.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {subItem.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};
