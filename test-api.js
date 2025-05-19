#!/usr/bin/env node

// API Testing Script for Gyoseishoshi Learning System
// Tests all API endpoints to ensure they are working correctly

const fs = require('fs').promises;
const path = require('path');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_TIMEOUT = 5000; // 5 seconds

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    const data = await response.json().catch(() => null);
    
    return {
      status: response.status,
      ok: response.ok,
      data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Test suite for API endpoints
const testSuites = [
  {
    name: 'Content Management API',
    tests: [
      {
        name: 'GET /api/content/subjects - Get all subjects',
        url: '/api/content/subjects',
        method: 'GET',
        expectedStatus: 200,
        validate: (response) => {
          return response.data?.success === true && 
                 Array.isArray(response.data?.data);
        }
      },
      {
        name: 'GET /api/content/units - Get all units',
        url: '/api/content/units',
        method: 'GET',
        expectedStatus: 200,
        validate: (response) => {
          return response.data?.success === true;
        }
      },
      {
        name: 'GET /api/content/unit?id=101 - Get specific unit',
        url: '/api/content/unit?id=101',
        method: 'GET',
        expectedStatus: 200,
        validate: (response) => {
          return response.data?.success === true &&
                 response.data?.data?.id === '101';
        }
      },
      {
        name: 'GET /api/content/unit?id=invalid - Invalid unit ID',
        url: '/api/content/unit?id=invalid',
        method: 'GET',
        expectedStatus: 404,
        validate: (response) => {
          return response.data?.error;
        }
      },
      {
        name: 'GET /api/content/search?q=憲法 - Search content',
        url: '/api/content/search?q=憲法',
        method: 'GET',
        expectedStatus: 200,
        validate: (response) => {
          return response.data?.success === true &&
                 Array.isArray(response.data?.data);
        }
      },
      {
        name: 'GET /api/content/progress?userId=test - Get user progress',
        url: '/api/content/progress?userId=test',
        method: 'GET',
        expectedStatus: 200,
        validate: (response) => {
          return response.data?.success === true &&
                 response.data?.data?.userId === 'test';
        }
      },
      {
        name: 'POST /api/content/progress - Update progress',
        url: '/api/content/progress',
        method: 'POST',
        body: {
          userId: 'test-user',
          unitId: '101',
          score: 85,
          timeSpent: 120,
          completed: true
        },
        expectedStatus: 200,
        validate: (response) => {
          return response.data?.success === true;
        }
      }
    ]
  },
  {
    name: 'Error Handling',
    tests: [
      {
        name: 'GET /api/content/invalid - Invalid endpoint',
        url: '/api/content/invalid',
        method: 'GET',
        expectedStatus: 404,
        validate: (response) => {
          return response.data?.error;
        }
      },
      {
        name: 'POST /api/content/unit - Missing required fields',
        url: '/api/content/unit',
        method: 'POST',
        body: { title: 'Test Unit' }, // Missing required fields
        expectedStatus: 400,
        validate: (response) => {
          return response.data?.error;
        }
      },
      {
        name: 'GET /api/content/search - Missing query parameter',
        url: '/api/content/search',
        method: 'GET',
        expectedStatus: 400,
        validate: (response) => {
          return response.data?.error;
        }
      }
    ]
  }
];

// Performance tests
const performanceTests = [
  {
    name: 'Load Testing - Multiple concurrent requests',
    async run() {
      const concurrentRequests = 10;
      const url = `${BASE_URL}/api/content/subjects`;
      
      const startTime = Date.now();
      const promises = Array(concurrentRequests).fill().map(() => makeRequest(url));
      
      try {
        const results = await Promise.allSettled(promises);
        const endTime = Date.now();
        
        const successful = results.filter(r => r.status === 'fulfilled' && r.value.ok).length;
        const avgResponseTime = (endTime - startTime) / concurrentRequests;
        
        return {
          success: successful === concurrentRequests,
          details: {
            totalRequests: concurrentRequests,
            successful,
            failed: concurrentRequests - successful,
            avgResponseTime: `${avgResponseTime.toFixed(2)}ms`,
            totalTime: `${endTime - startTime}ms`
          }
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  },
  {
    name: 'Response Time Test - Single request',
    async run() {
      const url = `${BASE_URL}/api/content/subjects`;
      const startTime = Date.now();
      
      try {
        const response = await makeRequest(url);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        return {
          success: response.ok,
          details: {
            responseTime: `${responseTime}ms`,
            status: response.status,
            acceptable: responseTime < 1000 // Response time should be under 1 second
          }
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  }
];

// Test runner functions
async function runApiTest(test, baseUrl) {
  const url = `${baseUrl}${test.url}`;
  const options = {
    method: test.method || 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (test.body) {
    options.body = JSON.stringify(test.body);
  }

  try {
    const response = await makeRequest(url, options);
    
    // Check status code
    const statusOk = test.expectedStatus ? response.status === test.expectedStatus : response.ok;
    
    // Run custom validation if provided
    const validationOk = test.validate ? test.validate(response) : true;
    
    const success = statusOk && validationOk;
    
    return {
      success,
      details: {
        url,
        method: test.method || 'GET',
        expectedStatus: test.expectedStatus,
        actualStatus: response.status,
        statusOk,
        validationOk,
        responseTime: response.headers['response-time'] || 'N/A'
      },
      response: success ? null : response // Include response only on failure for debugging
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: {
        url,
        method: test.method || 'GET'
      }
    };
  }
}

async function runTestSuite(suite, baseUrl) {
  console.log(`\n${colors.cyan}🧪 Running test suite: ${suite.name}${colors.reset}`);
  console.log('='.repeat(60));
  
  const results = [];
  let passed = 0;
  let failed = 0;
  
  for (const test of suite.tests) {
    process.stdout.write(`  ${test.name}... `);
    
    try {
      const result = await runApiTest(test, baseUrl);
      results.push({ test: test.name, ...result });
      
      if (result.success) {
        console.log(`${colors.green}✓ PASSED${colors.reset}`);
        passed++;
      } else {
        console.log(`${colors.red}✗ FAILED${colors.reset}`);
        if (result.error) {
          console.log(`    Error: ${result.error}`);
        }
        if (result.details) {
          console.log(`    Expected: ${result.details.expectedStatus}, Got: ${result.details.actualStatus}`);
        }
        failed++;
      }
    } catch (error) {
      console.log(`${colors.red}✗ ERROR${colors.reset}`);
      console.log(`    ${error.message}`);
      results.push({ test: test.name, success: false, error: error.message });
      failed++;
    }
  }
  
  console.log(`\n${colors.magenta}Results: ${passed} passed, ${failed} failed${colors.reset}\n`);
  
  return {
    name: suite.name,
    passed,
    failed,
    total: suite.tests.length,
    results
  };
}

async function runPerformanceTests() {
  console.log(`\n${colors.cyan}⚡ Running performance tests${colors.reset}`);
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const test of performanceTests) {
    process.stdout.write(`  ${test.name}... `);
    
    try {
      const result = await test.run();
      results.push({ test: test.name, ...result });
      
      if (result.success) {
        console.log(`${colors.green}✓ PASSED${colors.reset}`);
        if (result.details) {
          Object.entries(result.details).forEach(([key, value]) => {
            console.log(`    ${key}: ${value}`);
          });
        }
      } else {
        console.log(`${colors.red}✗ FAILED${colors.reset}`);
        if (result.error) {
          console.log(`    Error: ${result.error}`);
        }
      }
    } catch (error) {
      console.log(`${colors.red}✗ ERROR${colors.reset}`);
      console.log(`    ${error.message}`);
      results.push({ test: test.name, success: false, error: error.message });
    }
  }
  
  return results;
}

async function checkServerHealth(baseUrl) {
  console.log(`${colors.yellow}🏥 Checking server health...${colors.reset}`);
  
  try {
    const response = await makeRequest(`${baseUrl}/api/health`);
    
    if (response.ok) {
      console.log(`${colors.green}✓ Server is running at ${baseUrl}${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.yellow}⚠️  Server responded with status ${response.status}${colors.reset}`);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`${colors.red}✗ Server timeout - make sure the server is running${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ Cannot connect to server at ${baseUrl}${colors.reset}`);
      console.log(`  Error: ${error.message}`);
      console.log(`  Make sure the development server is running with: npm run dev`);
    }
    return false;
  }
}

async function generateReport(allResults, performanceResults) {
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    summary: {
      totalSuites: allResults.length,
      totalTests: allResults.reduce((sum, suite) => sum + suite.total, 0),
      totalPassed: allResults.reduce((sum, suite) => sum + suite.passed, 0),
      totalFailed: allResults.reduce((sum, suite) => sum + suite.failed, 0),
      successRate: 0
    },
    suites: allResults,
    performance: performanceResults
  };
  
  report.summary.successRate = 
    (report.summary.totalPassed / report.summary.totalTests * 100).toFixed(2);
  
  try {
    await fs.writeFile(
      'api-test-report.json',
      JSON.stringify(report, null, 2)
    );
    console.log(`${colors.blue}📊 Test report saved to api-test-report.json${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}⚠️  Could not save test report: ${error.message}${colors.reset}`);
  }
  
  return report;
}

async function main() {
  console.log(`${colors.magenta}🚀 Starting API Test Suite${colors.reset}`);
  console.log(`${'='.repeat(80)}`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Timeout: ${API_TIMEOUT}ms`);
  console.log(`${'='.repeat(80)}`);
  
  // Check if server is running
  const serverRunning = await checkServerHealth(BASE_URL);
  
  if (!serverRunning) {
    console.log(`\n${colors.red}❌ Cannot proceed with tests - server is not accessible${colors.reset}`);
    process.exit(1);
  }
  
  // Run all test suites
  const allResults = [];
  
  for (const suite of testSuites) {
    const result = await runTestSuite(suite, BASE_URL);
    allResults.push(result);
  }
  
  // Run performance tests
  const performanceResults = await runPerformanceTests();
  
  // Generate summary
  console.log(`\n${colors.cyan}📊 FINAL SUMMARY${colors.reset}`);
  console.log('='.repeat(60));
  
  const totalTests = allResults.reduce((sum, suite) => sum + suite.total, 0);
  const totalPassed = allResults.reduce((sum, suite) => sum + suite.passed, 0);
  const totalFailed = allResults.reduce((sum, suite) => sum + suite.failed, 0);
  const successRate = ((totalPassed / totalTests) * 100).toFixed(2);
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`${colors.green}Passed: ${totalPassed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${totalFailed}${colors.reset}`);
  console.log(`Success Rate: ${successRate}%`);
  
  // Performance summary
  const performancePassed = performanceResults.filter(r => r.success).length;
  console.log(`\nPerformance Tests: ${performancePassed}/${performanceResults.length} passed`);
  
  // Generate and save report
  await generateReport(allResults, performanceResults);
  
  // Exit with appropriate code
  if (totalFailed === 0 && performancePassed === performanceResults.length) {
    console.log(`\n${colors.green}🎉 All tests passed!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}💥 Some tests failed. Check the output above for details.${colors.reset}`);
    process.exit(1);
  }
}

// Run the test suite
if (require.main === module) {
  main().catch(error => {
    console.error(`${colors.red}Fatal error:${colors.reset}`, error);
    process.exit(1);
  });
}

module.exports = {
  makeRequest,
  runApiTest,
  runTestSuite,
  testSuites,
  performanceTests
};
