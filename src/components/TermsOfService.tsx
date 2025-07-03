import React from 'react';
import { FileText, Mail, Clock, Scale, Shield, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TermsOfService() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
                            <FileText className="h-12 w-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Please read these terms carefully before using our service.
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
                                Welcome to <strong>MediaGet</strong>. By accessing or using our service, you agree to be bound by these Terms of Service.
                                If you disagree with any part of the terms, then you may not access the service.
                            </p>
                            <p className="text-gray-700 mt-4">
                                By using MediaGet, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                            </p>
                        </section>

                        {/* 1. Acceptance of Terms */}
                        <section>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                            </div>
                            <p className="text-gray-700">
                                By accessing or using MediaGet, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                                If you do not agree with any of these terms, you are prohibited from using or accessing this service.
                            </p>
                        </section>

                        {/* 2. Use License */}
                        <section>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <Scale className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">2. Use License</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                Permission is granted to temporarily download one copy of the materials (information or software) on MediaGet's website
                                for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
                                and under this license you may not:
                            </p>

                            <ul className="space-y-2 text-gray-700 mb-4">
                                <li className="flex items-start space-x-2">
                                    <span className="text-red-600 mt-1">•</span>
                                    <span>Modify or copy the materials</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-red-600 mt-1">•</span>
                                    <span>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial)</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-red-600 mt-1">•</span>
                                    <span>Attempt to decompile or reverse engineer any software contained on MediaGet's website</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-red-600 mt-1">•</span>
                                    <span>Remove any copyright or other proprietary notations from the materials</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-red-600 mt-1">•</span>
                                    <span>Transfer the materials to another person or "mirror" the materials on any other server</span>
                                </li>
                            </ul>

                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <p className="text-yellow-800">
                                    This license shall automatically terminate if you violate any of these restrictions and may be terminated by
                                    MediaGet at any time. Upon terminating your viewing of these materials or upon the termination of this license,
                                    you must destroy any downloaded materials in your possession whether in electronic or printed format.
                                </p>
                            </div>
                        </section>

                        {/* 3. Disclaimer */}
                        <section>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">3. Disclaimer</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                The materials on MediaGet's website are provided on an 'as is' basis. MediaGet makes no warranties, expressed or implied,
                                and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of
                                merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                            <p className="text-gray-700">
                                Further, MediaGet does not warrant or make any representations concerning the accuracy, likely results, or reliability
                                of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
                            </p>
                        </section>

                        {/* 4. Limitations */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitations</h2>
                            <p className="text-gray-700 mb-4">
                                In no event shall MediaGet or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                                or due to business interruption) arising out of the use or inability to use the materials on MediaGet's website,
                                even if MediaGet or a MediaGet authorized representative has been notified orally or in writing of the possibility of such damage.
                            </p>
                            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                <p className="text-red-800">
                                    Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential
                                    or incidental damages, these limitations may not apply to you.
                                </p>
                            </div>
                        </section>

                        {/* 5. Accuracy of Materials */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Accuracy of Materials</h2>
                            <p className="text-gray-700">
                                The materials appearing on MediaGet's website could include technical, typographical, or photographic errors.
                                MediaGet does not warrant that any of the materials on its website are accurate, complete, or current.
                                MediaGet may make changes to the materials contained on its website at any time without notice.
                                However, MediaGet does not make any commitment to update the materials.
                            </p>
                        </section>

                        {/* 6. Links */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Links</h2>
                            <p className="text-gray-700">
                                MediaGet has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site.
                                The inclusion of any link does not imply endorsement by MediaGet of the site. Use of any such linked website is at the user's own risk.
                            </p>
                        </section>

                        {/* 7. Modifications */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modifications</h2>
                            <p className="text-gray-700">
                                MediaGet may revise these terms of service for its website at any time without notice.
                                By using this website, you are agreeing to be bound by the then current version of these terms of service.
                            </p>
                        </section>

                        {/* 8. Governing Law */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
                            <p className="text-gray-700">
                                These terms and conditions are governed by and construed in accordance with the laws of the United States
                                and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                            </p>
                        </section>

                        {/* 9. Intellectual Property */}
                        <section>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <Shield className="h-6 w-6 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">9. Intellectual Property</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                MediaGet respects the intellectual property rights of others and expects its users to do the same.
                                We respond to notices of alleged copyright infringement as required by applicable law.
                            </p>

                            <p className="text-gray-700 mb-4">
                                If you believe that your work has been copied in a way that constitutes copyright infringement,
                                please provide us with the following information:
                            </p>

                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Identification of the copyrighted work claimed to have been infringed</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Identification of the material that is claimed to be infringing or to be the subject of infringing activity</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Your contact information</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>A statement by you that you have a good faith belief that use of the material is not authorized by the copyright owner</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>A statement that the information in your notification is accurate and that you are authorized to act on behalf of the copyright owner</span>
                                </li>
                            </ul>
                        </section>

                        {/* 10. User Responsibilities */}
                        <section>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <Users className="h-6 w-6 text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">10. User Responsibilities</h2>
                            </div>
                            <p className="text-gray-700 mb-4">As a user of MediaGet, you agree to:</p>

                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-600 mt-1">✓</span>
                                    <span>Use the service only for lawful purposes</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-600 mt-1">✓</span>
                                    <span>Respect the intellectual property rights of content creators</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-600 mt-1">✓</span>
                                    <span>Not use the service to download content that infringes on copyrights or other intellectual property rights</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-600 mt-1">✓</span>
                                    <span>Not use the service for any illegal or unauthorized purpose</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-600 mt-1">✓</span>
                                    <span>Not interfere with or disrupt the service or servers or networks connected to the service</span>
                                </li>
                            </ul>
                        </section>

                        {/* 11. Service Availability */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Service Availability</h2>
                            <p className="text-gray-700">
                                MediaGet strives to provide uninterrupted service, but we do not guarantee that the service will be available at all times.
                                We reserve the right to modify, suspend, or discontinue the service at any time without notice.
                            </p>
                        </section>

                        {/* Contact Us */}
                        <section className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Mail className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">12. Contact Us</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                    <span className="text-gray-700">By email: </span>
                                    <a
                                        href="mailto:support@media-get.com"
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        support@media-get.com
                                    </a>
                                </div>
                                <p className="text-gray-700">• By visiting the contact section on our website</p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <a
                        href="#home"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
