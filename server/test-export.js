const fetch = require('node-fetch');

async function testExport() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const from = firstDay.toISOString().split('T')[0];
    const to = now.toISOString().split('T')[0];

    console.log('Testing CSV export...');
    console.log(`Date range: ${from} to ${to}\n`);

    const url = `http://localhost:3001/api/admin/reports/sales/export?from=${from}&to=${to}&format=csv`;
    console.log(`URL: ${url}\n`);

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer YOUR_TOKEN_HERE', // You'll need to replace this
                'Cookie': 'authToken=YOUR_TOKEN_HERE' // Or use cookie
            }
        });

        console.log(`Status: ${response.status}`);
        console.log(`Headers:`, response.headers.raw());

        const text = await response.text();
        console.log(`\nResponse length: ${text.length} bytes`);
        console.log(`\nFirst 500 chars of response:`);
        console.log(text.substring(0, 500));

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testExport();
