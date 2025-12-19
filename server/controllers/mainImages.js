const prisma = require('../utils/db');
const cloudinary = require('../utils/cloudinary');
const { nanoid } = require('nanoid');

async function uploadMainImage(req, res) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const uploadedFile = req.files.uploadedFile;
    const { productID } = req.body;

    if (!productID) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    // Upload to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'eloco/products',
        public_id: `${nanoid()}_${uploadedFile.name.replace(/\.[^/.]+$/, "")}`, // Remove extension for public_id
        resource_type: 'auto',
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
        }

        try {
          const imagePath = result.secure_url; // Use the secure URL from Cloudinary

          await prisma.product.update({
            where: { id: productID },
            data: { mainImage: imagePath },
          });

          res.status(200).json({
            message: 'File uploaded successfully',
            imagePath: imagePath,
          });
        } catch (dbError) {
          console.error('Database error:', dbError);
          // Try to delete from Cloudinary if DB update fails
          await cloudinary.uploader.destroy(result.public_id);

          return res
            .status(500)
            .json({ error: 'Error updating product main image in database' });
        }
      }
    );

    // Write buffer to stream
    uploadStream.end(uploadedFile.data);

  } catch (error) {
    console.error('Error in uploadMainImage:', error);
    return res.status(500).json({ error: 'Unexpected error during upload' });
  }
}

async function deleteMainImage(req, res) {
  try {
    const { id: productId } = req.params;
    const { imagePath } = req.body; // Expecting the full URL or we need to extract public_id

    if (!productId || !imagePath) {
      return res
        .status(400)
        .json({ message: 'Product ID and image path are required.' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Authorization check (loose, as extraction is needed)
    if (product.mainImage !== imagePath) {
      return res.status(403).json({ message: "Image path mismatch." });
    }

    // DELETE FROM CLOUDINARY
    // Extract public_id from URL
    // Format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<public_id>.<ext>
    // We need <folder>/<public_id>

    try {
      const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
      const match = imagePath.match(regex);
      if (match && match[1]) {
        const publicId = match[1];
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted from Cloudinary: ${publicId}`);
      } else {
        console.warn(`Could not extract public_id from: ${imagePath}. Skipping Cloudinary delete.`);
      }
    } catch (cloudError) {
      console.error('Error deleting from Cloudinary:', cloudError);
      // Continue to DB delete even if cloud fails? usually yes.
    }

    // UPDATE DATABASE
    await prisma.product.update({
      where: { id: productId },
      data: { mainImage: null },
    });

    res.status(200).json({ message: 'Main image deleted successfully.' });
  } catch (error) {
    console.error('Error deleting main image:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while deleting the main image.',
    });
  }
}

module.exports = {
  uploadMainImage,
  deleteMainImage,
};
