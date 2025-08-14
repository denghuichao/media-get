import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// Read and parse the sites.ts file manually
const sitesFileContent = readFileSync('./src/data/sites.ts', 'utf8');

// Extract site names from the file
const siteMatches = sitesFileContent.match(/name: '([^']+)'/g);
const siteNames = siteMatches ? siteMatches.map(match => match.replace(/name: '/, '').replace(/'$/, '')) : [];

// Read blog files from public/blogs directory
const blogsDir = './public/blogs';
const blogFiles = readdirSync(blogsDir)
    .filter(file => file.endsWith('.html'))
    .map(file => file.replace('.html', ''));

// Helper function to generate URL slug from site name
const getSiteSlug = (siteName) => {
    // Handle specific Chinese site names with custom mappings
    const chineseMap = {
        '爆米花网': 'baomihua',
        '豆瓣': 'douban',
        '斗鱼': 'douyu',
        '凤凰视频': 'ifeng',
        '风行网': 'fun-tv',
        '激动网': 'joy',
        '酷6网': 'ku6',
        '酷狗音乐': 'kugou',
        '酷我音乐': 'kuwo',
        '乐视网': 'letv',
        '荔枝FM': 'lizhi-fm',
        '懒人听书': 'lrts',
        '秒拍': 'miaopai',
        '痞客邦': 'pixnet',
        '齐鲁网': 'iqilu',
        '企鹅直播': 'penguin-live',
        '阳光卫视': 'isun-tv',
        '战旗TV': 'zhanqi-tv',
        '央视网': 'cctv',
        '芒果TV': 'mango-tv',
        '火猫TV': 'huomao-tv',
        '阳光宽频网': 'yangguang-tv',
        '西瓜视频': 'ixigua',
        '新片场': 'xinpianchang',
        '快手': 'kuaishou',
        '抖音': 'douyin',
        '中国体育TV': 'zhibo-tv',
        '知乎': 'zhihu'
    };

    // Check if it's a Chinese site name we need to map
    if (chineseMap[siteName]) {
        return chineseMap[siteName];
    }

    // Regular slug generation for other sites
    return siteName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'unknown';
};

// Generate current date
const today = new Date().toISOString().split('T')[0];

// Generate main sitemap.xml content
const mainSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>https://media-get.site/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://media-get.site/dashboard</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://media-get.site/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://media-get.site/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://media-get.site/blogs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

// Generate downloads sitemap content
const downloadsSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Download Pages -->
${siteNames.map(siteName => `  <url>
    <loc>https://media-get.site/download/${getSiteSlug(siteName)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

// Generate blogs sitemap content
const blogsSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Blog Articles -->
${blogFiles.map(blogSlug => `  <url>
    <loc>https://media-get.site/blogs/${blogSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`;

// Write sitemap files
console.log('Generating sitemaps...');

writeFileSync('./public/sitemap.xml', mainSitemapContent, 'utf8');
console.log('✅ Generated main sitemap.xml');

writeFileSync('./public/sitemap-downloads.xml', downloadsSitemapContent, 'utf8');
console.log('✅ Generated sitemap-downloads.xml');

writeFileSync('./public/sitemap-blogs.xml', blogsSitemapContent, 'utf8');
console.log('✅ Generated sitemap-blogs.xml');

// Update sitemap index
const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://media-get.site/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://media-get.site/sitemap-downloads.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://media-get.site/sitemap-blogs.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

writeFileSync('./public/sitemap-index.xml', sitemapIndexContent, 'utf8');
console.log('✅ Generated sitemap-index.xml');

console.log(`\n📊 Sitemap Statistics:
- Main pages: 5
- Download pages: ${siteNames.length}
- Blog articles: ${blogFiles.length}
- Total URLs: ${5 + siteNames.length + blogFiles.length}

🔗 Sitemap URLs:
- https://media-get.site/sitemap-index.xml (main index)
- https://media-get.site/sitemap.xml (main pages)
- https://media-get.site/sitemap-downloads.xml (download pages)
- https://media-get.site/sitemap-blogs.xml (blog articles)`);
