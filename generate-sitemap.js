import { readFileSync } from 'fs';

// Read and parse the sites.ts file manually
const sitesFileContent = readFileSync('./src/data/sites.ts', 'utf8');

// Extract site names from the file
const siteMatches = sitesFileContent.match(/name: '([^']+)'/g);
const siteNames = siteMatches ? siteMatches.map(match => match.replace(/name: '/, '').replace(/'$/, '')) : [];

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

// Generate sitemap.xml content
const today = new Date().toISOString().split('T')[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
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

  <!-- Download Pages -->
${siteNames.map(siteName => `  <url>
    <loc>https://media-get.site/download/${getSiteSlug(siteName)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

console.log(sitemapContent);
