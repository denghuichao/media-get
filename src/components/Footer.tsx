import React from 'react';
import { Download, Github, Twitter, Mail, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'support@mediaget.com';
  const githubUrl = import.meta.env.VITE_GITHUB_URL || 'https://github.com';
  const twitterUrl = import.meta.env.VITE_TWITTER_URL || 'https://twitter.com';

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{t('header.title')}</h3>
              <p className="text-xs text-gray-400 flex items-center space-x-1">
                <span>{t('footer.builtWith.prefix')}</span>
                <a 
                  href="https://github.com/soimort/you-get" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors underline"
                >
                  you-get
                </a>
                <span>{t('footer.builtWith.suffix')}</span>
                <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex space-x-4">
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href={twitterUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href={`mailto:${contactEmail}`} 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Contact Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <span className="text-gray-400 text-sm">{t('footer.copyright')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}