import { ExternalLink, Video, Music, Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSiteSlug } from '../data/sites';

const sites = [
  // Top 10 most popular sites
  { name: 'YouTube', url: 'youtube.com', color: 'bg-red-500', types: ['Video', 'Audio'], favicon: 'https://www.youtube.com/favicon.ico' },
  { name: 'Twitter/X', url: 'x.com', color: 'bg-black', types: ['Video', 'Image'], favicon: 'https://abs.twimg.com/favicons/twitter.3.ico' },
  { name: 'Instagram', url: 'instagram.com', color: 'bg-pink-500', types: ['Video', 'Image'], favicon: 'https://static.cdninstagram.com/rsrc.php/v3/yt/r/30PrGfR3xhI.ico' },
  { name: 'TikTok', url: 'tiktok.com', color: 'bg-black', types: ['Video'], favicon: 'https://sf16-website-login.neutral.ttwstatic.com/obj/tiktok_web_login_static/tiktok/webapp/main/webapp-desktop/favicon.ico' },
  { name: 'Vimeo', url: 'vimeo.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://f.vimeocdn.com/images_v6/favicon.ico' },
  { name: 'Facebook', url: 'facebook.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://static.xx.fbcdn.net/rsrc.php/yv/r/B8BxsscfVBr.ico' },
  { name: 'bilibili 哔哩哔哩', url: 'bilibili.com', color: 'bg-pink-400', types: ['Video', 'Image', 'Audio'], favicon: 'https://www.bilibili.com/favicon.ico' },
  { name: 'SoundCloud', url: 'soundcloud.com', color: 'bg-orange-500', types: ['Audio'], favicon: 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14b.ico' },
  { name: 'Dailymotion', url: 'dailymotion.com', color: 'bg-blue-400', types: ['Video'], favicon: 'https://static1.dmcdn.net/images/neon/favicons/favicon.ico' },
  { name: 'Tumblr', url: 'tumblr.com', color: 'bg-indigo-600', types: ['Video', 'Image', 'Audio'], favicon: 'https://assets.tumblr.com/images/favicons/favicon.ico' },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Video': return <Video className="h-3 w-3" />;
    case 'Audio': return <Music className="h-3 w-3" />;
    case 'Image': return <Image className="h-3 w-3" />;
    default: return <Video className="h-3 w-3" />;
  }
};

export default function SupportedSites() {
  const { t } = useTranslation();

  return (
    <section id="supported" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('supportedSites.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('supportedSites.subtitle')}
          </p>
          <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4 text-blue-600" />
              <span>{t('supportedSites.types.video')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Music className="h-4 w-4 text-green-600" />
              <span>{t('supportedSites.types.audio')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Image className="h-4 w-4 text-purple-600" />
              <span>{t('supportedSites.types.image')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {sites.map((site) => (
            <a
              key={site.name}
              href={`/download/${getSiteSlug(site.name)}`}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer border border-gray-100 hover:border-gray-200 block"
              aria-label={`Download from ${site.name} - ${site.url}`}
            >
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {site.favicon ? (
                    <img
                      src={site.favicon}
                      alt={`${site.name} favicon`}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        // Fallback to letter if favicon fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.className = `w-8 h-8 ${site.color} rounded-lg flex items-center justify-center flex-shrink-0`;
                          parent.innerHTML = `<span class="text-white font-bold text-sm">${site.name.charAt(0)}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <div className={`w-8 h-8 ${site.color} rounded-lg flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">
                        {site.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">{site.name}</h3>
                  <p className="text-xs text-gray-500 truncate group-hover:text-blue-500 transition-colors">{site.url}</p>
                </div>
                <div className="h-3 w-3 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {site.types.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors"
                  >
                    {getTypeIcon(type)}
                    <span>{type}</span>
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        {/* Show All Sites Button */}
        <div className="text-center mt-8">
          <a
            href="/supported-sites"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <span>{t('supportedSites.showAllSites')}</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <p className="text-sm text-gray-500 mt-2">
            {t('supportedSites.viewAllDescription')}
          </p>
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">{t('supportedSites.universal.title')}</h3>
            <p className="text-blue-100 mb-4">
              {t('supportedSites.universal.description')}
            </p>
            <div className="flex justify-center space-x-4 text-sm text-blue-100">
              {(t('supportedSites.universal.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                <span key={index}>✓ {feature}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
