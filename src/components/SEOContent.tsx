import React from 'react';
import { CheckCircle, Star, Users, Globe, Shield, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SEOContent() {
    const { t } = useTranslation();

    const stats = [
        { icon: <Users className="h-6 w-6" />, number: "2M+", label: "Active Users" },
        { icon: <CheckCircle className="h-6 w-6" />, number: "500+", label: "Supported Platforms" },
        { icon: <Globe className="h-6 w-6" />, number: "150+", label: "Countries Served" },
        { icon: <Star className="h-6 w-6" />, number: "4.8/5", label: "User Rating" }
    ];

    const useCases = [
        {
            title: "Content Creators",
            description: "Download your own content for backup, editing, or cross-platform sharing.",
            benefits: ["Backup your content", "Edit downloaded videos", "Cross-platform sharing"]
        },
        {
            title: "Educators",
            description: "Save educational videos for offline teaching and reference materials.",
            benefits: ["Offline access", "Educational resources", "Classroom presentations"]
        },
        {
            title: "Researchers",
            description: "Archive social media content and videos for academic research.",
            benefits: ["Data preservation", "Research materials", "Academic studies"]
        },
        {
            title: "Personal Use",
            description: "Keep your favorite videos, music, and images for offline enjoyment.",
            benefits: ["Offline entertainment", "Personal collection", "Data portability"]
        }
    ];

    const platforms = [
        "YouTube", "Instagram", "TikTok", "Twitter/X", "Facebook", "Vimeo", "Pinterest",
        "LinkedIn", "Reddit", "Tumblr", "Dailymotion", "SoundCloud", "Bandcamp", "Flickr",
        "Twitch", "YouTube Music", "Spotify", "Apple Music", "Telegram", "WhatsApp"
    ];

    return (
        <div className="py-16 bg-gray-50">
            {/* Stats Section */}
            <section className="mb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Trusted by Millions Worldwide
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            MediaGet has become the go-to solution for media downloading, serving users across the globe with reliable, fast, and secure downloads.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="mb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Perfect for Every Use Case
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Whether you're a content creator, educator, researcher, or just want to save your favorite media, MediaGet has you covered.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {useCases.map((useCase, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                                <p className="text-gray-600 mb-4">{useCase.description}</p>
                                <ul className="space-y-2">
                                    {useCase.benefits.map((benefit, benefitIndex) => (
                                        <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platform Coverage Section */}
            <section className="mb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Comprehensive Platform Support
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Download from over 500 platforms including all major social media sites, streaming services, and content platforms.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Popular Platforms</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {platforms.map((platform, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                >
                                    {platform}
                                </span>
                            ))}
                            <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                +480 more platforms
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Highlight */}
            <section className="mb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Why Choose MediaGet?
                            </h2>
                            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                                Experience the fastest, most reliable, and secure way to download media from your favorite platforms.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-lg mb-4">
                                    <Zap className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                                <p className="text-blue-100">
                                    Powered by yt-dlp technology for maximum speed and efficiency. Download multiple files simultaneously.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-lg mb-4">
                                    <Shield className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Privacy First</h3>
                                <p className="text-blue-100">
                                    No registration required. No data stored. Your downloads are completely private and secure.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-lg mb-4">
                                    <Globe className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Universal Access</h3>
                                <p className="text-blue-100">
                                    Works on any device with a web browser. No software installation required. Available worldwide.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-gray-600">
                            Everything you need to know about using MediaGet
                        </p>
                    </div>

                    <div className="space-y-6">
                        <details className="bg-white rounded-lg p-6 shadow-sm">
                            <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
                                Is MediaGet free to use?
                            </summary>
                            <p className="mt-4 text-gray-600">
                                Yes, MediaGet is completely free to use. There are no hidden charges, subscription fees, or premium features.
                                You can download unlimited content from over 500 platforms without any cost.
                            </p>
                        </details>

                        <details className="bg-white rounded-lg p-6 shadow-sm">
                            <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
                                Do I need to create an account or register?
                            </summary>
                            <p className="mt-4 text-gray-600">
                                No registration is required. MediaGet works completely anonymously. Simply paste your URL and start downloading
                                immediately. We don't store any personal information or download history.
                            </p>
                        </details>

                        <details className="bg-white rounded-lg p-6 shadow-sm">
                            <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
                                What video and audio quality options are available?
                            </summary>
                            <p className="mt-4 text-gray-600">
                                MediaGet supports multiple quality options including 4K, 1080p, 720p, 480p for videos, and various bitrates
                                for audio files. You can choose the format and quality that best suits your needs, including MP4, MP3, WebM, and more.
                            </p>
                        </details>

                        <details className="bg-white rounded-lg p-6 shadow-sm">
                            <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
                                Can I download entire playlists or multiple videos at once?
                            </summary>
                            <p className="mt-4 text-gray-600">
                                Yes, MediaGet supports playlist downloads from platforms like YouTube, allowing you to download multiple videos
                                with a single URL. You can also queue multiple individual downloads simultaneously.
                            </p>
                        </details>

                        <details className="bg-white rounded-lg p-6 shadow-sm">
                            <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
                                Is it legal to download videos and audio from these platforms?
                            </summary>
                            <p className="mt-4 text-gray-600">
                                MediaGet is a tool that facilitates downloading publicly available content. Users are responsible for ensuring
                                their downloads comply with the terms of service of the respective platforms and applicable copyright laws.
                                We recommend downloading only content you own or have permission to download.
                            </p>
                        </details>
                    </div>
                </div>
            </section>
        </div>
    );
}
