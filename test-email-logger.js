const emailLogger = require('./server/utils/emailLogger');

console.log('Testing email logger...');
emailLogger.info({
    event: 'email_sent',
    type: 'test_email',
    orderId: 'TEST-123',
    userId: 'USER-001',
    duration: '100ms'
});

emailLogger.error({
    event: 'email_failed',
    type: 'test_email',
    orderId: 'TEST-124',
    userId: 'USER-002',
    error: 'Simulated error',
    stack: 'Error: Simulated error\n    at Object.<anonymous>...'
});

console.log('Logs written.');
