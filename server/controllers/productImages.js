const prisma = require('../utils/db');
const cloudinary = require('../utils/cloudinary');
const { nanoid } = require('nanoid');

async function getSingleProductImages(request, response) {
  const { id } = request.params;
  const images = await prisma.image.findMany({
    where: { productID: id },
  });
  if (!images) {
    return response.json({ error: 'Images not found' }, { status: 404 });
  }
  return response.json(images);
}

async function createImage(request, response) {
  try {
    // 1. Check if files were uploaded
    if (!request.files || Object.keys(request.files).length === 0) {
      return response.status(400).json({ message: 'No files were uploaded.' });
    }

    const uploadedFile = request.files.uploadedFile;
    const { productID } = request.body;

    // 2. Check if productID is provided
    if (!productID) {
      return response.status(400).json({ message: 'Product ID is required.' });
    }

    // 3. Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'eloco/products/gallery',
        public_id: `${nanoid()}_${uploadedFile.name.replace(/\.[^/.]+$/, "")}`,
        resource_type: 'auto',
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return response.status(500).json({ error: 'Error uploading image to Cloudinary' });
        }

        try {
          // 4. Create image record in the database
          const newImage = await prisma.image.create({
            data: {
              imageID: nanoid(),
              productID: productID,
              image: result.secure_url, // Save Cloudinary URL
            },
          });
          return response.status(201).json(newImage);
        } catch (dbError) {
          console.error('Database error:', dbError);
          // Cleanup Cloudinary
          await cloudinary.uploader.destroy(result.public_id);
          return response
            .status(500)
            .json({ error: 'Error saving image to database' });
        }
      }
    );

    uploadStream.end(uploadedFile.data);

  } catch (error) {
    console.error('Error creating image:', error);
    return response.status(500).json({ error: 'Error creating image' });
  }
}

async function updateImage(request, response) {
  try {
    const { id } = request.params; // Getting product id from params
    const { productID, image } = request.body;

    // Checking whether photo exists for the given product id
    const existingImage = await prisma.image.findFirst({
      where: {
        productID: id, // Finding photo with a product id
      },
    });

    // if photo doesn't exist, return coresponding status code
    if (!existingImage) {
      return response
        .status(404)
        .json({ error: 'Image not found for the provided productID' });
    }

    // Updating photo using coresponding imageID
    const updatedImage = await prisma.image.update({
      where: {
        imageID: existingImage.imageID, // Using imageID of the found existing image
      },
      data: {
        productID: productID,
        image: image,
      },
    });

    return response.json(updatedImage);
  } catch (error) {
    console.error('Error updating image:', error);
    return response.status(500).json({ error: 'Error updating image' });
  }
}

async function deleteImage(request, response) {
  try {
    const { id } = request.params;

    // Find images to delete from Cloudinary
    const images = await prisma.image.findMany({
      where: { productID: String(id) }
    });

    for (const img of images) {
      if (img.image.includes('cloudinary')) {
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
        const match = img.image.match(regex);
        if (match && match[1]) {
          await cloudinary.uploader.destroy(match[1]);
        }
      }
      // If local file, we might want to try deleting it too but let's assume moving forward we use Cloudinary
    }

    await prisma.image.deleteMany({
      where: {
        productID: String(id), // Converting id to string
      },
    });
    return response.status(204).send();
  } catch (error) {
    console.error('Error deleting image:', error);
    return response.status(500).json({ error: 'Error deleting image' });
  }
}

module.exports = {
  getSingleProductImages,
  createImage,
  updateImage,
  deleteImage,
};
