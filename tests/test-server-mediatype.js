#!/usr/bin/env node

/**
 * 测试服务器端mediaType逻辑修复
 */

// 模拟从yt-dlp获取的格式信息（类似Bilibili视频）
const mockMediaInfo = {
    title: "扎心的真相：上班是如何摧毁我们的心态、生活和幸福感的？【围炉夜话】",
    extractor_key: "BiliBili",
    formats: [
        // 音频格式
        {
            format_id: "30280",
            ext: "m4a",
            vcodec: "none",
            acodec: "mp4a.40.2",
            resolution: "audio only",
            abr: 132
        },
        // 视频格式（无音频）
        {
            format_id: "30077",
            ext: "mp4",
            vcodec: "avc1.640020",
            acodec: "none",
            height: 720,
            width: 1280
        },
        // 另一个视频格式
        {
            format_id: "30066",
            ext: "mp4",
            vcodec: "avc1.42001e",
            acodec: "none",
            height: 360,
            width: 640
        }
    ]
};

// 复制服务器端修复后的逻辑
function determineMediaTypeServer(format_id, mediaInfo) {
    // Find selected format info - handle combined format IDs (e.g., "137+140")
    let selectedFormat = null;
    let selectedFormats = [];
    if (format_id && mediaInfo.formats) {
        if (format_id.includes('+')) {
            // Handle combined format ID
            const formatIds = format_id.split('+');
            selectedFormats = formatIds.map(id =>
                mediaInfo.formats.find(f => f.format_id === id)
            ).filter(Boolean);
            // Use the first found format as primary for backward compatibility
            selectedFormat = selectedFormats[0] || null;
        } else {
            // Single format ID
            selectedFormat = mediaInfo.formats.find(f => f.format_id === format_id);
            if (selectedFormat) {
                selectedFormats = [selectedFormat];
            }
        }
    }

    // Determine media type based on selected format(s)
    let mediaType = 'video';
    if (selectedFormats.length > 0) {
        // If any format has video codec, consider it video
        const hasVideo = selectedFormats.some(format =>
            format?.vcodec && format.vcodec !== 'none'
        );

        // Check if it's audio only (all formats have no video codec)
        const isAudioOnly = selectedFormats.every(format =>
            format?.vcodec === 'none' || format?.resolution === 'audio only'
        );

        // Check if it's image format
        const isImage = selectedFormats.some(format => {
            const ext = format?.ext?.toLowerCase();
            return ext && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext);
        });

        if (isImage) {
            mediaType = 'image';
        } else if (isAudioOnly) {
            mediaType = 'audio';
        } else if (hasVideo) {
            mediaType = 'video';
        }
    } else if (mediaInfo.formats && mediaInfo.formats.length > 0) {
        // Fallback to first format if no selected format found
        const firstFormat = mediaInfo.formats[0];
        if (firstFormat.vcodec === 'none' && firstFormat.acodec !== 'none') {
            mediaType = 'audio';
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes((firstFormat.ext || '').toLowerCase())) {
            mediaType = 'image';
        }
    }

    return { mediaType, selectedFormats };
}

// 测试用例
const testCases = [
    {
        name: "单一音频格式",
        format_id: "30280",
        expected: "audio",
        description: "选择纯音频格式应该返回audio"
    },
    {
        name: "单一视频格式",
        format_id: "30077",
        expected: "video",
        description: "选择纯视频格式应该返回video"
    },
    {
        name: "视频+音频组合",
        format_id: "30077+30280",
        expected: "video",
        description: "选择视频+音频组合应该返回video（这是问题所在）"
    },
    {
        name: "不存在的格式ID",
        format_id: "999",
        expected: "video",
        description: "不存在的格式应该回退到默认video"
    },
    {
        name: "空格式ID",
        format_id: "",
        expected: "video",
        description: "空格式ID应该回退到默认video"
    }
];

// 运行测试
console.log('🔧 测试服务器端mediaType逻辑修复...\n');
console.log('🎯 重点：修复组合格式ID（如"30077+30280"）的mediaType判断\n');

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
    const result = determineMediaTypeServer(testCase.format_id, mockMediaInfo);
    const passed = result.mediaType === testCase.expected;

    console.log(`测试 ${index + 1}: ${testCase.name}`);
    console.log(`  📝 ${testCase.description}`);
    console.log(`  🎛️  格式ID: "${testCase.format_id}"`);
    console.log(`  🎯 期望mediaType: ${testCase.expected}`);
    console.log(`  📊 实际mediaType: ${result.mediaType}`);
    console.log(`  📋 选中的格式数量: ${result.selectedFormats.length}`);

    if (result.selectedFormats.length > 0) {
        console.log(`  🔍 格式详情:`);
        result.selectedFormats.forEach((format, i) => {
            const videoInfo = format.vcodec !== 'none' ? `视频(${format.vcodec})` : '无视频';
            const audioInfo = format.acodec !== 'none' ? `音频(${format.acodec})` : '无音频';
            console.log(`     ${format.format_id}: ${videoInfo} + ${audioInfo}`);
        });
    }

    console.log(`  ✅ 状态: ${passed ? '✅ 通过' : '❌ 失败'}`);
    console.log('');

    if (passed) passedTests++;
});

// 汇总
console.log('📊 测试汇总:');
console.log(`  总测试数: ${totalTests}`);
console.log(`  通过: ${passedTests}`);
console.log(`  失败: ${totalTests - passedTests}`);
console.log('');

// 特别检查关键问题
const combinedFormatTest = testCases.find(test => test.format_id.includes('+'));
if (combinedFormatTest) {
    const result = determineMediaTypeServer(combinedFormatTest.format_id, mockMediaInfo);
    const fixed = result.mediaType === 'video';

    console.log('🎯 关键问题验证:');
    console.log(`  问题: 组合格式"${combinedFormatTest.format_id}"之前被错误识别为"audio"`);
    console.log(`  修复后结果: ${result.mediaType}`);
    console.log(`  问题是否已修复: ${fixed ? '✅ 是' : '❌ 否'}`);

    if (fixed) {
        console.log('\n🎉 服务器端mediaType逻辑已修复！');
        console.log('现在选择video+audio组合格式时，mediaType会正确设置为"video"');
    } else {
        console.log('\n💥 修复失败！需要进一步调试。');
    }
}

if (passedTests === totalTests) {
    process.exit(0);
} else {
    process.exit(1);
}
