export interface SiteInfo {
    name: string;
    url: string;
    color: string;
    types: string[];
    favicon?: string;
    region: string;
}

export const sites: SiteInfo[] = [
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
    { name: 'Veoh', url: 'veoh.com', color: 'bg-green-500', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'TED', url: 'ted.com', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.ted.com/favicon.ico', region: 'International' },
    { name: 'SHOWROOM', url: 'showroom-live.com', color: 'bg-pink-400', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'MTV81', url: 'mtv81.com', color: 'bg-purple-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Mixcloud', url: 'mixcloud.com', color: 'bg-teal-500', types: ['Audio'], favicon: 'https://www.mixcloud.com/media/images/www/global/favicon.ico', region: 'International' },
    { name: 'Metacafe', url: 'metacafe.com', color: 'bg-orange-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Magisto', url: 'magisto.com', color: 'bg-green-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Khan Academy', url: 'khanacademy.org', color: 'bg-green-700', types: ['Video'], favicon: 'https://www.khanacademy.org/favicon.ico', region: 'International' },
    { name: 'Internet Archive', url: 'archive.org', color: 'bg-gray-600', types: ['Video'], favicon: 'https://archive.org/images/glogo.jpg', region: 'International' },
    { name: 'InfoQ', url: 'infoq.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.infoq.com/favicon.ico', region: 'International' },
    { name: 'Imgur', url: 'imgur.com', color: 'bg-green-500', types: ['Image'], favicon: 'https://s.imgur.com/images/favicon-32x32.png', region: 'International' },
    { name: 'Heavy Music Archive', url: 'heavy-music.ru', color: 'bg-gray-800', types: ['Audio'], favicon: undefined, region: 'International' },
    { name: 'Freesound', url: 'freesound.org', color: 'bg-yellow-600', types: ['Audio'], favicon: 'https://freesound.org/media/images/favicon.ico', region: 'International' },
    { name: 'FC2 Video', url: 'video.fc2.com', color: 'bg-blue-500', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'eHow', url: 'ehow.com', color: 'bg-orange-500', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Coub', url: 'coub.com', color: 'bg-blue-400', types: ['Video'], favicon: 'https://coub.com/favicon.ico', region: 'International' },
    { name: 'CBS', url: 'cbs.com', color: 'bg-blue-900', types: ['Video'], favicon: 'https://www.cbs.com/favicon.ico', region: 'International' },
    { name: 'Bandcamp', url: 'bandcamp.com', color: 'bg-teal-600', types: ['Audio'], favicon: 'https://s4.bcbits.com/img/favicon/favicon-32x32.png', region: 'International' },
    { name: 'AliveThai', url: 'alive.in.th', color: 'bg-red-500', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'interest.me', url: 'ch.interest.me', color: 'bg-purple-500', types: ['Video'], favicon: undefined, region: 'International' },

    // Japanese Sites
    { name: '755 ナナゴーゴー', url: '7gogo.jp', color: 'bg-pink-500', types: ['Video', 'Image'], favicon: undefined, region: 'Japan' },
    { name: 'niconico ニコニコ動画', url: 'nicovideo.jp', color: 'bg-orange-400', types: ['Video'], favicon: 'https://www.nicovideo.jp/favicon.ico', region: 'Japan' },

    // Chinese Sites  
    { name: '163 网易视频/云音乐', url: 'v.163.com', color: 'bg-red-600', types: ['Video', 'Audio'], favicon: 'https://s1.music.126.net/style/favicon.ico', region: 'China' },
    { name: '56网', url: '56.com', color: 'bg-green-600', types: ['Video'], favicon: undefined, region: 'China' },
    { name: 'AcFun', url: 'acfun.cn', color: 'bg-orange-500', types: ['Video'], favicon: 'https://cdn.aixifan.com/ico/favicon.ico', region: 'China' },
    { name: 'Baidu 百度贴吧', url: 'tieba.baidu.com', color: 'bg-blue-600', types: ['Video', 'Image'], favicon: 'https://tb2.bdstatic.com/tb/favicon.ico', region: 'China' },
    { name: '爆米花网', url: 'baomihua.com', color: 'bg-yellow-500', types: ['Video'], favicon: undefined, region: 'China' },
    { name: 'bilibili 哔哩哔哩', url: 'bilibili.com', color: 'bg-pink-400', types: ['Video', 'Image', 'Audio'], favicon: 'https://www.bilibili.com/favicon.ico', region: 'China' },
    { name: '豆瓣', url: 'douban.com', color: 'bg-green-700', types: ['Video', 'Audio'], favicon: 'https://www.douban.com/favicon.ico', region: 'China' },
    { name: '斗鱼', url: 'douyutv.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.douyu.com/favicon.ico', region: 'China' },
    { name: '凤凰视频', url: 'v.ifeng.com', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.ifeng.com/favicon.ico', region: 'China' },
    { name: '风行网', url: 'fun.tv', color: 'bg-blue-500', types: ['Video'], favicon: undefined, region: 'China' },
    { name: 'iQIYI 爱奇艺', url: 'iqiyi.com', color: 'bg-green-500', types: ['Video'], favicon: 'https://www.iqiyi.com/favicon.ico', region: 'China' },
    { name: '激动网', url: 'joy.cn', color: 'bg-red-500', types: ['Video'], favicon: undefined, region: 'China' },
    { name: '酷6网', url: 'ku6.com', color: 'bg-blue-400', types: ['Video'], favicon: undefined, region: 'China' },
    { name: '酷狗音乐', url: 'kugou.com', color: 'bg-blue-600', types: ['Audio'], favicon: 'https://www.kugou.com/favicon.ico', region: 'China' },
    { name: '酷我音乐', url: 'kuwo.cn', color: 'bg-orange-500', types: ['Audio'], favicon: 'https://www.kuwo.cn/favicon.ico', region: 'China' },
    { name: '乐视网', url: 'le.com', color: 'bg-green-600', types: ['Video'], favicon: undefined, region: 'China' },
    { name: '荔枝FM', url: 'lizhi.fm', color: 'bg-green-500', types: ['Audio'], favicon: undefined, region: 'China' },
    { name: '懒人听书', url: 'lrts.me', color: 'bg-blue-500', types: ['Audio'], favicon: undefined, region: 'China' },
    { name: '秒拍', url: 'miaopai.com', color: 'bg-orange-400', types: ['Video'], favicon: undefined, region: 'China' },
    { name: 'MioMio弹幕网', url: 'miomio.tv', color: 'bg-purple-500', types: ['Video'], favicon: undefined, region: 'China' },
    { name: 'MissEvan 猫耳FM', url: 'missevan.com', color: 'bg-pink-500', types: ['Audio'], favicon: 'https://www.missevan.com/favicon.ico', region: 'China' },
    { name: '痞客邦', url: 'pixnet.net', color: 'bg-blue-400', types: ['Video'], favicon: undefined, region: 'China' },
    { name: 'PPTV聚力', url: 'pptv.com', color: 'bg-orange-600', types: ['Video'], favicon: undefined, region: 'China' },
    { name: '齐鲁网', url: 'v.iqilu.com', color: 'bg-blue-600', types: ['Video'], favicon: undefined, region: 'China' },
    { name: 'QQ 腾讯视频', url: 'v.qq.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://v.qq.com/favicon.ico', region: 'China' },
    { name: '企鹅直播', url: 'live.qq.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://live.qq.com/favicon.ico', region: 'China' },
    { name: 'Sina 新浪视频/微博', url: 'video.sina.com.cn', color: 'bg-red-500', types: ['Video'], favicon: 'https://www.sina.com.cn/favicon.ico', region: 'China' },
    { name: 'Sohu 搜狐视频', url: 'tv.sohu.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://tv.sohu.com/favicon.ico', region: 'China' },
    { name: 'Tudou 土豆', url: 'tudou.com', color: 'bg-orange-400', types: ['Video'], favicon: 'https://www.tudou.com/favicon.ico', region: 'China' },
    { name: '阳光卫视', url: 'isuntv.com', color: 'bg-yellow-500', types: ['Video'], favicon: undefined, region: 'China' },
    { name: 'Youku 优酷', url: 'youku.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://www.youku.com/favicon.ico', region: 'China' },
    { name: '战旗TV', url: 'zhanqi.tv', color: 'bg-red-600', types: ['Video'], favicon: undefined, region: 'China' },
    { name: '央视网', url: 'cntv.cn', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.cctv.com/favicon.ico', region: 'China' },
    { name: '芒果TV', url: 'mgtv.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.mgtv.com/favicon.ico', region: 'China' },
    { name: '火猫TV', url: 'huomao.com', color: 'bg-red-500', types: ['Video'], favicon: undefined, region: 'China' },
    { name: '阳光宽频网', url: '365yg.com', color: 'bg-yellow-600', types: ['Video'], favicon: undefined, region: 'China' },
    { name: '西瓜视频', url: 'ixigua.com', color: 'bg-green-500', types: ['Video'], favicon: 'https://www.ixigua.com/favicon.ico', region: 'China' },
    { name: '新片场', url: 'xinpianchang.com', color: 'bg-purple-500', types: ['Video'], favicon: 'https://www.xinpianchang.com/favicon.ico', region: 'China' },
    { name: '快手', url: 'kuaishou.com', color: 'bg-yellow-500', types: ['Video', 'Image'], favicon: 'https://www.kuaishou.com/favicon.ico', region: 'China' },
    { name: '抖音', url: 'douyin.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.douyin.com/favicon.ico', region: 'China' },
    { name: '中国体育TV', url: 'v.zhibo.tv', color: 'bg-blue-600', types: ['Video'], favicon: undefined, region: 'China' },
    { name: '知乎', url: 'zhihu.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://static.zhihu.com/heifetz/favicon.ico', region: 'China' },

    // Korean Sites
    { name: 'Naver 네이버', url: 'tvcast.naver.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.naver.com/favicon.ico', region: 'Korea' },

    // Additional Popular International Sites
    { name: 'Twitch', url: 'twitch.tv', color: 'bg-purple-600', types: ['Video'], favicon: 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png', region: 'International' },
    { name: 'Reddit', url: 'reddit.com', color: 'bg-orange-600', types: ['Video', 'Image'], favicon: 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png', region: 'International' },
    { name: 'LinkedIn', url: 'linkedin.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca', region: 'International' },
    { name: 'Apple Podcasts', url: 'podcasts.apple.com', color: 'bg-purple-500', types: ['Audio'], favicon: 'https://www.apple.com/favicon.ico', region: 'International' },
    { name: 'Apple Trailers', url: 'trailers.apple.com', color: 'bg-gray-800', types: ['Video'], favicon: 'https://www.apple.com/favicon.ico', region: 'International' },
    { name: 'Google Drive', url: 'drive.google.com', color: 'bg-green-500', types: ['Video'], favicon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png', region: 'International' },
    { name: 'Google Podcasts', url: 'podcasts.google.com', color: 'bg-blue-500', types: ['Audio'], favicon: 'https://www.google.com/favicon.ico', region: 'International' },
    { name: 'Microsoft Stream', url: 'stream.microsoft.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.microsoft.com/favicon.ico', region: 'International' },
    { name: 'Microsoft Learn', url: 'learn.microsoft.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.microsoft.com/favicon.ico', region: 'International' },
    { name: 'Amazon MiniTV', url: 'amazon.com/minitv', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.amazon.com/favicon.ico', region: 'International' },
    { name: 'Amazon Store', url: 'amazon.com', color: 'bg-yellow-600', types: ['Video'], favicon: 'https://www.amazon.com/favicon.ico', region: 'International' },
    { name: 'Dropbox', url: 'dropbox.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://cfl.dropboxstatic.com/static/images/favicon-vflUeLeeY.ico', region: 'International' },
    { name: 'Telegram', url: 't.me', color: 'bg-blue-400', types: ['Video', 'Audio'], favicon: 'https://telegram.org/favicon.ico', region: 'International' },
    { name: 'Bloomberg', url: 'bloomberg.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.bloomberg.com/favicon.ico', region: 'International' },
    { name: 'CNN', url: 'cnn.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.cnn.com/favicon.ico', region: 'International' },
    { name: 'BBC', url: 'bbc.com', color: 'bg-red-700', types: ['Video'], favicon: 'https://static.bbci.co.uk/wwhp/20230925-1548/responsive/img/apple-touch/apple-touch-180.png', region: 'International' },
    { name: 'Al Jazeera', url: 'aljazeera.com', color: 'bg-red-500', types: ['Video'], favicon: 'https://www.aljazeera.com/favicon.ico', region: 'International' },
    { name: 'BitChute', url: 'bitchute.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.bitchute.com/favicon.ico', region: 'International' },
    { name: 'Rumble', url: 'rumble.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://rumble.com/favicon.ico', region: 'International' },
    { name: 'Odysee', url: 'odysee.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://odysee.com/public/favicon.png', region: 'International' },

    // Long-tail Video Platforms (for SEO traffic)
    { name: 'Vevo', url: 'vevo.com', color: 'bg-red-500', types: ['Video'], favicon: 'https://www.vevo.com/favicon.ico', region: 'International' },
    { name: 'Crunchyroll', url: 'crunchyroll.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.crunchyroll.com/favicon.ico', region: 'International' },
    { name: 'Funimation', url: 'funimation.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://www.funimation.com/favicon.ico', region: 'International' },
    { name: 'LiveJournal', url: 'livejournal.com', color: 'bg-blue-400', types: ['Video', 'Image'], favicon: 'https://www.livejournal.com/favicon.ico', region: 'International' },
    { name: 'Break', url: 'break.com', color: 'bg-red-500', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Newgrounds', url: 'newgrounds.com', color: 'bg-orange-600', types: ['Video', 'Audio'], favicon: 'https://www.newgrounds.com/favicon.ico', region: 'International' },
    { name: 'DeviantArt', url: 'deviantart.com', color: 'bg-green-700', types: ['Image', 'Video'], favicon: 'https://www.deviantart.com/favicon.ico', region: 'International' },
    { name: 'ArtStation', url: 'artstation.com', color: 'bg-blue-800', types: ['Image', 'Video'], favicon: 'https://www.artstation.com/favicon.ico', region: 'International' },
    { name: 'Behance', url: 'behance.net', color: 'bg-blue-600', types: ['Image', 'Video'], favicon: 'https://www.behance.net/favicon.ico', region: 'International' },
    { name: 'Dribbble', url: 'dribbble.com', color: 'bg-pink-500', types: ['Image'], favicon: 'https://dribbble.com/favicon.ico', region: 'International' },

    // Music and Audio Platforms
    { name: 'Spotify', url: 'spotify.com', color: 'bg-green-500', types: ['Audio'], favicon: 'https://open.spotify.com/favicon.ico', region: 'International' },
    { name: 'Deezer', url: 'deezer.com', color: 'bg-purple-600', types: ['Audio'], favicon: 'https://www.deezer.com/favicon.ico', region: 'International' },
    { name: 'Tidal', url: 'tidal.com', color: 'bg-black', types: ['Audio'], favicon: 'https://tidal.com/favicon.ico', region: 'International' },
    { name: 'Last.fm', url: 'last.fm', color: 'bg-red-600', types: ['Audio'], favicon: 'https://www.last.fm/favicon.ico', region: 'International' },
    { name: 'Jamendo', url: 'jamendo.com', color: 'bg-orange-500', types: ['Audio'], favicon: 'https://www.jamendo.com/favicon.ico', region: 'International' },
    { name: 'Audiomack', url: 'audiomack.com', color: 'bg-orange-600', types: ['Audio'], favicon: 'https://www.audiomack.com/favicon.ico', region: 'International' },
    { name: 'ReverbNation', url: 'reverbnation.com', color: 'bg-blue-600', types: ['Audio'], favicon: 'https://www.reverbnation.com/favicon.ico', region: 'International' },
    { name: 'Bandlab', url: 'bandlab.com', color: 'bg-red-500', types: ['Audio'], favicon: 'https://www.bandlab.com/favicon.ico', region: 'International' },
    { name: 'Audius', url: 'audius.co', color: 'bg-purple-500', types: ['Audio'], favicon: 'https://audius.co/favicon.ico', region: 'International' },

    // Gaming Platforms
    { name: 'itch.io', url: 'itch.io', color: 'bg-red-500', types: ['Video'], favicon: 'https://itch.io/favicon.ico', region: 'International' },
    { name: 'GameJolt', url: 'gamejolt.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://gamejolt.com/favicon.ico', region: 'International' },
    { name: 'Kongregate', url: 'kongregate.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.kongregate.com/favicon.ico', region: 'International' },
    { name: 'Armor Games', url: 'armorgames.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://armorgames.com/favicon.ico', region: 'International' },

    // Educational and Documentary
    { name: 'CuriosityStream', url: 'curiositystream.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.curiositystream.com/favicon.ico', region: 'International' },
    { name: 'The Great Courses', url: 'thegreatcourses.com', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.thegreatcourses.com/favicon.ico', region: 'International' },
    { name: 'Wondrium', url: 'wondrium.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://www.wondrium.com/favicon.ico', region: 'International' },
    { name: 'MindValley', url: 'mindvalley.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.mindvalley.com/favicon.ico', region: 'International' },

    // Podcast Platforms
    { name: 'Castbox', url: 'castbox.fm', color: 'bg-green-500', types: ['Audio'], favicon: 'https://castbox.fm/favicon.ico', region: 'International' },
    { name: 'Pocket Casts', url: 'pocketcasts.com', color: 'bg-red-500', types: ['Audio'], favicon: 'https://www.pocketcasts.com/favicon.ico', region: 'International' },
    { name: 'Overcast', url: 'overcast.fm', color: 'bg-orange-500', types: ['Audio'], favicon: 'https://overcast.fm/favicon.ico', region: 'International' },
    { name: 'Stitcher', url: 'stitcher.com', color: 'bg-blue-500', types: ['Audio'], favicon: 'https://www.stitcher.com/favicon.ico', region: 'International' },
    { name: 'RadioPublic', url: 'radiopublic.com', color: 'bg-green-600', types: ['Audio'], favicon: 'https://radiopublic.com/favicon.ico', region: 'International' },

    // Alternative Platforms
    { name: 'Brighteon', url: 'brighteon.com', color: 'bg-yellow-600', types: ['Video'], favicon: 'https://www.brighteon.com/favicon.ico', region: 'International' },
    { name: 'Brand New Tube', url: 'brandnewtube.com', color: 'bg-blue-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Banned.video', url: 'banned.video', color: 'bg-red-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Gab TV', url: 'tv.gab.com', color: 'bg-green-700', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Gettr', url: 'gettr.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://gettr.com/favicon.ico', region: 'International' },

    // Live Streaming Platforms
    { name: 'Periscope', url: 'periscope.tv', color: 'bg-blue-400', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Younow', url: 'younow.com', color: 'bg-green-500', types: ['Video'], favicon: 'https://www.younow.com/favicon.ico', region: 'International' },
    { name: 'Bigo Live', url: 'bigo.tv', color: 'bg-blue-500', types: ['Video'], favicon: 'https://www.bigo.tv/favicon.ico', region: 'International' },
    { name: '17Live', url: '17.live', color: 'bg-yellow-500', types: ['Video'], favicon: undefined, region: 'International' },

    // Business and Professional
    { name: 'Zoom', url: 'zoom.us', color: 'bg-blue-500', types: ['Video'], favicon: 'https://st1.zoom.us/zoom.ico', region: 'International' },
    { name: 'WebEx', url: 'webex.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.webex.com/favicon.ico', region: 'International' },
    { name: 'GoToMeeting', url: 'gotomeeting.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.gotomeeting.com/favicon.ico', region: 'International' },
    { name: 'BigBlueButton', url: 'bigbluebutton.org', color: 'bg-blue-600', types: ['Video'], favicon: 'https://bigbluebutton.org/favicon.ico', region: 'International' },
    { name: 'Jitsi', url: 'meet.jit.si', color: 'bg-blue-700', types: ['Video'], favicon: 'https://meet.jit.si/favicon.ico', region: 'International' },

    // E-commerce with Video
    { name: 'Etsy', url: 'etsy.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.etsy.com/favicon.ico', region: 'International' },
    { name: 'eBay', url: 'ebay.com', color: 'bg-yellow-500', types: ['Video'], favicon: 'https://www.ebay.com/favicon.ico', region: 'International' },
    { name: 'Shopify', url: 'shopify.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.shopify.com/favicon.ico', region: 'International' },

    // Fitness and Health
    { name: 'Peloton', url: 'onepeloton.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.onepeloton.com/favicon.ico', region: 'International' },
    { name: 'Beachbody', url: 'beachbody.com', color: 'bg-red-500', types: ['Video'], favicon: 'https://www.beachbody.com/favicon.ico', region: 'International' },
    { name: 'Daily Burn', url: 'dailyburn.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.dailyburn.com/favicon.ico', region: 'International' },
    { name: 'Fitness Blender', url: 'fitnessblender.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.fitnessblender.com/favicon.ico', region: 'International' },

    // Technology and Programming
    { name: 'GitHub', url: 'github.com', color: 'bg-gray-800', types: ['Video'], favicon: 'https://github.com/favicon.ico', region: 'International' },
    { name: 'GitLab', url: 'gitlab.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://gitlab.com/favicon.ico', region: 'International' },
    { name: 'Stack Overflow', url: 'stackoverflow.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://stackoverflow.com/favicon.ico', region: 'International' },
    { name: 'Codepen', url: 'codepen.io', color: 'bg-green-500', types: ['Video'], favicon: 'https://codepen.io/favicon.ico', region: 'International' },
    { name: 'JSFiddle', url: 'jsfiddle.net', color: 'bg-blue-600', types: ['Video'], favicon: 'https://jsfiddle.net/favicon.png', region: 'International' },
    { name: 'Repl.it', url: 'replit.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://replit.com/favicon.ico', region: 'International' },
    { name: 'CodeSandbox', url: 'codesandbox.io', color: 'bg-black', types: ['Video'], favicon: 'https://codesandbox.io/favicon.ico', region: 'International' },

    // Niche Video Platforms
    { name: 'Streamable', url: 'streamable.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://streamable.com/favicon.ico', region: 'International' },
    { name: 'Vidyard', url: 'vidyard.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.vidyard.com/favicon.ico', region: 'International' },
    { name: 'Wistia', url: 'wistia.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://fast.wistia.com/favicon.ico', region: 'International' },
    { name: 'JW Player', url: 'jwplatform.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.jwplayer.com/favicon.ico', region: 'International' },
    { name: 'Brightcove', url: 'brightcove.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.brightcove.com/favicon.ico', region: 'International' },
    { name: 'Kaltura', url: 'kaltura.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.kaltura.com/favicon.ico', region: 'International' },
    { name: 'MediaFire', url: 'mediafire.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://www.mediafire.com/favicon.ico', region: 'International' },
    { name: 'MEGA', url: 'mega.nz', color: 'bg-red-600', types: ['Video'], favicon: 'https://mega.nz/favicon.ico', region: 'International' },
    { name: '4shared', url: '4shared.com', color: 'bg-green-500', types: ['Video'], favicon: 'https://www.4shared.com/favicon.ico', region: 'International' },
    { name: 'SendSpace', url: 'sendspace.com', color: 'bg-blue-400', types: ['Video'], favicon: 'https://www.sendspace.com/favicon.ico', region: 'International' },
    { name: 'FileFront', url: 'filefront.com', color: 'bg-gray-600', types: ['Video'], favicon: undefined, region: 'International' },

    // International News and Media
    { name: 'France24', url: 'france24.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.france24.com/favicon.ico', region: 'International' },
    { name: 'Deutsche Welle', url: 'dw.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.dw.com/favicon.ico', region: 'International' },
    { name: 'NHK World', url: 'nhk.or.jp', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.nhk.or.jp/favicon.ico', region: 'International' },
    { name: 'CGTN', url: 'cgtn.com', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.cgtn.com/favicon.ico', region: 'International' },
    { name: 'TRT World', url: 'trtworld.com', color: 'bg-green-700', types: ['Video'], favicon: 'https://www.trtworld.com/favicon.ico', region: 'International' },

    // Adult Content Platforms (for long-tail SEO)
    { name: 'XVideos', url: 'xvideos.com', color: 'bg-red-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Pornhub', url: 'pornhub.com', color: 'bg-yellow-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'YouPorn', url: 'youporn.com', color: 'bg-black', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Spankbang', url: 'spankbang.com', color: 'bg-pink-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'RedTube', url: 'redtube.com', color: 'bg-red-700', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Tube8', url: 'tube8.com', color: 'bg-green-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Chaturbate', url: 'chaturbate.com', color: 'bg-purple-700', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'BongaCams', url: 'bongacams.com', color: 'bg-pink-700', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'MyFreeCams', url: 'myfreecams.com', color: 'bg-purple-800', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Cam4', url: 'cam4.com', color: 'bg-blue-700', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Stripchat', url: 'stripchat.com', color: 'bg-red-800', types: ['Video'], favicon: undefined, region: 'International' },

    // Sports and Fitness Platforms
    { name: 'ESPN', url: 'espn.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.espn.com/favicon.ico', region: 'International' },
    { name: 'Fox Sports', url: 'foxsports.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.foxsports.com/favicon.ico', region: 'International' },
    { name: 'NBA', url: 'nba.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.nba.com/favicon.ico', region: 'International' },
    { name: 'NFL', url: 'nfl.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.nfl.com/favicon.ico', region: 'International' },
    { name: 'MLB', url: 'mlb.com', color: 'bg-blue-900', types: ['Video'], favicon: 'https://www.mlb.com/favicon.ico', region: 'International' },
    { name: 'NHL', url: 'nhl.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.nhl.com/favicon.ico', region: 'International' },
    { name: 'Formula 1', url: 'formula1.com', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.formula1.com/favicon.ico', region: 'International' },
    { name: 'UEFA', url: 'uefa.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.uefa.com/favicon.ico', region: 'International' },
    { name: 'FIFA', url: 'fifa.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://www.fifa.com/favicon.ico', region: 'International' },

    // Cooking and Food Platforms
    { name: 'Food Network', url: 'foodnetwork.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.foodnetwork.com/favicon.ico', region: 'International' },
    { name: 'Tasty', url: 'tasty.co', color: 'bg-red-500', types: ['Video'], favicon: 'https://www.tasty.co/favicon.ico', region: 'International' },
    { name: 'AllRecipes', url: 'allrecipes.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.allrecipes.com/favicon.ico', region: 'International' },
    { name: 'Bon Appétit', url: 'bonappetit.com', color: 'bg-gray-800', types: ['Video'], favicon: 'https://www.bonappetit.com/favicon.ico', region: 'International' },
    { name: 'Epicurious', url: 'epicurious.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.epicurious.com/favicon.ico', region: 'International' },

    // Travel and Lifestyle
    { name: 'Travel Channel', url: 'travelchannel.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.travelchannel.com/favicon.ico', region: 'International' },
    { name: 'National Geographic', url: 'nationalgeographic.com', color: 'bg-yellow-500', types: ['Video'], favicon: 'https://www.nationalgeographic.com/favicon.ico', region: 'International' },
    { name: 'Discovery', url: 'discovery.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://www.discovery.com/favicon.ico', region: 'International' },
    { name: 'History Channel', url: 'history.com', color: 'bg-brown-600', types: ['Video'], favicon: 'https://www.history.com/favicon.ico', region: 'International' },
    { name: 'Animal Planet', url: 'animalplanet.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.animalplanet.com/favicon.ico', region: 'International' },

    // Fashion and Beauty
    { name: 'Vogue', url: 'vogue.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.vogue.com/favicon.ico', region: 'International' },
    { name: 'Harper\'s Bazaar', url: 'harpersbazaar.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.harpersbazaar.com/favicon.ico', region: 'International' },
    { name: 'Elle', url: 'elle.com', color: 'bg-pink-600', types: ['Video'], favicon: 'https://www.elle.com/favicon.ico', region: 'International' },
    { name: 'Marie Claire', url: 'marieclaire.com', color: 'bg-pink-500', types: ['Video'], favicon: 'https://www.marieclaire.com/favicon.ico', region: 'International' },
    { name: 'Sephora', url: 'sephora.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.sephora.com/favicon.ico', region: 'International' },

    // Home and Garden
    { name: 'HGTV', url: 'hgtv.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.hgtv.com/favicon.ico', region: 'International' },
    { name: 'DIY Network', url: 'diynetwork.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.diynetwork.com/favicon.ico', region: 'International' },
    { name: 'Better Homes & Gardens', url: 'bhg.com', color: 'bg-green-500', types: ['Video'], favicon: 'https://www.bhg.com/favicon.ico', region: 'International' },
    { name: 'House Beautiful', url: 'housebeautiful.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://www.housebeautiful.com/favicon.ico', region: 'International' },

    // Kids and Family
    { name: 'Disney+', url: 'disneyplus.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.disneyplus.com/favicon.ico', region: 'International' },
    { name: 'Nickelodeon', url: 'nick.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.nick.com/favicon.ico', region: 'International' },
    { name: 'Cartoon Network', url: 'cartoonnetwork.com', color: 'bg-yellow-500', types: ['Video'], favicon: 'https://www.cartoonnetwork.com/favicon.ico', region: 'International' },
    { name: 'Sesame Street', url: 'sesamestreet.org', color: 'bg-red-500', types: ['Video'], favicon: 'https://www.sesamestreet.org/favicon.ico', region: 'International' },
    { name: 'PBS Kids', url: 'pbskids.org', color: 'bg-green-500', types: ['Video'], favicon: 'https://pbskids.org/favicon.ico', region: 'International' },

    // Science and Technology
    { name: 'Scientific American', url: 'scientificamerican.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.scientificamerican.com/favicon.ico', region: 'International' },
    { name: 'Popular Science', url: 'popsci.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.popsci.com/favicon.ico', region: 'International' },
    { name: 'Wired', url: 'wired.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.wired.com/favicon.ico', region: 'International' },
    { name: 'TechCrunch', url: 'techcrunch.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://techcrunch.com/favicon.ico', region: 'International' },
    { name: 'The Verge', url: 'theverge.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://www.theverge.com/favicon.ico', region: 'International' },
    { name: 'Engadget', url: 'engadget.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://www.engadget.com/favicon.ico', region: 'International' },

    // Religion and Spirituality
    { name: 'YouVersion', url: 'youversion.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.youversion.com/favicon.ico', region: 'International' },
    { name: 'Crosswalk', url: 'crosswalk.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.crosswalk.com/favicon.ico', region: 'International' },
    { name: 'Christianity Today', url: 'christianitytoday.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.christianitytoday.com/favicon.ico', region: 'International' },
    { name: 'Vatican News', url: 'vaticannews.va', color: 'bg-yellow-500', types: ['Video'], favicon: 'https://www.vaticannews.va/favicon.ico', region: 'International' },

    // Automotive
    { name: 'Motor Trend', url: 'motortrend.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.motortrend.com/favicon.ico', region: 'International' },
    { name: 'Car and Driver', url: 'caranddriver.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.caranddriver.com/favicon.ico', region: 'International' },
    { name: 'Top Gear', url: 'topgear.com', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.topgear.com/favicon.ico', region: 'International' },
    { name: 'AutoTrader', url: 'autotrader.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.autotrader.com/favicon.ico', region: 'International' },

    // Real Estate
    { name: 'Zillow', url: 'zillow.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.zillow.com/favicon.ico', region: 'International' },
    { name: 'Realtor.com', url: 'realtor.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.realtor.com/favicon.ico', region: 'International' },
    { name: 'Trulia', url: 'trulia.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.trulia.com/favicon.ico', region: 'International' },

    // Finance and Business
    { name: 'CNBC', url: 'cnbc.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.cnbc.com/favicon.ico', region: 'International' },
    { name: 'MarketWatch', url: 'marketwatch.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.marketwatch.com/favicon.ico', region: 'International' },
    { name: 'Yahoo Finance', url: 'finance.yahoo.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://finance.yahoo.com/favicon.ico', region: 'International' },
    { name: 'Forbes', url: 'forbes.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.forbes.com/favicon.ico', region: 'International' },
    { name: 'Fortune', url: 'fortune.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://fortune.com/favicon.ico', region: 'International' },
    { name: 'Harvard Business Review', url: 'hbr.org', color: 'bg-blue-800', types: ['Video'], favicon: 'https://hbr.org/favicon.ico', region: 'International' },

    // Asian Video Platforms (huge traffic potential)
    { name: 'Weibo', url: 'weibo.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://weibo.com/favicon.ico', region: 'China' },
    { name: 'XiaoHongShu 小红书', url: 'xiaohongshu.com', color: 'bg-red-500', types: ['Video', 'Image'], favicon: 'https://www.xiaohongshu.com/favicon.ico', region: 'China' },
    { name: 'Ximalaya 喜马拉雅FM', url: 'ximalaya.com', color: 'bg-orange-500', types: ['Audio'], favicon: 'https://www.ximalaya.com/favicon.ico', region: 'China' },
    { name: 'Toutiao 今日头条', url: 'toutiao.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.toutiao.com/favicon.ico', region: 'China' },
    { name: 'YLE Areena', url: 'areena.yle.fi', color: 'bg-blue-500', types: ['Video'], favicon: 'https://areena.yle.fi/favicon.ico', region: 'Europe' },
    { name: 'TRT Çocuk', url: 'trtcocuk.net.tr', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.trtcocuk.net.tr/favicon.ico', region: 'Europe' },

    // Streaming and Alternative Platforms
    { name: 'Triller', url: 'triller.co', color: 'bg-pink-600', types: ['Video'], favicon: 'https://triller.co/favicon.ico', region: 'International' },
    { name: 'Trovo', url: 'trovo.live', color: 'bg-green-600', types: ['Video'], favicon: 'https://trovo.live/favicon.ico', region: 'International' },
    { name: 'TwitCasting', url: 'twitcasting.tv', color: 'bg-blue-500', types: ['Video'], favicon: 'https://twitcasting.tv/favicon.ico', region: 'International' },
    { name: 'Substack', url: 'substack.com', color: 'bg-orange-500', types: ['Video', 'Audio'], favicon: 'https://substack.com/favicon.ico', region: 'International' },
    { name: 'StoryFire', url: 'storyfire.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://storyfire.com/favicon.ico', region: 'International' },

    // Educational Content
    { name: 'Stanford OpenClassroom', url: 'openclassroom.stanford.edu', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.stanford.edu/favicon.ico', region: 'International' },
    { name: 'MIT TechTV', url: 'techtv.mit.edu', color: 'bg-red-600', types: ['Video'], favicon: 'https://web.mit.edu/favicon.ico', region: 'International' },
    { name: 'TeamTreeHouse', url: 'teamtreehouse.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://teamtreehouse.com/favicon.ico', region: 'International' },
    { name: 'Teachable', url: 'teachable.com', color: 'bg-green-500', types: ['Video'], favicon: 'https://teachable.com/favicon.ico', region: 'International' },
    { name: 'Team Coco', url: 'teamcoco.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://teamcoco.com/favicon.ico', region: 'International' },

    // News and Media
    { name: 'The Guardian', url: 'theguardian.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.theguardian.com/favicon.ico', region: 'International' },
    { name: 'The Sun', url: 'thesun.co.uk', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.thesun.co.uk/favicon.ico', region: 'International' },
    { name: 'The Star', url: 'thestar.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.thestar.com/favicon.ico', region: 'International' },
    { name: 'The Intercept', url: 'theintercept.com', color: 'bg-black', types: ['Video'], favicon: 'https://theintercept.com/favicon.ico', region: 'International' },
    { name: 'Washington Post', url: 'washingtonpost.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.washingtonpost.com/favicon.ico', region: 'International' },
    { name: 'Wall Street Journal', url: 'wsj.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.wsj.com/favicon.ico', region: 'International' },
    { name: 'TMZ', url: 'tmz.com', color: 'bg-yellow-500', types: ['Video'], favicon: 'https://www.tmz.com/favicon.ico', region: 'International' },
    { name: 'TruNews', url: 'trunews.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.trunews.com/favicon.ico', region: 'International' },

    // Entertainment and TV
    { name: 'TLC', url: 'tlc.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://www.tlc.com/favicon.ico', region: 'International' },
    { name: 'Syfy', url: 'syfy.com', color: 'bg-purple-700', types: ['Video'], favicon: 'https://www.syfy.com/favicon.ico', region: 'International' },
    { name: 'TruTV', url: 'trutv.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.trutv.com/favicon.ico', region: 'International' },
    { name: 'Travel Channel', url: 'travelchannel.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.travelchannel.com/favicon.ico', region: 'International' },
    { name: 'Weather Channel', url: 'weather.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://weather.com/favicon.ico', region: 'International' },
    { name: 'This American Life', url: 'thisamericanlife.org', color: 'bg-red-600', types: ['Audio'], favicon: 'https://www.thisamericanlife.org/favicon.ico', region: 'International' },
    { name: 'This Old House', url: 'thisoldhouse.com', color: 'bg-brown-600', types: ['Video'], favicon: 'https://www.thisoldhouse.com/favicon.ico', region: 'International' },

    // Gaming and Esports
    { name: 'Xbox Clips', url: 'xboxclips.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://xboxclips.com/favicon.ico', region: 'International' },
    { name: 'WWE', url: 'wwe.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.wwe.com/favicon.ico', region: 'International' },
    { name: 'Wrestle Universe', url: 'wrestleuniverse.com', color: 'bg-purple-600', types: ['Video'], favicon: undefined, region: 'International' },

    // Music and Audio
    { name: 'Yandex Music', url: 'music.yandex.ru', color: 'bg-yellow-500', types: ['Audio'], favicon: 'https://music.yandex.ru/favicon.ico', region: 'International' },
    { name: 'TuneIn', url: 'tunein.com', color: 'bg-green-500', types: ['Audio'], favicon: 'https://tunein.com/favicon.ico', region: 'International' },
    { name: 'WorldStarHipHop', url: 'worldstarhiphop.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.worldstarhiphop.com/favicon.ico', region: 'International' },
    { name: 'StreetVoice', url: 'streetvoice.com', color: 'bg-orange-500', types: ['Audio'], favicon: 'https://streetvoice.com/favicon.ico', region: 'International' },

    // File Sharing and Cloud Storage
    { name: 'Yandex Disk', url: 'disk.yandex.ru', color: 'bg-red-600', types: ['Video'], favicon: 'https://disk.yandex.ru/favicon.ico', region: 'International' },
    { name: 'UlozTo', url: 'ulozto.net', color: 'bg-blue-500', types: ['Video'], favicon: 'https://ulozto.net/favicon.ico', region: 'International' },
    { name: 'ZippyShare', url: 'zippyshare.com', color: 'bg-orange-500', types: ['Video'], favicon: undefined, region: 'International' },

    // Specialized Platforms
    { name: 'Wistia', url: 'wistia.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://fast.wistia.com/favicon.ico', region: 'International' },
    { name: 'Vimeo Live', url: 'vimeo.com/live', color: 'bg-blue-600', types: ['Video'], favicon: 'https://f.vimeocdn.com/images_v6/favicon.ico', region: 'International' },
    { name: 'Vidyard', url: 'vidyard.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.vidyard.com/favicon.ico', region: 'International' },
    { name: 'Viu', url: 'viu.com', color: 'bg-yellow-500', types: ['Video'], favicon: 'https://www.viu.com/favicon.ico', region: 'International' },
    { name: 'VLive', url: 'vlive.tv', color: 'bg-purple-600', types: ['Video'], favicon: undefined, region: 'International' },

    // Adult Content (additional major platforms)
    { name: 'XHamster', url: 'xhamster.com', color: 'bg-orange-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'XNXX', url: 'xnxx.com', color: 'bg-blue-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'YouJizz', url: 'youjizz.com', color: 'bg-red-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Txxx', url: 'txxx.com', color: 'bg-black', types: ['Video'], favicon: undefined, region: 'International' },

    // International Broadcasting
    { name: 'TV5Monde', url: 'tv5monde.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.tv5monde.com/favicon.ico', region: 'International' },
    { name: 'TVer', url: 'tver.jp', color: 'bg-blue-500', types: ['Video'], favicon: 'https://tver.jp/favicon.ico', region: 'Japan' },
    { name: 'TV2 Norge', url: 'tv2.no', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.tv2.no/favicon.ico', region: 'Europe' },
    { name: 'TV4 Sverige', url: 'tv4.se', color: 'bg-red-500', types: ['Video'], favicon: 'https://www.tv4.se/favicon.ico', region: 'Europe' },
    { name: 'TF1', url: 'tf1.fr', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.tf1.fr/favicon.ico', region: 'Europe' },

    // Podcast and Audio Platforms
    { name: 'Podcast Addict', url: 'podcastaddict.com', color: 'bg-blue-600', types: ['Audio'], favicon: undefined, region: 'International' },
    { name: 'Podchaser', url: 'podchaser.com', color: 'bg-green-500', types: ['Audio'], favicon: 'https://www.podchaser.com/favicon.ico', region: 'International' },
    { name: 'Podbay.fm', url: 'podbay.fm', color: 'bg-blue-500', types: ['Audio'], favicon: 'https://podbay.fm/favicon.ico', region: 'International' },

    // Social and Community
    { name: 'Wykop', url: 'wykop.pl', color: 'bg-green-600', types: ['Video'], favicon: 'https://wykop.pl/favicon.ico', region: 'Europe' },
    { name: 'Weverse', url: 'weverse.io', color: 'bg-purple-600', types: ['Video'], favicon: 'https://weverse.io/favicon.ico', region: 'International' },
    { name: 'Whowatch', url: 'whowatch.tv', color: 'bg-blue-500', types: ['Video'], favicon: undefined, region: 'International' },

    // Niche Video Platforms
    { name: 'ThisVid', url: 'thisvid.com', color: 'bg-red-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Three Speak', url: 'threespeak.tv', color: 'bg-purple-600', types: ['Video'], favicon: 'https://threespeak.tv/favicon.ico', region: 'International' },
    { name: 'Toon Goggles', url: 'toongoggles.com', color: 'bg-yellow-500', types: ['Video'], favicon: 'https://www.toongoggles.com/favicon.ico', region: 'International' },
    { name: 'Toggo', url: 'toggo.de', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.toggo.de/favicon.ico', region: 'Europe' },

    // European Platforms
    { name: 'Zattoo', url: 'zattoo.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://zattoo.com/favicon.ico', region: 'Europe' },
    { name: 'Zee5', url: 'zee5.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://www.zee5.com/favicon.ico', region: 'International' },
    { name: 'Zing MP3', url: 'zingmp3.vn', color: 'bg-blue-500', types: ['Audio'], favicon: 'https://zingmp3.vn/favicon.ico', region: 'Asia' },

    // Tech and Coding
    { name: 'Zapiks', url: 'zapiks.fr', color: 'bg-blue-500', types: ['Video'], favicon: undefined, region: 'Europe' },
    { name: 'Zype', url: 'zype.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://www.zype.com/favicon.ico', region: 'International' },

    // Microsoft and Professional Platforms
    { name: 'Microsoft Stream', url: 'stream.microsoft.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.microsoft.com/favicon.ico', region: 'International' },
    { name: 'Microsoft Learn', url: 'learn.microsoft.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://docs.microsoft.com/favicon.ico', region: 'International' },
    { name: 'Minds', url: 'minds.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.minds.com/favicon.ico', region: 'International' },
    { name: 'Mirrativ', url: 'mirrativ.com', color: 'bg-red-500', types: ['Video'], favicon: 'https://www.mirrativ.com/favicon.ico', region: 'Japan' },
    { name: 'MiTele', url: 'mitele.es', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.mitele.es/favicon.ico', region: 'Europe' },
    { name: 'Mixcloud', url: 'mixcloud.com', color: 'bg-blue-800', types: ['Audio'], favicon: 'https://www.mixcloud.com/favicon.ico', region: 'International' },

    // Sports and Entertainment
    { name: 'MLB', url: 'mlb.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.mlb.com/favicon.ico', region: 'International' },
    { name: 'MLSSoccer', url: 'mlssoccer.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.mlssoccer.com/favicon.ico', region: 'International' },
    { name: 'MTV', url: 'mtv.com', color: 'bg-pink-600', types: ['Video'], favicon: 'https://www.mtv.com/favicon.ico', region: 'International' },
    { name: 'MTV Italia', url: 'mtv.it', color: 'bg-pink-500', types: ['Video'], favicon: 'https://www.mtv.it/favicon.ico', region: 'Europe' },
    { name: 'MySpace', url: 'myspace.com', color: 'bg-blue-600', types: ['Audio', 'Video'], favicon: 'https://myspace.com/favicon.ico', region: 'International' },

    // News and Media Giants
    { name: 'NBC', url: 'nbc.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.nbc.com/favicon.ico', region: 'International' },
    { name: 'NBC News', url: 'nbcnews.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.nbcnews.com/favicon.ico', region: 'International' },
    { name: 'NBC Sports', url: 'nbcsports.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.nbcsports.com/favicon.ico', region: 'International' },
    { name: 'NDR', url: 'ndr.de', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.ndr.de/favicon.ico', region: 'Europe' },
    { name: 'Nebula', url: 'watchnebula.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://nebula.app/favicon.ico', region: 'International' },

    // Chinese Music and Entertainment
    { name: 'NetEase Music 网易云音乐', url: 'music.163.com', color: 'bg-red-600', types: ['Audio'], favicon: 'https://s1.music.126.net/style/favicon.ico', region: 'China' },
    { name: 'QQ Music QQ音乐', url: 'y.qq.com', color: 'bg-green-600', types: ['Audio'], favicon: 'https://y.qq.com/favicon.ico', region: 'China' },
    { name: 'NicoNico ニコニコ動画', url: 'nicovideo.jp', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.nicovideo.jp/favicon.ico', region: 'Japan' },
    { name: 'Newgrounds', url: 'newgrounds.com', color: 'bg-orange-600', types: ['Video', 'Audio'], favicon: 'https://www.newgrounds.com/favicon.ico', region: 'International' },

    // Emerging Platforms
    { name: 'Naver TV', url: 'tv.naver.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://tv.naver.com/favicon.ico', region: 'Korea' },
    { name: 'Nowness', url: 'nowness.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.nowness.com/favicon.ico', region: 'International' },
    { name: 'NPR', url: 'npr.org', color: 'bg-blue-800', types: ['Audio'], favicon: 'https://www.npr.org/favicon.ico', region: 'International' },
    { name: 'NRK', url: 'nrk.no', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.nrk.no/favicon.ico', region: 'Europe' },
    { name: 'NTS Live', url: 'nts.live', color: 'bg-pink-600', types: ['Audio'], favicon: 'https://www.nts.live/favicon.ico', region: 'International' },

    // Education and Learning
    { name: 'OCW MIT', url: 'ocw.mit.edu', color: 'bg-red-700', types: ['Video'], favicon: 'https://ocw.mit.edu/favicon.ico', region: 'International' },
    { name: 'Odnoklassniki', url: 'ok.ru', color: 'bg-orange-600', types: ['Video'], favicon: 'https://ok.ru/favicon.ico', region: 'Russia' },
    { name: 'On24', url: 'on24.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.on24.com/favicon.ico', region: 'International' },
    { name: 'OnDemand Korea', url: 'ondemandkorea.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.ondemandkorea.com/favicon.ico', region: 'Korea' },
    { name: 'OpenRec', url: 'openrec.tv', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.openrec.tv/favicon.ico', region: 'Japan' },

    // Podcast and Audio Platforms
    { name: 'Patreon', url: 'patreon.com', color: 'bg-orange-600', types: ['Video', 'Audio'], favicon: 'https://c5.patreon.com/external/favicon/favicon.ico', region: 'International' },
    { name: 'PBS', url: 'pbs.org', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.pbs.org/favicon.ico', region: 'International' },
    { name: 'PBS Kids', url: 'pbskids.org', color: 'bg-green-600', types: ['Video'], favicon: 'https://pbskids.org/favicon.ico', region: 'International' },
    { name: 'PeerTube', url: 'joinpeertube.org', color: 'bg-orange-500', types: ['Video'], favicon: 'https://joinpeertube.org/favicon.ico', region: 'International' },
    { name: 'Periscope', url: 'periscope.tv', color: 'bg-blue-500', types: ['Video'], favicon: undefined, region: 'International' },

    // Creative and Art Platforms
    { name: 'Piapro', url: 'piapro.jp', color: 'bg-green-500', types: ['Audio'], favicon: 'https://piapro.jp/favicon.ico', region: 'Japan' },
    { name: 'Picarto', url: 'picarto.tv', color: 'bg-purple-600', types: ['Video'], favicon: 'https://picarto.tv/favicon.ico', region: 'International' },
    { name: 'Pinterest', url: 'pinterest.com', color: 'bg-red-500', types: ['Image'], favicon: 'https://s.pinimg.com/webapp/favicon-32x32-77890bb82e.png', region: 'International' },
    { name: 'Pixiv Sketch', url: 'sketch.pixiv.net', color: 'bg-blue-500', types: ['Image'], favicon: 'https://sketch.pixiv.net/favicon.ico', region: 'Japan' },
    { name: 'Platzi', url: 'platzi.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://static.platzi.com/media/favicons/platzi_favicon.png', region: 'International' },

    // Specialized Content
    { name: 'Pluralsight', url: 'pluralsight.com', color: 'bg-pink-600', types: ['Video'], favicon: 'https://www.pluralsight.com/etc/clientlibs/pluralsight/main/images/favicons/favicon-32x32.png', region: 'International' },
    { name: 'Podbay FM', url: 'podbay.fm', color: 'bg-blue-500', types: ['Audio'], favicon: 'https://podbay.fm/favicon.ico', region: 'International' },
    { name: 'Podchaser', url: 'podchaser.com', color: 'bg-green-500', types: ['Audio'], favicon: 'https://www.podchaser.com/favicon.ico', region: 'International' },
    { name: 'PokerGo', url: 'pokergo.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.pokergo.com/favicon.ico', region: 'International' },
    { name: 'Polskie Radio', url: 'polskieradio.pl', color: 'bg-red-600', types: ['Audio'], favicon: 'https://www.polskieradio.pl/favicon.ico', region: 'Europe' },

    // Adult Content Platforms (additional)
    { name: 'Pornbox', url: 'pornbox.com', color: 'bg-black', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'PornerBros', url: 'pornerbros.com', color: 'bg-orange-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'PornFlip', url: 'pornflip.com', color: 'bg-blue-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Pornotube', url: 'pornotube.com', color: 'bg-red-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'PornTop', url: 'porntop.com', color: 'bg-purple-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'PornTube', url: 'porntube.com', color: 'bg-black', types: ['Video'], favicon: undefined, region: 'International' },

    // International Broadcasting
    { name: 'Rai', url: 'rai.it', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.rai.it/favicon.ico', region: 'Europe' },
    { name: 'RaiPlay', url: 'raiplay.it', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.raiplay.it/favicon.ico', region: 'Europe' },
    { name: 'Radio France', url: 'radiofrance.fr', color: 'bg-blue-600', types: ['Audio'], favicon: 'https://www.radiofrance.fr/favicon.ico', region: 'Europe' },
    { name: 'Radiko', url: 'radiko.jp', color: 'bg-green-500', types: ['Audio'], favicon: 'https://radiko.jp/favicon.ico', region: 'Japan' },
    { name: 'Ray Wenderlich', url: 'raywenderlich.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.raywenderlich.com/favicon.ico', region: 'International' },

    // Entertainment and Gaming
    { name: 'Red Bull TV', url: 'redbull.tv', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.redbull.com/favicon.ico', region: 'International' },
    { name: 'Reddit', url: 'reddit.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.reddit.com/favicon.ico', region: 'International' },
    { name: 'RedTube', url: 'redtube.com', color: 'bg-red-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'ReverbNation', url: 'reverbnation.com', color: 'bg-orange-500', types: ['Audio'], favicon: 'https://www.reverbnation.com/favicon.ico', region: 'International' },
    { name: 'Rinse FM', url: 'rinse.fm', color: 'bg-black', types: ['Audio'], favicon: 'https://rinse.fm/favicon.ico', region: 'International' },
    { name: 'Rooster Teeth', url: 'roosterteeth.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://roosterteeth.com/favicon.ico', region: 'International' },
    { name: 'Rotten Tomatoes', url: 'rottentomatoes.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.rottentomatoes.com/favicon.ico', region: 'International' },

    // European Broadcasting
    { name: 'RTÉ', url: 'rte.ie', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.rte.ie/favicon.ico', region: 'Europe' },
    { name: 'RTL', url: 'rtl.de', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.rtl.de/favicon.ico', region: 'Europe' },
    { name: 'RTL Nederland', url: 'rtl.nl', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.rtl.nl/favicon.ico', region: 'Europe' },
    { name: 'RTVE', url: 'rtve.es', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.rtve.es/favicon.ico', region: 'Europe' },
    { name: 'RTV Slovenia', url: 'rtvslo.si', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.rtvslo.si/favicon.ico', region: 'Europe' },

    // Alternative Video Platforms
    { name: 'Rumble', url: 'rumble.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://rumble.com/favicon.ico', region: 'International' },
    { name: 'Rutube', url: 'rutube.ru', color: 'bg-red-600', types: ['Video'], favicon: 'https://rutube.ru/favicon.ico', region: 'Russia' },
    { name: 'Ruutu', url: 'ruutu.fi', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.ruutu.fi/favicon.ico', region: 'Europe' },

    // Professional and Educational
    { name: 'Safari Books Online', url: 'safaribooksonline.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.oreilly.com/favicon.ico', region: 'International' },
    { name: 'Sample Focus', url: 'samplefocus.com', color: 'bg-purple-600', types: ['Audio'], favicon: 'https://samplefocus.com/favicon.ico', region: 'International' },
    { name: 'SBS', url: 'sbs.com.au', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.sbs.com.au/favicon.ico', region: 'International' },
    { name: 'SBS Korea', url: 'sbs.co.kr', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.sbs.co.kr/favicon.ico', region: 'Korea' },
    { name: 'Science Channel', url: 'sciencechannel.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.sciencechannel.com/favicon.ico', region: 'International' },

    // Screen Recording and Video Tools
    { name: 'Screencastify', url: 'screencastify.com', color: 'bg-green-500', types: ['Video'], favicon: 'https://www.screencastify.com/favicon.ico', region: 'International' },
    { name: 'Screencast-O-Matic', url: 'screencast-o-matic.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://screencast-o-matic.com/favicon.ico', region: 'International' },
    { name: 'Scrolller', url: 'scrolller.com', color: 'bg-purple-600', types: ['Image', 'Video'], favicon: 'https://scrolller.com/favicon.ico', region: 'International' },

    // News and Media
    { name: 'Servus TV', url: 'servustv.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.servustv.com/favicon.ico', region: 'Europe' },
    { name: 'Seznam Zprávy', url: 'seznamzpravy.cz', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.seznamzpravy.cz/favicon.ico', region: 'Europe' },
    { name: 'Shahid', url: 'shahid.net', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.shahid.net/favicon.ico', region: 'International' },
    { name: 'Sky News', url: 'skynews.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://news.sky.com/favicon.ico', region: 'International' },
    { name: 'Sky News Australia', url: 'skynews.com.au', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.skynews.com.au/favicon.ico', region: 'International' },
    { name: 'Sky Sports', url: 'skysports.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.skysports.com/favicon.ico', region: 'International' },

    // Document and Presentation Platforms
    { name: 'SlideShare', url: 'slideshare.net', color: 'bg-blue-600', types: ['Document'], favicon: 'https://www.slideshare.net/favicon.ico', region: 'International' },
    { name: 'SlidesLive', url: 'slideslive.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://slideslive.com/favicon.ico', region: 'International' },
    { name: 'Snapchat Spotlight', url: 'snapchat.com', color: 'bg-yellow-400', types: ['Video'], favicon: 'https://snapchat.com/favicon.ico', region: 'International' },

    // Chinese Platforms
    { name: 'Sina Weibo Video', url: 'weibo.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://weibo.com/favicon.ico', region: 'China' },
    { name: 'Sohu', url: 'sohu.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.sohu.com/favicon.ico', region: 'China' },
    { name: 'SonyLIV', url: 'sonyliv.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.sonyliv.com/favicon.ico', region: 'International' },

    // Korean Platforms
    { name: 'Soop Live', url: 'sooplive.co.kr', color: 'bg-blue-500', types: ['Video'], favicon: 'https://sooplive.co.kr/favicon.ico', region: 'Korea' },

    // Audio Platforms
    { name: 'SoundGasm', url: 'soundgasm.net', color: 'bg-purple-600', types: ['Audio'], favicon: undefined, region: 'International' },
    { name: 'Spreaker', url: 'spreaker.com', color: 'bg-orange-500', types: ['Audio'], favicon: 'https://www.spreaker.com/favicon.ico', region: 'International' },

    // Entertainment Networks
    { name: 'South Park Studios', url: 'southparkstudios.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://southparkstudios.com/favicon.ico', region: 'International' },
    { name: 'SpankBang', url: 'spankbang.com', color: 'bg-pink-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Sport5', url: 'sport5.co.il', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.sport5.co.il/favicon.ico', region: 'International' },
    { name: 'SportBox', url: 'sportbox.ru', color: 'bg-green-600', types: ['Video'], favicon: 'https://news.sportbox.ru/favicon.ico', region: 'Russia' },
    { name: 'Sport Deutschland', url: 'sportdeutschland.tv', color: 'bg-red-600', types: ['Video'], favicon: 'https://sportdeutschland.tv/favicon.ico', region: 'Europe' },

    // Video Hosting and Cloud
    { name: 'Sprout Video', url: 'sproutvideo.com', color: 'bg-green-500', types: ['Video'], favicon: 'https://sproutvideo.com/favicon.ico', region: 'International' },
    { name: 'SRG SSR Play', url: 'play.srf.ch', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.srf.ch/favicon.ico', region: 'Europe' },

    // Additional High-Value Platforms
    { name: 'Steam', url: 'store.steampowered.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://store.steampowered.com/favicon.ico', region: 'International' },
    { name: 'Streamable', url: 'streamable.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://streamable.com/favicon.ico', region: 'International' },
    { name: 'Streamango', url: 'streamango.com', color: 'bg-orange-500', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Stripchat', url: 'stripchat.com', color: 'bg-purple-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'TailorMade', url: 'taylormade.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.taylormade.com/favicon.ico', region: 'International' },
    { name: 'Teachertube', url: 'teachertube.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.teachertube.com/favicon.ico', region: 'International' },
    { name: 'TED-Ed', url: 'ed.ted.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://ed.ted.com/favicon.ico', region: 'International' },
    { name: 'Telecinco', url: 'telecinco.es', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.telecinco.es/favicon.ico', region: 'Europe' },
    { name: 'Telefonica', url: 'telefonica.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.telefonica.com/favicon.ico', region: 'International' },
    { name: 'TelemundoNBC', url: 'telemundo.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.telemundo.com/favicon.ico', region: 'International' },
    { name: 'Tennis Channel', url: 'tennischannel.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.tennischannel.com/favicon.ico', region: 'International' },
    { name: 'TheOnion', url: 'theonion.com', color: 'bg-yellow-500', types: ['Video'], favicon: 'https://www.theonion.com/favicon.ico', region: 'International' },
    { name: 'Thunderbird TV', url: 'thunderbird.tv', color: 'bg-blue-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Time.com', url: 'time.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://time.com/favicon.ico', region: 'International' },
    { name: 'TopGear', url: 'topgear.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.topgear.com/favicon.ico', region: 'International' },
    { name: 'TopCoder', url: 'topcoder.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.topcoder.com/favicon.ico', region: 'International' },
    { name: 'Tumblr', url: 'tumblr.com', color: 'bg-blue-800', types: ['Video', 'Image'], favicon: 'https://www.tumblr.com/favicon.ico', region: 'International' },
    { name: 'Turner Classic Movies', url: 'tcm.com', color: 'bg-red-700', types: ['Video'], favicon: 'https://www.tcm.com/favicon.ico', region: 'International' },
    { name: 'TV Land', url: 'tvland.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.tvland.com/favicon.ico', region: 'International' },
    { name: 'TV Guide', url: 'tvguide.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.tvguide.com/favicon.ico', region: 'International' },
    { name: 'Typeform', url: 'typeform.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.typeform.com/favicon.ico', region: 'International' },
    { name: 'Udacity', url: 'udacity.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.udacity.com/favicon.ico', region: 'International' },
    { name: 'Udemy', url: 'udemy.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://www.udemy.com/staticx/udemy/images/v7/favicon-32x32.png', region: 'International' },
    { name: 'Unibet', url: 'unibet.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.unibet.com/favicon.ico', region: 'International' },
    { name: 'Univision', url: 'univision.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://www.univision.com/favicon.ico', region: 'International' },
    { name: 'UOL', url: 'uol.com.br', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.uol.com.br/favicon.ico', region: 'International' },
    { name: 'UStream', url: 'ustream.tv', color: 'bg-red-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Variety', url: 'variety.com', color: 'bg-black', types: ['Video'], favicon: 'https://variety.com/favicon.ico', region: 'International' },
    { name: 'Vbox7', url: 'vbox7.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.vbox7.com/favicon.ico', region: 'International' },
    { name: 'Veoh', url: 'veoh.com', color: 'bg-orange-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'VideoLan', url: 'videolan.org', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.videolan.org/favicon.ico', region: 'International' },
    { name: 'VideoPress', url: 'videopress.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://videopress.com/favicon.ico', region: 'International' },
    { name: 'VidLii', url: 'vidlii.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.vidlii.com/favicon.ico', region: 'International' },
    { name: 'VidMe', url: 'vid.me', color: 'bg-purple-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'VidYo', url: 'vidyo.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.vidyo.com/favicon.ico', region: 'International' },
    { name: 'VK Video', url: 'vk.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://vk.com/favicon.ico', region: 'Russia' },
    { name: 'VoiceThread', url: 'voicethread.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://voicethread.com/favicon.ico', region: 'International' },
    { name: 'Voot', url: 'voot.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://www.voot.com/favicon.ico', region: 'International' },
    { name: 'VuClip', url: 'vuclip.com', color: 'bg-orange-500', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Walla', url: 'walla.co.il', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.walla.co.il/favicon.ico', region: 'International' },
    { name: 'Wazoo', url: 'wazoo.com', color: 'bg-green-500', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Webex', url: 'webex.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.webex.com/favicon.ico', region: 'International' },
    { name: 'WeTV', url: 'wetv.vip', color: 'bg-green-600', types: ['Video'], favicon: 'https://puui.qpic.cn/media_img/lena/PIC1hbkbx_580_580/0', region: 'International' },
    { name: 'Wideo', url: 'wideo.co', color: 'bg-blue-500', types: ['Video'], favicon: 'https://wideo.co/favicon.ico', region: 'International' },
    { name: 'Wistia', url: 'wistia.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://fast.wistia.com/favicon.ico', region: 'International' },
    { name: 'Woopra', url: 'woopra.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://www.woopra.com/favicon.ico', region: 'International' },
    { name: 'WorldStarTV', url: 'worldstartv.com', color: 'bg-red-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Wrzuta', url: 'wrzuta.pl', color: 'bg-orange-500', types: ['Video'], favicon: undefined, region: 'Europe' },
    { name: 'Xfinity Stream', url: 'xfinity.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.xfinity.com/favicon.ico', region: 'International' },
    { name: 'Yahoo Screen', url: 'screen.yahoo.com', color: 'bg-purple-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'YallaShoot', url: 'yallashoot.com', color: 'bg-green-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Yandex Video', url: 'yandex.ru/video', color: 'bg-red-600', types: ['Video'], favicon: 'https://yandex.ru/favicon.ico', region: 'Russia' },
    { name: 'YooKassa', url: 'yookassa.ru', color: 'bg-purple-600', types: ['Video'], favicon: 'https://yookassa.ru/favicon.ico', region: 'Russia' },
    { name: 'Zoleka', url: 'zoleka.com', color: 'bg-blue-500', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Zoom', url: 'zoom.us', color: 'bg-blue-600', types: ['Video'], favicon: 'https://zoom.us/favicon.ico', region: 'International' },

    // Major Tech and Business Platforms
    { name: 'Blogger', url: 'blogger.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.blogger.com/favicon.ico', region: 'International' },
    { name: 'Bluesky', url: 'bsky.app', color: 'bg-blue-500', types: ['Video'], favicon: 'https://bsky.app/favicon.ico', region: 'International' },
    { name: 'Boosty', url: 'boosty.to', color: 'bg-orange-500', types: ['Video'], favicon: 'https://boosty.to/favicon.ico', region: 'International' },
    { name: 'Boston Globe', url: 'bostonglobe.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.bostonglobe.com/favicon.ico', region: 'International' },
    { name: 'Box', url: 'box.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.box.com/favicon.ico', region: 'International' },
    { name: 'BrainPOP', url: 'brainpop.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.brainpop.com/favicon.ico', region: 'International' },
    { name: 'Bravo TV', url: 'bravotv.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://www.bravotv.com/favicon.ico', region: 'International' },
    { name: 'BreitBart', url: 'breitbart.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.breitbart.com/favicon.ico', region: 'International' },
    { name: 'Brightcove', url: 'brightcove.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.brightcove.com/favicon.ico', region: 'International' },
    { name: 'Business Insider', url: 'businessinsider.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.businessinsider.com/favicon.ico', region: 'International' },
    { name: 'BuzzFeed', url: 'buzzfeed.com', color: 'bg-red-500', types: ['Video'], favicon: 'https://www.buzzfeed.com/favicon.ico', region: 'International' },

    // Educational and Professional
    { name: 'Caffeine TV', url: 'caffeine.tv', color: 'bg-purple-600', types: ['Video'], favicon: 'https://caffeine.tv/favicon.ico', region: 'International' },
    { name: 'Camdemy', url: 'camdemy.com', color: 'bg-blue-500', types: ['Video'], favicon: 'https://www.camdemy.com/favicon.ico', region: 'International' },
    { name: 'CBC', url: 'cbc.ca', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.cbc.ca/favicon.ico', region: 'International' },
    { name: 'CBS News', url: 'cbsnews.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.cbsnews.com/favicon.ico', region: 'International' },
    { name: 'CBS Sports', url: 'cbssports.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.cbssports.com/favicon.ico', region: 'International' },
    { name: 'Cellebrite', url: 'cellebrite.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.cellebrite.com/favicon.ico', region: 'International' },
    { name: 'Charlie Rose', url: 'charlierose.com', color: 'bg-black', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Cisco Webex', url: 'webex.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.webex.com/favicon.ico', region: 'International' },
    { name: 'Clipchamp', url: 'clipchamp.com', color: 'bg-purple-600', types: ['Video'], favicon: 'https://app.clipchamp.com/favicon.ico', region: 'International' },
    { name: 'Cloudflare Stream', url: 'cloudflarestream.com', color: 'bg-orange-500', types: ['Video'], favicon: 'https://www.cloudflare.com/favicon.ico', region: 'International' },
    { name: 'Clyp', url: 'clyp.it', color: 'bg-blue-500', types: ['Audio'], favicon: 'https://clyp.it/favicon.ico', region: 'International' },
    { name: 'CNBC', url: 'cnbc.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.cnbc.com/favicon.ico', region: 'International' },
    { name: 'CNN Indonesia', url: 'cnnindonesia.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.cnnindonesia.com/favicon.ico', region: 'International' },
    { name: 'Comedy Central', url: 'comedycentral.com', color: 'bg-yellow-500', types: ['Video'], favicon: 'https://www.comedycentral.com/favicon.ico', region: 'International' },

    // Streaming and Alternative Platforms
    { name: 'Cooking Channel', url: 'cookingchannel.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.cookingchannel.com/favicon.ico', region: 'International' },
    { name: 'Corus', url: 'corus.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.corus.com/favicon.ico', region: 'International' },
    { name: 'Cozy TV', url: 'cozy.tv', color: 'bg-purple-500', types: ['Video'], favicon: 'https://cozy.tv/favicon.ico', region: 'International' },
    { name: 'Crackle', url: 'crackle.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.crackle.com/favicon.ico', region: 'International' },
    { name: 'Craftsy', url: 'craftsy.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.craftsy.com/favicon.ico', region: 'International' },
    { name: 'Crowd Bunker', url: 'crowdbunker.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://crowdbunker.com/favicon.ico', region: 'International' },
    { name: 'C-SPAN', url: 'c-span.org', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.c-span.org/favicon.ico', region: 'International' },
    { name: 'CTV', url: 'ctv.ca', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.ctv.ca/favicon.ico', region: 'International' },
    { name: 'CW TV', url: 'cwtv.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.cwtv.com/favicon.ico', region: 'International' },
    { name: 'Cybrary', url: 'cybrary.it', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.cybrary.it/favicon.ico', region: 'International' },

    // Korean and Asian Platforms
    { name: 'Daum', url: 'daum.net', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.daum.net/favicon.ico', region: 'Korea' },
    { name: 'Dangal Play', url: 'dangalplay.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.dangalplay.com/favicon.ico', region: 'International' },
    { name: 'Democracy Now', url: 'democracynow.org', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.democracynow.org/favicon.ico', region: 'International' },
    { name: 'Digital Concert Hall', url: 'digitalconcerthall.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.digitalconcerthall.com/favicon.ico', region: 'International' },
    { name: 'Discovery Plus', url: 'discoveryplus.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.discoveryplus.com/favicon.ico', region: 'International' },
    { name: 'Disney+', url: 'disneyplus.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.disneyplus.com/favicon.ico', region: 'International' },
    { name: 'DLive', url: 'dlive.tv', color: 'bg-yellow-500', types: ['Video'], favicon: 'https://dlive.tv/favicon.ico', region: 'International' },
    { name: 'Douyin', url: 'douyin.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.douyin.com/favicon.ico', region: 'China' },
    { name: 'DPlay', url: 'dplay.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.dplay.com/favicon.ico', region: 'International' },
    { name: 'Dropout', url: 'dropout.tv', color: 'bg-yellow-500', types: ['Video'], favicon: 'https://www.dropout.tv/favicon.ico', region: 'International' },
    { name: 'DrTalks', url: 'drtalks.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://drtalks.com/favicon.ico', region: 'International' },
    { name: 'DrTuber', url: 'drtuber.com', color: 'bg-orange-600', types: ['Video'], favicon: undefined, region: 'International' },

    // Adult Content Platforms (additional)
    { name: 'BongaCams', url: 'bongacams.com', color: 'bg-purple-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'CAM4', url: 'cam4.com', color: 'bg-red-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'CamModels', url: 'cammodels.com', color: 'bg-pink-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Camsoda', url: 'camsoda.com', color: 'bg-orange-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Chaturbate', url: 'chaturbate.com', color: 'bg-orange-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'EMPFlix', url: 'empflix.com', color: 'bg-black', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'Eporner', url: 'eporner.com', color: 'bg-blue-600', types: ['Video'], favicon: undefined, region: 'International' },
    { name: 'HellPorno', url: 'hellporno.com', color: 'bg-red-600', types: ['Video'], favicon: undefined, region: 'International' },

    // European Broadcasting
    { name: 'eBaums World', url: 'ebaumsworld.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.ebaumsworld.com/favicon.ico', region: 'International' },
    { name: 'El País', url: 'elpais.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://elpais.com/favicon.ico', region: 'International' },
    { name: 'ESPN', url: 'espn.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.espn.com/favicon.ico', region: 'International' },
    { name: 'Eurosport', url: 'eurosport.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.eurosport.com/favicon.ico', region: 'International' },
    { name: 'FOX', url: 'fox.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.fox.com/favicon.ico', region: 'International' },
    { name: 'Fox News', url: 'foxnews.com', color: 'bg-blue-800', types: ['Video'], favicon: 'https://www.foxnews.com/favicon.ico', region: 'International' },
    { name: 'Fox Sports', url: 'foxsports.com', color: 'bg-blue-700', types: ['Video'], favicon: 'https://www.foxsports.com/favicon.ico', region: 'International' },
    { name: 'France Culture', url: 'franceculture.fr', color: 'bg-purple-600', types: ['Audio'], favicon: 'https://www.franceculture.fr/favicon.ico', region: 'Europe' },
    { name: 'France Inter', url: 'franceinter.fr', color: 'bg-red-600', types: ['Audio'], favicon: 'https://www.franceinter.fr/favicon.ico', region: 'Europe' },
    { name: 'France TV', url: 'francetv.fr', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.francetv.fr/favicon.ico', region: 'Europe' },

    // Gaming and Entertainment
    { name: 'Funker530', url: 'funker530.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://funker530.com/favicon.ico', region: 'International' },
    { name: 'GameSpot', url: 'gamespot.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.gamespot.com/favicon.ico', region: 'International' },
    { name: 'GameStar', url: 'gamestar.de', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.gamestar.de/favicon.ico', region: 'Europe' },
    { name: 'GB News', url: 'gbnews.uk', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.gbnews.uk/favicon.ico', region: 'International' },
    { name: 'Genius', url: 'genius.com', color: 'bg-yellow-500', types: ['Video'], favicon: 'https://genius.com/favicon.ico', region: 'International' },
    { name: 'Giant Bomb', url: 'giantbomb.com', color: 'bg-orange-600', types: ['Video'], favicon: 'https://www.giantbomb.com/favicon.ico', region: 'International' },
    { name: 'Gettr', url: 'gettr.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://gettr.com/favicon.ico', region: 'International' },
    { name: 'Globo', url: 'globo.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.globo.com/favicon.ico', region: 'International' },
    { name: 'GoPro', url: 'gopro.com', color: 'bg-black', types: ['Video'], favicon: 'https://gopro.com/favicon.ico', region: 'International' },
    { name: 'HBO', url: 'hbo.com', color: 'bg-purple-800', types: ['Video'], favicon: 'https://www.hbo.com/favicon.ico', region: 'International' },
    { name: 'HGTV', url: 'hgtv.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.hgtv.com/favicon.ico', region: 'International' },
    { name: 'HiDive', url: 'hidive.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.hidive.com/favicon.ico', region: 'International' },
    { name: 'History Channel', url: 'history.com', color: 'bg-brown-600', types: ['Video'], favicon: 'https://www.history.com/favicon.ico', region: 'International' },
    { name: 'Hollywood Reporter', url: 'hollywoodreporter.com', color: 'bg-black', types: ['Video'], favicon: 'https://www.hollywoodreporter.com/favicon.ico', region: 'International' },
    { name: 'HotStar', url: 'hotstar.com', color: 'bg-blue-600', types: ['Video'], favicon: 'https://www.hotstar.com/favicon.ico', region: 'International' },
    { name: 'HuffPost', url: 'huffpost.com', color: 'bg-green-600', types: ['Video'], favicon: 'https://www.huffpost.com/favicon.ico', region: 'International' },
    { name: 'Hypem', url: 'hypem.com', color: 'bg-green-500', types: ['Audio'], favicon: 'https://hypem.com/favicon.ico', region: 'International' },
    { name: 'IGN', url: 'ign.com', color: 'bg-red-600', types: ['Video'], favicon: 'https://www.ign.com/favicon.ico', region: 'International' },
];

// Helper function to generate URL slug from site name
export const getSiteSlug = (siteName: string): string => {
    // Handle specific Chinese site names with custom mappings
    const chineseMap: Record<string, string> = {
        '爆米花网': 'baomihua',
        '豆瓣': 'douban',
        '斗鱼': 'douyu',
        '凤凰视频': 'ifeng',
        '风行网': 'fun-tv',
        '激动网': 'joy',
        '酷6网': 'ku6',
        '酷狗音乐': 'kugou',
        '酷我音乐': 'kuwo',
        '乐视网': 'letv',
        '荔枝FM': 'lizhi-fm',
        '懒人听书': 'lrts',
        '秒拍': 'miaopai',
        '痞客邦': 'pixnet',
        '齐鲁网': 'iqilu',
        '企鹅直播': 'penguin-live',
        '阳光卫视': 'isun-tv',
        '战旗TV': 'zhanqi-tv',
        '央视网': 'cctv',
        '芒果TV': 'mango-tv',
        '火猫TV': 'huomao-tv',
        '阳光宽频网': 'yangguang-tv',
        '西瓜视频': 'ixigua',
        '新片场': 'xinpianchang',
        '快手': 'kuaishou',
        '抖音': 'douyin',
        '中国体育TV': 'zhibo-tv',
        '知乎': 'zhihu'
    };

    // Check if it's a Chinese site name we need to map
    if (chineseMap[siteName]) {
        return chineseMap[siteName];
    }

    // Regular slug generation for other sites
    return siteName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'unknown';
};

// Helper function to find site by slug
export const findSiteBySlug = (slug: string): SiteInfo | undefined => {
    return sites.find(site => getSiteSlug(site.name) === slug);
};
