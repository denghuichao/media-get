import { BookOpen, Users, Award, Shield, Clock, Zap } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

export default function AboutAndQuality() {
    const { config } = useConfig();
    const downloadTool = config?.downloadTool || 'yt-dlp';
    const toolDisplayName = downloadTool === 'yt-dlp' ? 'yt-dlp' : 'you-get';
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-2xl">
                            <BookOpen className="h-12 w-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">About MediaGet</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your trusted partner for ethical media downloading and content backup solutions
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 space-y-8">

                        {/* Mission Statement */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                MediaGet was created to provide a reliable, ethical, and user-friendly solution for downloading and backing up digital content.
                                We believe in respecting content creators' rights while helping users preserve their own content and access materials for legitimate purposes.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <Shield className="h-6 w-6 text-blue-600" />
                                        <h3 className="font-semibold text-gray-900">Ethical Approach</h3>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        We promote responsible use of our service and respect for intellectual property rights.
                                    </p>
                                </div>

                                <div className="bg-green-50 p-6 rounded-lg">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <Users className="h-6 w-6 text-green-600" />
                                        <h3 className="font-semibold text-gray-900">User-Focused</h3>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        Designed with user privacy, security, and ease of use as our top priorities.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Key Features and Benefits */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose MediaGet?</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center p-6">
                                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Zap className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                                    <p className="text-gray-700 text-sm">
                                        Advanced download algorithms ensure quick and efficient processing of your media requests.
                                    </p>
                                </div>

                                <div className="text-center p-6">
                                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Shield className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
                                    <p className="text-gray-700 text-sm">
                                        We don't store your downloaded content and use anonymous user tracking for enhanced privacy.
                                    </p>
                                </div>

                                <div className="text-center p-6">
                                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Award className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Quality Focused</h3>
                                    <p className="text-gray-700 text-sm">
                                        Support for multiple quality options and formats to meet your specific needs.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Educational Content */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Educational Resources</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-3">Best Practices for Media Downloading</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span>Always verify you have the right to download and use content</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span>Respect copyright laws and platform terms of service</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span>Use downloads for personal, educational, or fair use purposes</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span>Consider supporting content creators through official channels</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Technical Information */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Excellence</h2>
                            <p className="text-gray-700 mb-4">
                                MediaGet is built on robust, modern technology stack ensuring reliability and performance:
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Backend Technology</h3>
                                    <ul className="text-gray-700 space-y-1 text-sm">
                                        <li>• Powered by {toolDisplayName} - industry-leading extraction library</li>
                                        <li>• Asynchronous processing for improved performance</li>
                                        <li>• Secure server infrastructure with HTTPS</li>
                                        <li>• Regular updates and security patches</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">User Experience</h3>
                                    <ul className="text-gray-700 space-y-1 text-sm">
                                        <li>• Responsive design for all devices</li>
                                        <li>• Multi-language support</li>
                                        <li>• Real-time download progress tracking</li>
                                        <li>• Clean, intuitive user interface</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Community and Support */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Community & Support</h2>
                            <p className="text-gray-700 mb-4">
                                We're committed to providing excellent support and building a responsible user community:
                            </p>

                            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Clock className="h-6 w-6 text-blue-600" />
                                    <h3 className="font-semibold text-blue-900">24/7 Support</h3>
                                </div>
                                <p className="text-blue-800 text-sm mb-3">
                                    Our support team is available around the clock to help with technical issues and questions.
                                </p>
                                <p className="text-blue-700 text-sm">
                                    <strong>Contact:</strong> support@media-get.com |
                                    <strong> Response Time:</strong> Within 24 hours
                                </p>
                            </div>
                        </section>

                        {/* Future Development */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Continuous Improvement</h2>
                            <p className="text-gray-700 mb-4">
                                We're constantly working to improve MediaGet with new features and platform support:
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg text-center">
                                    <p className="font-medium text-gray-900">100+</p>
                                    <p className="text-gray-600 text-sm">Supported Platforms</p>
                                </div>
                                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg text-center">
                                    <p className="font-medium text-gray-900">99.9%</p>
                                    <p className="text-gray-600 text-sm">Uptime Reliability</p>
                                </div>
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg text-center">
                                    <p className="font-medium text-gray-900">24/7</p>
                                    <p className="text-gray-600 text-sm">Service Availability</p>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
