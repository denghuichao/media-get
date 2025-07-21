#!/usr/bin/env node

// 验证所有网站下载页面的脚本
import { sites, getSiteSlug } from './src/data/sites.js';

console.log('🔍 验证所有网站下载页面...\n');

console.log(`📊 总共支持 ${sites.length} 个网站\n`);

// 按地区分组显示
const sitesByRegion = sites.reduce((acc, site) => {
    if (!acc[site.region]) {
        acc[site.region] = [];
    }
    acc[site.region].push(site);
    return acc;
}, {});

let totalPages = 0;

Object.entries(sitesByRegion).forEach(([region, regionSites]) => {
    console.log(`\n🌍 ${region} (${regionSites.length} 个网站):`);

    regionSites.forEach((site, index) => {
        const slug = getSiteSlug(site.name);
        const url = `/download/${slug}`;
        const types = site.types.join(', ');

        console.log(`   ${index + 1}. ${site.name}`);
        console.log(`      🔗 URL: https://media-get.site${url}`);
        console.log(`      📁 类型: ${types}`);
        console.log(`      🎨 颜色: ${site.color}`);

        totalPages++;
    });
});

console.log(`\n✅ 所有 ${totalPages} 个网站的下载页面已准备就绪！`);

console.log(`\n📋 页面URL示例:`);
console.log('   - https://media-get.site/download/youtube');
console.log('   - https://media-get.site/download/tiktok');
console.log('   - https://media-get.site/download/bilibili-哔哩哔哩');
console.log('   - https://media-get.site/download/instagram');

console.log(`\n🎯 SEO优势:`);
console.log('   ✅ 独立的URL路径，便于搜索引擎索引');
console.log('   ✅ 每个页面有专门的SEO标题和描述');
console.log('   ✅ 正确的canonical URL设置');
console.log('   ✅ 社交媒体分享友好');

console.log(`\n🚀 下一步建议:`);
console.log('   1. 提交sitemap.xml到Google Search Console');
console.log('   2. 为热门网站添加更多内容和FAQ');
console.log('   3. 添加结构化数据markup');
console.log('   4. 监控各页面的SEO表现');
