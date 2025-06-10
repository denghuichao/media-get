import React from 'react';
import { ExternalLink, Video, Music, Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const sites = [
  // Popular International Sites
  { name: 'YouTube', url: 'youtube.com', color: 'bg-red-500', types: ['Video', 'Audio'] },
  { name: 'Twitter/X', url: 'x.com', color: 'bg-black', types: ['Video', 'Image'] },
  { name: 'Instagram', url: 'instagram.com', color: 'bg-pink-500', types: ['Video', 'Image'] },
  { name: 'TikTok', url: 'tiktok.com', color: 'bg-black', types: ['Video'] },
  { name: 'Vimeo', url: 'vimeo.com', color: 'bg-blue-500', types: ['Video'] },
  { name: 'Facebook', url: 'facebook.com', color: 'bg-blue-600', types: ['Video'] },
  { name: 'Tumblr', url: 'tumblr.com', color: 'bg-indigo-600', types: ['Video', 'Image', 'Audio'] },
  { name: 'SoundCloud', url: 'soundcloud.com', color: 'bg-orange-500', types: ['Audio'] },
  { name: 'Dailymotion', url: 'dailymotion.com', color: 'bg-blue-400', types: ['Video'] },
  { name: 'Pinterest', url: 'pinterest.com', color: 'bg-red-600', types: ['Image'] },
  { name: 'Flickr', url: 'flickr.com', color: 'bg-purple-500', types: ['Image', 'Video'] },
  { name: 'VK', url: 'vk.com', color: 'bg-blue-700', types: ['Video', 'Image'] },
  { name: 'Veoh', url: 'veoh.com', color: 'bg-green-500', types: ['Video'] },
  { name: 'TED', url: 'ted.com', color: 'bg-red-700', types: ['Video'] },
  { name: 'SHOWROOM', url: 'showroom-live.com', color: 'bg-pink-400', types: ['Video'] },
  { name: 'MTV81', url: 'mtv81.com', color: 'bg-purple-600', types: ['Video'] },
  { name: 'Mixcloud', url: 'mixcloud.com', color: 'bg-teal-500', types: ['Audio'] },
  { name: 'Metacafe', url: 'metacafe.com', color: 'bg-orange-600', types: ['Video'] },
  { name: 'Magisto', url: 'magisto.com', color: 'bg-green-600', types: ['Video'] },
  { name: 'Khan Academy', url: 'khanacademy.org', color: 'bg-green-700', types: ['Video'] },
  { name: 'Internet Archive', url: 'archive.org', color: 'bg-gray-600', types: ['Video'] },
  { name: 'InfoQ', url: 'infoq.com', color: 'bg-blue-800', types: ['Video'] },
  { name: 'Imgur', url: 'imgur.com', color: 'bg-green-500', types: ['Image'] },
  { name: 'Heavy Music Archive', url: 'heavy-music.ru', color: 'bg-gray-800', types: ['Audio'] },
  { name: 'Freesound', url: 'freesound.org', color: 'bg-yellow-600', types: ['Audio'] },
  { name: 'FC2 Video', url: 'video.fc2.com', color: 'bg-blue-500', types: ['Video'] },
  { name: 'eHow', url: 'ehow.com', color: 'bg-orange-500', types: ['Video'] },
  { name: 'Coub', url: 'coub.com', color: 'bg-blue-400', types: ['Video'] },
  { name: 'CBS', url: 'cbs.com', color: 'bg-blue-900', types: ['Video'] },
  { name: 'Bandcamp', url: 'bandcamp.com', color: 'bg-teal-600', types: ['Audio'] },
  { name: 'AliveThai', url: 'alive.in.th', color: 'bg-red-500', types: ['Video'] },
  { name: 'interest.me', url: 'ch.interest.me', color: 'bg-purple-500', types: ['Video'] },
  
  // Japanese Sites
  { name: '755 ナナゴーゴー', url: '7gogo.jp', color: 'bg-pink-500', types: ['Video', 'Image'] },
  { name: 'niconico ニコニコ動画', url: 'nicovideo.jp', color: 'bg-orange-400', types: ['Video'] },
  
  // Chinese Sites
  { name: '163 网易视频/云音乐', url: 'v.163.com', color: 'bg-red-600', types: ['Video', 'Audio'] },
  { name: '56网', url: '56.com', color: 'bg-green-600', types: ['Video'] },
  { name: 'AcFun', url: 'acfun.cn', color: 'bg-orange-500', types: ['Video'] },
  { name: 'Baidu 百度贴吧', url: 'tieba.baidu.com', color: 'bg-blue-600', types: ['Video', 'Image'] },
  { name: '爆米花网', url: 'baomihua.com', color: 'bg-yellow-500', types: ['Video'] },
  { name: 'bilibili 哔哩哔哩', url: 'bilibili.com', color: 'bg-pink-400', types: ['Video', 'Image', 'Audio'] },
  { name: '豆瓣', url: 'douban.com', color: 'bg-green-700', types: ['Video', 'Audio'] },
  { name: '斗鱼', url: 'douyutv.com', color: 'bg-orange-600', types: ['Video'] },
  { name: '凤凰视频', url: 'v.ifeng.com', color: 'bg-red-700', types: ['Video'] },
  { name: '风行网', url: 'fun.tv', color: 'bg-blue-500', types: ['Video'] },
  { name: 'iQIYI 爱奇艺', url: 'iqiyi.com', color: 'bg-green-500', types: ['Video'] },
  { name: '激动网', url: 'joy.cn', color: 'bg-red-500', types: ['Video'] },
  { name: '酷6网', url: 'ku6.com', color: 'bg-blue-400', types: ['Video'] },
  { name: '酷狗音乐', url: 'kugou.com', color: 'bg-blue-600', types: ['Audio'] },
  { name: '酷我音乐', url: 'kuwo.cn', color: 'bg-orange-500', types: ['Audio'] },
  { name: '乐视网', url: 'le.com', color: 'bg-green-600', types: ['Video'] },
  { name: '荔枝FM', url: 'lizhi.fm', color: 'bg-green-500', types: ['Audio'] },
  { name: '懒人听书', url: 'lrts.me', color: 'bg-blue-500', types: ['Audio'] },
  { name: '秒拍', url: 'miaopai.com', color: 'bg-orange-400', types: ['Video'] },
  { name: 'MioMio弹幕网', url: 'miomio.tv', color: 'bg-purple-500', types: ['Video'] },
  { name: 'MissEvan 猫耳FM', url: 'missevan.com', color: 'bg-pink-500', types: ['Audio'] },
  { name: '痞客邦', url: 'pixnet.net', color: 'bg-blue-400', types: ['Video'] },
  { name: 'PPTV聚力', url: 'pptv.com', color: 'bg-orange-600', types: ['Video'] },
  { name: '齐鲁网', url: 'v.iqilu.com', color: 'bg-blue-600', types: ['Video'] },
  { name: 'QQ 腾讯视频', url: 'v.qq.com', color: 'bg-blue-500', types: ['Video'] },
  { name: '企鹅直播', url: 'live.qq.com', color: 'bg-blue-600', types: ['Video'] },
  { name: 'Sina 新浪视频/微博', url: 'video.sina.com.cn', color: 'bg-red-500', types: ['Video'] },
  { name: 'Sohu 搜狐视频', url: 'tv.sohu.com', color: 'bg-orange-500', types: ['Video'] },
  { name: 'Tudou 土豆', url: 'tudou.com', color: 'bg-orange-400', types: ['Video'] },
  { name: '阳光卫视', url: 'isuntv.com', color: 'bg-yellow-500', types: ['Video'] },
  { name: 'Youku 优酷', url: 'youku.com', color: 'bg-blue-500', types: ['Video'] },
  { name: '战旗TV', url: 'zhanqi.tv', color: 'bg-red-600', types: ['Video'] },
  { name: '央视网', url: 'cntv.cn', color: 'bg-red-700', types: ['Video'] },
  { name: '芒果TV', url: 'mgtv.com', color: 'bg-orange-500', types: ['Video'] },
  { name: '火猫TV', url: 'huomao.com', color: 'bg-red-500', types: ['Video'] },
  { name: '阳光宽频网', url: '365yg.com', color: 'bg-yellow-600', types: ['Video'] },
  { name: '西瓜视频', url: 'ixigua.com', color: 'bg-green-500', types: ['Video'] },
  { name: '新片场', url: 'xinpianchang.com', color: 'bg-purple-500', types: ['Video'] },
  { name: '快手', url: 'kuaishou.com', color: 'bg-yellow-500', types: ['Video', 'Image'] },
  { name: '抖音', url: 'douyin.com', color: 'bg-black', types: ['Video'] },
  { name: '中国体育TV', url: 'v.zhibo.tv', color: 'bg-blue-600', types: ['Video'] },
  { name: '知乎', url: 'zhihu.com', color: 'bg-blue-700', types: ['Video'] },
  
  // Korean Sites
  { name: 'Naver 네이버', url: 'tvcast.naver.com', color: 'bg-green-600', types: ['Video'] },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sites.map((site) => (
            <div
              key={site.name}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer border border-gray-100 hover:border-gray-200"
            >
              <div className="flex items-start space-x-3 mb-3">
                <div className={`w-8 h-8 ${site.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">
                    {site.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{site.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{site.url}</p>
                </div>
                <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
              </div>
              
              <div className="flex flex-wrap gap-1">
                {site.types.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {getTypeIcon(type)}
                    <span>{type}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">{t('supportedSites.universal.title')}</h3>
            <p className="text-blue-100 mb-4">
              {t('supportedSites.universal.description')}
            </p>
            <div className="flex justify-center space-x-4 text-sm text-blue-100">
              {t('supportedSites.universal.features', { returnObjects: true }).map((feature: string, index: number) => (
                <span key={index}>✓ {feature}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}