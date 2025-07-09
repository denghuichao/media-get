// Google Analytics 4 事件跟踪工具函数

declare global {
    interface Window {
        gtag: (command: string, targetId: string, config?: object) => void;
    }
}

/**
 * 发送自定义事件到Google Analytics
 * @param eventName 事件名称
 * @param parameters 事件参数
 */
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, parameters);
        console.log('Analytics Event:', eventName, parameters);
    }
};

/**
 * 跟踪分析按钮点击事件
 * @param platform 平台名称(从URL解析)
 * @param url 分析的URL
 */
export const trackAnalyzeClick = (platform: string, url: string) => {
    trackEvent('analyze_button_click', {
        platform: platform,
        url_domain: getDomainFromUrl(url),
        event_category: 'engagement',
        event_label: 'analyze_media',
        custom_parameter_platform: platform
    });
};

/**
 * 跟踪下载按钮点击事件
 * @param platform 平台名称
 * @param mediaType 媒体类型(video/audio/image)
 * @param format 选择的格式
 * @param isPlaylist 是否为播放列表
 */
export const trackDownloadClick = (
    platform: string,
    mediaType: string,
    format: string,
    isPlaylist: boolean = false
) => {
    trackEvent('download_button_click', {
        platform: platform,
        media_type: mediaType,
        format: format,
        is_playlist: isPlaylist,
        event_category: 'conversion',
        event_label: 'start_download',
        custom_parameter_platform: platform,
        custom_parameter_media_type: mediaType
    });
};

/**
 * 跟踪下载完成事件
 * @param platform 平台名称
 * @param mediaType 媒体类型
 * @param format 格式
 * @param success 是否成功
 * @param fileCount 文件数量
 */
export const trackDownloadComplete = (
    platform: string,
    mediaType: string,
    format: string,
    success: boolean,
    fileCount: number = 1
) => {
    trackEvent('download_complete', {
        platform: platform,
        media_type: mediaType,
        format: format,
        success: success,
        file_count: fileCount,
        event_category: 'conversion',
        event_label: success ? 'download_success' : 'download_failure',
        custom_parameter_platform: platform,
        custom_parameter_media_type: mediaType
    });
};

/**
 * 跟踪平台使用统计
 * @param platform 平台名称
 * @param action 操作类型
 */
export const trackPlatformUsage = (platform: string, action: 'analyze' | 'download') => {
    trackEvent('platform_usage', {
        platform: platform,
        action: action,
        event_category: 'platform_analytics',
        event_label: `${platform}_${action}`,
        custom_parameter_platform: platform
    });
};

/**
 * 从URL提取域名
 * @param url URL字符串
 * @returns 域名或'unknown'
 */
export const getDomainFromUrl = (url: string): string => {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return 'unknown';
    }
};

/**
 * 从URL获取平台名称
 * @param url URL字符串
 * @returns 平台名称
 */
export const getPlatformFromUrl = (url: string): string => {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();

        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'YouTube';
        if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'Twitter/X';
        if (hostname.includes('instagram.com')) return 'Instagram';
        if (hostname.includes('tiktok.com')) return 'TikTok';
        if (hostname.includes('bilibili.com')) return 'Bilibili';
        if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return 'Facebook';
        if (hostname.includes('reddit.com')) return 'Reddit';
        if (hostname.includes('vimeo.com')) return 'Vimeo';
        if (hostname.includes('dailymotion.com')) return 'Dailymotion';
        if (hostname.includes('twitch.tv')) return 'Twitch';
        if (hostname.includes('soundcloud.com')) return 'SoundCloud';
        if (hostname.includes('spotify.com')) return 'Spotify';
        if (hostname.includes('linkedin.com')) return 'LinkedIn';
        if (hostname.includes('pinterest.com')) return 'Pinterest';
        if (hostname.includes('tumblr.com')) return 'Tumblr';
        if (hostname.includes('weibo.com')) return 'Weibo';
        if (hostname.includes('flickr.com')) return 'Flickr';
        if (hostname.includes('archive.org')) return 'Archive.org';
        if (hostname.includes('bandcamp.com')) return 'Bandcamp';
        if (hostname.includes('mixcloud.com')) return 'Mixcloud';

        // 更多平台匹配
        if (hostname.includes('amazon.com') || hostname.includes('amazon.')) return 'Amazon';
        if (hostname.includes('bbc.') || hostname.includes('iplayer')) return 'BBC';
        if (hostname.includes('cnn.com')) return 'CNN';
        if (hostname.includes('espn.com')) return 'ESPN';
        if (hostname.includes('hbo.com') || hostname.includes('hbomax.com')) return 'HBO';
        if (hostname.includes('netflix.com')) return 'Netflix';
        if (hostname.includes('disney.com') || hostname.includes('disneyplus.com')) return 'Disney';
        if (hostname.includes('paramount.com') || hostname.includes('paramountplus.com')) return 'Paramount';
        if (hostname.includes('ted.com')) return 'TED';
        if (hostname.includes('udemy.com')) return 'Udemy';
        if (hostname.includes('zoom.us')) return 'Zoom';
        if (hostname.includes('vk.com')) return 'VKontakte';
        if (hostname.includes('niconico.jp') || hostname.includes('nicovideo.jp')) return 'Niconico';

        return hostname.split('.').slice(-2, -1)[0] || 'Other';
    } catch {
        return 'Unknown';
    }
};

/**
 * 从格式信息确定媒体类型
 * @param format 格式ID或格式对象
 * @param mediaInfo 媒体信息对象
 * @returns 媒体类型
 */
export const determineMediaTypeFromFormat = (format: string, mediaInfo: any): string => {
    if (!format || !mediaInfo) return 'video';

    // 查找选中的格式
    const selectedFormat = mediaInfo.formats?.find((f: any) => f.format_id === format);

    if (selectedFormat) {
        // 检查编解码器
        if (selectedFormat.vcodec === 'none' && selectedFormat.acodec && selectedFormat.acodec !== 'none') {
            return 'audio';
        }
        if (selectedFormat.acodec === 'none' && selectedFormat.vcodec && selectedFormat.vcodec !== 'none') {
            return 'video';
        }

        // 检查扩展名
        const ext = selectedFormat.ext?.toLowerCase();
        if (ext && ['mp3', 'm4a', 'aac', 'flac', 'ogg', 'wav'].includes(ext)) {
            return 'audio';
        }
        if (ext && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) {
            return 'image';
        }
    }

    // 默认为视频
    return 'video';
};
