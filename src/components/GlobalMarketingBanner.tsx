import React from 'react';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { Globe, Users, Star, Zap } from 'lucide-react';

export const GlobalMarketingBanner: React.FC = () => {
  const { t } = useLanguageContext();

  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 text-white p-6 rounded-lg shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Globe className="h-8 w-8" />
            <h2 className="text-2xl font-bold">{t('global_technology')}</h2>
            <span className="text-2xl">❤️</span>
            <h2 className="text-2xl font-bold">{t('brazilian_heart')}</h2>
          </div>
          <p className="text-lg opacity-90">
            {t('used_worldwide')} • {t('adapted_brazil')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">{t('thousands_users')}</h3>
            <p className="text-sm opacity-80">
              {t('thousands_users_desc')}
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">{t('advanced_technology')}</h3>
            <p className="text-sm opacity-80">
              {t('advanced_technology_desc')}
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">{t('brazilian_style')}</h3>
            <p className="text-sm opacity-80">
              {t('brazilian_style_desc')}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">🌍</span>
            <span className="text-sm">
              {t('available_languages')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 