// Test file to verify the file filtering logic
// This simulates the filtering logic used in both Dashboard and Hero components

function getFilteredFiles(taskStatus) {
    if (!taskStatus.result?.files) return [];

    // Filter files based on mediaType logic:
    // - audio: show both audio and video files (video might be audio-only)
    // - video: show both audio and video files
    // - image: show only image files
    return taskStatus.result.files.filter(file => {
        if (taskStatus.mediaType === 'audio' || taskStatus.mediaType === 'video') {
            return file.type === 'audio' || file.type === 'video';
        }
        return file.type === taskStatus.mediaType;
    });
}

// Test data
const testCases = [
    {
        name: "Audio task with mixed files",
        taskStatus: {
            mediaType: 'audio',
            result: {
                files: [
                    { filename: 'song.mp3', type: 'audio' },
                    { filename: 'video.mp4', type: 'video' },
                    { filename: 'image.jpg', type: 'image' }
                ]
            }
        },
        expected: ['song.mp3', 'video.mp4'] // Should include audio and video, exclude image
    },
    {
        name: "Video task with mixed files",
        taskStatus: {
            mediaType: 'video',
            result: {
                files: [
                    { filename: 'song.mp3', type: 'audio' },
                    { filename: 'video.mp4', type: 'video' },
                    { filename: 'image.jpg', type: 'image' }
                ]
            }
        },
        expected: ['song.mp3', 'video.mp4'] // Should include audio and video, exclude image
    },
    {
        name: "Image task with mixed files",
        taskStatus: {
            mediaType: 'image',
            result: {
                files: [
                    { filename: 'song.mp3', type: 'audio' },
                    { filename: 'video.mp4', type: 'video' },
                    { filename: 'image.jpg', type: 'image' }
                ]
            }
        },
        expected: ['image.jpg'] // Should include only image
    },
    {
        name: "Audio task with only audio files",
        taskStatus: {
            mediaType: 'audio',
            result: {
                files: [
                    { filename: 'song1.mp3', type: 'audio' },
                    { filename: 'song2.wav', type: 'audio' }
                ]
            }
        },
        expected: ['song1.mp3', 'song2.wav'] // Should include all audio files
    },
    {
        name: "Video task with only video files",
        taskStatus: {
            mediaType: 'video',
            result: {
                files: [
                    { filename: 'video1.mp4', type: 'video' },
                    { filename: 'video2.webm', type: 'video' }
                ]
            }
        },
        expected: ['video1.mp4', 'video2.webm'] // Should include all video files
    }
];

// Run tests
console.log('🧪 Testing file filtering logic...\n');

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);

    const result = getFilteredFiles(testCase.taskStatus);
    const resultFilenames = result.map(file => file.filename);

    const passed = JSON.stringify(resultFilenames.sort()) === JSON.stringify(testCase.expected.sort());

    if (passed) {
        console.log('✅ PASSED');
        console.log(`   Expected: [${testCase.expected.join(', ')}]`);
        console.log(`   Got:      [${resultFilenames.join(', ')}]`);
        passedTests++;
    } else {
        console.log('❌ FAILED');
        console.log(`   Expected: [${testCase.expected.join(', ')}]`);
        console.log(`   Got:      [${resultFilenames.join(', ')}]`);
    }
    console.log('');
});

console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
    console.log('🎉 All tests passed! File filtering logic is working correctly.');
} else {
    console.log('⚠️  Some tests failed. Please check the filtering logic.');
}
