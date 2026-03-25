// ディレクトリ作成確認用スクリプト
const fs = require('fs');
const path = require('path');

async function checkAndCreateDirectories() {
  const directories = [
    path.join(process.cwd(), 'content'),
    path.join(process.cwd(), 'content/units'),
    path.join(process.cwd(), 'public/pdf'),
    path.join(process.cwd(), 'public/audio'),
    path.join(process.cwd(), 'temp')
  ];

  console.log('🔧 Checking directory structure...\\n');
  
  for (const dir of directories) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      } else {
        console.log(`✓ Directory already exists: ${dir}`);
      }
      
      // ディレクトリの権限を確認
      const stats = fs.statSync(dir);
      console.log(`   Mode: ${stats.mode.toString(8)}`);
    } catch (error) {
      console.error(`❌ Error with directory ${dir}:`, error.message);
    }
  }
  
  console.log('\\n✨ Directory check complete!');
}

checkAndCreateDirectories().catch(console.error);
