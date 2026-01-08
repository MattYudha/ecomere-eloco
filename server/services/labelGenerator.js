const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Template version
const TEMPLATE_VERSION = 'v2';

// Browser management
let browser = null;
let activePagesCount = 0;
const MAX_CONCURRENT_PAGES = 2;
const BROWSER_TIMEOUT = 30000; // 30 seconds

// QR Code helpers
function generateChecksum(orderId) {
  // Simple CRC-like checksum (first 4 chars of hash)
  const hash = crypto
    .createHash('md5')
    .update(orderId)
    .digest('hex');
  return hash.substring(0, 4);
}

async function generateQRCodeDataURL(order) {
  try {
    const payload = {
      v: 1,  // Version flag
      orderId: order.id,
      checksum: generateChecksum(order.id)
    };

    return await QRCode.toDataURL(JSON.stringify(payload), {
      width: 150,
      margin: 1,
      errorCorrectionLevel: 'M'
    });
  } catch (error) {
    console.error('[QR] Generation failed for order:', order.id, error);
    return null; // Graceful fallback
  }
}

// Health check & auto-recovery
async function getBrowser() {
  try {
    // Check if browser exists and is connected
    if (browser && browser.isConnected()) {
      return browser;
    }

    // Browser dead or doesn't exist → relaunch
    console.log('[Puppeteer] Launching new browser instance...');

    // Railway/production: use system chromium
    const launchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Prevent memory issues
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions'
      ],
      timeout: BROWSER_TIMEOUT
    };

    // In production (Railway), use system chromium
    if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
      launchOptions.executablePath = '/nix/store/*-chromium-*/bin/chromium';
    }

    browser = await puppeteer.launch(launchOptions);

    // Handle browser disconnect
    browser.on('disconnected', () => {
      console.warn('[Puppeteer] Browser disconnected');
      browser = null;
      activePagesCount = 0;
    });

    return browser;
  } catch (error) {
    console.error('[Puppeteer] Failed to launch browser:', error);
    browser = null;
    throw new Error('Failed to initialize PDF generator');
  }
}

// Separate template function (maintainability)
async function generateLabelHTML(order, qrCodeDataURL = null) {
  // Escape HTML to prevent XSS
  const escape = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="template-version" content="${TEMPLATE_VERSION}">
      <style>
        @page {
          size: A6 landscape;
          margin: 0;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          width: 14.8cm;
          height: 10.5cm;
          padding: 0.5cm;
          font-family: Arial, sans-serif;
          background: white;
          color: #000;
          font-size: 9pt;
          border: 1px solid #ddd;
        }
        
        /* Header with logo and status */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.3cm;
          border-bottom: 2px dashed #ccc;
          padding-bottom: 0.3cm;
        }
        
        .logo-section {
          flex: 1;
        }
        
        .logo {
          font-size: 18pt;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 0.1cm;
        }
        
        .logo .brand {
          color: #ff6b35;
        }
        
        .logo .dot {
          color: #000;
        }
        
        .order-id {
          font-size: 8pt;
          color: #666;
          margin-bottom: 0.2cm;
        }
        
        .courier-info {
          display: flex;
          align-items: center;
          gap: 0.3cm;
        }
        
        .courier-logo {
          font-size: 12pt;
          font-weight: bold;
          color: #ff6b35;
        }
        
        .courier-service {
          font-size: 9pt;
          color: #666;
        }
        
        /* Status section - right side */
        .status-section {
          text-align: right;
        }
        
        .tracking-number {
          font-size: 12pt;
          font-weight: bold;
          color: #000;
        }
        
        .tracking-note {
          font-size: 7pt;
          color: #999;
          font-style: italic;
          margin-top: 0.1cm;
        }
        
        /* Payment notice with status */
        .payment-notice {
          background: #f5f5f5;
          border: 1px solid #ccc;
          padding: 0.25cm;
          margin: 0.3cm 0;
          font-size: 8pt;
          line-height: 1.5;
        }
        
        .payment-notice .payment-status {
          font-weight: 600;
          color: #16a34a;
          margin-bottom: 0.1cm;
        }
        
        /* Two column layout */
        .info-section {
          display: flex;
          gap: 0.5cm;
          margin: 0.3cm 0;
          border-bottom: 1px dashed #ccc;
          padding-bottom: 0.3cm;
        }
        
        .column {
          flex: 1;
        }
        
        .column-title {
          font-weight: bold;
          font-size: 9pt;
          margin-bottom: 0.2cm;
          color: #000;
        }
        
        .info-row {
          margin-bottom: 0.1cm;
          line-height: 1.4;
        }
        
        .label {
          font-weight: bold;
          color: #000;
        }
        
        .value {
          color: #333;
        }
        
        .address {
          color: #333;
          line-height: 1.5;
          max-height: 2cm;
          overflow: hidden;
          word-break: break-word;
        }
        
        /* Product table */
        .product-section {
          margin-top: 0.3cm;
        }
        
        .product-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 8pt;
        }
        
        .product-table th {
          background: #f5f5f5;
          border: 1px solid #ddd;
          padding: 0.1cm;
          text-align: left;
          font-weight: bold;
        }
        
        .product-table td {
          border: 1px solid #ddd;
          padding: 0.1cm;
        }
        
        /* Footer */
        .footer {
          position: absolute;
          bottom: 0.3cm;
          left: 0.5cm;
          right: 0.5cm;
          text-align: center;
          font-size: 7pt;
          color: #999;
        }
        
        /* QR Code Page */
        .qr-page {
          page-break-before: always;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 10.5cm;
        }
        
        .qr-container {
          text-align: center;
          border: 2px dashed #ccc;
          padding: 1cm;
          border-radius: 8px;
        }
        
        .qr-container img {
          width: 5cm;
          height: 5cm;
        }
        
        .qr-text {
          margin-top: 0.5cm;
          font-size: 9pt;
          color: #666;
        }
      </style>
    </head>
    <body data-template-version="${TEMPLATE_VERSION}">
      <!-- Page 1: Shipping Label -->
      <div class="header">
        <div class="logo-section">
          <div class="logo">
            <span class="brand">ELOQO</span><span class="dot">.CO</span>
          </div>
          <div class="order-id">INV/${escape(order.id.substring(0, 13))}</div>
          <div class="courier-info">
            <span class="courier-logo">${escape(order.courier)}</span>
            <span class="courier-service">${escape(order.courierService || 'Regular')}</span>
          </div>
        </div>
        <div class="status-section">
          <div class="tracking-number">${escape(order.id.substring(0, 13).toUpperCase())}</div>
          <div class="tracking-note">Kode Booking Ini Bukan No Resi Pengiriman</div>
        </div>
      </div>
      
      <div class="payment-notice">
        <div class="payment-status">Pembayaran: Non Tunai</div>
        <div>Penjual tidak perlu bayar apapun ke kurir, sudah dibayarkan otomatis.</div>
      </div>
      
      <div class="info-section">
        <div class="column">
          <div class="column-title">Kepada:</div>
          <div class="info-row">
            <div class="label">${escape(order.name)} ${escape(order.lastname)}</div>
          </div>
          <div class="info-row address">
            ${escape(order.adress)}${order.apartment ? ', ' + escape(order.apartment) : ''}<br>
            ${order.company ? escape(order.company) + ', ' : ''}${escape(order.city)}<br>
            ${escape(order.country)}<br>
            ${escape(order.phone)}
          </div>
        </div>
        
        <div class="column">
          <div class="column-title">Dari:</div>
          <div class="info-row">
            <div class="label">ELOCO E-Commerce</div>
          </div>
          <div class="info-row address">
            Jl. Contoh Alamat Toko<br>
            Jakarta Selatan, DKI Jakarta<br>
            Indonesia<br>
            +62 812-3456-7890
          </div>
        </div>
      </div>
      
      <div class="product-section">
        <table class="product-table">
          <thead>
            <tr>
              <th>Produk</th>
              <th style="width: 2cm;">Berat</th>
              <th style="width: 2.5cm;">Ongkir</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Order #${escape(order.id.substring(0, 8))}</td>
              <td>-</td>
              <td>Rp ${order.total.toLocaleString('id-ID')}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="footer">
        Kode Pos: ${escape(order.postalCode)} | Powered by ELOCO E-Commerce
      </div>
      
      <!-- Page 2: QR Code -->
      <div class="qr-page">
        <div class="qr-container">
          ${qrCodeDataURL
      ? `<img src="${qrCodeDataURL}" alt="QR Code" />
                 <div class="qr-text">Scan untuk verifikasi order</div>`
      : `<div style="padding: 2cm; color: #999;">
                   <div style="font-weight: bold;">Order ID:</div>
                   <div style="font-family: monospace;">${escape(order.id)}</div>
                 </div>`
    }
        </div>
      </div>
    </body>
    </html>
  `;
}

// Main PDF generation with concurrency control
async function generateShippingLabel(order) {
  // Concurrency limit
  if (activePagesCount >= MAX_CONCURRENT_PAGES) {
    throw new Error('PDF generator busy. Please try again.');
  }

  let page = null;

  try {
    activePagesCount++;

    const browserInstance = await getBrowser();
    page = await browserInstance.newPage();

    // Set timeout for page operations
    page.setDefaultTimeout(15000);

    // Generate QR code
    const qrCodeDataURL = await generateQRCodeDataURL(order);

    // Generate HTML
    const html = await generateLabelHTML(order, qrCodeDataURL);

    // Set content
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 10000
    });

    // Generate PDF - format A6 handles sizing
    const pdf = await page.pdf({
      format: 'A6',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });

    return pdf;

  } catch (error) {
    console.error('[Puppeteer] Error generating label:', error);
    throw error;
  } finally {
    // Always cleanup
    if (page) {
      try {
        await page.close();
      } catch (e) {
        console.error('[Puppeteer] Error closing page:', e);
      }
    }
    activePagesCount--;
  }
}

// Bulk label generation with partial failure handling
async function generateBulkLabels(orders) {
  const browserInstance = await getBrowser();
  const page = await browserInstance.newPage();

  const successfulLabels = [];
  const failedOrders = [];

  try {
    for (const order of orders) {
      try {
        // Generate QR code for each order
        const qrCodeDataURL = await generateQRCodeDataURL(order);
        const html = await generateLabelHTML(order, qrCodeDataURL);
        successfulLabels.push(html);
      } catch (error) {
        console.error('[Bulk] Failed to generate label for order:', order.id, error);
        failedOrders.push({
          orderId: order.id,
          error: error.message
        });
        // Continue with next order
      }
    }

    if (successfulLabels.length === 0) {
      throw new Error('All labels failed to generate');
    }

    // Generate multi-page PDF
    const fullHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    /* Same styles as single label */
                </style>
            </head>
            <body>
                ${successfulLabels.join('<div style="page-break-after: always;"></div>')}
            </body>
            </html>
        `;

    await page.setContent(fullHTML, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A6',
      printBackground: true,
      preferCSSPageSize: true
    });

    return {
      pdf,
      stats: {
        total: orders.length,
        successful: successfulLabels.length,
        failed: failedOrders.length,
        failedOrders
      }
    };

  } finally {
    await page.close();
  }
}

// Graceful shutdown
async function cleanup() {
  if (browser) {
    try {
      await browser.close();
    } catch (e) {
      console.error('[Puppeteer] Error closing browser:', e);
    } finally {
      browser = null;
      activePagesCount = 0;
    }
  }
}

// Handle process termination
process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);

module.exports = {
  generateShippingLabel,
  generateBulkLabels,
  cleanup
};
