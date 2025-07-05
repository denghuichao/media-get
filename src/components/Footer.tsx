import { Download, Github, Twitter, Mail, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const contactEmail = 'support@media-get.com';
  const githubUrl = import.meta.env.VITE_GITHUB_URL || 'https://github.com';
  const twitterUrl = import.meta.env.VITE_TWITTER_URL || 'https://twitter.com';

  const toolDisplayName = 'yt-dlp';
  const toolUrl = 'https://github.com/yt-dlp/yt-dlp';

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg" aria-hidden="true">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{t('header.title')}</h3>
              <p className="text-xs text-gray-400 flex items-center space-x-1">
                <span>{t('footer.builtWith.prefix')}</span>
                <a
                  href={toolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors underline"
                  aria-label={`${toolDisplayName} GitHub repository`}
                >
                  {toolDisplayName}
                </a>
                <span>{t('footer.builtWith.suffix')}</span>
                <Heart className="h-3 w-3 text-red-500 fill-red-500" aria-hidden="true" />
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex space-x-4" role="list" aria-label="Social media links">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Visit our GitHub repository"
                role="listitem"
              >
                <Github className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on Twitter"
                role="listitem"
              >
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${contactEmail}`}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Send us an email"
                role="listitem"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>

            {/* Links */}
            <nav className="flex items-center space-x-4 text-sm" role="navigation" aria-label="Footer navigation">
              <a
                href="#privacy"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Privacy Policy"
              >
                {t('footer.privacyPolicy')}
              </a>
              <span className="text-gray-600" aria-hidden="true">•</span>
              <a
                href="#terms"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Terms of Service"
              >
                {t('footer.termsOfService')}
              </a>
              <span className="text-gray-600" aria-hidden="true">•</span>
              <a
                href="#disclaimer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Disclaimer"
              >
                {t('footer.disclaimer')}
              </a>
              <span className="text-gray-600" aria-hidden="true">•</span>
              <span className="text-gray-400">{t('footer.copyright')}</span>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}