// SEO and Performance optimization utilities

// Image optimization utilities
export const optimizeImages = () => {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
};

// Preload critical resources
export const preloadCriticalResources = () => {
    // Preload important fonts
    const fontLink = document.createElement('link') as HTMLLinkElement;
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.as = 'style';
    fontLink.onload = function () {
        (this as HTMLLinkElement).rel = 'stylesheet';
    };
    document.head.appendChild(fontLink);
};

// Basic performance monitoring
export const monitorPerformance = () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                const paint = performance.getEntriesByType('paint');

                console.log('Performance Metrics:', {
                    DOMContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    LoadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    FirstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
                    FirstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
                });
            }, 0);
        });
    }
};

// Service Worker for caching
export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
};

// Initialize all SEO optimizations
export const initSEOOptimizations = () => {
    optimizeImages();
    preloadCriticalResources();
    monitorPerformance();
    // registerServiceWorker(); // Uncomment when you have a service worker
};
