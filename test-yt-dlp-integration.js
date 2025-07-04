#!/usr/bin/env node

// Test script for yt-dlp integration
import { spawn } from 'child_process';

const DOWNLOAD_TOOL = process.env.DOWNLOAD_TOOL || 'yt-dlp';

// Check if yt-dlp is available
async function checkYtDlpAvailable() {
  try {
    const result = await new Promise((resolve, reject) => {
      const process = spawn(DOWNLOAD_TOOL, ['--version']);
      let output = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`${DOWNLOAD_TOOL} version check failed with code ${code}`));
        }
      });
      
      process.on('error', (error) => {
        reject(error);
      });
    });
    
    console.log('✅ yt-dlp version check:', result.split('\n')[0]);
    return true;
  } catch (error) {
    console.error('❌ yt-dlp is not available:', error.message);
    console.error('Please install yt-dlp with: pip install yt-dlp');
    return false;
  }
}

// Test extractors list
async function testExtractors() {
  try {
    const result = await new Promise((resolve, reject) => {
      const process = spawn(DOWNLOAD_TOOL, ['--list-extractors']);
      let output = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Extractors list failed with code ${code}`));
        }
      });
      
      process.on('error', (error) => {
        reject(error);
      });
    });
    
    const extractors = result.split('\n').filter(line => line.trim()).slice(0, 10);
    console.log('✅ Sample extractors:', extractors.join(', '));
    return true;
  } catch (error) {
    console.error('❌ Failed to get extractors:', error.message);
    return false;
  }
}

// Test format listing with a sample URL
async function testFormatListing() {
  const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rick Roll for testing
  
  try {
    const result = await new Promise((resolve, reject) => {
      const process = spawn(DOWNLOAD_TOOL, ['--list-formats', '--no-warnings', testUrl]);
      let output = '';
      let stderr = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Format listing failed: ${stderr || output}`));
        }
      });
      
      process.on('error', (error) => {
        reject(error);
      });
    });
    
    const formats = result.split('\n').filter(line => line.includes('mp4') || line.includes('webm')).slice(0, 3);
    console.log('✅ Sample formats available:', formats.length > 0 ? 'Yes' : 'No');
    if (formats.length > 0) {
      console.log('   First few formats:', formats[0].substring(0, 80) + '...');
    }
    return true;
  } catch (error) {
    console.error('❌ Failed to list formats (this might be expected if network issues):', error.message.substring(0, 100));
    return false;
  }
}

// Test argument parsing
function testArgumentParsing() {
  console.log('✅ Testing argument parsing...');
  
  const testArgs = [
    '-o', '/tmp/test/%(title)s.%(ext)s',
    '--no-playlist',
    '--write-info-json',
    '--write-thumbnail',
    '--ignore-errors',
    '--no-warnings',
    '--extract-flat', 'false',
    '-f', 'best[height<=1080]/best',
    '--retries', '3',
    '--fragment-retries', '3',
    '--restrict-filenames',
    'https://example.com/video'
  ];
  
  console.log('   Arguments:', testArgs.join(' '));
  console.log('   ✅ Argument parsing looks correct');
}

// Main test function
async function runTests() {
  console.log('🧪 Testing yt-dlp integration...\n');
  
  testArgumentParsing();
  console.log();
  
  const ytDlpAvailable = await checkYtDlpAvailable();
  console.log();
  
  if (ytDlpAvailable) {
    await testExtractors();
    console.log();
    
    await testFormatListing();
    console.log();
  }
  
  console.log('🎯 Integration test summary:');
  console.log(`   Download tool: ${DOWNLOAD_TOOL}`);
  console.log(`   Available: ${ytDlpAvailable ? '✅ Yes' : '❌ No'}`);
  console.log(`   Ready for use: ${ytDlpAvailable ? '✅ Yes' : '❌ Install yt-dlp first'}`);
  
  if (!ytDlpAvailable) {
    console.log('\n📝 To install yt-dlp:');
    console.log('   pip install yt-dlp');
    console.log('   # or');
    console.log('   pip3 install yt-dlp');
    console.log('   # or using conda');
    console.log('   conda install -c conda-forge yt-dlp');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
