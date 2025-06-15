import React, { useState } from 'react';
import { Check, Download, Zap, Crown, ArrowRight, Globe, Shield } from 'lucide-react';

interface PricingPlan {
    id: string;
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    popular?: boolean;
    icon: React.ComponentType<any>;
    gradient: string;
    buttonText: string;
    creemProductId?: string;
    downloads: string;
    quality: string;
}

const pricingPlans: PricingPlan[] = [
    {
        id: 'free',
        name: 'Free Plan',
        price: 0,
        period: 'forever',
        description: 'Perfect for casual users who need basic downloading',
        downloads: '5 downloads/day',
        quality: 'Standard quality',
        features: [
            '5 downloads per day',
            'Standard quality (720p)',
            'Basic format options',
            'Community support',
            '50+ supported platforms',
            'No watermarks'
        ],
        icon: Download,
        gradient: 'from-gray-500 to-gray-700',
        buttonText: 'Start Free',
        creemProductId: 'free-plan'
    },
    {
        id: 'lite',
        name: 'Lite Plan',
        price: 9.99,
        period: 'month',
        description: 'For power users who need unlimited high-quality downloads',
        downloads: 'Unlimited downloads',
        quality: 'Up to 4K quality',
        features: [
            'Unlimited downloads',
            'Up to 4K quality (2160p)',
            'All format options (MP4, MP3, WEBM, etc.)',
            'Priority support',
            '100+ supported platforms',
            'Batch downloads',
            'Download history',
            'No ads',
            'Faster download speeds'
        ],
        popular: true,
        icon: Zap,
        gradient: 'from-blue-500 to-purple-600',
        buttonText: 'Subscribe Lite',
        creemProductId: 'pro-plan'
    },
    {
        id: 'pro',
        name: 'Pro Plan',
        price: 29.99,
        period: 'month',
        description: 'For teams and businesses with advanced requirements',
        downloads: 'Unlimited downloads',
        quality: 'Up to 8K quality',
        features: [
            'Everything in Pro',
            'Up to 8K quality',
            'API access',
            'Team management (up to 10 users)',
            'Advanced analytics',
            'Custom integrations',
            'Dedicated support',
            'SLA guarantee',
            'White-label options',
            'Bulk processing'
        ],
        icon: Crown,
        gradient: 'from-purple-600 to-pink-600',
        buttonText: 'Subscribe Pro',
        creemProductId: 'enterprise-plan'
    }
];

function PricingPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleSubscribe = async (plan: PricingPlan) => {
        if (plan.id === 'free') {
            alert('Free plan activated! Start downloading media from 100+ platforms.');
            return;
        }

        setIsLoading(plan.id);

        try {
            // Creem.io integration
            const creemCheckoutUrl = `https://creem.io/checkout`;
            const params = new URLSearchParams({
                product_id: plan.creemProductId || plan.id,
                plan_id: plan.id,
                price: plan.price.toString(),
                currency: 'USD',
                success_url: window.location.origin + '/success',
                cancel_url: window.location.origin,
            });

            window.location.href = `${creemCheckoutUrl}?${params.toString()}`;

        } catch (error) {
            console.error('Error initiating checkout:', error);
            alert('There was an error processing your request. Please try again.');
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="container mx-auto px-6 py-16">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    Choose Your{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Perfect Plan
                    </span>
                </h1>

                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                    Download media from 100+ platforms with the plan that fits your needs.
                    Start free and upgrade anytime.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                {pricingPlans.map((plan) => {
                    const IconComponent = plan.icon;

                    return (
                        <div
                            key={plan.id}
                            className={`relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${plan.popular
                                ? 'border-blue-500 ring-2 ring-blue-500/20'
                                : 'border-gray-200/50'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.gradient} mb-4 shadow-lg`}>
                                    <IconComponent className="h-8 w-8 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                                    <span className="text-gray-500 ml-2">/{plan.period}</span>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3 mb-6">
                                    <div className="text-sm font-medium text-gray-900 mb-1">{plan.downloads}</div>
                                    <div className="text-sm text-gray-600">{plan.quality}</div>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                            <Check className="h-3 w-3 text-green-600" />
                                        </div>
                                        <span className="text-gray-700 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan)}
                                disabled={isLoading === plan.id}
                                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${plan.popular
                                    ? `bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90 shadow-lg hover:shadow-xl`
                                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {isLoading === plan.id ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        {plan.buttonText}
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Features Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-gray-200/50 mb-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose MediaGet?</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Globe className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">100+ Platforms</h3>
                        <p className="text-gray-600">Download from YouTube, TikTok, Instagram, Twitter, and 100+ more platforms</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Zap className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                        <p className="text-gray-600">Optimized download speeds with our advanced infrastructure</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h3>
                        <p className="text-gray-600">No malware, no ads, just clean and secure downloads</p>
                    </div>
                </div>
            </div>

            {/* Trust Section */}
        </div>
    );
}

export default PricingPage;