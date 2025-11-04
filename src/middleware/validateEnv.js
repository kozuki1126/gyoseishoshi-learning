/**
 * Environment Variables Validation Middleware
 * 
 * Validates required environment variables at application startup
 * to ensure security requirements are met before serving requests.
 * 
 * Security Features:
 * - JWT_SECRET strength validation
 * - Required environment variables check
 * - Development vs Production environment validation
 * - Comprehensive error reporting
 * 
 * Usage:
 *   import { validateEnvironment } from '@/middleware/validateEnv';
 *   validateEnvironment(); // Call at app startup
 */

const crypto = require('crypto');

// Required environment variables for different environments
const REQUIRED_VARS = {
  all: [
    'JWT_SECRET',
    'NODE_ENV',
    'NEXT_PUBLIC_SITE_URL'
  ],
  development: [
    'API_BASE_URL'
  ],
  production: [
    'ADMIN_EMAIL',
    'DATABASE_URL'
  ]
};

// Security validation rules
const VALIDATION_RULES = {
  JWT_SECRET: {
    minLength: 32,
    pattern: null, // Complex validation function defined below
    description: 'Must be at least 32 characters with mixed character types'
  },
  NODE_ENV: {
    allowedValues: ['development', 'test', 'production'],
    description: 'Must be development, test, or production'
  },
  NEXT_PUBLIC_SITE_URL: {
    pattern: /^https?:\/\/.+$/,
    description: 'Must be a valid HTTP/HTTPS URL'
  },
  API_BASE_URL: {
    pattern: /^https?:\/\/.+$/,
    description: 'Must be a valid HTTP/HTTPS URL'
  },
  ADMIN_EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    description: 'Must be a valid email address'
  },
  DATABASE_URL: {
    pattern: /^postgresql:\/\/.+$/,
    description: 'Must be a valid PostgreSQL connection string'
  },
  UPLOAD_MAX_SIZE: {
    pattern: /^\d+$/,
    description: 'Must be a positive integer (bytes)'
  }
};

/**
 * Validate JWT secret strength
 * @param {string} secret - JWT secret to validate
 * @returns {object} - Validation result
 */
function validateJWTSecretStrength(secret) {
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Length validation
  if (!secret || secret.length < 32) {
    result.isValid = false;
    result.errors.push('JWT_SECRET must be at least 32 characters long');
    return result; // Return early if too short
  }

  // Character set validation
  const hasLowercase = /[a-z]/.test(secret);
  const hasUppercase = /[A-Z]/.test(secret);
  const hasNumbers = /[0-9]/.test(secret);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(secret);

  const charSetCount = [hasLowercase, hasUppercase, hasNumbers, hasSymbols].filter(Boolean).length;
  
  if (charSetCount < 3) {
    result.warnings.push('JWT_SECRET should contain at least 3 different character types (lowercase, uppercase, numbers, symbols)');
  }

  // Check for common weak patterns
  if (/(.)\1{3,}/.test(secret)) {
    result.warnings.push('JWT_SECRET contains repeated characters (potential weakness)');
  }

  // Check for default/example values
  const weakPatterns = [
    /your.{0,10}secret/i,
    /change.{0,10}this/i,
    /example/i,
    /test.{0,10}key/i,
    /default/i,
    /123456/,
    /password/i
  ];

  weakPatterns.forEach(pattern => {
    if (pattern.test(secret)) {
      result.isValid = false;
      result.errors.push('JWT_SECRET appears to be a default or example value - please generate a secure secret');
    }
  });

  return result;
}

/**
 * Validate a single environment variable
 * @param {string} key - Environment variable name
 * @param {string} value - Environment variable value
 * @param {object} rule - Validation rule
 * @returns {object} - Validation result
 */
function validateEnvironmentVariable(key, value, rule) {
  const result = {
    key,
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check if value exists
  if (!value || value.trim() === '') {
    result.isValid = false;
    result.errors.push(`${key} is required but not set`);
    return result;
  }

  // Special handling for JWT_SECRET
  if (key === 'JWT_SECRET') {
    const jwtValidation = validateJWTSecretStrength(value);
    result.isValid = jwtValidation.isValid;
    result.errors = result.errors.concat(jwtValidation.errors);
    result.warnings = result.warnings.concat(jwtValidation.warnings);
    return result;
  }

  // Length validation
  if (rule.minLength && value.length < rule.minLength) {
    result.isValid = false;
    result.errors.push(`${key} must be at least ${rule.minLength} characters long`);
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(value)) {
    result.isValid = false;
    result.errors.push(`${key} format is invalid: ${rule.description}`);
  }

  // Allowed values validation
  if (rule.allowedValues && !rule.allowedValues.includes(value)) {
    result.isValid = false;
    result.errors.push(`${key} must be one of: ${rule.allowedValues.join(', ')}`);
  }

  return result;
}

/**
 * Get required environment variables for current environment
 * @param {string} nodeEnv - Current NODE_ENV
 * @returns {string[]} - Array of required variable names
 */
function getRequiredVariables(nodeEnv = 'development') {
  const required = [...REQUIRED_VARS.all];
  
  if (REQUIRED_VARS[nodeEnv]) {
    required.push(...REQUIRED_VARS[nodeEnv]);
  }

  return required;
}

/**
 * Validate all environment variables
 * @param {object} env - Environment variables object (defaults to process.env)
 * @returns {object} - Comprehensive validation result
 */
function validateEnvironment(env = process.env) {
  const nodeEnv = env.NODE_ENV || 'development';
  const requiredVars = getRequiredVariables(nodeEnv);
  
  const validationResult = {
    isValid: true,
    environment: nodeEnv,
    results: [],
    errors: [],
    warnings: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0
    }
  };

  console.log(`🔍 Validating environment variables for: ${nodeEnv.toUpperCase()}`);
  console.log('='.repeat(60));

  // Validate required variables
  requiredVars.forEach(varName => {
    const value = env[varName];
    const rule = VALIDATION_RULES[varName] || {};
    
    const result = validateEnvironmentVariable(varName, value, rule);
    validationResult.results.push(result);
    
    validationResult.summary.total++;
    
    if (result.isValid) {
      validationResult.summary.passed++;
      console.log(`✅ ${varName}: OK`);
    } else {
      validationResult.summary.failed++;
      validationResult.isValid = false;
      validationResult.errors.push(...result.errors);
      console.log(`❌ ${varName}: FAILED`);
      result.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    if (result.warnings.length > 0) {
      validationResult.summary.warnings++;
      validationResult.warnings.push(...result.warnings);
      console.log(`⚠️  ${varName}: WARNINGS`);
      result.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
  });

  // Validate optional but recommended variables
  const optionalVars = ['UPLOAD_MAX_SIZE', 'SESSION_TIMEOUT', 'BCRYPT_ROUNDS'];
  optionalVars.forEach(varName => {
    const value = env[varName];
    if (value && VALIDATION_RULES[varName]) {
      const rule = VALIDATION_RULES[varName];
      const result = validateEnvironmentVariable(varName, value, rule);
      
      if (!result.isValid) {
        validationResult.warnings.push(`Optional variable ${varName} has invalid format`);
        console.log(`⚠️  ${varName}: Invalid format (optional)`);
      } else {
        console.log(`✅ ${varName}: OK (optional)`);
      }
    }
  });

  // Display summary
  console.log('='.repeat(60));
  console.log(`📊 Validation Summary:`);
  console.log(`   Total: ${validationResult.summary.total}`);
  console.log(`   Passed: ${validationResult.summary.passed}`);
  console.log(`   Failed: ${validationResult.summary.failed}`);
  console.log(`   Warnings: ${validationResult.summary.warnings}`);

  if (validationResult.isValid) {
    console.log(`✅ Environment validation PASSED`);
  } else {
    console.log(`❌ Environment validation FAILED`);
    console.log(`\n🚨 Critical Issues:`);
    validationResult.errors.forEach(error => console.log(`   - ${error}`));
  }

  if (validationResult.warnings.length > 0) {
    console.log(`\n⚠️  Warnings:`);
    validationResult.warnings.forEach(warning => console.log(`   - ${warning}`));
  }

  return validationResult;
}

/**
 * Middleware function to validate environment on app startup
 * Throws error if validation fails to prevent insecure startup
 */
function validateEnvironmentMiddleware() {
  const validation = validateEnvironment();
  
  if (!validation.isValid) {
    console.error('\n💥 Application startup BLOCKED due to environment validation errors!');
    console.error('🔧 Please fix the above issues before starting the application.');
    console.error('💡 Run: node scripts/generate-jwt-secret.js --save');
    
    // In production, we must stop the application
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    // In development, throw an error that can be caught
    throw new Error('Environment validation failed - see console for details');
  }

  // Log warnings in production
  if (validation.warnings.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn('⚠️  Production environment has warnings - please review security settings');
  }

  return validation;
}

/**
 * Generate environment setup instructions
 */
function generateSetupInstructions() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const requiredVars = getRequiredVariables(nodeEnv);
  
  console.log('\n📋 Environment Setup Instructions:');
  console.log('='.repeat(50));
  console.log('1. Copy the example environment file:');
  console.log('   cp .env.example .env.local');
  console.log('\n2. Generate a secure JWT secret:');
  console.log('   node scripts/generate-jwt-secret.js --save');
  console.log('\n3. Configure required variables in .env.local:');
  
  requiredVars.forEach(varName => {
    const rule = VALIDATION_RULES[varName];
    console.log(`   ${varName}=${rule?.description ? ` # ${rule.description}` : ''}`);
  });
  
  console.log('\n4. Restart the application');
}

module.exports = {
  validateEnvironment,
  validateEnvironmentMiddleware,
  validateJWTSecretStrength,
  generateSetupInstructions,
  REQUIRED_VARS,
  VALIDATION_RULES
};
