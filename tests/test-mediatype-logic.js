#!/usr/bin/env node

/**
 * Test script to verify mediaType determination logic in Hero component
 */

// Mock MediaInfo structure
const mockMediaInfo = {
    title: "Test Video",
    formats: [
        // Audio only format
        {
            format_id: "140",
            ext: "m4a",
            vcodec: "none",
            acodec: "mp4a.40.2",
            resolution: "audio only",
            abr: 128
        },
        // Video only format
        {
            format_id: "137",
            ext: "mp4",
            vcodec: "avc1.640028",
            acodec: "none",
            height: 1080,
            width: 1920
        },
        // Combined video+audio format
        {
            format_id: "22",
            ext: "mp4",
            vcodec: "avc1.64001F",
            acodec: "mp4a.40.2",
            height: 720,
            width: 1280
        },
        // Image format
        {
            format_id: "thumbnail",
            ext: "jpg",
            vcodec: "none",
            acodec: "none"
        }
    ]
};

// Copy of the determineMediaTypeFromFormat function from Hero.tsx
function determineMediaTypeFromFormat(formatId, mediaInfo) {
    if (!formatId || !mediaInfo?.formats) return 'video';

    // Handle combined format ID (e.g., "137+140")
    const formatIds = formatId.includes('+') ? formatId.split('+') : [formatId];
    const selectedFormats = formatIds.map(id =>
        mediaInfo.formats.find(f => f.format_id === id)
    ).filter(Boolean);

    if (selectedFormats.length === 0) return 'video';

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

    if (isImage) return 'image';
    if (isAudioOnly) return 'audio';
    if (hasVideo) return 'video';

    return 'video'; // Default fallback
}

// Test cases
const testCases = [
    {
        name: "Audio only format",
        formatId: "140",
        expected: "audio"
    },
    {
        name: "Video only format",
        formatId: "137",
        expected: "video"
    },
    {
        name: "Combined video+audio format",
        formatId: "22",
        expected: "video"
    },
    {
        name: "Video + Audio combination",
        formatId: "137+140",
        expected: "video"
    },
    {
        name: "Image format",
        formatId: "thumbnail",
        expected: "image"
    },
    {
        name: "Non-existent format",
        formatId: "999",
        expected: "video"
    },
    {
        name: "Empty format ID",
        formatId: "",
        expected: "video"
    },
    {
        name: "Multiple audio formats",
        formatId: "140+141", // This would be unusual but should still be audio
        expected: "audio"
    }
];

// Run tests
console.log('🧪 Testing mediaType determination logic...\n');

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
    const result = determineMediaTypeFromFormat(testCase.formatId, mockMediaInfo);
    const passed = result === testCase.expected;

    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`  Format ID: ${testCase.formatId}`);
    console.log(`  Expected: ${testCase.expected}`);
    console.log(`  Got: ${result}`);
    console.log(`  Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');

    if (passed) passedTests++;
});

// Summary
console.log('📊 Test Summary:');
console.log(`  Total tests: ${totalTests}`);
console.log(`  Passed: ${passedTests}`);
console.log(`  Failed: ${totalTests - passedTests}`);

if (passedTests === totalTests) {
    console.log('🎉 All tests passed!');
    process.exit(0);
} else {
    console.log('💥 Some tests failed!');
    process.exit(1);
}
