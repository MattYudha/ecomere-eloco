const fs = require('fs');
const path = require('path');

async function testBulkUploadCurl() {
  console.log('🧪 Testing Bulk Upload with curl command\n');

  const csvPath = path.join(__dirname, '../../bulk-upload-example.csv');

  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found:', csvPath);
    return;
  }

  console.log('✅ CSV file found:', csvPath);
  console.log('\n📋 Run this command in PowerShell:\n');
  console.log(
    `curl -X POST http://localhost:3001/api/bulk-upload -F "file=@${csvPath}"`,
  );
  console.log('\n');
}

testBulkUploadCurl();
