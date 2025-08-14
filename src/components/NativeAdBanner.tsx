import { useEffect, useRef } from 'react';

interface NativeAdBannerProps {
    adKey: string;
    className?: string;
}

export default function NativeAdBanner({
    adKey,
    className = ''
}: NativeAdBannerProps): JSX.Element | null {
    const banner = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (banner.current && !banner.current.firstChild && adKey) {
            // 创建异步脚本
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.setAttribute('data-cfasync', 'false');
            script.src = `//pl27408886.profitableratecpm.com/${adKey}/invoke.js`;

            // 创建容器div
            const container = document.createElement('div');
            container.id = `container-${adKey}`;

            // 添加到banner容器中
            banner.current.append(script);
            banner.current.append(container);
        }
    }, [banner, adKey]);

    // 如果没有提供adKey，不渲染广告
    if (!adKey) {
        return null;
    }

    return (
        <div className={`mx-auto my-6 max-w-4xl ${className}`}>
            <div
                className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 min-h-[200px] flex justify-center items-center relative"
                ref={banner}
            >
            </div>
        </div>
    );
}
