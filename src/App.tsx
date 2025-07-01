import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePWA } from '@/hooks/usePWA';

// Componentes de Layout
import { Navbar } from '@/components/Navbar';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';

// Páginas
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Componentes Reais (substituindo os mockados)
import { RealProductSearch } from '@/components/RealProductSearch';
import { RealWishlist } from '@/components/RealWishlist';
import { RealTryOn } from '@/components/RealTryOn';
import { RealOutfitGenerator } from '@/components/RealOutfitGenerator';
import { RealBeautyIntegration } from '@/components/RealBeautyIntegration';
import { RealMoodBoard } from '@/components/RealMoodBoard';
import { RealPlanModal } from '@/components/RealPlanModal';

// Componentes existentes que já são reais
import { VirtualTryOn } from '@/components/VirtualTryOn';
import { PhotoManager } from '@/components/PhotoManager';
import { PaletteResults } from '@/components/PaletteResults';
import { ConsultationWizard } from '@/components/ConsultationWizard';
import { NotificationCenter } from '@/components/NotificationCenter';

// Hooks e utilitários
import { realDataSeeder } from '@/utils/realDataSeeder';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  const pwa = usePWA();
  const [isDataSeeded, setIsDataSeeded] = useState(false);

  // Seed de dados reais na primeira execução
  useEffect(() => {
    const seedData = async () => {
      try {
        // Verificar se já temos dados
        const status = await realDataSeeder.checkDatabaseStatus();
        
        if (status.productsCount === 0) {
          console.log('🌱 Populando banco com dados reais...');
          await realDataSeeder.seedAllData();
        }
        
        setIsDataSeeded(true);
      } catch (error) {
        console.error('Erro ao popular dados:', error);
        setIsDataSeeded(true); // Continuar mesmo com erro
      }
    };

    if (!authLoading) {
      seedData();
    }
  }, [authLoading]);

  if (authLoading || !isDataSeeded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando Pozzy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        user={user}
        searchesLeft={10}
        isPremium={false}
        onLogout={() => {}}
        onUpgrade={() => {}}
        userId={user?.uid || ''}
        onAuthClick={() => {}}
      />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/discover" element={<RealProductSearch />} />
          <Route path="/wishlist" element={<RealWishlist />} />
          <Route path="/try-on" element={<RealTryOn />} />
          <Route path="/outfit-generator" element={<RealOutfitGenerator />} />
          <Route path="/beauty" element={<RealBeautyIntegration />} />
          <Route path="/moodboard" element={<RealMoodBoard />} />
          <Route path="/consultoria" element={<ConsultationWizard 
            isFirstTime={false}
            colorPalette={null}
            userPhotos={[]}
            selectedProduct={null}
            onStepChange={() => {}}
            onCompleteSetup={() => {}}
            activeStep="evento"
          />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <NotificationCenter />
      <Toaster />
      <PWAInstallBanner 
        isInstallable={pwa.isInstallable}
        triggerInstallPrompt={pwa.triggerInstallPrompt}
        hasBeenRejected={pwa.hasBeenRejected}
        forceShow={pwa.forceShow}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
