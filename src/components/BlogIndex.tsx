import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const blogs = [
    { path: '/blogs/amazon-ecommerce-video-platform-deep-dive-yt-dlp.html', title: 'Amazon Video Infrastructure Deep Dive: E-commerce Integrated Media Platform in yt-dlp - Technical Analysis' },
    { path: '/blogs/amazon-product-video-extraction-e-commerce-engineering.html', title: 'Amazon产品视频提取深度技术解析：电商平台媒体工程实战' },
    { path: '/blogs/archive-org-digital-preservation-engineering.html', title: 'Archive.org: Digital Preservation Engineering and Wayback Machine Video Infrastructure' },
    { path: '/blogs/arte-european-broadcasting-multilingual-deep-dive-yt-dlp.html', title: 'ARTE European Broadcasting: Multilingual Media Engineering Deep Dive | yt-dlp Technical Analysis' },
    { path: '/blogs/bandcamp-independent-music-platform-engineering.html', title: 'Bandcamp: Independent Music Platform Engineering and Audio Distribution' },
    { path: '/blogs/bbc-iplayer-public-broadcasting-media-selector-engineering.html', title: 'BBC iPlayer: Public Broadcasting, Media Selector Logic, and Content Encryption' },
    { path: '/blogs/bitchute-decentralized-video-platform-p2p-engineering.html', title: 'BitChute: Decentralized Video Platform, P2P Technology, and Censorship Resistance' },
    { path: '/blogs/bloomberg-financial-media-enterprise-broadcasting-deep-dive-yt-dlp.html', title: 'Bloomberg Financial Media: Enterprise News Broadcasting Engineering Deep Dive | yt-dlp Technical Analysis' },
    { path: '/blogs/brightcove-enterprise-video-infrastructure-yt-dlp.html', title: 'Brightcove Enterprise Video Infrastructure Deep Dive: Cloud Media Platform in yt-dlp - Technical Analysis' },
    { path: '/blogs/cnn-news-broadcasting-global-media-deep-dive-yt-dlp.html', title: 'CNN News Broadcasting: Global Media Engineering Deep Dive | yt-dlp Technical Analysis' },
    { path: '/blogs/cracking-instagram-video-extraction-yt-dlp-deep-dive.html', title: 'Cracking Instagram\'s Video Extraction: A yt-dlp Deep Dive' },
    { path: '/blogs/dailymotion-video-extraction-graphql-api-yt-dlp-engineering.html', title: 'Dailymotion Video Extraction: GraphQL API, yt-dlp Engineering, and Player Reverse Engineering' },
    { path: '/blogs/decoding-bilibili-video-infrastructure-yt-dlp-analysis.html', title: 'Decoding Bilibili\'s Video Infrastructure: A yt-dlp Analysis' },
    { path: '/blogs/disney-video-platform-extraction-deep-dive-yt-dlp.html', title: 'Disney Video Platform Deep Dive: Multi-Brand Entertainment Infrastructure in yt-dlp - Technical Analysis' },
    { path: '/blogs/dropbox-cloud-storage-video-engineering.html', title: 'Dropbox: Cloud Storage, Video File Handling, and API Integration' },
    { path: '/blogs/espn-sports-broadcasting-video-engineering.html', title: 'ESPN: Sports Broadcasting, Live Streaming, and Video-on-Demand Architecture' },
    { path: '/blogs/facebook-video-extraction-mastery-yt-dlp-engineering.html', title: 'Facebook Video Extraction Mastery: A yt-dlp Engineering Deep Dive' },
    { path: '/blogs/flickr-media-platform-photography-video-api-engineering.html', title: 'Flickr: Media Platform, Photography APIs, and Video Storage Engineering' },
    { path: '/blogs/google-drive-cloud-storage-enterprise-media-engineering.html', title: 'Google Drive: Cloud Storage, Enterprise Media, and API-Driven Documentaries' },
    { path: '/blogs/hbo-streaming-platform-enterprise-video-engineering.html', title: 'HBO Max: Streaming Platform, Enterprise Video, and DRM Technology' },
    { path: '/blogs/how-yt-dlp-downloads-youtube-videos-deep-dive.html', title: 'How yt-dlp Downloads YouTube Videos: A Technical Deep Dive' },
    { path: '/blogs/jwplatform-video-infrastructure-deep-dive-yt-dlp.html', title: 'JW Player Video Infrastructure Deep Dive: Universal Video Platform in yt-dlp - Technical Analysis' },
    { path: '/blogs/kaltura-enterprise-video-platform-deep-dive-yt-dlp.html', title: 'Kaltura Video Platform Deep Dive: Enterprise Media Infrastructure in yt-dlp - Technical Analysis' },
    { path: '/blogs/kickstarter-crowdfunding-video-marketing-engineering.html', title: 'Kickstarter: Crowdfunding, Video Marketing, and Platform Engineering' },
    { path: '/blogs/lbry-odysee-blockchain-video-platform-engineering.html', title: 'LBRY & Odysee: Blockchain Video, Decentralized Content, and Platform Engineering' },
    { path: '/blogs/linkedin-video-extraction-professional-platform-engineering.html', title: 'LinkedIn Video Extraction: Professional Platform Engineering and API Insights' },
    { path: '/blogs/mastering-twitch-live-stream-extraction-yt-dlp.html', title: 'Mastering Twitch Live Stream Extraction with yt-dlp' },
    { path: '/blogs/mixcloud-dj-platform-radio-show-engineering.html', title: 'Mixcloud: DJ Platform, Radio Show Archiving, and Audio Streaming Engineering' },
    { path: '/blogs/nbc-universal-broadcasting-deep-dive-yt-dlp.html', title: 'NBC Universal Broadcasting Deep Dive: GraphQL APIs and Legacy Infrastructure in yt-dlp - Technical Analysis' },
    { path: '/blogs/niconico-japanese-video-platform-engineering.html', title: 'Niconico: Japanese Video Platform, Real-Time Comments, and Cultural Tech' },
    { path: '/blogs/paramount-plus-streaming-deep-dive-yt-dlp.html', title: 'Paramount+ Streaming Deep Dive: Modern DRM and CBS Infrastructure in yt-dlp - Technical Analysis' },
    { path: '/blogs/pbs-public-broadcasting-deep-dive-yt-dlp.html', title: 'PBS Public Broadcasting Deep Dive: yt-dlp\'s Engineering for Educational Content Extraction' },
    { path: '/blogs/peertube-decentralized-video-federation-engineering.html', title: 'PeerTube: Decentralized Video, ActivityPub Federation, and P2P Streaming' },
    { path: '/blogs/pinterest-visual-platform-pin-video-engineering.html', title: 'Pinterest: Visual Platform, Pin Schemas, and Video Content Engineering' },
    { path: '/blogs/reddit-video-extraction-technical-deep-dive-yt-dlp.html', title: 'Reddit Video Extraction: Technical Deep Dive into yt-dlp Implementation' },
    { path: '/blogs/reverse-engineering-tiktok-video-extraction-yt-dlp.html', title: 'Reverse Engineering TikTok\'s Video Extraction: Inside yt-dlp\'s TikTok Extractor - Technical Deep Dive' },
    { path: '/blogs/rumble-video-platform-next-gen-streaming-engineering.html', title: 'Rumble: Video Platform, Next-Gen Streaming, and Creator Economy Engineering' },
    { path: '/blogs/soundcloud-audio-extraction-engineering-yt-dlp-deep-dive.html', title: 'SoundCloud Audio Extraction: A yt-dlp Engineering Deep Dive' },
    { path: '/blogs/spotify-podcast-graphql-api-engineering.html', title: 'Spotify: Podcast Delivery, GraphQL API, and Audio Encryption Engineering' },
    { path: '/blogs/streamable-video-hosting-ajax-api-engineering.html', title: 'Streamable: Video Hosting, AJAX API, and oEmbed Integration' },
    { path: '/blogs/ted-talks-inspirational-content-platform-deep-dive-yt-dlp.html', title: 'TED Talks Platform: Inspirational Content Delivery Engineering Deep Dive | yt-dlp Technical Analysis' },
    { path: '/blogs/telegram-instant-messaging-embedded-media-engineering.html', title: 'Telegram: Instant Messaging, Embedded Media, and Secure Content Handling' },
    { path: '/blogs/tumblr-microblogging-video-engineering.html', title: 'Tumblr: Microblogging, GIF Culture, and Video Integration Engineering' },
    { path: '/blogs/twitter-x-video-extraction-mastery-yt-dlp-engineering.html', title: 'Twitter/X Video Extraction Mastery: yt-dlp\'s Social Media API Engineering' },
    { path: '/blogs/udemy-online-learning-platform-deep-dive-yt-dlp.html', title: 'Udemy Video Extraction Deep Dive: yt-dlp\'s Engineering for Online Learning Platforms' },
    { path: '/blogs/vevo-music-platform-deep-dive-yt-dlp.html', title: 'Vevo Music Platform Deep Dive: yt-dlp\'s Engineering for Premium Music Video Extraction' },
    { path: '/blogs/vimeo-video-extraction-deep-dive-yt-dlp.html', title: 'Vimeo Video Extraction: A Deep Dive into yt-dlp\'s Vimeo Extractor' },
    { path: '/blogs/vkontakte-russian-social-network-video-engineering.html', title: 'VKontakte (VK): Russian Social Network, Video Platform, and API Engineering' },
    { path: '/blogs/wistia-business-video-platform-deep-dive-yt-dlp.html', title: 'Wistia Business Video Platform Deep Dive: Professional Video Infrastructure in yt-dlp - Technical Analysis' },
    { path: '/blogs/zoom-video-conferencing-deep-dive-yt-dlp.html', title: 'Zoom Video Conferencing Deep Dive: yt-dlp\'s Engineering for Enterprise Recording Extraction' },
];

const BlogIndex: React.FC = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                            {t('blogs.title')}
                        </span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('blogs.subtitle')}
                    </p>
                </header>

                <div className="mb-12 max-w-xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('blogs.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-5 py-3 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-5">
                            <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredBlogs.map((blog) => (
                        <a
                            key={blog.path}
                            href={blog.path}
                            className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out overflow-hidden group"
                        >
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 h-24 overflow-hidden">
                                    {blog.title}
                                </h2>
                                <p className="mt-4 text-blue-600 font-semibold text-sm">
                                    {t('blogs.readMore')}
                                    <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">
                                        →
                                    </span>
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogIndex;
