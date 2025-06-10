import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language === 'zh' ? 'chinese' : 'english';

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors group"
      title={t('language.switch')}
    >
      <Languages className="h-4 w-4 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium">
        {t(`language.${currentLang}`)}
      </span>
    </button>
  );
}