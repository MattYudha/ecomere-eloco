const cloudinary = require('cloudinary').v2;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Priority: CLOUDINARY_URL > Individual Keys
if (process.env.CLOUDINARY_URL) {
    console.log('✅ [Cloudinary] Configured using CLOUDINARY_URL.');
} else {
    if (!cloudName || !apiKey || !apiSecret) {
        console.error('❌ [Cloudinary] CRITICAL: Credentials missing! Set CLOUDINARY_URL or (CLOUD_NAME, API_KEY, API_SECRET).');
    } else {
        console.log('✅ [Cloudinary] Configured using individual keys.');
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
}

module.exports = cloudinary;