import { useState, useMemo } from 'react';
import { ExternalLink, Video, Music, Image, Search, Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const sites = [
    // Popular International Sites
    { name: 'YouTube', url: 'youtube.com', color: 'bg-red-500', types: ['Video', 'Audio'], favicon: 'https://www.youtube.com/favicon.ico', region: 'International' },
    { name: 'Twitter/X', url: 'x.com', color: 'bg-black', types: ['Video', 'Image'], favicon: 'https://abs.twimg.com/favicons/twitter.3.ico', region: 'International' },
    { name: 'Instagram', url: 'instagram.com', color: 'bg-pink-500', types: ['Video', 'Image'], favicon: 'https://static.cdninstagram.com/rsrc.php/v3/yt/r/30PrGfR3xhI.ico', region: 'International' },
    { name: 'TikTok', url: 'tiktok.com', color: 'bg-black', types: ['Video'], favicon: 'https://sf16-website-login.neutral.ttwstatic.com/obj/tiktok_web_login_static/tiktok/webapp/main/webapp-desktop/favicon.ico', region: 'International' },
    { name: 'Vimeo', url: 'vimeo.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://f.vimeocdn.com/images_v6/favicon.ico', region: 'International' },
    { name: 'Facebook', url: 'facebook.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://static.xx.fbcdn.net/rsrc.php/yv/r/B8BxsscfVBr.ico', region: 'International' },
    { name: 'Tumblr', url: 'tumblr.com', color: 'bg-indigo-600', types: ['Video', 'Image', 'Audio'], favicon: 'https://assets.tumblr.com/images/favicons/favicon.ico', region: 'International' },
    { name: 'SoundCloud', url: 'soundcloud.com', color: 'bg-orange-500', types: ['Audio'], favicon: 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14b.ico', region: 'International' },
    { name: 'Dailymotion', url: 'dailymotion.com', color: 'bg-blue-400', types: ['Video'], favicon: 'https://static1.dmcdn.net/images/neon/favicons/favicon.ico', region: 'International' },
    { name: 'Pinterest', url: 'pinterest.com', color: 'bg-red-600', types: ['Image'], favicon: 'https://s.pinimg.com/webapp/favicon-7ce86cf5.ico', region: 'International' },
    { name: 'Flickr', url: 'flickr.com', color: 'bg-purple-500', types: ['Image', 'Video'], favicon: 'https://combo.staticflickr.com/pw/favicon.ico', region: 'International' },
    { name: 'VK', url: 'vk.com', color: 'bg-blue-700', types: ['Video', 'Image'], favicon: 'https://vk.com/images/icons/favicons/fav_logo.ico', region: 'International' },
    { name: 'Veoh', url: 'veoh.com', color: 'bg-green-500', types: ['Video'], favicon: null, region: 'International' },
    { name: 'TED', url: 'ted.com', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.ted.com/favicon.ico', region: 'International' },
    { name: 'SHOWROOM', url: 'showroom-live.com', color: 'bg-pink-400', types: ['Video'], favicon: null, region: 'International' },
    { name: 'MTV81', url: 'mtv81.com', color: 'bg-purple-600', types: ['Video'], favicon: null, region: 'International' },
    { name: 'Mixcloud', url: 'mixcloud.com', color: 'bg-teal-500', types: ['Audio'], favicon: 'https://www.mixcloud.com/media/images/www/global/favicon.ico', region: 'International' },
    { name: 'Metacafe', url: 'metacafe.com', color: 'bg-orange-600', types: ['Video'], favicon: null, region: 'International' },
    { name: 'Magisto', url: 'magisto.com', color: 'bg-green-600', types: ['Video'], favicon: null, region: 'International' },
    { name: 'Khan Academy', url: 'khanacademy.org', color: 'bg-green-700', types: ['Video'], favicon: 'https://www.khanacademy.org/favicon.ico', region: 'International' },
    { name: 'Internet Archive', url: 'archive.org', color: 'bg-gray-600', types: ['Video'], favicon: 'https://archive.org/images/glogo.jpg', region: 'International' },
    { name: 'InfoQ', url: 'infoq.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.infoq.com/favicon.ico', region: 'International' },
    { name: 'Imgur', url: 'imgur.com', color: 'bg-green-500', types: ['Image'], favicon: 'https://s.imgur.com/images/favicon-32x32.png', region: 'International' },
    { name: 'Heavy Music Archive', url: 'heavy-music.ru', color: 'bg-gray-800', types: ['Audio'], favicon: null, region: 'International' },
    { name: 'Freesound', url: 'freesound.org', color: 'bg-yellow-600', types: ['Audio'], favicon: 'https://freesound.org/media/images/favicon.ico', region: 'International' },
    { name: 'FC2 Video', url: 'video.fc2.com', color: 'bg-blue-500', types: ['Video'], favicon: null, region: 'International' },
    { name: 'eHow', url: 'ehow.com', color: 'bg-orange-500', types: ['Video'], favicon: null, region: 'International' },
    { name: 'Coub', url: 'coub.com', color: 'bg-blue-400', types: ['Video'], favicon: 'https://coub.com/favicon.ico', region: 'International' },
    { name: 'CBS', url: 'cbs.com', color: 'bg-blue-900', types: ['Video'], favicon: 'https://www.cbs.com/favicon.ico', region: 'International' },
    { name: 'Bandcamp', url: 'bandcamp.com', color: 'bg-teal-600', types: ['Audio'], favicon: 'https://s4.bcbits.com/img/favicon/favicon-32x32.png', region: 'International' },
    { name: 'AliveThai', url: 'alive.in.th', color: 'bg-red-500', types: ['Video'], favicon: null, region: 'International' },
    { name: 'interest.me', url: 'ch.interest.me', color: 'bg-purple-500', types: ['Video'], favicon: null, region: 'International' },

    // Japanese Sites
    { name: '755 ナナゴーゴー', url: '7gogo.jp', color: 'bg-pink-500', types: ['Video', 'Image'], favicon: null, region: 'Japan' },
    { name: 'niconico ニコニコ動画', url: 'nicovideo.jp', color: 'bg-orange-400', types: ['Video'], favicon: 'https://www.nicovideo.jp/favicon.ico', region: 'Japan' },

    // Chinese Sites  
    { name: '163 网易视频/云音乐', url: 'v.163.com', color: 'bg-red-600', types: ['Video', 'Audio'], favicon: 'https://s1.music.126.net/style/favicon.ico', region: 'China' },
    { name: '56网', url: '56.com', color: 'bg-green-600', types: ['Video'], favicon: null, region: 'China' },
    { name: 'AcFun', url: 'acfun.cn', color: 'bg-orange-500', types: ['Video'], favicon: 'https://cdn.aixifan.com/ico/favicon.ico', region: 'China' },
    { name: 'Baidu 百度贴吧', url: 'tieba.baidu.com', color: 'bg-blue-600', types: ['Video', 'Image'], favicon: 'https://tb2.bdstatic.com/tb/favicon.ico', region: 'China' },
    { name: '爆米花网', url: 'baomihua.com', color: 'bg-yellow-500', types: ['Video'], favicon: null, region: 'China' },
    { name: 'bilibili 哔哩哔哩', url: 'bilibili.com', color: 'bg-pink-400', types: ['Video', 'Image', 'Audio'], favicon: 'https://www.bilibili.com/favicon.ico', region: 'China' },
    { name: '豆瓣', url: 'douban.com', color: 'bg-green-700', types: ['Video', 'Audio'], favicon: 'https://www.douban.com/favicon.ico', region: 'China' },
    { name: '斗鱼', url: 'douyutv.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.douyu.com/favicon.ico', region: 'China' },
    { name: '凤凰视频', url: 'v.ifeng.com', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.ifeng.com/favicon.ico', region: 'China' },
    { name: '风行网', url: 'fun.tv', color: 'bg-blue-500', types: ['Video'], favicon: null, region: 'China' },
    { name: 'iQIYI 爱奇艺', url: 'iqiyi.com', color: 'bg-green-500', types: ['Video'], favicon: 'https://www.iqiyi.com/favicon.ico', region: 'China' },
    { name: '激动网', url: 'joy.cn', color: 'bg-red-500', types: ['Video'], favicon: null, region: 'China' },
    { name: '酷6网', url: 'ku6.com', color: 'bg-blue-400', types: ['Video'], favicon: null, region: 'China' },
    { name: '酷狗音乐', url: 'kugou.com', color: 'bg-blue-600', types: ['Audio'], favicon: 'https://www.kugou.com/favicon.ico', region: 'China' },
    { name: '酷我音乐', url: 'kuwo.cn', color: 'bg-orange-500', types: ['Audio'], favicon: 'https://www.kuwo.cn/favicon.ico', region: 'China' },
    { name: '乐视网', url: 'le.com', color: 'bg-green-600', types: ['Video'], favicon: null, region: 'China' },
    { name: '荔枝FM', url: 'lizhi.fm', color: 'bg-green-500', types: ['Audio'], favicon: null, region: 'China' },
    { name: '懒人听书', url: 'lrts.me', color: 'bg-blue-500', types: ['Audio'], favicon: null, region: 'China' },
    { name: '秒拍', url: 'miaopai.com', color: 'bg-orange-400', types: ['Video'], favicon: null, region: 'China' },
    { name: 'MioMio弹幕网', url: 'miomio.tv', color: 'bg-purple-500', types: ['Video'], favicon: null, region: 'China' },
    { name: 'MissEvan 猫耳FM', url: 'missevan.com', color: 'bg-pink-500', types: ['Audio'], favicon: 'https://www.missevan.com/favicon.ico', region: 'China' },
    { name: '痞客邦', url: 'pixnet.net', color: 'bg-blue-400', types: ['Video'], favicon: null, region: 'China' },
    { name: 'PPTV聚力', url: 'pptv.com', color: 'bg-orange-600', types: ['Video'], favicon: null, region: 'China' },
    { name: '齐鲁网', url: 'v.iqilu.com', color: 'bg-blue-600', types: ['Video'], favicon: null, region: 'China' },
    { name: 'QQ 腾讯视频', url: 'v.qq.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://v.qq.com/favicon.ico', region: 'China' },
    { name: '企鹅直播', url: 'live.qq.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://live.qq.com/favicon.ico', region: 'China' },
    { name: 'Sina 新浪视频/微博', url: 'video.sina.com.cn', color: 'bg-red-500', types: ['Video'], favicon: 'https://www.sina.com.cn/favicon.ico', region: 'China' },
    { name: 'Sohu 搜狐视频', url: 'tv.sohu.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://tv.sohu.com/favicon.ico', region: 'China' },
    { name: 'Tudou 土豆', url: 'tudou.com', color: 'bg-orange-400', types: ['Video'], favicon: 'https://www.tudou.com/favicon.ico', region: 'China' },
    { name: '阳光卫视', url: 'isuntv.com', color: 'bg-yellow-500', types: ['Video'], favicon: null, region: 'China' },
    { name: 'Youku 优酷', url: 'youku.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://www.youku.com/favicon.ico', region: 'China' },
    { name: '战旗TV', url: 'zhanqi.tv', color: 'bg-red-600', types: ['Video'], favicon: null, region: 'China' },
    { name: '央视网', url: 'cntv.cn', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.cctv.com/favicon.ico', region: 'China' },
    { name: '芒果TV', url: 'mgtv.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.mgtv.com/favicon.ico', region: 'China' },
    { name: '火猫TV', url: 'huomao.com', color: 'bg-red-500', types: ['Video'], favicon: null, region: 'China' },
    { name: '阳光宽频网', url: '365yg.com', color: 'bg-yellow-600', types: ['Video'], favicon: null, region: 'China' },
    { name: '西瓜视频', url: 'ixigua.com', color: 'bg-green-500', types: ['Video'], favicon: 'https://www.ixigua.com/favicon.ico', region: 'China' },
    { name: '新片场', url: 'xinpianchang.com', color: 'bg-purple-500', types: ['Video'], favicon: 'https://www.xinpianchang.com/favicon.ico', region: 'China' },
    { name: '快手', url: 'kuaishou.com', color: 'bg-yellow-500', types: ['Video', 'Image'], favicon: 'https://www.kuaishou.com/favicon.ico', region: 'China' },
    { name: '抖音', url: 'douyin.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.douyin.com/favicon.ico', region: 'China' },
    { name: '中国体育TV', url: 'v.zhibo.tv', color: 'bg-blue-600', types: ['Video'], favicon: null, region: 'China' },
    { name: '知乎', url: 'zhihu.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://static.zhihu.com/heifetz/favicon.ico', region: 'China' },

    // Korean Sites
    { name: 'Naver 네이버', url: 'tvcast.naver.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.naver.com/favicon.ico', region: 'Korea' },
];

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'Video': return <Video className="h-3 w-3" />;
        case 'Audio': return <Music className="h-3 w-3" />;
        case 'Image': return <Image className="h-3 w-3" />;
        default: return <Video className="h-3 w-3" />;
    }
};

export default function AllSupportedSites() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('All');
    const [selectedRegion, setSelectedRegion] = useState<string>('All');

    // Get unique regions and types
    const regions = useMemo(() => {
        const uniqueRegions = Array.from(new Set(sites.map(site => site.region))).sort();
        return ['All', ...uniqueRegions];
    }, []);

    const types = useMemo(() => {
        const uniqueTypes = Array.from(new Set(sites.flatMap(site => site.types))).sort();
        return ['All', ...uniqueTypes];
    }, []);

    // Filter sites based on search and filters
    const filteredSites = useMemo(() => {
        return sites.filter(site => {
            const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                site.url.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = selectedType === 'All' || site.types.includes(selectedType);
            const matchesRegion = selectedRegion === 'All' || site.region === selectedRegion;

            return matchesSearch && matchesType && matchesRegion;
        });
    }, [searchTerm, selectedType, selectedRegion]);

    // Group sites by region
    const sitesByRegion = useMemo(() => {
        const grouped = filteredSites.reduce((acc, site) => {
            if (!acc[site.region]) {
                acc[site.region] = [];
            }
            acc[site.region].push(site);
            return acc;
        }, {} as Record<string, typeof sites>);

        // Sort regions with International first
        const sortedRegions = Object.keys(grouped).sort((a, b) => {
            if (a === 'International') return -1;
            if (b === 'International') return 1;
            return a.localeCompare(b);
        });

        return sortedRegions.map(region => ({
            region,
            sites: grouped[region]
        }));
    }, [filteredSites]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {t('allSupportedSites.title')}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        {t('allSupportedSites.subtitle')}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center space-x-8 text-sm text-gray-600 mb-8">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>{sites.filter(s => s.types.includes('Video')).length} {t('supportedSites.types.video')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>{sites.filter(s => s.types.includes('Audio')).length} {t('supportedSites.types.audio')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span>{sites.filter(s => s.types.includes('Image')).length} {t('supportedSites.types.image')}</span>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('allSupportedSites.searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Type Filter */}
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {types.map(type => (
                                    <option key={type} value={type}>
                                        {type === 'All' ? t('allSupportedSites.filters.allTypes') : type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Region Filter */}
                        <div className="flex items-center space-x-2">
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {regions.map(region => (
                                    <option key={region} value={region}>
                                        {region === 'All' ? t('allSupportedSites.filters.allRegions') : region}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="mt-4 text-sm text-gray-600">
                        {t('allSupportedSites.resultsCount', { count: filteredSites.length, total: sites.length })}
                    </div>
                </div>

                {/* Sites grouped by region */}
                {sitesByRegion.map(({ region, sites: regionSites }) => (
                    <div key={region} className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="w-1 h-8 bg-blue-500 rounded-full mr-4"></span>
                            {region}
                            <span className="ml-2 text-lg text-gray-500 font-normal">
                                ({regionSites.length} {t('allSupportedSites.sitesCount')})
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {regionSites.map((site) => (
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
                    </div>
                ))}

                {/* No results */}
                {filteredSites.length === 0 && (
                    <div className="text-center py-12">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {t('allSupportedSites.noResults.title')}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {t('allSupportedSites.noResults.description')}
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedType('All');
                                setSelectedRegion('All');
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {t('allSupportedSites.noResults.clearFilters')}
                        </button>
                    </div>
                )}

                {/* Back to home */}
                <div className="text-center mt-12">
                    <a
                        href="/#supported"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        {t('allSupportedSites.backToHome')}
                    </a>
                </div>
            </div>
        </div>
    );
}
