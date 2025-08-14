import React, { useState } from 'react';
import { Search, Download, Play, Image, Music, AlertCircle, CheckCircle, Clock, RefreshCw, ExternalLink, List, ChevronDown, ChevronUp, Video, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService, MediaInfo, TaskStatus } from '../services/api';
import { getUserDisplayInfo } from '../utils/fingerprint';
import { formatSmartTimestampWithUTC } from '../utils/dateUtils';
import { trackAnalyzeClick, trackDownloadClick, trackDownloadComplete, trackPlatformUsage, getPlatformFromUrl, determineMediaTypeFromFormat } from '../utils/analytics';
import AdBanner from './AdBanner';
import NativeAdBanner from './NativeAdBanner';
import { AD_CONFIGS } from '../configs/adConfigs';

interface SiteInfo {
    name: string;
    url: string;
    color: string;
    favicon?: string;
    types: string[];
    region: string;
}

interface SiteDownloadPageProps {
    siteInfo: SiteInfo;
}

export default function SiteDownloadPage({ siteInfo }: SiteDownloadPageProps) {
    const { t } = useTranslation();
    const userInfo = getUserDisplayInfo();
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
    const [selectedFormat, setSelectedFormat] = useState('');
    const [downloadPlaylist, setDownloadPlaylist] = useState(false);
    const [error, setError] = useState('');
    const [downloadSuccess, setDownloadSuccess] = useState('');
    const [currentTask, setCurrentTask] = useState<TaskStatus | null>(null);
    const [taskPolling, setTaskPolling] = useState<number | null>(null);

    // Auto-hide timers
    const [successTimer, setSuccessTimer] = useState<number | null>(null);
    const [taskTimer, setTaskTimer] = useState<number | null>(null);

    // Track expanded categories for showing more formats
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    // Helper function to toggle category expansion
    const toggleCategoryExpansion = (categoryKey: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryKey]: !prev[categoryKey]
        }));
    };

    // Helper function to detect if URL might be a playlist
    const isPlaylistUrl = (url: string): boolean => {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            const pathname = urlObj.pathname.toLowerCase();
            const searchParams = urlObj.searchParams;

            // YouTube playlist indicators
            if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
                return searchParams.has('list') ||
                    pathname.includes('/playlist') ||
                    pathname.includes('/channel') ||
                    pathname.includes('/user');
            }

            // Bilibili playlist indicators
            if (hostname.includes('bilibili.com')) {
                return pathname.includes('/favlist') ||
                    pathname.includes('/medialist') ||
                    pathname.includes('/collection');
            }

            // Other common playlist patterns
            return pathname.includes('playlist') ||
                pathname.includes('album') ||
                pathname.includes('collection') ||
                searchParams.has('playlist') ||
                searchParams.has('album');
        } catch {
            return false;
        }
    };

    // Helper function to detect if error is related to login cookies
    const isLoginCookieError = (errorMessage: string): boolean => {
        const cookieKeywords = [
            'login cookies',
            'need login',
            'authentication required',
            'sign in required',
            'login required',
            'cookies.txt',
            'need to login',
            'requires login'
        ];

        return cookieKeywords.some(keyword =>
            errorMessage.toLowerCase().includes(keyword.toLowerCase())
        );
    };

    // Helper function to get platform login URL
    const getPlatformLoginUrl = (url: string): string => {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();

            if (hostname.includes('instagram.com')) {
                return 'https://www.instagram.com/accounts/login/';
            } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
                return 'https://twitter.com/i/flow/login';
            } else if (hostname.includes('facebook.com')) {
                return 'https://www.facebook.com/login/';
            }

            return `https://${urlObj.hostname}`;
        } catch {
            return siteInfo.url;
        }
    };

    // Clear timers on unmount
    React.useEffect(() => {
        return () => {
            if (successTimer) clearTimeout(successTimer);
            if (taskTimer) clearTimeout(taskTimer);
            if (taskPolling) clearInterval(taskPolling);
        };
    }, [successTimer, taskTimer, taskPolling]);

    const handleAnalyze = async () => {
        if (!url.trim()) {
            setError(t('hero.errors.emptyUrl'));
            return;
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            setError(t('hero.errors.invalidUrl'));
            return;
        }

        setIsLoading(true);
        setError('');
        setMediaInfo(null);
        setSelectedFormat('');

        // Track analytics
        const platform = getPlatformFromUrl(url);
        trackAnalyzeClick(platform, url);
        trackPlatformUsage(platform, 'analyze');

        try {
            const result = await apiService.analyzeUrl(url);
            setMediaInfo(result);

            // Auto-select best format
            if (result.formats && result.formats.length > 0) {
                // Set default selected format to the first one
                setSelectedFormat(result.formats[0].format_id || '');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || t('hero.errors.analysisFailed');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!mediaInfo || !selectedFormat) {
            setError(t('hero.errors.noFormatSelected'));
            return;
        }

        setIsSubmitting(true);
        setError('');
        setDownloadSuccess('');

        // Track download analytics
        const platform = getPlatformFromUrl(url);
        const mediaType = mediaInfo ? determineMediaTypeFromFormat(selectedFormat, mediaInfo) : 'video';
        trackDownloadClick(platform, mediaType, selectedFormat, downloadPlaylist);
        trackPlatformUsage(platform, 'download');

        try {
            const result = await apiService.downloadMedia(url, userInfo.id, selectedFormat, undefined, undefined, downloadPlaylist);

            if (result.success && result.taskId) {
                // Show success message immediately
                setDownloadSuccess(downloadPlaylist ? t('success.playlistDownloadStarted') : t('success.downloadStarted'));

                // Auto-hide success message after 4 seconds
                const timer = setTimeout(() => {
                    setDownloadSuccess('');
                }, 4000);
                setSuccessTimer(timer);

                setCurrentTask({
                    id: result.taskId,
                    status: 'pending',
                    progress: 0,
                    title: result.task?.title || 'Unknown',
                    site: result.task?.site || 'Unknown',
                    url: result.task?.url || url,
                    mediaType: mediaType,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });

                // Start polling for task status if we have a task ID
                if (result.taskId) {
                    const polling = setInterval(async () => {
                        try {
                            const status = await apiService.getTaskStatus(result.taskId!);
                            setCurrentTask(status);

                            if (status.status === 'completed') {
                                clearInterval(polling);
                                setTaskPolling(null);
                                setDownloadSuccess(t('hero.success.downloadCompleted'));

                                // Track completion
                                trackDownloadComplete(platform, mediaType, selectedFormat, true);

                                // Auto-hide success message
                                const timer = setTimeout(() => {
                                    setDownloadSuccess('');
                                    setCurrentTask(null);
                                }, 10000);
                                setSuccessTimer(timer);

                            } else if (status.status === 'failed') {
                                clearInterval(polling);
                                setTaskPolling(null);
                                setError(status.error || t('hero.errors.downloadFailed'));
                                setCurrentTask(null);

                                // Track failure
                                trackDownloadComplete(platform, mediaType, selectedFormat, false);
                            }
                        } catch (pollingError) {
                            console.error('Polling error:', pollingError);
                        }
                    }, 2000);

                    setTaskPolling(polling);

                    // Auto-hide task status after 2 minutes if still running
                    const timer = setTimeout(() => {
                        if (taskPolling) {
                            clearInterval(taskPolling);
                            setTaskPolling(null);
                        }
                        setCurrentTask(null);
                    }, 120000);
                    setTaskTimer(timer);
                }
            } else {
                throw new Error(result.error || t('hero.errors.downloadFailed'));
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || t('hero.errors.downloadFailed');
            setError(errorMessage);

            // Track failure
            const platform = getPlatformFromUrl(url);
            const mediaType = mediaInfo ? determineMediaTypeFromFormat(selectedFormat, mediaInfo) : 'video';
            trackDownloadComplete(platform, mediaType, selectedFormat, false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFormatIcon = (format: any) => {
        if (format.vcodec && format.vcodec !== 'none') {
            return <Play className="h-4 w-4 text-blue-600" />;
        } else if (format.acodec && format.acodec !== 'none') {
            return <Music className="h-4 w-4 text-green-600" />;
        } else {
            return <Image className="h-4 w-4 text-purple-600" />;
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (!bytes) return 'Unknown';

        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getSiteSpecificContent = () => {
        const siteName = siteInfo.name.toLowerCase();

        if (siteName.includes('twitter') || siteName.includes('x.com')) {
            return {
                title: `${siteInfo.name} Video Downloader`,
                description: `Download high-quality videos, images, and GIFs from ${siteInfo.name}. Support for Full HD, 1080p, 2K, 4K video downloads.`,
                howToSteps: [
                    `Open the ${siteInfo.name} app or website`,
                    'Find the video or content you want to download',
                    'Copy the tweet or post URL',
                    'Paste the URL in the input box above',
                    'Click Analyze and then Download'
                ],
                features: [
                    'High Quality Downloads (HD, 1080p, 2K, 4K)',
                    'Video, Image and GIF Support',
                    'No Software Installation Required',
                    'Works on All Devices and Browsers',
                    'Fast and Free Downloads'
                ],
                faqs: [
                    {
                        question: `Why use MediaGet to download ${siteInfo.name} content?`,
                        answer: `MediaGet provides the easiest way to download content from ${siteInfo.name} in high quality. Our tool is constantly updated and works with all browsers and devices.`
                    },
                    {
                        question: `How to download ${siteInfo.name} videos online?`,
                        answer: 'Simply paste the URL into the input box above, click Analyze, select your preferred quality, and click Download.'
                    },
                    {
                        question: `Is it free to download ${siteInfo.name} content?`,
                        answer: 'Yes! MediaGet is completely free with no limits on downloads.'
                    },
                    {
                        question: 'What quality options are available?',
                        answer: 'We support all available qualities including HD, 1080p, 2K, 4K depending on the original content quality.'
                    },
                    {
                        question: 'Where are downloaded files saved?',
                        answer: 'Files are downloaded to your browser\'s default download folder. You can find them in your browser\'s download history.'
                    }
                ]
            };
        } else if (siteName.includes('youtube')) {
            return {
                title: `${siteInfo.name} Video & Audio Downloader`,
                description: `Download videos and audio from ${siteInfo.name} in various formats and qualities. Support for playlists and individual videos.`,
                howToSteps: [
                    `Go to ${siteInfo.name} and find your video`,
                    'Copy the video URL from the address bar',
                    'Paste the URL in the input box above',
                    'Click Analyze to see available formats',
                    'Select your preferred quality and click Download'
                ],
                features: [
                    'Multiple Quality Options (144p to 4K)',
                    'Audio-Only Downloads (MP3, M4A)',
                    'Playlist Support',
                    'No Registration Required',
                    'Fast Download Speeds'
                ],
                faqs: [
                    {
                        question: `Can I download ${siteInfo.name} playlists?`,
                        answer: 'Yes! Enable the playlist option before analyzing to download entire playlists.'
                    },
                    {
                        question: 'What audio formats are supported?',
                        answer: 'We support various audio formats including MP3, M4A, and WebM audio.'
                    },
                    {
                        question: 'Is there a download limit?',
                        answer: 'No, you can download as many videos as you want for free.'
                    }
                ]
            };
        } else {
            return {
                title: `${siteInfo.name} Media Downloader`,
                description: `Download content from ${siteInfo.name} easily and quickly. Support for ${siteInfo.types.join(', ').toLowerCase()} downloads.`,
                howToSteps: [
                    `Visit ${siteInfo.name} and find your content`,
                    'Copy the URL of the content',
                    'Paste the URL in the input box above',
                    'Click Analyze and select format',
                    'Click Download to save to your device'
                ],
                features: [
                    `${siteInfo.types.join(' & ')} Support`,
                    'High Quality Downloads',
                    'No Software Required',
                    'Cross-Platform Compatible',
                    'Free and Fast'
                ],
                faqs: [
                    {
                        question: `How to download from ${siteInfo.name}?`,
                        answer: 'Copy the URL from the platform, paste it above, analyze, and download your preferred format.'
                    },
                    {
                        question: 'Is it safe to use?',
                        answer: 'Yes, our downloader is safe and secure. We don\'t store your downloads or personal information.'
                    },
                    {
                        question: 'What formats are supported?',
                        answer: `We support various formats for ${siteInfo.types.join(', ').toLowerCase()} content depending on what's available.`
                    }
                ]
            };
        }
    };

    const content = getSiteSpecificContent();

    return (
        <div className="max-w-4xl mx-auto">
            {/* Site Header */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                    {siteInfo.favicon ? (
                        <img
                            src={siteInfo.favicon}
                            alt={`${siteInfo.name} favicon`}
                            className="w-12 h-12 mr-4"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className={`w-12 h-12 ${siteInfo.color} rounded-lg flex items-center justify-center mr-4`}>
                            <span className="text-white font-bold text-xl">
                                {siteInfo.name.charAt(0)}
                            </span>
                        </div>
                    )}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {content.title}
                    </h1>
                </div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {content.description}
                </p>
            </div>

            {/* 广告1: 页面顶部 - 728x90横幅广告 */}
            <AdBanner
                adKey={AD_CONFIGS.BANNER_728x90.key}
                width={728}
                height={90}
                className="mb-8"
            />

            {/* Download Interface */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                <div className="space-y-6">
                    {/* URL Input */}
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder={`Enter ${siteInfo.name} URL here...`}
                                className="w-full px-4 py-4 pr-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                            />
                            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                        </div>

                        {isPlaylistUrl(url) && (
                            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                                <List className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm text-blue-800 font-medium">
                                        {t('hero.playlist.detected')}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        {t('hero.playlist.description')}
                                    </p>
                                </div>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={downloadPlaylist}
                                        onChange={(e) => setDownloadPlaylist(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-blue-800 font-medium">
                                        {t('hero.playlist.enable')}
                                    </span>
                                </label>
                            </div>
                        )}

                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading || !url.trim()}
                            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                    <span>{t('hero.analyzing')}</span>
                                </>
                            ) : (
                                <>
                                    <Search className="h-5 w-5" />
                                    <span>{t('hero.analyze')}</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-red-800">{error}</p>
                                {isLoginCookieError(error) && (
                                    <div className="mt-2">
                                        <p className="text-sm text-red-600 mb-2">
                                            {t('hero.loginRequired.description')}
                                        </p>
                                        <a
                                            href={getPlatformLoginUrl(url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center space-x-1 text-sm text-red-700 hover:text-red-800 underline"
                                        >
                                            <span>{t('hero.loginRequired.action')}</span>
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Success Display */}
                    {downloadSuccess && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-green-800">{downloadSuccess}</span>
                        </div>
                    )}

                    {/* Task Status */}
                    {currentTask && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-3 mb-2">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-blue-800">
                                    {t('hero.task.status')}: {currentTask.status}
                                </span>
                            </div>
                            {currentTask.progress && (
                                <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${currentTask.progress}%` }}
                                    />
                                </div>
                            )}
                            <p className="text-sm text-blue-600">
                                {t('hero.task.created')}: {formatSmartTimestampWithUTC(currentTask.createdAt, 'UTC')}
                            </p>
                        </div>
                    )}

                    {/* Media Info and Download Options */}
                    {mediaInfo && (
                        <div className="space-y-6">
                            {/* Media Details */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    {t('hero.mediaInfo.title')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">{t('hero.mediaInfo.title')}:</span>
                                        <p className="text-gray-900 mt-1">{mediaInfo.title}</p>
                                    </div>
                                    {mediaInfo.duration && (
                                        <div>
                                            <span className="font-medium text-gray-700">{t('hero.mediaInfo.duration')}:</span>
                                            <p className="text-gray-900 mt-1">{Math.floor(mediaInfo.duration / 60)}:{(mediaInfo.duration % 60).toString().padStart(2, '0')}</p>
                                        </div>
                                    )}
                                    {mediaInfo.uploader && (
                                        <div>
                                            <span className="font-medium text-gray-700">{t('hero.mediaInfo.uploader')}:</span>
                                            <p className="text-gray-900 mt-1">{mediaInfo.uploader}</p>
                                        </div>
                                    )}
                                    {mediaInfo.upload_date && (
                                        <div>
                                            <span className="font-medium text-gray-700">{t('hero.mediaInfo.uploadDate')}:</span>
                                            <p className="text-gray-900 mt-1">{mediaInfo.upload_date}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Format Selection */}
                            {mediaInfo.formats && mediaInfo.formats.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {t('hero.formats.title')}
                                    </h3>

                                    {/* Format Categories */}
                                    <div className="space-y-3">
                                        {Object.entries(
                                            mediaInfo.formats.reduce((acc: Record<string, any[]>, format) => {
                                                const category = format.format_id === 'audio-only' ? 'audio' : 'video';
                                                if (!acc[category]) acc[category] = [];
                                                acc[category].push(format);
                                                return acc;
                                            }, {})
                                        ).map(([category, formats]) => (
                                            <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => toggleCategoryExpansion(category)}
                                                    className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        {category === 'video' ? (
                                                            <Video className="h-5 w-5 text-blue-600" />
                                                        ) : (
                                                            <Music className="h-5 w-5 text-green-600" />
                                                        )}
                                                        <span className="font-medium text-gray-900 capitalize">
                                                            {category} ({formats.length})
                                                        </span>
                                                    </div>
                                                    {expandedCategories[category] ? (
                                                        <ChevronUp className="h-5 w-5 text-gray-500" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5 text-gray-500" />
                                                    )}
                                                </button>

                                                {expandedCategories[category] && (
                                                    <div className="max-h-64 overflow-y-auto">
                                                        {formats.slice(0, 10).map((format: any, index: number) => (
                                                            <label
                                                                key={format.format_id || index}
                                                                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-t border-gray-100"
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="format"
                                                                    value={format.format_id || ''}
                                                                    checked={selectedFormat === format.format_id}
                                                                    onChange={() => setSelectedFormat(format.format_id || '')}
                                                                    className="mr-3 text-blue-600 focus:ring-blue-500"
                                                                />
                                                                <div className="flex items-center space-x-3 flex-1">
                                                                    {getFormatIcon(format)}
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center space-x-2">
                                                                            <span className="font-medium text-gray-900">
                                                                                {format.format_note || format.quality || format.format_id}
                                                                            </span>
                                                                            {format.fps && (
                                                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                                                    {format.fps}fps
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-sm text-gray-600 space-x-2">
                                                                            {format.ext && <span>{format.ext.toUpperCase()}</span>}
                                                                            {format.filesize && <span>• {formatFileSize(format.filesize)}</span>}
                                                                            {format.vcodec && format.vcodec !== 'none' && <span>• {format.vcodec}</span>}
                                                                            {format.acodec && format.acodec !== 'none' && <span>• {format.acodec}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Download Button */}
                                    <button
                                        onClick={handleDownload}
                                        disabled={isSubmitting || !selectedFormat}
                                        className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <RefreshCw className="h-5 w-5 animate-spin" />
                                                <span>{t('hero.downloading')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download className="h-5 w-5" />
                                                <span>{t('hero.download')}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Features & Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 广告2: 下载界面后 - 300x250中矩形广告.. */}
            <AdBanner
                adKey={AD_CONFIGS.BANNER_300x250.key}
                width={300}
                height={250}
                className="mb-8"
            />

            {/* How To Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    How to Download from {siteInfo.name}
                </h2>
                <div className="space-y-4">
                    {content.howToSteps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                                {index + 1}
                            </div>
                            <p className="text-gray-700 pt-1">{step}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 广告3: How To Section后 - 原生广告 */}
            <NativeAdBanner
                adKey={AD_CONFIGS.NATIVE_BANNER.key}
                className="mb-8"
            />

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <HelpCircle className="h-6 w-6 mr-2" />
                    Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                    {content.faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {faq.question}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 广告4: 页面底部 - 468x60横幅广告 */}
            <AdBanner
                adKey={AD_CONFIGS.BANNER_468x60.key}
                width={468}
                height={60}
                className="mb-8"
            />
        </div>
    );
}
