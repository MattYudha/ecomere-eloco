const https = require('https');

const PROD_URL = 'https://ecomere-eloco-production.up.railway.app';

const endpoints = [
    { path: '/health', method: 'GET' },
    { path: '/api/users/profile', method: 'GET' }, // Should be 401, not 502/503
    { path: '/api/notifications/test', method: 'GET' } // Check if this crashes
];

console.log(`🚀 Checking Production Health: ${PROD_URL}`);

const checkEndpoint = (path, method = 'GET') => {
    return new Promise((resolve) => {
        const options = {
            method,
            timeout: 10000
        };

        const req = https.request(`${PROD_URL}${path}`, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`[${method}] ${path} -> Status: ${res.statusCode}`);
                if (res.statusCode >= 500) {
                    console.error('❌ CRITICAL: Server Error (5xx)');
                } else if (res.statusCode === 200) {
                    console.log('✅ OK');
                } else {
                    console.log(`⚠️ Note: ${res.statusMessage}`);
                }
                resolve({ path, status: res.statusCode });
            });
        });

        req.on('error', (e) => {
            console.error(`❌ NETWORK ERROR ${path}:`, e.message);
            resolve({ path, error: e.message });
        });

        req.end();
    });
};

const runChecks = async () => {
    for (const endpoint of endpoints) {
        await checkEndpoint(endpoint.path, endpoint.method);
    }
};

runChecks();
