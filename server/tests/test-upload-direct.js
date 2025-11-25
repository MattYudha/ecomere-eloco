const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testBulkUpload() {
  console.log('🧪 Testing Bulk Upload API Direct\n');

  const csvPath = path.join(__dirname, '../../bulk-upload-example.csv');

  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found:', csvPath);
    return;
  }

  console.log('✅ CSV file found:', csvPath);

  const formData = new FormData();
  formData.append('file', fs.createReadStream(csvPath));

  try {
    const response = await fetch('http://localhost:3001/api/bulk-upload', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    console.log('📡 Response status:', response.status);
    const text = await response.text();
    console.log('📄 Response body:', text);

    if (response.ok) {
      const data = JSON.parse(text);
      console.log('\n✅ Upload successful!');
      console.log('Batch ID:', data.batchId);
      console.log('Status:', data.status);
      console.log('Summary:', data);
    } else {
      console.log('\n❌ Upload failed');
      try {
        const error = JSON.parse(text);
        console.log('Error:', error);
      } catch {
        console.log('Raw error:', text);
      }
    }
  } catch (error) {
    console.error('\n❌ Request error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testBulkUpload();
