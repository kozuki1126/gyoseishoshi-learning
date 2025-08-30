#!/usr/bin/env node

/**
 * JWT Secret Generator Script
 * 
 * Generates a cryptographically secure JWT secret for production use.
 * This script ensures the generated secret meets security best practices:
 * - Minimum 32 characters length
 * - Mixed alphanumeric and special characters
 * - High entropy for cryptographic security
 * 
 * Usage:
 *   node scripts/generate-jwt-secret.js
 *   node scripts/generate-jwt-secret.js --length 64
 *   node scripts/generate-jwt-secret.js --save
 * 
 * Security Level: Production-grade cryptographic strength
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Security constants
const MIN_LENGTH = 32;
const DEFAULT_LENGTH = 64;
const CHARACTER_SET = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

/**
 * Generate a cryptographically secure random string
 * @param {number} length - Length of the secret to generate
 * @returns {string} - Cryptographically secure random string
 */
function generateSecureJWTSecret(length = DEFAULT_LENGTH) {
  if (length < MIN_LENGTH) {
    throw new Error(`JWT secret must be at least ${MIN_LENGTH} characters long for security`);
  }

  // Combine all character sets
  const allChars = Object.values(CHARACTER_SET).join('');
  
  // Generate random bytes
  const randomBytes = crypto.randomBytes(length * 2);
  
  let result = '';
  
  // Ensure we have at least one character from each set for complexity
  const requiredChars = [
    CHARACTER_SET.lowercase[Math.floor(crypto.randomInt(0, CHARACTER_SET.lowercase.length))],
    CHARACTER_SET.uppercase[Math.floor(crypto.randomInt(0, CHARACTER_SET.uppercase.length))],
    CHARACTER_SET.numbers[Math.floor(crypto.randomInt(0, CHARACTER_SET.numbers.length))],
    CHARACTER_SET.symbols[Math.floor(crypto.randomInt(0, CHARACTER_SET.symbols.length))]
  ];
  
  // Add required characters to result
  result += requiredChars.join('');
  
  // Fill remaining length with random characters
  for (let i = result.length; i < length; i++) {
    const randomIndex = randomBytes[i] % allChars.length;
    result += allChars[randomIndex];
  }
  
  // Shuffle the result to avoid predictable patterns
  return result.split('').sort(() => crypto.randomInt(0, 3) - 1).join('');
}

/**
 * Validate JWT secret strength
 * @param {string} secret - JWT secret to validate
 * @returns {object} - Validation result
 */
function validateJWTSecret(secret) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
    strength: 'weak'
  };

  // Length validation
  if (secret.length < MIN_LENGTH) {
    validation.isValid = false;
    validation.errors.push(`Secret must be at least ${MIN_LENGTH} characters long`);
  }

  // Character set validation
  const hasLowercase = /[a-z]/.test(secret);
  const hasUppercase = /[A-Z]/.test(secret);
  const hasNumbers = /[0-9]/.test(secret);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(secret);

  const charSetCount = [hasLowercase, hasUppercase, hasNumbers, hasSymbols].filter(Boolean).length;
  
  if (charSetCount < 3) {
    validation.warnings.push('Secret should contain at least 3 different character types (lowercase, uppercase, numbers, symbols)');
  }

  // Determine strength
  if (secret.length >= 64 && charSetCount >= 4) {
    validation.strength = 'very_strong';
  } else if (secret.length >= 48 && charSetCount >= 3) {
    validation.strength = 'strong';
  } else if (secret.length >= 32 && charSetCount >= 3) {
    validation.strength = 'moderate';
  } else {
    validation.strength = 'weak';
  }

  // Pattern validation (avoid common patterns)
  if (/(.)\1{3,}/.test(secret)) {
    validation.warnings.push('Secret contains repeated characters (potential weakness)');
  }

  if (/^[a-zA-Z0-9]+$/.test(secret) && secret.length < 48) {
    validation.warnings.push('Consider adding special characters for enhanced security');
  }

  return validation;
}

/**
 * Save JWT secret to .env.local file
 * @param {string} secret - JWT secret to save
 */
function saveToEnvFile(secret) {
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';

  // Read existing .env.local if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add JWT_SECRET
  if (envContent.includes('JWT_SECRET=')) {
    envContent = envContent.replace(/JWT_SECRET=.*$/m, `JWT_SECRET=${secret}`);
  } else {
    envContent += `\n# Generated JWT Secret - ${new Date().toISOString()}\nJWT_SECRET=${secret}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log(`✅ JWT_SECRET saved to ${envPath}`);
}

/**
 * Main execution function
 */
function main() {
  const args = process.argv.slice(2);
  let length = DEFAULT_LENGTH;
  let shouldSave = false;

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--length' && args[i + 1]) {
      length = parseInt(args[i + 1]);
      i++; // Skip next argument
    } else if (arg === '--save') {
      shouldSave = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
JWT Secret Generator

Usage:
  node scripts/generate-jwt-secret.js [options]

Options:
  --length <number>  Length of the generated secret (minimum: ${MIN_LENGTH}, default: ${DEFAULT_LENGTH})
  --save             Save the generated secret to .env.local file
  --help, -h         Show this help message

Examples:
  node scripts/generate-jwt-secret.js                # Generate ${DEFAULT_LENGTH}-character secret
  node scripts/generate-jwt-secret.js --length 128   # Generate 128-character secret
  node scripts/generate-jwt-secret.js --save         # Generate and save to .env.local
      `);
      return;
    }
  }

  try {
    console.log('🔐 JWT Secret Generator');
    console.log('='.repeat(50));

    // Generate JWT secret
    const jwtSecret = generateSecureJWTSecret(length);
    
    // Validate generated secret
    const validation = validateJWTSecret(jwtSecret);
    
    // Display results
    console.log(`Generated JWT Secret (${jwtSecret.length} characters):`);
    console.log(`\n${jwtSecret}\n`);
    
    console.log(`Security Strength: ${validation.strength.toUpperCase()}`);
    
    if (validation.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      validation.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    if (validation.errors.length > 0) {
      console.log('\n❌ Errors:');
      validation.errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('\n✅ Secret meets security requirements');
    }

    // Save to file if requested
    if (shouldSave) {
      saveToEnvFile(jwtSecret);
    } else {
      console.log('\n💡 To save this secret to .env.local, run:');
      console.log(`   node scripts/generate-jwt-secret.js --save`);
    }

    console.log('\n🔒 Security Reminder:');
    console.log('   - Never commit your JWT_SECRET to version control');
    console.log('   - Use different secrets for different environments');
    console.log('   - Rotate secrets regularly in production');
    
  } catch (error) {
    console.error('❌ Error generating JWT secret:', error.message);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  generateSecureJWTSecret,
  validateJWTSecret,
  saveToEnvFile
};
