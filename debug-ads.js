// 广告调试脚本
console.log('=== 广告调试开始 ===');

// 检查所有广告容器
const adContainers = document.querySelectorAll('[ref="banner"], .border.border-gray-200');
console.log(`找到 ${adContainers.length} 个广告容器`);

adContainers.forEach((container, index) => {
    console.log(`\n广告容器 ${index + 1}:`);
    console.log('- HTML:', container.outerHTML.substring(0, 200) + '...');
    console.log('- 子元素数量:', container.children.length);
    console.log('- 是否有脚本:', container.querySelector('script') ? '是' : '否');
    console.log('- 是否有iframe:', container.querySelector('iframe') ? '是' : '否');

    // 检查脚本内容
    const scripts = container.querySelectorAll('script');
    scripts.forEach((script, scriptIndex) => {
        console.log(`  脚本 ${scriptIndex + 1}:`, script.src || script.innerHTML.substring(0, 100));
    });
});

// 检查全局atOptions
console.log('\n=== atOptions 检查 ===');
if (typeof atOptions !== 'undefined') {
    console.log('atOptions:', atOptions);
} else {
    console.log('atOptions 未定义');
}

// 检查网络请求
console.log('\n=== 检查网络资源 ===');
const scripts = document.querySelectorAll('script[src*="highperformanceformat"], script[src*="profitableratecpm"]');
console.log(`找到 ${scripts.length} 个广告脚本`);
scripts.forEach((script, index) => {
    console.log(`脚本 ${index + 1}: ${script.src}`);
});

console.log('=== 广告调试结束 ===');
