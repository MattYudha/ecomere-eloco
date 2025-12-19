const cloudinary = require('cloudinary').v2;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('CRITICAL ERROR: Cloudinary credentials are missing from environment variables!');
  console.error('CLOUDINARY_CLOUD_NAME:', cloudName ? 'Set' : 'Missing');
  console.error('CLOUDINARY_API_KEY:', apiKey ? 'Set' : 'Missing');
  console.error('CLOUDINARY_API_SECRET:', apiSecret ? 'Set' : 'Missing');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

module.exports = cloudinary;
