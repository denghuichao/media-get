import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogsDir = path.join(__dirname, 'blogs');
const baseUrl = 'http://localhost:5175/blogs/';

// Get all blog files
const blogFiles = fs.readdirSync(blogsDir)
    .filter(file => file.endsWith('.html'))
    .sort();

console.log('=== Blog Rendering Test Results ===\n');
console.log(`Found ${blogFiles.length} blog files to test:\n`);

// List all files that will be tested
blogFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
});

console.log('\n=== Testing Instructions ===');
console.log('Please open each URL in the browser and check for:');
console.log('1. Page loads without errors');
console.log('2. Code blocks display with syntax highlighting');
console.log('3. No HTML parsing errors in console');
console.log('4. All content renders correctly');
console.log('\nURLs to test:');

blogFiles.forEach((file, index) => {
    const url = baseUrl + file;
    console.log(`\n${index + 1}. ${file}`);
    console.log(`   URL: ${url}`);
});

console.log('\n=== Manual Testing Checklist ===');
console.log('For each page, verify:');
console.log('□ Page loads without 500/404 errors');
console.log('□ No parse5 HTML errors in console');
console.log('□ Code blocks have syntax highlighting');
console.log('□ All text content is readable');
console.log('□ No broken layout or missing elements');
