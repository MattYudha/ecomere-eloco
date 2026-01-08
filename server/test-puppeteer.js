const puppeteer = require('puppeteer');

async function testPuppeteer() {
    console.log('Testing Puppeteer...');

    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        console.log('Browser launched! Creating page...');
        const page = await browser.newPage();

        console.log('Setting content...');
        await page.setContent('<h1>Test PDF</h1><p>This is a test.</p>');

        console.log('Generating PDF...');
        const pdf = await page.pdf({ format: 'A4' });

        console.log('PDF generated! Size:', pdf.length, 'bytes');
        console.log('First 50 bytes:', pdf.slice(0, 50).toString());

        await browser.close();
        console.log('✅ Puppeteer test PASSED!');

    } catch (error) {
        console.error('❌ Puppeteer test FAILED:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
    }
}

testPuppeteer();
