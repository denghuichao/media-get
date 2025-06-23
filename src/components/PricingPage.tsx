import React, { useState, useEffect } from 'react';
import { Check, Download, Zap, Crown, ArrowRight, Globe, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { apiService, PricingPlan } from '../services/api';
import { useAuth, useUser, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

// 你需要引入图标
function Message({ type, text, onClose }: { type: 'error' | 'success', text: string, onClose: () => void }) {
    return (
        <div
            className={
                `fixed top-6 left-1/2 z-50 transform -translate-x-1/2 min-w-[320px] max-w-[90vw] ` +
                (type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                ) +
                ' rounded-lg p-4 mb-6 shadow-lg'
            }
        >
            <div className="flex items-center space-x-2">
                {type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                <span className={type === 'success' ? 'text-green-700' : 'text-red-700'}>
                    {text}
                </span>
                <button
                    className="ml-auto text-gray-400 hover:text-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

function PricingPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
    const [loadingPlans, setLoadingPlans] = useState<boolean>(true);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    // 拉取所有套餐
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const subscribe = params.get('subscribe');
        console.log('subscribe param:', subscribe); // 调试用
        if (subscribe === 'success') {
            setMessage({ type: 'success', text: 'Subscription successful!' });
        } else if (subscribe === 'fail') {
            setMessage({ type: 'error', text: 'Subscription failed, please try again.' });
        }
        const fetchPlans = async () => {
            try {
                const plans = await apiService.getPricingPlans();
                setPricingPlans(plans);
            } catch (err) {
                setMessage({ type: 'error', text: 'Failed to load pricing plans' });
            } finally {
                setLoadingPlans(false);
            }
        };
        fetchPlans();
    }, []);

    // 发起支付请求
    const handleSubscribe = async (plan: PricingPlan) => {
        if (!isLoaded) return;


        if (plan.price === 0) {
            window.location.href = '/home';
            return;
        }

        setIsLoading(plan.id);

        try {
            const userId = user?.id || '';
            if (!userId) {
                setMessage({ type: 'error', text: 'User info not found, please login.' });
                setIsLoading(null);
                return;
            }
            const res = await apiService.createCheckoutSession(userId, plan.id);
            if (res && res.checkout_url) {
                window.location.href = res.checkout_url;
            } else {
                throw new Error('No checkout_url returned');
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'There was an error processing your request. Please try again.' });
        } finally {
            setIsLoading(null);
        }
    };

    if (loadingPlans) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-16">
            {message && (
                <Message
                    type={message.type}
                    text={message.text}
                    onClose={() => setMessage(null)}
                />
            )}
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
                    // 你可以根据 plan.id 映射到本地 icon/gradient/buttonText
                    let IconComponent = Download;
                    let gradient = 'from-gray-500 to-gray-700';
                    let buttonText = 'Start Free';
                    if (plan.id === 'lite') {
                        IconComponent = Zap;
                        gradient = 'from-blue-500 to-purple-600';
                        buttonText = 'Subscribe Lite';
                    }
                    if (plan.id === 'pro') {
                        IconComponent = Crown;
                        gradient = 'from-purple-600 to-pink-600';
                        buttonText = 'Subscribe Pro';
                    }

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
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${gradient} mb-4 shadow-lg`}>
                                    <IconComponent className="h-8 w-8 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                                    <span className="text-gray-500 ml-2">/{plan.period}</span>
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


                            <>
                                <SignedIn>
                                    <button
                                        onClick={() => handleSubscribe(plan)}
                                        disabled={isLoading === plan.id}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                    >
                                        {isLoading === plan.id ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                        ) : (
                                            <>
                                                {buttonText}
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </SignedIn>
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
                                            Sign in to Subscribe
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                            </>

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
        </div>
    );
}

export default PricingPage;