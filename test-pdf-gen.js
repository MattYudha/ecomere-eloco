const fs = require('fs');
const { generateSalesReportPDFStream } = require('./server/services/reportGenerator');

// Mock filters
const filters = {
    from: '2025-11-30',
    to: '2025-12-30',
    status: 'delivered,shipped'
};

const res = fs.createWriteStream('test-report.pdf');

console.log('Starting PDF generation test...');

generateSalesReportPDFStream(res, filters)
    .then(() => {
        console.log('PDF generation finished.');
    })
    .catch(err => {
        console.error('PDF generation error:', err);
    });
