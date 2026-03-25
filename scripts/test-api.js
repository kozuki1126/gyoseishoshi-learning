// ファイル保存・再生のテストスクリプト
const http = require('http');
const path = require('path');
const fs = require('fs');

async function testApi() {
  console.log('🔍 APIテスト開始\\n');
  
  // テスト対象のURL
  const baseUrl = 'http://localhost:3000';
  
  // 1. ディレクトリ構造を確認
  const directories = [
    path.join(process.cwd(), 'content/units'),
    path.join(process.cwd(), 'public/pdf'),
    path.join(process.cwd(), 'public/audio'),
    path.join(process.cwd(), 'temp')
  ];
  
  console.log('📁 ディレクトリの存在確認:');
  for (const dir of directories) {
    console.log(`${fs.existsSync(dir) ? '✓' : '✗'} ${dir}`);
  }
  console.log('');
  
  // 2. サンプルファイルの存在を確認
  const sampleFiles = [
    path.join(process.cwd(), 'public/pdf/101_constitutional_overview.pdf'),
    path.join(process.cwd(), 'public/audio/101_constitutional_overview.mp3')
  ];
  
  console.log('📄 サンプルファイルの存在確認:');
  for (const file of sampleFiles) {
    console.log(`${fs.existsSync(file) ? '✓' : '✗'} ${file}`);
  }
  console.log('');
  
  // 3. APIエンドポイントのテスト (GETリクエスト)
  console.log('🌐 APIエンドポイントのテスト:');
  
  const testGetRequest = (url) => {
    return new Promise((resolve, reject) => {
      const req = http.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          console.log(`GET ${url}:`);
          console.log(`  Status: ${res.statusCode}`);
          try {
            const json = JSON.parse(data);
            console.log(`  Response: ${JSON.stringify(json, null, 2)}`);
          } catch (e) {
            console.log(`  Response: ${data.substring(0, 100)}...`);
          }
          console.log('');
          resolve();
        });
      });
      
      req.on('error', (error) => {
        console.error(`Error with ${url}:`, error.message);
        resolve();
      });
    });
  };
  
  // 各APIエンドポイントをテスト
  await testGetRequest(`${baseUrl}/api/content/subjects`);
  await testGetRequest(`${baseUrl}/api/content/units?id=101`);
  await testGetRequest(`${baseUrl}/api/content/search?q=憲法`);
  
  console.log('🔚 テスト完了');
}

// 開発サーバーが起動しているか確認
console.log('📡 開発サーバーへの接続テスト...');
testApi().catch(console.error);
