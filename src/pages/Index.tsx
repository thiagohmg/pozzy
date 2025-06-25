import React, { useState, useEffect } from 'react';
import { MobileHeader } from "@/components/MobileHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { WelcomeSection } from "@/components/WelcomeSection";
import { useToast } from "@/hooks/use-toast";
import { MainNavigation } from "@/components/MainNavigation";
import { DiscoverSection } from "@/components/sections/DiscoverSection";
import { ConsultoriaSection } from "@/components/sections/ConsultoriaSection";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { ToolsSection } from "@/components/sections/ToolsSection";
import { useSavedPalettes } from "@/hooks/useSavedPalettes";
import { Sparkles } from "lucide-react";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Navbar } from "@/components/Navbar";
import { usePWA } from '@/hooks/usePWA';
import { AuthModal } from "@/components/AuthModal";
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { PWAInstallBanner } from "@/components/PWAInstallBanner";

interface AppUser {
  uid: string;
  email: string;
  searchesUsed: number;
  isPremium: boolean;
}

interface Photo {
  id: string;
  data: string;
  name: string;
}

const Index = () => {
  function getInitialSection() {
    try {
      return localStorage.getItem('activeSection') || 'descobrir';
    } catch { return 'descobrir'; }
  }
  function getInitialSubSection() {
    try {
      return localStorage.getItem('activeSubSection') || '';
    } catch { return ''; }
  }
  
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [searchResults, setSearchResults] = useState([]);
  const [tryOnResult, setTryOnResult] = useState(null);
  const [fashionAdvice, setFashionAdvice] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [activeSection, setActiveSection] = useState(getInitialSection());
  const [activeSubSection, setActiveSubSection] = useState<string>(getInitialSubSection());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();
  const { currentPalette, isLoading: palettesLoading, savePalette } = useSavedPalettes();
  const colorPalette = currentPalette?.data || null;
  const pwa = usePWA();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Você pode querer buscar dados adicionais do perfil aqui
        setUser({
          uid: session.user.id,
          email: session.user.email!,
          isPremium: false, // Defina isso com base no seu DB
          searchesUsed: 0,  // Defina isso com base no seu DB
        });
      }
      setLoading(false);
    };

    setLoading(true);
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          uid: session.user.id,
          email: session.user.email!,
          isPremium: false,
          searchesUsed: 0,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const savedResults = localStorage.getItem('discover-lastResults');
    if (savedResults) {
      try {
        setSearchResults(JSON.parse(savedResults));
      } catch {}
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('activeSection', activeSection);
    } catch {}
  }, [activeSection]);
  useEffect(() => {
    try {
      localStorage.setItem('activeSubSection', activeSubSection);
    } catch {}
  }, [activeSubSection]);

  const handleLogin = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword(data);
      if (error) throw error;
      toast({ title: 'Login bem-sucedido!', description: 'Bem-vindo(a) de volta!' });
      setShowAuthModal(false);
    } catch (error: any) {
      toast({ title: 'Erro no login', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp(data);
      if (error) throw error;
      toast({ title: 'Cadastro realizado!', description: 'Verifique seu e-mail para confirmar a conta.' });
      setShowAuthModal(false);
    } catch (error: any) {
      toast({ title: 'Erro no cadastro', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ title: 'Você saiu da sua conta.' });
    } catch (error: any) {
      toast({ title: 'Erro ao sair', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    const searchesLeft = 5 - (user?.searchesUsed ?? 0);
    if (searchesLeft <= 0) {
      toast({
        title: "Limite atingido",
        description: "Faça upgrade para continuar usando a consultoria",
        variant: "destructive"
      });
      return;
    }

    setTimeout(() => {
      const mockResults = [
        {
          name: "Vestido Floral Coral",
          description: "Perfeito para sua paleta quente, com tons que realçam sua beleza natural",
          price: "R$ 159,90",
          tryOnCompatible: true,
          paletteMatch: 95
        },
        {
          name: "Blazer Terracota Premium",
          description: "Cor ideal para seu subtom, corte moderno e versátil",
          price: "R$ 219,50",
          tryOnCompatible: true,
          paletteMatch: 88
        },
        {
          name: "Blusa Dourada Elegante",
          description: "Tom dourado que combina perfeitamente com suas cores",
          price: "R$ 89,90",
          tryOnCompatible: true,
          paletteMatch: 92
        }
      ];

      setSearchResults(mockResults);

      toast({
        title: "Busca personalizada realizada! ✨",
        description: `${mockResults.length} produtos encontrados baseados na sua paleta de cores`,
      });
    }, 2000);
  };

  const searchesLeft = 5 - (user?.searchesUsed ?? 0);

  useEffect(() => {
    if (user && searchesLeft <= 0) {
      setShowUpgradeModal(true);
    }
  }, [searchesLeft, user]);

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  const handleProductTryOn = (product: any) => {
    if (userPhotos.length === 0) {
      toast({
        title: "Fotos necessárias 📸",
        description: "Adicione suas fotos na aba 'Meu Perfil' para usar o try-on virtual",
        variant: "destructive"
      });
      setActiveSection('perfil');
      return;
    }
    
    setSelectedProduct(product);
    setActiveSection('consultoria');
    toast({
      title: `Produto selecionado! 👗`,
      description: `Experimentando: ${product.name} nas suas ${userPhotos.length} foto(s)`
    });
  };

  const handleAdviceGenerated = (advice: any) => {
    setFashionAdvice(advice);
  };

  const handlePaletteAnalyzed = (palette: any) => {
    const savedPalette = savePalette(palette);
    console.log('Paleta analisada e salva automaticamente:', savedPalette);
    
    toast({
      title: "Paleta analisada! ✨",
      description: "Sua análise está disponível em todas as seções",
    });
  };

  const handleInitialSetupComplete = (photos: Photo[], palette: any) => {
    setUserPhotos(photos);
    setIsSetupComplete(true);
    setActiveSection('descobrir');
    
    toast({
      title: "Setup completo! 🎉",
      description: "Agora você pode usar todas as funcionalidades da plataforma"
    });
  };

  const handlePhotosChange = (photos: Photo[]) => {
    setUserPhotos(photos);
    if (photos.length > 0) {
      setIsSetupComplete(true);
    }
  };

  const handleSubSectionChange = (section: string, subAction: string) => {
    console.log('DEBUG: handleSubSectionChange called with:', section, subAction);
    console.log('DEBUG: Current activeSection before change:', activeSection);
    
    setActiveSection(section);
    setActiveSubSection(subAction);
    
    console.log('DEBUG: Set activeSection to:', section);
    console.log('DEBUG: Set activeSubSection to:', subAction);
    
    setTimeout(() => {
      switch(subAction) {
        case 'search':
          const searchInput = document.querySelector('input[placeholder*="buscar"], input[placeholder*="Ex:"], input[type="search"]');
          if (searchInput) {
            (searchInput as HTMLInputElement).focus();
            (searchInput as HTMLInputElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            console.log('DEBUG: Search input not found');
          }
          break;
          
        case 'palette':
          const paletteButton = document.querySelector('button:has-text("Descobrir Minha Paleta")');
          if (paletteButton) {
            (paletteButton as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          break;
          
        case 'try-on':
          console.log('DEBUG: Navigating to try-on section in consultoria');
          break;
          
        case 'photos':
          const photosSection = document.querySelector('[data-section="photos"]');
          if (photosSection) {
            photosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          break;
          
        case 'ai-advice':
          console.log('DEBUG: Navigating to AI advice section');
          break;
          
        default:
          console.log(`DEBUG: No specific action for: ${subAction}`);
          break;
      }
    }, 500);
  };

  const handleSectionChange = (section: string) => {
    console.log('DEBUG: handleSectionChange called with:', section);
    console.log('DEBUG: Previous activeSection:', activeSection);
    console.log('DEBUG: Function type:', typeof setActiveSection);
    
    try {
      setActiveSection(section);
      console.log('DEBUG: Successfully set activeSection to:', section);
    } catch (error) {
      console.error('DEBUG: Error setting activeSection:', error);
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'descobrir':
        return (
          <DiscoverSection
            colorPalette={colorPalette}
            onSectionChange={handleSectionChange}
            onSearch={handleSearch}
            searchesLeft={searchesLeft}
            isPremium={user?.isPremium ?? false}
            loading={loading}
            searchResults={searchResults}
            user={user}
            onProductTryOn={handleProductTryOn}
            activeSubSection={activeSubSection}
          />
        );
      case 'consultoria':
        return (
          <ConsultoriaSection
            userPhotos={userPhotos}
            selectedProduct={selectedProduct}
            colorPalette={colorPalette}
            onSectionChange={handleSectionChange}
            onAdviceGenerated={handleAdviceGenerated}
            fashionAdvice={fashionAdvice}
            activeSubSection={activeSubSection}
            isSetupComplete={isSetupComplete}
            onSetupComplete={() => setIsSetupComplete(true)}
            onPaletteAnalyzed={handlePaletteAnalyzed}
          />
        );
      case 'perfil':
        return (
          <ProfileSection
            isSetupComplete={isSetupComplete}
            userPhotos={userPhotos}
            colorPalette={colorPalette}
            selectedProduct={selectedProduct}
            userId={user?.uid ?? null}
            onInitialSetupComplete={handleInitialSetupComplete}
            onPhotosChange={handlePhotosChange}
            onPaletteAnalyzed={handlePaletteAnalyzed}
            activeSubSection={activeSubSection}
          />
        );
      case 'ferramentas':
        return <ToolsSection />;
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
              Seção "{activeSection}" em desenvolvimento
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Debug: activeSection = "{activeSection}"
            </p>
          </div>
        );
    }
  };

  return (
    <>
        <Navbar
          user={user}
        searchesLeft={5 - (user?.searchesUsed ?? 0)}
        isPremium={user?.isPremium ?? false}
        onLogout={handleLogout}
        onUpgrade={() => setShowUpgradeModal(true)}
        userId={user?.uid ?? ''}
        onAuthClick={() => setShowAuthModal(true)}
      />
      <div className="flex flex-col min-h-screen pt-16">
        <main className="flex-grow pb-24 md:pb-8">
          {!isSetupComplete && (
            <WelcomeSection
              onSectionChange={handleSectionChange}
            />
          )}

            <MainNavigation 
              activeSection={activeSection} 
              onSectionChange={handleSectionChange}
              onSubSectionChange={handleSubSectionChange}
            />

            {renderActiveSection()}
      </main>

        {user && (
      <MobileBottomNav 
        activeSection={activeSection}
            onSectionChange={setActiveSection}
            userId={user.uid}
      />
        )}
        </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
      <AuthModal 
        isOpen={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onLogin={handleLogin}
        onRegister={handleRegister}
        loading={loading}
      />
      <PWAInstallBanner 
        isInstallable={pwa.isInstallable}
        triggerInstallPrompt={pwa.triggerInstallPrompt}
        hasBeenRejected={pwa.hasBeenRejected}
        forceShow={pwa.forceShow}
      />
    </>
  );
};

export default Index;
