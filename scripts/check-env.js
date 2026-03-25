const { loadEnvConfig } = require('@next/env');
const {
  validateEnvironment,
  generateSetupInstructions,
} = require('../src/security/middleware/validateEnv');

function main() {
  loadEnvConfig(process.cwd());

  console.log('🔍 Running environment validation...\n');

  const result = validateEnvironment();

  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Passed: ${result.summary.passed}`);
  console.log(`Failed: ${result.summary.failed}`);
  console.log(`Warnings: ${result.summary.warnings}`);

  if (!result.isValid) {
    console.log('\n❌ Environment validation failed.');
    result.errors.forEach((error) => console.log(`- ${error}`));
    console.log('');
    generateSetupInstructions();
    process.exitCode = 1;
    return;
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️ Warnings');
    result.warnings.forEach((warning) => console.log(`- ${warning}`));
  }

  console.log('\n✅ Environment validation passed.');
}

main();
