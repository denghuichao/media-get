// Adsterra 广告位配置
export const AD_CONFIGS = {
    // Banner 广告位 (5个)
    BANNER_728x90: {
        key: '21b4e791e8fc157267b7fb8db77406e7',
        width: 728,
        height: 90,
        description: 'Hero区域下方横幅广告 (728x90)'
    },
    BANNER_300x250: {
        key: '2dbd7652ab816ca9c51b9d98cae0f704',
        width: 300,
        height: 250,
        description: '支持网站和功能之间的中矩形广告 (300x250)'
    },
    BANNER_468x60: {
        key: 'cdca1056d09b03ff4385032aa518fc21',
        width: 468,
        height: 60,
        description: '移动端横幅广告 (468x60)'
    },
    BANNER_160x600: {
        key: 'd9854d6c329ca3c4fecd3ab5e8aba53f',
        width: 160,
        height: 600,
        description: '侧边栏摩天楼广告 (160x600)'
    },
    BANNER_160x300: {
        key: 'fc2f68c052d293d18d3fc10d2689246b',
        width: 160,
        height: 300,
        description: '侧边栏中等广告 (160x300)'
    },

    // Native 广告位 (1个)
    NATIVE_BANNER: {
        key: 'f6dbbdd7420083a4c4d8b67aed8fd1c9',
        description: '原生广告，嵌入在内容中'
    }
};

// 响应式广告尺寸工具函数
export const getResponsiveAdSize = (defaultWidth: number, defaultHeight: number) => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        // 移动端使用较小的尺寸
        if (defaultWidth === 728) return { width: 320, height: 50 };
        if (defaultWidth === 300) return { width: 300, height: 250 };
    }

    return { width: defaultWidth, height: defaultHeight };
};
