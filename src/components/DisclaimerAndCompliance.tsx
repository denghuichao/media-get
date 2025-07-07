import { AlertTriangle, Info, Shield } from 'lucide-react';

export default function DisclaimerAndCompliance() {

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-2xl">
                            <AlertTriangle className="h-12 w-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Disclaimer & Legal Notice</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Important information about the use of MediaGet and content downloading
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 space-y-8">

                        {/* Content Responsibility Disclaimer */}
                        <section>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-red-100 p-2 rounded-lg">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Content Responsibility</h2>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                                <p className="text-red-800 font-semibold mb-3">⚠️ IMPORTANT COPYRIGHT NOTICE</p>
                                <p className="text-red-700 mb-4">
                                    MediaGet is a tool that facilitates downloading publicly available content. <strong>Users are solely responsible for ensuring they have the right to download and use any content.</strong>
                                </p>
                                <ul className="list-disc list-inside text-red-700 space-y-2">
                                    <li>Only download content you own or have permission to download</li>
                                    <li>Respect copyright laws and terms of service of source platforms</li>
                                    <li>MediaGet does not host, store, or distribute any copyrighted content</li>
                                    <li>We do not encourage or support copyright infringement</li>
                                </ul>
                            </div>
                        </section>

                        {/* Educational Purpose */}
                        <section>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <Info className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Educational and Personal Use</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                MediaGet is intended for educational and personal use only. We encourage users to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                                <li>Download content for personal backup purposes</li>
                                <li>Access educational materials for offline learning</li>
                                <li>Save content they have created or own</li>
                                <li>Use downloaded content in compliance with fair use policies</li>
                            </ul>
                        </section>

                        {/* Legal Compliance */}
                        <section>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <Shield className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Legal Compliance</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                We are committed to operating within legal boundaries:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                                <li>We comply with DMCA and international copyright laws</li>
                                <li>We respond promptly to valid takedown requests</li>
                                <li>We do not store or cache downloaded content</li>
                                <li>Users must comply with their local laws and regulations</li>
                            </ul>
                        </section>

                        {/* No Warranty */}
                        <section>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Disclaimer</h3>
                            <p className="text-gray-700 mb-4">
                                MediaGet is provided "as is" without any warranties. We do not guarantee:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                                <li>Continuous availability of the service</li>
                                <li>Accuracy or quality of downloaded content</li>
                                <li>Compatibility with all websites or platforms</li>
                                <li>Freedom from errors or interruptions</li>
                            </ul>
                        </section>

                        {/* Contact for Legal Issues */}
                        <section>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Inquiries</h3>
                            <p className="text-gray-700 mb-4">
                                For legal matters, copyright concerns, or DMCA requests, please contact us:
                            </p>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-gray-800">
                                    <strong>Email:</strong> denghuichao90@gmail.com<br />
                                    <strong>Response Time:</strong> 24-48 hours<br />
                                </p>
                            </div>
                        </section>

                        {/* Age Restriction */}
                        <section>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Age Requirements</h3>
                            <p className="text-gray-700">
                                MediaGet is intended for users aged 13 and above. Users under 18 should have parental supervision and consent when using our service.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
