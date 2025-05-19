#!/usr/bin/env node

// Directory structure verification script
// Checks if all required directories exist and creates them if needed

const fs = require('fs').promises;
const path = require('path');

const requiredDirectories = [
  'src',
  'src/components',
  'src/components/icons',
  'src/components/units',
  'src/pages',
  'src/pages/api',
  'src/pages/api/content',
  'src/pages/admin',
  'src/pages/register',
  'src/pages/subjects',  
  'src/pages/units',
  'src/pages/study-plan',
  'src/data',
  'src/lib',
  'src/styles',
  'content',
  'content/units',
  'public',
  'public/images',
  'public/images/features',
  'public/audio',
  'public/audio/units',
  'public/pdf',
  'public/pdf/downloads'
];

const requiredFiles = [
  {
    path: 'src/pages/_app.js',
    required: true
  },
  {
    path: 'src/pages/index.js',
    required: true
  },
  {
    path: 'src/styles/globals.css',
    required: true
  },
  {
    path: 'src/data/subjects.js',
    required: true
  },
  {
    path: 'package.json',
    required: true
  },
  {
    path: 'next.config.js',
    required: false
  },
  {
    path: 'tailwind.config.js',
    required: false
  }
];

async function checkDirectory(dirPath) {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

async function checkFile(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}

async function createDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create directory ${dirPath}:`, error.message);
    return false;
  }
}

async function checkAndCreateDirectories() {
  console.log('🔍 Checking required directories...\n');
  
  let createdCount = 0;
  let existingCount = 0;
  
  for (const dir of requiredDirectories) {
    const exists = await checkDirectory(dir);
    
    if (exists) {
      console.log(`✅ Directory exists: ${dir}`);
      existingCount++;
    } else {
      console.log(`⚠️  Directory missing: ${dir}`);
      const created = await createDirectory(dir);
      if (created) {
        createdCount++;
      }
    }
  }
  
  console.log(`\n📊 Directory Summary:`);
  console.log(`   Existing: ${existingCount}`);
  console.log(`   Created:  ${createdCount}`);
  console.log(`   Total:    ${requiredDirectories.length}\n`);
}

async function checkRequiredFiles() {
  console.log('🔍 Checking required files...\n');
  
  let existingFiles = 0;
  let missingFiles = 0;
  const missingRequiredFiles = [];
  
  for (const fileInfo of requiredFiles) {
    const exists = await checkFile(fileInfo.path);
    
    if (exists) {
      console.log(`✅ File exists: ${fileInfo.path}`);
      existingFiles++;
    } else {
      if (fileInfo.required) {
        console.log(`❌ Required file missing: ${fileInfo.path}`);
        missingRequiredFiles.push(fileInfo.path);
      } else {
        console.log(`⚠️  Optional file missing: ${fileInfo.path}`);
      }
      missingFiles++;
    }
  }
  
  console.log(`\n📊 File Summary:`);
  console.log(`   Existing: ${existingFiles}`);
  console.log(`   Missing:  ${missingFiles}`);
  console.log(`   Total:    ${requiredFiles.length}\n`);
  
  if (missingRequiredFiles.length > 0) {
    console.log('❌ Missing required files that need to be created manually:');
    missingRequiredFiles.forEach(file => console.log(`   - ${file}`));
    console.log('');
  }
}

async function checkGitignore() {
  console.log('🔍 Checking .gitignore file...\n');
  
  const gitignoreEntries = [
    '# Dependencies',
    'node_modules/',
    'npm-debug.log*',
    '',
    '# Next.js',
    '.next/',
    'out/',
    'build/',
    '',
    '# Environment variables',
    '.env*',
    '!.env.example',
    '',
    '# Editor directories and files',
    '.vscode/',
    '.idea/',
    '*.swp',
    '*.swo',
    '',
    '# OS generated files',
    '.DS_Store',
    'Thumbs.db',
    '',
    '# Logs',
    'logs/',
    '*.log',
    '',
    '# Runtime data',
    'pids/',
    '*.pid',
    '*.seed'
  ];
  
  try {
    const exists = await checkFile('.gitignore');
    if (!exists) {
      await fs.writeFile('.gitignore', gitignoreEntries.join('\n'));
      console.log('✅ Created .gitignore file');
    } else {
      console.log('✅ .gitignore file already exists');
    }
  } catch (error) {
    console.error('❌ Failed to create .gitignore:', error.message);
  }
}

async function validateProjectStructure() {
  console.log('🔍 Validating overall project structure...\n');
  
  // Check if this is a valid Next.js project
  const packageJsonExists = await checkFile('package.json');
  
  if (packageJsonExists) {
    try {
      const packageContent = await fs.readFile('package.json', 'utf-8');
      const packageJson = JSON.parse(packageContent);
      
      if (packageJson.dependencies && packageJson.dependencies.next) {
        console.log('✅ Valid Next.js project detected');
        console.log(`   Next.js version: ${packageJson.dependencies.next}`);
      } else {
        console.log('⚠️  package.json exists but Next.js not found in dependencies');
      }
    } catch (error) {
      console.log('❌ Error reading package.json:', error.message);
    }
  } else {
    console.log('❌ package.json not found - this may not be a valid Next.js project');
  }
}

async function checkPermissions() {
  console.log('🔍 Checking permissions...\n');
  
  try {
    // Test write permissions in various directories
    const testDirs = ['./public', './src', './content'];
    
    for (const dir of testDirs) {
      if (await checkDirectory(dir)) {
        try {
          const testFile = path.join(dir, '.test-permission');
          await fs.writeFile(testFile, 'test');
          await fs.unlink(testFile);
          console.log(`✅ Write permissions OK: ${dir}`);
        } catch (error) {
          console.log(`❌ Write permissions denied: ${dir}`);
        }
      }
    }
  } catch (error) {
    console.log('⚠️  Could not verify permissions');
  }
}

async function generateSummaryReport() {
  console.log('📋 Generating summary report...\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    project: 'gyoseishoshi-learning',
    status: 'verified',
    directories: {
      total: requiredDirectories.length,
      existing: 0,
      created: 0
    },
    files: {
      total: requiredFiles.length,
      existing: 0,
      missing: 0
    }
  };
  
  // Count existing directories
  for (const dir of requiredDirectories) {
    if (await checkDirectory(dir)) {
      report.directories.existing++;
    }
  }
  
  // Count existing files
  for (const fileInfo of requiredFiles) {
    if (await checkFile(fileInfo.path)) {
      report.files.existing++;
    } else {
      report.files.missing++;
    }
  }
  
  // Save report
  try {
    await fs.writeFile(
      'directory-check-report.json',
      JSON.stringify(report, null, 2)
    );
    console.log('✅ Summary report saved to directory-check-report.json');
  } catch (error) {
    console.log('⚠️  Could not save summary report');
  }
  
  return report;
}

async function main() {
  console.log('🚀 Starting directory structure check...\n');
  console.log('=' .repeat(50));
  console.log('Directory & File Structure Verification');
  console.log('Project: Administrative Scrivener Exam Learning System');
  console.log('=' .repeat(50));
  console.log('');
  
  try {
    // Run all checks
    await checkAndCreateDirectories();
    await checkRequiredFiles();
    await validateProjectStructure();
    await checkGitignore();
    await checkPermissions();
    
    // Generate summary
    const report = await generateSummaryReport();
    
    console.log('=' .repeat(50));
    console.log('✅ Directory structure check completed!');
    console.log('=' .repeat(50));
    console.log(`Directories: ${report.directories.existing}/${report.directories.total} exist`);
    console.log(`Files: ${report.files.existing}/${report.files.total} exist`);
    
    if (report.files.missing === 0) {
      console.log('🎉 All checks passed! Project structure is ready.');
    } else {
      console.log('⚠️  Some files are missing. Please check the output above.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ An error occurred during the check:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  checkDirectory,
  checkFile,
  createDirectory,
  checkAndCreateDirectories,
  checkRequiredFiles,
  requiredDirectories,
  requiredFiles
};
