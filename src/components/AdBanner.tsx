import { useEffect, useRef, useState, useMemo } from 'react';
import { getResponsiveAdSize } from '../configs/adConfigs';

interface AdBannerProps {
    adKey: string;
    width?: number;
    height?: number;
    className?: string;
    responsive?: boolean;
    delay?: number;
}

export default function AdBanner({
    adKey,
    width = 320,
    height = 50,
    className = '',
    responsive = true,
    delay = 0
}: AdBannerProps): JSX.Element | null {
    const banner = useRef<HTMLDivElement>(null);
    const [adSize, setAdSize] = useState({ width, height });

    useEffect(() => {
        if (responsive) {
            const size = getResponsiveAdSize(width, height);
            setAdSize(size);
        } else {
            setAdSize({ width, height });
        }
    }, [width, height, responsive]);

    // 使用 useMemo 缓存 atOptions 对象
    const atOptions = useMemo(() => ({
        key: adKey,
        format: 'iframe',
        height: adSize.height,
        width: adSize.width,
        params: {},
    }), [adKey, adSize.height, adSize.width]);

    useEffect(() => {
        if (banner.current && !banner.current.firstChild && adKey && adSize.width && adSize.height) {
            const loadAd = () => {
                if (!banner.current) return;

                // 创建配置脚本
                const conf = document.createElement('script');
                conf.type = 'text/javascript';
                conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

                // 创建广告脚本
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;

                banner.current.append(conf);
                banner.current.append(script);
            };

            if (delay > 0) {
                setTimeout(loadAd, delay);
            } else {
                loadAd();
            }
        }
    }, [banner, atOptions, adKey, adSize, delay]);

    // 如果没有提供adKey，不渲染广告
    if (!adKey) {
        return null;
    }

    return (
        <div
            className={`mx-auto my-4 flex justify-center items-center ${className}`}
            style={{
                minHeight: adSize.height,
                maxWidth: adSize.width,
            }}
        >
            <div
                className="border border-gray-200 rounded bg-gray-50 flex justify-center items-center relative"
                ref={banner}
                style={{
                    width: adSize.width,
                    height: adSize.height,
                }}
            >
            </div>
        </div>
    );
}
