#!/usr/bin/env node

// Test script for filename length handling
import path from 'path';

// Simulate the worker methods for testing
class FilenameTest {
    constructor() {
        this.taskId = 'test';
    }

    generateCleanFilename(title, itag, extension = 'mp4') {
        // Clean the title first
        let cleanTitle = title
            .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
            .replace(/\s+/g, '-') // Replace spaces with dashes
            .replace(/[^\w\-\u4e00-\u9fff\.]/g, '') // Keep only word chars, dashes, Chinese chars, and dots
            .replace(/\.+/g, '.') // Replace multiple dots with single dot
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes

        // Calculate available space for title
        // Format: {title}_{itag}.{extension}
        const itagPart = `_${itag}`;
        const extensionPart = `.${extension}`;
        const overhead = itagPart.length + extensionPart.length;

        // Filesystem filename limit is usually 255 bytes
        // Leave some margin and limit to 200 characters total
        const maxFilenameLength = 200;
        const maxTitleLength = maxFilenameLength - overhead;

        // Truncate title if too long, but try to keep it meaningful
        if (cleanTitle.length > maxTitleLength) {
            // Try to truncate at word boundary
            const truncated = cleanTitle.substring(0, maxTitleLength);
            const lastDash = truncated.lastIndexOf('-');
            const lastSpace = truncated.lastIndexOf(' ');
            const cutPoint = Math.max(lastDash, lastSpace);

            if (cutPoint > maxTitleLength * 0.7) {
                // If we can cut at a reasonable point, do so
                cleanTitle = truncated.substring(0, cutPoint);
            } else {
                // Otherwise just hard truncate and add ellipsis indicator
                cleanTitle = truncated.substring(0, maxTitleLength - 3) + '...';
            }
        }

        // Remove any trailing dashes or dots
        cleanTitle = cleanTitle.replace(/[-\.]+$/, '');

        // Ensure we have at least some title
        if (!cleanTitle || cleanTitle.length < 3) {
            cleanTitle = 'video';
        }

        const finalFilename = `${cleanTitle}_${itag}.${extension}`;

        // Log if filename was truncated
        if (title.length > maxTitleLength) {
            console.log(`Truncated filename: "${title}" -> "${finalFilename}"`);
        }

        return finalFilename;
    }

    validateFilenameLength(filename, maxLength = 200) {
        if (filename.length <= maxLength) {
            return filename;
        }

        const parts = filename.split('.');
        const extension = parts.pop();
        const nameWithoutExt = parts.join('.');

        const maxNameLength = maxLength - extension.length - 1; // -1 for the dot

        if (maxNameLength > 10) {
            const truncatedName = nameWithoutExt.substring(0, maxNameLength - 3) + '...';
            return `${truncatedName}.${extension}`;
        } else {
            // If even with truncation we can't fit, use a very short name
            return `file_${Date.now()}.${extension}`;
        }
    }
}

// Test cases
const tester = new FilenameTest();

const testCases = [
    {
        title: "Short title",
        itag: "best",
        expected_short: true
    },
    {
        title: "This is a medium length title that should work fine without any issues and not cause problems",
        itag: "720p",
        expected_short: true
    },
    {
        title: "This is an extremely long title that would definitely cause filesystem issues if we don't handle it properly and it contains way too many characters for a reasonable filename and should be truncated appropriately while still maintaining some meaningful content for the user to identify the video",
        itag: "1080p",
        expected_short: false
    },
    {
        title: "超长的中文标题包含了很多很多的字符这样的标题在文件系统中可能会导致问题所以我们需要适当地截断它们同时保持一些有意义的内容以便用户可以识别视频文件这是一个测试用例",
        itag: "480p",
        expected_short: false
    },
    {
        title: "Title with special chars @#$%^&*(){}[]|\\:;\"'<>,.?/~`",
        itag: "360p",
        expected_short: true
    },
    {
        title: "",
        itag: "default",
        expected_short: true
    }
];

console.log('🧪 Testing filename length handling...\n');

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}:`);
    console.log(`  Original title: "${testCase.title}" (${testCase.title.length} chars)`);

    const generated = tester.generateCleanFilename(testCase.title, testCase.itag, 'mp4');
    const validated = tester.validateFilenameLength(generated);

    console.log(`  Generated: "${generated}" (${generated.length} chars)`);
    console.log(`  Validated: "${validated}" (${validated.length} chars)`);
    console.log(`  Within limit: ${validated.length <= 200 ? '✅' : '❌'}`);

    // Check if our prediction was correct
    const actuallyShort = validated.length <= 200;
    if (actuallyShort) {
        console.log(`  ✅ Filename is appropriately sized`);
    } else {
        console.log(`  ❌ Filename is still too long!`);
    }

    console.log();
});

// Test yt-dlp output template
console.log('📋 yt-dlp output template analysis:');
console.log('  Old template: %(title)s.%(ext)s (unlimited length)');
console.log('  New template: %(title).60s.%(ext)s (60 char title limit)');
console.log('  Additional: --trim-filenames 200 (200 char total limit)');
console.log();

// Test some real-world problematic examples
const realWorldCases = [
    "How to Build a Complete CRUD Application with Node.js, Express, MongoDB, and React - Full Stack Development Tutorial 2024",
    "【完整教程】从零开始学习Vue3+TypeScript+Vite项目搭建和开发实战详细步骤讲解",
    "Advanced JavaScript Concepts: Closures, Prototypes, Async/Await, Promises, and Modern ES6+ Features Explained with Examples",
];

console.log('🌍 Real-world examples:');
realWorldCases.forEach((title, index) => {
    const generated = tester.generateCleanFilename(title, '1080p', 'mp4');
    const validated = tester.validateFilenameLength(generated);
    console.log(`${index + 1}. "${title.substring(0, 50)}..."`);
    console.log(`   -> "${validated}" (${validated.length} chars)`);
});

console.log('\n✅ All tests completed!');
