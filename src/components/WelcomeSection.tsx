import React from 'react';
import { Button } from "@/components/ui/button";
import { Palette } from 'lucide-react';

interface WelcomeSectionProps {
  onSectionChange: (section: string) => void;
}

export const WelcomeSection = ({ onSectionChange }: WelcomeSectionProps) => {
  const handleAnalyzePalette = () => {
    // Esta função agora apenas dispara o modal de login, que será gerenciado pelo componente pai
    // ou por um clique no botão "Entrar/Cadastrar"
  };

  return (
    <section id="inicio" className="py-4 md:py-4 lg:py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Mobile Layout */}
        <div className="text-center md:hidden">
          <div className="mb-8">
            <h1 className="title-primary mb-4 leading-tight text-center">
              Transforme seu visual <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #4C1F4B 0%, #A883B7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                com inteligência artificial
              </span>
            </h1>
            <p className="subtitle mb-8 max-w-2xl mx-auto leading-relaxed">
              Analise sua paleta de cores, encontre roupas perfeitas e transforme seu estilo com inteligência artificial.
            </p>
          </div>
        </div>

        {/* Desktop: Add illustration placeholder */}
        <div className="hidden md:flex">
          <div
            className="rounded-3xl p-12 flex flex-col justify-center items-center w-full min-h-[220px]"
            style={{ background: 'linear-gradient(135deg, #F3F0F3 0%, #E8D5E8 100%)' }}
          >
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="text-6xl mb-4">✨</div>
              <h1 className="title-primary mb-4 leading-tight text-center md:text-3xl whitespace-nowrap">
                Transforme seu visual com&nbsp;
                <span
                  style={{
                    background: 'linear-gradient(135deg, #4C1F4B 0%, #A883B7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  inteligência artificial
                </span>
              </h1>
              <p className="subtitle max-w-2xl mx-auto text-center">
                Analise sua paleta de cores, encontre roupas perfeitas e transforme seu estilo com inteligência artificial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
