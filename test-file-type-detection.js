#!/usr/bin/env node

// Test script for file type detection logic
import path from 'path';

// Replicate the worker logic for testing
function detectFileType(filename) {
    const ext = path.extname(filename).toLowerCase();
    let type = 'video'; // default

    // Video formats
    const videoExtensions = [
        '.mp4', '.mkv', '.webm', '.flv', '.avi', '.mov', '.wmv', '.m4v',
        '.mpg', '.mpeg', '.3gp', '.f4v', '.ts', '.mts', '.m2ts'
    ];

    // Audio formats
    const audioExtensions = [
        '.mp3', '.m4a', '.aac', '.flac', '.ogg', '.wav', '.wma',
        '.opus', '.vorbis', '.ac3', '.dts'
    ];

    // Image formats
    const imageExtensions = [
        '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg',
        '.tiff', '.tif'
    ];

    if (audioExtensions.includes(ext)) {
        type = 'audio';
    } else if (imageExtensions.includes(ext)) {
        type = 'image';
    } else if (videoExtensions.includes(ext)) {
        type = 'video';
    } else {
        console.log(`Unknown extension ${ext} for file ${filename}, defaulting to video`);
        type = 'video';
    }

    return { filename, ext, type };
}

// Test cases
const testFiles = [
    'video.mp4',
    'movie.mkv',
    'clip.webm',
    'old_video.avi',
    'music.mp3',
    'song.m4a',
    'audio.flac',
    'photo.jpg',
    'image.png',
    'thumbnail.webp',
    'unknown.xyz',
    'How-to-Build-a-Complete-CRUD-Application_1080p.mp4',
    'Music-Video_720p.webm',
    'Podcast-Episode_best.mp3'
];

console.log('🧪 Testing file type detection...\n');

testFiles.forEach(filename => {
    const result = detectFileType(filename);
    const icon = result.type === 'video' ? '🎥' :
        result.type === 'audio' ? '🎵' :
            result.type === 'image' ? '🖼️' : '📄';

    console.log(`${icon} ${result.filename}`);
    console.log(`   Extension: ${result.ext || 'none'}`);
    console.log(`   Type: ${result.type}`);
    console.log();
});

// Test specific MP4 case
console.log('📋 Specific MP4 test:');
const mp4Result = detectFileType('example.mp4');
console.log(`File: example.mp4`);
console.log(`Extension: ${mp4Result.ext}`);
console.log(`Type: ${mp4Result.type}`);
console.log(`Should show video icon: ${mp4Result.type === 'video' ? '✅' : '❌'}`);

console.log('\n✅ Type detection test completed!');
