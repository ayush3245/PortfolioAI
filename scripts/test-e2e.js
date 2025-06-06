#!/usr/bin/env node

/**
 * End-to-End Test Script for PortfolioAI
 * Tests the complete application flow including API integration
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const API_BASE_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:8080';

const testData = {
  bio: 'I am a software developer with 5 years of experience',
  projects: [
    {
      title: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce platform using React and Node.js',
      skillsUsed: ['React', 'Node.js', 'MongoDB']
    }
  ],
  hobbies: 'Reading, hiking, photography'
};

async function testApiEndpoint() {
  console.log('🧪 Testing API endpoint...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/enhance-portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(`API error: ${result.error}`);
    }

    console.log('✅ API endpoint test passed');
    console.log('📊 Enhanced data received:', {
      bioLength: result.data.enhancedBio?.length || 0,
      projectsCount: result.data.enhancedProjects?.length || 0,
      hobbiesLength: result.data.enhancedHobbies?.length || 0
    });
    
    return true;
  } catch (error) {
    console.error('❌ API endpoint test failed:', error.message);
    return false;
  }
}

async function testFrontendAvailability() {
  console.log('🌐 Testing frontend availability...');
  
  try {
    const response = await fetch(FRONTEND_URL);
    
    if (!response.ok) {
      throw new Error(`Frontend returned ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    if (!html.includes('PortfolioAI') && !html.includes('portfolio')) {
      throw new Error('Frontend content does not appear to be PortfolioAI');
    }

    console.log('✅ Frontend availability test passed');
    return true;
  } catch (error) {
    console.error('❌ Frontend availability test failed:', error.message);
    return false;
  }
}

async function testEnvironmentVariables() {
  console.log('🔧 Testing environment variables...');
  
  const requiredVars = ['VITE_GROQ_API_KEY'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing);
    return false;
  }
  
  console.log('✅ Environment variables test passed');
  return true;
}

async function runAllTests() {
  console.log('🚀 Starting End-to-End Tests for PortfolioAI\n');
  
  const tests = [
    { name: 'Environment Variables', fn: testEnvironmentVariables },
    { name: 'Frontend Availability', fn: testFrontendAvailability },
    { name: 'API Endpoint', fn: testApiEndpoint }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    const result = await test.fn();
    
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n📋 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! PortfolioAI is working correctly.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Tests interrupted by user');
  process.exit(1);
});

// Run tests
runAllTests().catch(error => {
  console.error('\n💥 Unexpected error during testing:', error);
  process.exit(1);
});
