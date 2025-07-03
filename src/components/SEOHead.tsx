import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    noIndex?: boolean;
}

export default function SEOHead({
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    noIndex = false
}: SEOHeadProps) {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        // Update document title
        const fullTitle = title
            ? `${title} | MediaGet`
            : t('seo.defaultTitle');
        document.title = fullTitle;

        // Update meta description
        const metaDescription = description || t('seo.defaultDescription');
        updateMetaTag('description', metaDescription);

        // Update meta keywords
        const metaKeywords = keywords || t('seo.defaultKeywords');
        updateMetaTag('keywords', metaKeywords);

        // Update language
        document.documentElement.lang = i18n.language;

        // Update Open Graph tags
        updateMetaProperty('og:title', fullTitle);
        updateMetaProperty('og:description', metaDescription);
        updateMetaProperty('og:locale', i18n.language === 'zh' ? 'zh_CN' : 'en_US');

        if (ogImage) {
            updateMetaProperty('og:image', ogImage);
        }

        // Update Twitter Card tags
        updateMetaProperty('twitter:title', fullTitle);
        updateMetaProperty('twitter:description', metaDescription);

        // Update canonical URL
        if (canonicalUrl) {
            updateCanonicalUrl(canonicalUrl);
        }

        // Update robots meta tag
        const robotsContent = noIndex ? 'noindex, nofollow' : 'index, follow';
        updateMetaTag('robots', robotsContent);

    }, [title, description, keywords, canonicalUrl, ogImage, noIndex, t, i18n.language]);

    return null;
}

function updateMetaTag(name: string, content: string) {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
    }
    meta.content = content;
}

function updateMetaProperty(property: string, content: string) {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
    }
    meta.content = content;
}

function updateCanonicalUrl(url: string) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = url;
}
