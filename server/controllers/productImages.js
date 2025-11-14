const prisma = require("../utills/db");
const { nanoid } = require("nanoid");
const path = require('path');

async function getSingleProductImages(request, response) {
  const { id } = request.params;
  const images = await prisma.image.findMany({
    where: { productID: id },
  });
  if (!images) {
    return response.json({ error: "Images not found" }, { status: 404 });
  }
  return response.json(images);
}

async function createImage(request, response) {
  try {
    // 1. Check if files were uploaded
    if (!request.files || Object.keys(request.files).length === 0) {
      return response.status(400).json({ message: "No files were uploaded." });
    }

    const uploadedFile = request.files.uploadedFile;
    const { productID } = request.body;

    // 2. Check if productID is provided
    if (!productID) {
      return response.status(400).json({ message: "Product ID is required." });
    }

    // 3. Move the file to the public directory
    const imagePath = '/uploads/' + `${nanoid()}_${uploadedFile.name}`;
    const movePath = path.join(__dirname, '..', '..', 'public', imagePath); // Corrected path construction

    uploadedFile.mv(movePath, async (err) => {
      if (err) {
        console.error(err);
        return response.status(500).send(err);
      }

      try {
        // 4. Create image record in the database
        const newImage = await prisma.image.create({
          data: {
            imageID: nanoid(),
            productID: productID,
            image: imagePath, // Save the web-accessible path
          },
        });
        return response.status(201).json(newImage);
      } catch (dbError) {
        console.error("Database error:", dbError);
        return response.status(500).json({ error: "Error saving image to database" });
      }
    });
  } catch (error) {
    console.error("Error creating image:", error);
    return response.status(500).json({ error: "Error creating image" });
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
        .json({ error: "Image not found for the provided productID" });
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
    console.error("Error updating image:", error);
    return response.status(500).json({ error: "Error updating image" });
  }
}

async function deleteImage(request, response) {
  try {
    const { id } = request.params;
    await prisma.image.deleteMany({
      where: {
        productID: String(id), // Converting id to string
      },
    });
    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting image:", error);
    return response.status(500).json({ error: "Error deleting image" });
  }
}



module.exports = {
  getSingleProductImages,
  createImage,
  updateImage,
  deleteImage,
};