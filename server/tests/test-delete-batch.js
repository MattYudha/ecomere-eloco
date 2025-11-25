const fetch = require('node-fetch');

async function testDeleteBatch() {
  console.log('🧪 Testing Delete Batch Functionality\n');

  const BASE_URL = 'http://localhost:3001/api/bulk-upload';

  try {
    // 1. Get list of batches
    console.log('1️⃣ Getting batch list...');
    const listResponse = await fetch(BASE_URL);
    const listData = await listResponse.json();

    if (!listData.batches || listData.batches.length === 0) {
      console.log('❌ No batches found. Upload a CSV first.');
      console.log('\n💡 Run this command:');
      console.log(
        'curl.exe -X POST http://localhost:3001/api/bulk-upload -F "file=@bulk-upload-example.csv"',
      );
      return;
    }

    console.log(`✅ Found ${listData.batches.length} batches`);

    // Get the latest batch
    const latestBatch = listData.batches[0];
    console.log(`\n📦 Latest Batch:`);
    console.log(`   ID: ${latestBatch.id}`);
    console.log(`   File: ${latestBatch.fileName}`);
    console.log(`   Status: ${latestBatch.status}`);
    console.log(
      `   Products: ${latestBatch.successfulRecords}/${latestBatch.totalRecords}`,
    );

    // 2. Test Delete Batch Only (keep products)
    console.log('\n2️⃣ Testing DELETE batch only (keep products)...');
    console.log(`   URL: ${BASE_URL}/${latestBatch.id}?deleteProducts=false`);

    const deleteResponse = await fetch(
      `${BASE_URL}/${latestBatch.id}?deleteProducts=false`,
      { method: 'DELETE' },
    );

    console.log(
      `   Status: ${deleteResponse.status} ${deleteResponse.statusText}`,
    );

    const contentType = deleteResponse.headers.get('content-type');
    console.log(`   Content-Type: ${contentType}`);

    if (contentType && contentType.includes('application/json')) {
      const text = await deleteResponse.text();
      console.log(`   Response Body: ${text}`);

      if (text) {
        const deleteData = JSON.parse(text);

        if (deleteResponse.ok) {
          console.log('\n✅ DELETE Success!');
          console.log(`   Message: ${deleteData.message}`);
          console.log(`   Products Deleted: ${deleteData.deletedProducts}`);
        } else {
          console.log('\n❌ DELETE Failed!');
          console.log(`   Error: ${deleteData.error}`);
        }
      } else {
        console.log('\n⚠️ Empty response body');
      }
    } else {
      const text = await deleteResponse.text();
      console.log(`   Response (non-JSON): ${text}`);
    }

    // 3. Verify batch deleted
    console.log('\n3️⃣ Verifying batch deleted...');
    const verifyResponse = await fetch(BASE_URL);
    const verifyData = await verifyResponse.json();

    const stillExists = verifyData.batches.find((b) => b.id === latestBatch.id);

    if (stillExists) {
      console.log('❌ Batch still exists!');
    } else {
      console.log('✅ Batch successfully deleted from list');
    }

    console.log(`\n📊 Remaining batches: ${verifyData.batches.length}`);
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run test
console.log('Starting test...\n');
testDeleteBatch()
  .then(() => {
    console.log('\n✅ Test completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });
