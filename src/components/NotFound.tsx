import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from './SEOHead';

const NotFound: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <SEOHead
                title="Page Not Found - 404"
                description="Sorry, the page you are looking for does not exist. Return to MediaGet homepage or explore our media downloader features."
                noIndex={true}
            />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-md w-full text-center px-4">
                    <div className="mb-8">
                        <h1 className="text-9xl font-bold text-blue-600">404</h1>
                        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                            {t('404.title', 'Page Not Found')}
                        </h2>
                        <p className="text-gray-600 mt-2">
                            {t('404.description', 'Sorry, the page you are looking for does not exist.')}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            to="/"
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            {t('404.goHome', 'Go to Homepage')}
                        </Link>

                        <Link
                            to="/dashboard"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            {t('404.goDashboard', 'Try Dashboard')}
                        </Link>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            {t('404.popularPages', 'Popular Pages')}
                        </h3>
                        <div className="space-y-2 text-sm">
                            <Link to="/download/youtube" className="block text-blue-600 hover:text-blue-700">
                                {t('404.youtubeDownloader', 'YouTube Downloader')}
                            </Link>
                            <Link to="/download/instagram" className="block text-blue-600 hover:text-blue-700">
                                {t('404.instagramDownloader', 'Instagram Downloader')}
                            </Link>
                            <Link to="/download/tiktok" className="block text-blue-600 hover:text-blue-700">
                                {t('404.tiktokDownloader', 'TikTok Downloader')}
                            </Link>
                            <Link to="/blogs" className="block text-blue-600 hover:text-blue-700">
                                {t('404.blogs', 'Tech Blogs')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFound;
