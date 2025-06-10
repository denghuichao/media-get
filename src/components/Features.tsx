import React from 'react';
import { Shield, Zap, Settings, Download, PlayCircle, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Download className="h-8 w-8" />,
      title: t('features.items.multipleFormats.title'),
      description: t('features.items.multipleFormats.description')
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t('features.items.lightningFast.title'),
      description: t('features.items.lightningFast.description')
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t('features.items.privacyFirst.title'),
      description: t('features.items.privacyFirst.description')
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: t('features.items.advancedOptions.title'),
      description: t('features.items.advancedOptions.description')
    },
    {
      icon: <PlayCircle className="h-8 w-8" />,
      title: t('features.items.streamDownload.title'),
      description: t('features.items.streamDownload.description')
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: t('features.items.mobileFriendly.title'),
      description: t('features.items.mobileFriendly.description')
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{t('features.status')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}