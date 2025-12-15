const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'debug_notification.txt');

const logDebug = (message, data = null) => {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] ${message}`;

    if (data) {
        try {
            logMessage += `\nData: ${JSON.stringify(data, null, 2)}`;
        } catch (e) {
            logMessage += `\nData: [Circular or Non-JSON]`;
        }
    }

    logMessage += '\n' + '-'.repeat(50) + '\n';

    fs.appendFile(logPath, logMessage, (err) => {
        if (err) console.error('Failed to write to debug log:', err);
    });
};

module.exports = { logDebug };
