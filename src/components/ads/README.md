/*
广告组件使用示例

1. 导入组件：
import { AdBanner, NativeAdBanner, AD_CONFIGS } from './components/ads';

2. 使用 AdBanner（横幅广告）：
// 728x90 横幅广告（适合页面顶部/底部）
<AdBanner 
  adKey={AD_CONFIGS.BANNER_728x90.key} 
  width={728} 
  height={90} 
/>

// 300x250 中矩形广告（适合内容区域）
<AdBanner 
  adKey={AD_CONFIGS.BANNER_300x250.key} 
  width={300} 
  height={250}
/>

// 468x60 横幅广告（适合移动端）
<AdBanner 
  adKey={AD_CONFIGS.BANNER_468x60.key} 
  width={468} 
  height={60}
/>

// 160x600 摩天楼广告（适合侧边栏）
<AdBanner 
  adKey={AD_CONFIGS.BANNER_160x600.key} 
  width={160} 
  height={600}
/>

// 160x300 中等侧边栏广告
<AdBanner 
  adKey={AD_CONFIGS.BANNER_160x300.key} 
  width={160} 
  height={300}
/>

3. 使用 NativeAdBanner（原生广告）：
<NativeAdBanner 
  adKey={AD_CONFIGS.NATIVE_BANNER.key}
  className="my-8 shadow-md"
/>

4. 实际的广告配置（已配置完成）：

export const AD_CONFIGS = {
  BANNER_728x90: {
    key: '21b4e791e8fc157267b7fb8db77406e7',
    width: 728, height: 90
  },
  BANNER_300x250: {
    key: '2dbd7652ab816ca9c51b9d98cae0f704',
    width: 300, height: 250
  },
  BANNER_468x60: {
    key: 'cdca1056d09b03ff4385032aa518fc21',
    width: 468, height: 60
  },
  BANNER_160x600: {
    key: 'd9854d6c329ca3c4fecd3ab5e8aba53f',
    width: 160, height: 600
  },
  BANNER_160x300: {
    key: 'fc2f68c052d293d18d3fc10d2689246b',
    width: 160, height: 300
  },
  NATIVE_BANNER: {
    key: 'f6dbbdd7420083a4c4d8b67aed8fd1c9'
  }
};

5. 建议的插入位置：

主页 (HomePage)：
- Hero组件下方：
  <AdBanner adKey={AD_CONFIGS.BANNER_728x90.key} width={728} height={90} />
  
- SupportedSites和Features之间：
  <AdBanner adKey={AD_CONFIGS.BANNER_300x250.key} width={300} height={250} />
  
- 页面底部：
  <AdBanner adKey={AD_CONFIGS.BANNER_468x60.key} width={468} height={60} />

站点下载页面 (SiteDownloadPage)：
- 下载界面上方：
  <AdBanner adKey={AD_CONFIGS.BANNER_300x250.key} width={300} height={250} />
  
- 内容中嵌入：
  <NativeAdBanner adKey={AD_CONFIGS.NATIVE_BANNER.key} />

侧边栏（如果需要）：
- 摩天楼广告：
  <AdBanner adKey={AD_CONFIGS.BANNER_160x600.key} width={160} height={600} />

移动端适配：
组件已自动适配移动端，会根据屏幕尺寸调整广告大小。
*/
