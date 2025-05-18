const fs = require('fs');
const path = require('path');

// 必要なディレクトリを作成する関数
function createDirectories() {
  const directories = [
    path.join(process.cwd(), 'content'),
    path.join(process.cwd(), 'content/units'),
    path.join(process.cwd(), 'public/pdf'),
    path.join(process.cwd(), 'public/audio')
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✓ Created directory: ${dir}`);
    } else {
      console.log(`✓ Directory already exists: ${dir}`);
    }
  });
}

// 初期化スクリプト実行
console.log('🔧 Setting up directory structure for content management...\n');
createDirectories();
console.log('\n✨ Setup complete! You can now start the development server.');
console.log('Run: npm run dev');