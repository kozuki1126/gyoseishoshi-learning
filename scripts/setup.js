const fs = require('fs').promises;
const path = require('path');

async function setup() {
  console.log('🔧 Setting up project directories...');

  const directories = [
    'content',
    'content/units',
    'public/audio',
    'public/pdf',
    'temp'
  ];

  for (const dir of directories) {
    const dirPath = path.join(process.cwd(), dir);
    try {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } catch (error) {
      if (error.code === 'EEXIST') {
        console.log(`📁 Directory already exists: ${dir}`);
      } else {
        console.error(`❌ Error creating directory ${dir}:`, error);
      }
    }
  }

  // Create .gitignore entries for dynamic content
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  const gitignoreContent = `
# Dynamic content directories
/temp
/public/audio/*.mp3
/public/audio/*.wav
/public/audio/*.m4a
/public/audio/*.ogg
/public/pdf/*.pdf
/content/units/*.meta.json
`;

  try {
    const existingContent = await fs.readFile(gitignorePath, 'utf-8').catch(() => '');
    if (!existingContent.includes('# Dynamic content directories')) {
      await fs.appendFile(gitignorePath, gitignoreContent);
      console.log('✅ Updated .gitignore');
    }
  } catch (error) {
    console.error('❌ Error updating .gitignore:', error);
  }

  console.log('✨ Setup completed!');
}

setup().catch(console.error);
