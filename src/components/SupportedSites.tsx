import { useState } from 'react';
import { ExternalLink, Video, Music, Image, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const sites = [
  // Popular International Sites
  { name: 'YouTube', url: 'youtube.com', color: 'bg-red-500', types: ['Video', 'Audio'], favicon: 'https://www.youtube.com/favicon.ico' },
  { name: 'Twitter/X', url: 'x.com', color: 'bg-black', types: ['Video', 'Image'], favicon: 'https://abs.twimg.com/favicons/twitter.3.ico' },
  { name: 'Instagram', url: 'instagram.com', color: 'bg-pink-500', types: ['Video', 'Image'], favicon: 'https://static.cdninstagram.com/rsrc.php/v3/yt/r/30PrGfR3xhI.ico' },
  { name: 'TikTok', url: 'tiktok.com', color: 'bg-black', types: ['Video'], favicon: 'https://sf16-website-login.neutral.ttwstatic.com/obj/tiktok_web_login_static/tiktok/webapp/main/webapp-desktop/favicon.ico' },
  { name: 'Vimeo', url: 'vimeo.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://f.vimeocdn.com/images_v6/favicon.ico' },
  { name: 'Facebook', url: 'facebook.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://static.xx.fbcdn.net/rsrc.php/yv/r/B8BxsscfVBr.ico' },
  { name: 'Tumblr', url: 'tumblr.com', color: 'bg-indigo-600', types: ['Video', 'Image', 'Audio'], favicon: 'https://assets.tumblr.com/images/favicons/favicon.ico' },
  { name: 'SoundCloud', url: 'soundcloud.com', color: 'bg-orange-500', types: ['Audio'], favicon: 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14b.ico' },
  { name: 'Dailymotion', url: 'dailymotion.com', color: 'bg-blue-400', types: ['Video'], favicon: 'https://static1.dmcdn.net/images/neon/favicons/favicon.ico' },
  { name: 'Pinterest', url: 'pinterest.com', color: 'bg-red-600', types: ['Image'], favicon: 'https://s.pinimg.com/webapp/favicon-7ce86cf5.ico' },
  { name: 'Flickr', url: 'flickr.com', color: 'bg-purple-500', types: ['Image', 'Video'], favicon: 'https://combo.staticflickr.com/pw/favicon.ico' },
  { name: 'VK', url: 'vk.com', color: 'bg-blue-700', types: ['Video', 'Image'], favicon: 'https://vk.com/images/icons/favicons/fav_logo.ico' },
  { name: 'Veoh', url: 'veoh.com', color: 'bg-green-500', types: ['Video'], favicon: null },
  { name: 'TED', url: 'ted.com', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.ted.com/favicon.ico' },
  { name: 'SHOWROOM', url: 'showroom-live.com', color: 'bg-pink-400', types: ['Video'], favicon: null },
  { name: 'MTV81', url: 'mtv81.com', color: 'bg-purple-600', types: ['Video'], favicon: null },
  { name: 'Mixcloud', url: 'mixcloud.com', color: 'bg-teal-500', types: ['Audio'], favicon: 'https://www.mixcloud.com/media/images/www/global/favicon.ico' },
  { name: 'Metacafe', url: 'metacafe.com', color: 'bg-orange-600', types: ['Video'], favicon: null },
  { name: 'Magisto', url: 'magisto.com', color: 'bg-green-600', types: ['Video'], favicon: null },
  { name: 'Khan Academy', url: 'khanacademy.org', color: 'bg-green-700', types: ['Video'], favicon: 'https://www.khanacademy.org/favicon.ico' },
  { name: 'Internet Archive', url: 'archive.org', color: 'bg-gray-600', types: ['Video'], favicon: 'https://archive.org/images/glogo.jpg' },
  { name: 'InfoQ', url: 'infoq.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.infoq.com/favicon.ico' },
  { name: 'Imgur', url: 'imgur.com', color: 'bg-green-500', types: ['Image'], favicon: 'https://s.imgur.com/images/favicon-32x32.png' },
  { name: 'Heavy Music Archive', url: 'heavy-music.ru', color: 'bg-gray-800', types: ['Audio'], favicon: null },
  { name: 'Freesound', url: 'freesound.org', color: 'bg-yellow-600', types: ['Audio'], favicon: 'https://freesound.org/media/images/favicon.ico' },
  { name: 'FC2 Video', url: 'video.fc2.com', color: 'bg-blue-500', types: ['Video'], favicon: null },
  { name: 'eHow', url: 'ehow.com', color: 'bg-orange-500', types: ['Video'], favicon: null },
  { name: 'Coub', url: 'coub.com', color: 'bg-blue-400', types: ['Video'], favicon: 'https://coub.com/favicon.ico' },
  { name: 'CBS', url: 'cbs.com', color: 'bg-blue-900', types: ['Video'], favicon: 'https://www.cbs.com/favicon.ico' },
  { name: 'Bandcamp', url: 'bandcamp.com', color: 'bg-teal-600', types: ['Audio'], favicon: 'https://s4.bcbits.com/img/favicon/favicon-32x32.png' },
  { name: 'AliveThai', url: 'alive.in.th', color: 'bg-red-500', types: ['Video'], favicon: null },
  { name: 'interest.me', url: 'ch.interest.me', color: 'bg-purple-500', types: ['Video'], favicon: null },

  // Japanese Sites
  { name: '755 ナナゴーゴー', url: '7gogo.jp', color: 'bg-pink-500', types: ['Video', 'Image'], favicon: null },
  { name: 'niconico ニコニコ動画', url: 'nicovideo.jp', color: 'bg-orange-400', types: ['Video'], favicon: 'https://www.nicovideo.jp/favicon.ico' },

  // Chinese Sites  
  { name: '163 网易视频/云音乐', url: 'v.163.com', color: 'bg-red-600', types: ['Video', 'Audio'], favicon: 'https://s1.music.126.net/style/favicon.ico' },
  { name: '56网', url: '56.com', color: 'bg-green-600', types: ['Video'], favicon: null },
  { name: 'AcFun', url: 'acfun.cn', color: 'bg-orange-500', types: ['Video'], favicon: 'https://cdn.aixifan.com/ico/favicon.ico' },
  { name: 'Baidu 百度贴吧', url: 'tieba.baidu.com', color: 'bg-blue-600', types: ['Video', 'Image'], favicon: 'https://tb2.bdstatic.com/tb/favicon.ico' },
  { name: '爆米花网', url: 'baomihua.com', color: 'bg-yellow-500', types: ['Video'], favicon: null },
  { name: 'bilibili 哔哩哔哩', url: 'bilibili.com', color: 'bg-pink-400', types: ['Video', 'Image', 'Audio'], favicon: 'https://www.bilibili.com/favicon.ico' },
  { name: '豆瓣', url: 'douban.com', color: 'bg-green-700', types: ['Video', 'Audio'], favicon: 'https://www.douban.com/favicon.ico' },
  { name: '斗鱼', url: 'douyutv.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.douyu.com/favicon.ico' },
  { name: '凤凰视频', url: 'v.ifeng.com', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.ifeng.com/favicon.ico' },
  { name: '风行网', url: 'fun.tv', color: 'bg-blue-500', types: ['Video'], favicon: null },
  { name: 'iQIYI 爱奇艺', url: 'iqiyi.com', color: 'bg-green-500', types: ['Video'], favicon: 'https://www.iqiyi.com/favicon.ico' },
  { name: '激动网', url: 'joy.cn', color: 'bg-red-500', types: ['Video'], favicon: null },
  { name: '酷6网', url: 'ku6.com', color: 'bg-blue-400', types: ['Video'], favicon: null },
  { name: '酷狗音乐', url: 'kugou.com', color: 'bg-blue-600', types: ['Audio'], favicon: 'https://www.kugou.com/favicon.ico' },
  { name: '酷我音乐', url: 'kuwo.cn', color: 'bg-orange-500', types: ['Audio'], favicon: 'https://www.kuwo.cn/favicon.ico' },
  { name: '乐视网', url: 'le.com', color: 'bg-green-600', types: ['Video'], favicon: null },
  { name: '荔枝FM', url: 'lizhi.fm', color: 'bg-green-500', types: ['Audio'], favicon: null },
  { name: '懒人听书', url: 'lrts.me', color: 'bg-blue-500', types: ['Audio'], favicon: null },
  { name: '秒拍', url: 'miaopai.com', color: 'bg-orange-400', types: ['Video'], favicon: null },
  { name: 'MioMio弹幕网', url: 'miomio.tv', color: 'bg-purple-500', types: ['Video'], favicon: null },
  { name: 'MissEvan 猫耳FM', url: 'missevan.com', color: 'bg-pink-500', types: ['Audio'], favicon: 'https://www.missevan.com/favicon.ico' },
  { name: '痞客邦', url: 'pixnet.net', color: 'bg-blue-400', types: ['Video'], favicon: null },
  { name: 'PPTV聚力', url: 'pptv.com', color: 'bg-orange-600', types: ['Video'], favicon: null },
  { name: '齐鲁网', url: 'v.iqilu.com', color: 'bg-blue-600', types: ['Video'], favicon: null },
  { name: 'QQ 腾讯视频', url: 'v.qq.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://v.qq.com/favicon.ico' },
  { name: '企鹅直播', url: 'live.qq.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://live.qq.com/favicon.ico' },
  { name: 'Sina 新浪视频/微博', url: 'video.sina.com.cn', color: 'bg-red-500', types: ['Video'], favicon: 'https://www.sina.com.cn/favicon.ico' },
  { name: 'Sohu 搜狐视频', url: 'tv.sohu.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://tv.sohu.com/favicon.ico' },
  { name: 'Tudou 土豆', url: 'tudou.com', color: 'bg-orange-400', types: ['Video'], favicon: 'https://www.tudou.com/favicon.ico' },
  { name: '阳光卫视', url: 'isuntv.com', color: 'bg-yellow-500', types: ['Video'], favicon: null },
  { name: 'Youku 优酷', url: 'youku.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://www.youku.com/favicon.ico' },
  { name: '战旗TV', url: 'zhanqi.tv', color: 'bg-red-600', types: ['Video'], favicon: null },
  { name: '央视网', url: 'cntv.cn', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.cctv.com/favicon.ico' },
  { name: '芒果TV', url: 'mgtv.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.mgtv.com/favicon.ico' },
  { name: '火猫TV', url: 'huomao.com', color: 'bg-red-500', types: ['Video'], favicon: null },
  { name: '阳光宽频网', url: '365yg.com', color: 'bg-yellow-600', types: ['Video'], favicon: null },
  { name: '西瓜视频', url: 'ixigua.com', color: 'bg-green-500', types: ['Video'], favicon: 'https://www.ixigua.com/favicon.ico' },
  { name: '新片场', url: 'xinpianchang.com', color: 'bg-purple-500', types: ['Video'], favicon: 'https://www.xinpianchang.com/favicon.ico' },
  { name: '快手', url: 'kuaishou.com', color: 'bg-yellow-500', types: ['Video', 'Image'], favicon: 'https://www.kuaishou.com/favicon.ico' },
  { name: '抖音', url: 'douyin.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.douyin.com/favicon.ico' },
  { name: '中国体育TV', url: 'v.zhibo.tv', color: 'bg-blue-600', types: ['Video'], favicon: null },
  { name: '知乎', url: 'zhihu.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://static.zhihu.com/heifetz/favicon.ico' },

  // Korean Sites
  { name: 'Naver 네이버', url: 'tvcast.naver.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.naver.com/favicon.ico' },
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
  const [showAll, setShowAll] = useState(false);

  // 主流网站前5个
  const mainSites = sites.slice(0, 5);
  const displaySites = showAll ? sites : mainSites;

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
          {displaySites.map((site) => (
            <a
              key={site.name}
              href={`https://${site.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer border border-gray-100 hover:border-gray-200 block"
              aria-label={`Visit ${site.name} - ${site.url}`}
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
                <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
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

        {/* 展开/收起按钮 */}
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            <span>
              {showAll ? t('supportedSites.showLess') : t('supportedSites.showMore')}
            </span>
            {showAll ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {!showAll && (
            <p className="text-sm text-gray-500 mt-2">
              {t('supportedSites.moreCount', { count: sites.length - mainSites.length })}
            </p>
          )}
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