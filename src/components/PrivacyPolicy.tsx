import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Clock, Database, Lock, Users, FileText, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
                            <Shield className="h-12 w-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your privacy is important to us. Learn how we collect, use, and protect your data.
                    </p>
                    <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Last Updated: June 30, 2025</span>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 space-y-8">

                        {/* Introduction */}
                        <section>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                At <strong>MediaGet</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service to download videos and media content from various platforms.
                            </p>
                            <p className="text-gray-700 mt-4">
                                By using MediaGet, you agree to the collection and use of information in accordance with this policy.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <Database className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                            </div>
                            <p className="text-gray-700 mb-4">We collect minimal information to provide and improve our service:</p>

                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-2">Usage Data</h3>
                                    <p className="text-gray-700">
                                        We collect information about how you use our service, including the URLs you input for downloading,
                                        the time and date of your requests, and your IP address.
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-2">Device Information</h3>
                                    <p className="text-gray-700">
                                        We may collect information about your device, including browser type, operating system,
                                        and screen resolution through our client-side fingerprinting system.
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-2">Anonymous User Identification</h3>
                                    <p className="text-gray-700">
                                        We generate an anonymous user ID based on your browser fingerprint to manage your download history.
                                        This does not contain any personally identifiable information.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* How We Use Your Information */}
                        <section>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <Eye className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
                            </div>
                            <p className="text-gray-700 mb-4">We use the information we collect for the following purposes:</p>

                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>To provide and maintain our service</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>To detect, prevent, and address technical issues</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>To improve our service and user experience</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>To monitor the usage of our service</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>To manage your download history using anonymous identifiers</span>
                                </li>
                            </ul>
                        </section>

                        {/* Data Storage and Security */}
                        <section>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <Lock className="h-6 w-6 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Data Storage and Security</h2>
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                                <p className="text-blue-800 font-medium">
                                    🔒 We implement appropriate security measures to protect your information.
                                </p>
                            </div>

                            <p className="text-gray-700 mb-4">
                                However, no method of transmission over the Internet or electronic storage is 100% secure.
                                While we strive to use commercially acceptable means to protect your information,
                                we cannot guarantee its absolute security.
                            </p>

                            <div className="bg-green-50 border-l-4 border-green-400 p-4">
                                <p className="text-green-800 font-medium">
                                    ✅ We do not store the content you download. All processing is done in real-time,
                                    and we do not keep copies of the videos or media you download.
                                </p>
                            </div>
                        </section>

                        {/* Third-Party Services */}
                        <section>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <Users className="h-6 w-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Third-Party Services</h2>
                            </div>
                            <p className="text-gray-700">
                                We may employ third-party companies and individuals to facilitate our service, provide service-related services,
                                or assist us in analyzing how our service is used. These third parties have access to your information only to
                                perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                            </p>
                        </section>

                        {/* AdSense and Advertising */}
                        <section>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-yellow-100 p-2 rounded-lg">
                                    <Eye className="h-6 w-6 text-yellow-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Advertising and Cookies</h2>
                            </div>
                            <div className="space-y-4">
                                <p className="text-gray-700">
                                    MediaGet uses Google AdSense to display advertisements. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites.
                                </p>

                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                                    <h3 className="font-semibold text-blue-800 mb-2">Google AdSense</h3>
                                    <ul className="text-blue-700 space-y-1 text-sm">
                                        <li>• Google uses cookies to serve ads based on your interests</li>
                                        <li>• You can opt out of personalized advertising by visiting Google's Ads Settings</li>
                                        <li>• Third-party vendors may also use cookies to serve ads</li>
                                        <li>• We do not control these third-party cookies</li>
                                    </ul>
                                </div>

                                <p className="text-gray-700">
                                    You may opt out of personalized advertising by visiting{' '}
                                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline">
                                        Google's Ads Settings
                                    </a>{' '}
                                    or by visiting{' '}
                                    <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline">
                                        aboutads.info
                                    </a>.
                                </p>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Cookie Usage</h4>
                                    <p className="text-gray-700 text-sm">
                                        Our website uses cookies for advertising purposes and to improve user experience.
                                        By continuing to use our site, you consent to the use of cookies in accordance with our cookie policy.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Data Retention */}
                        <section>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <FileText className="h-6 w-6 text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Data Retention</h2>
                            </div>
                            <p className="text-gray-700">
                                We will retain your information only for as long as is necessary for the purposes set out in this Privacy Policy.
                                We will retain and use your information to the extent necessary to comply with our legal obligations,
                                resolve disputes, and enforce our policies.
                            </p>
                        </section>

                        {/* Your Data Protection Rights */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Data Protection Rights</h2>
                            <p className="text-gray-700 mb-4">Depending on your location, you may have certain data protection rights, including:</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">• The right to access, update, or delete the information we have on you</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">• The right of rectification</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">• The right to object</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">• The right of restriction</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">• The right to data portability</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">• The right to withdraw consent</p>
                                </div>
                            </div>
                        </section>

                        {/* Children's Privacy */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                            <p className="text-gray-700">
                                Our service is not intended for use by children under the age of 13. We do not knowingly collect
                                personally identifiable information from children under 13. If you are a parent or guardian and you are
                                aware that your child has provided us with personal information, please contact us.
                            </p>
                        </section>

                        {/* Changes to This Privacy Policy */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
                            <p className="text-gray-700 mb-4">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                                Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
                            </p>
                            <p className="text-gray-700">
                                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
                                are effective when they are posted on this page.
                            </p>
                        </section>

                        {/* Contact Us */}
                        <section className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Mail className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                    <span className="text-gray-700">By email: </span>
                                    <a
                                        href="mailto:denghuichao90@gmail.com"
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        denghuichao90@gmail.com
                                    </a>
                                </div>
                                <p className="text-gray-700">• By visiting the contact section on our website</p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
