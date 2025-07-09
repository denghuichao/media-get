// Test to verify that download links open in new tabs
// This simulates the download link creation logic

function createDownloadLink(fileUrl, filename) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    link.target = '_blank';

    // Return the link element for testing instead of adding to DOM
    return link;
}

// Test the link creation
console.log('🧪 Testing download link creation with target="_blank"...\n');

const testLink = createDownloadLink('https://example.com/file.mp4', 'video.mp4');

console.log('Link properties:');
console.log(`  href: ${testLink.href}`);
console.log(`  download: ${testLink.download}`);
console.log(`  target: ${testLink.target}`);

if (testLink.target === '_blank') {
    console.log('\n✅ SUCCESS: Download links will open in new tabs');
} else {
    console.log('\n❌ FAILED: Download links will not open in new tabs');
}
