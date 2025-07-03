import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function ComplianceBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-3" />
                    <div>
                        <p className="text-orange-800 font-medium">
                            Copyright Notice:
                        </p>
                        <p className="text-orange-700 text-sm">
                            Only download content you own or have permission to use. Respect copyright laws and platform terms of service.{' '}
                            <a href="#disclaimer" className="underline hover:text-orange-900">
                                Learn more
                            </a>
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-orange-500 hover:text-orange-700 p-1"
                    aria-label="Dismiss notice"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
