// Google Analytics事件跟踪测试文件
// 测试各种事件跟踪功能

console.log('🧪 Google Analytics事件跟踪测试开始...\n');

// 模拟window.gtag函数
let capturedEvents = [];
window.gtag = function (command, eventName, parameters) {
    capturedEvents.push({
        command,
        eventName,
        parameters,
        timestamp: new Date().toISOString()
    });
    console.log(`📊 Analytics Event Captured:`, {
        command,
        eventName,
        parameters
    });
};

// 导入测试函数
import {
    trackAnalyzeClick,
    trackDownloadClick,
    trackDownloadComplete,
    trackPlatformUsage,
    getPlatformFromUrl,
    determineMediaTypeFromFormat
} from '../src/utils/analytics.js';

// 测试平台识别
console.log('1. 测试平台识别功能');
const testUrls = [
    'https://www.youtube.com/watch?v=test',
    'https://twitter.com/user/status/123',
    'https://www.instagram.com/p/test/',
    'https://www.tiktok.com/@user/video/123',
    'https://www.bilibili.com/video/BV123',
    'https://unknown-platform.com/video/123'
];

testUrls.forEach(url => {
    const platform = getPlatformFromUrl(url);
    console.log(`  ${url} → ${platform}`);
});
console.log('');

// 测试分析按钮点击跟踪
console.log('2. 测试分析按钮点击跟踪');
trackAnalyzeClick('YouTube', 'https://www.youtube.com/watch?v=test');
trackAnalyzeClick('TikTok', 'https://www.tiktok.com/@user/video/123');
console.log('');

// 测试下载按钮点击跟踪
console.log('3. 测试下载按钮点击跟踪');
trackDownloadClick('YouTube', 'video', 'mp4-720p', false);
trackDownloadClick('Spotify', 'audio', 'mp3-320', false);
trackDownloadClick('Instagram', 'image', 'jpg', false);
trackDownloadClick('YouTube', 'video', 'playlist-mixed', true);
console.log('');

// 测试下载完成跟踪
console.log('4. 测试下载完成跟踪');
trackDownloadComplete('YouTube', 'video', 'mp4-1080p', true, 1);
trackDownloadComplete('Bilibili', 'video', 'flv-720p', false, 0);
trackDownloadComplete('Spotify', 'audio', 'mp3-320', true, 3);
console.log('');

// 测试平台使用统计
console.log('5. 测试平台使用统计');
trackPlatformUsage('YouTube', 'analyze');
trackPlatformUsage('TikTok', 'download');
console.log('');

// 测试媒体类型检测
console.log('6. 测试媒体类型检测');
const mockMediaInfo = {
    formats: [
        { format_id: 'audio-only', vcodec: 'none', acodec: 'mp3', ext: 'mp3' },
        { format_id: 'video-only', vcodec: 'h264', acodec: 'none', ext: 'mp4' },
        { format_id: 'combined', vcodec: 'h264', acodec: 'aac', ext: 'mp4' },
        { format_id: 'image', vcodec: 'none', acodec: 'none', ext: 'jpg' }
    ]
};

console.log('  audio-only format →', determineMediaTypeFromFormat('audio-only', mockMediaInfo));
console.log('  video-only format →', determineMediaTypeFromFormat('video-only', mockMediaInfo));
console.log('  combined format →', determineMediaTypeFromFormat('combined', mockMediaInfo));
console.log('  image format →', determineMediaTypeFromFormat('image', mockMediaInfo));
console.log('');

// 总结测试结果
console.log('📈 测试总结:');
console.log(`  总共捕获了 ${capturedEvents.length} 个Analytics事件`);
console.log(`  事件类型分布:`);

const eventCounts = {};
capturedEvents.forEach(event => {
    eventCounts[event.eventName] = (eventCounts[event.eventName] || 0) + 1;
});

Object.entries(eventCounts).forEach(([eventName, count]) => {
    console.log(`    ${eventName}: ${count} 次`);
});

console.log('\n✅ Google Analytics事件跟踪测试完成!');
console.log('\n📋 捕获的所有事件:');
console.table(capturedEvents.map(event => ({
    事件名称: event.eventName,
    平台: event.parameters?.platform || 'N/A',
    媒体类型: event.parameters?.media_type || 'N/A',
    格式: event.parameters?.format || 'N/A',
    操作: event.parameters?.action || 'N/A'
})));

export { capturedEvents };
