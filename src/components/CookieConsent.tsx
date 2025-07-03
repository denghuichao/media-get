import { Cookie, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const hasConsented = localStorage.getItem('cookieConsent');
        if (!hasConsented) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setIsVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem('cookieConsent', 'rejected');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-2xl">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3 flex-1">
                        <Cookie className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold mb-1">Cookie Consent</h3>
                            <p className="text-gray-300 text-sm">
                                We use cookies to enhance your experience and show personalized ads through Google AdSense.
                                By continuing to use our site, you consent to our use of cookies.{' '}
                                <a href="#privacy" className="text-blue-400 hover:text-blue-300 underline">
                                    Learn more
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                        <button
                            onClick={handleReject}
                            className="px-4 py-2 text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:border-gray-500 transition-colors text-sm"
                        >
                            Reject
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            Accept All
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
