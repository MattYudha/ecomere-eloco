const prisma = require("../utills/db");
const { nanoid } = require("nanoid");
const path = require('path');
const fs = require('fs').promises; // Import fs.promises for async file operations

async function uploadMainImage(req, res) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const uploadedFile = req.files.uploadedFile;
    const { productID } = req.body;

    if (!productID) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    const imagePath = '/uploads/' + `${nanoid()}_${uploadedFile.name}`;
    const movePath = path.join(__dirname, '..', '..', 'public', imagePath);

    uploadedFile.mv(movePath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      try {
        const updatedProduct = await prisma.product.update({
          where: {
            id: productID,
          },
          data: {
            mainImage: imagePath,
          },
        });
        res.status(200).json({ 
          message: "File uploaded successfully",
          imagePath: imagePath // Return the imagePath
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
        // Attempt to delete the uploaded file if DB update fails
        try {
          await fs.unlink(movePath);
          console.log(`Cleaned up uploaded file: ${movePath}`);
        } catch (cleanupError) {
          console.error(`Failed to clean up uploaded file: ${cleanupError}`);
        }
        return res.status(500).json({ error: "Error updating product main image" });
      }
    });
  } catch (error) {
    console.error("Error uploading main image:", error);
    return res.status(500).json({ error: "Error uploading main image" });
  }
}

async function deleteMainImage(req, res) {
  try {
    const { id: productId } = req.params; // Product ID from URL params
    const { imagePath: imagePathToDelete } = req.body; // Image path from request body

    if (!productId || !imagePathToDelete) {
      return res.status(400).json({ message: "Product ID and image path are required." });
    }

    // 1. Find the product and verify the image
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.mainImage !== imagePathToDelete) {
      // This is a security check to prevent deleting arbitrary files
      return res.status(403).json({ message: "Unauthorized: Image path does not match product's main image." });
    }

    if (!product.mainImage) {
      return res.status(404).json({ message: "No main image found for this product to delete." });
    }

    // 2. Construct absolute path to the file
    const absolutePathToDelete = path.join(__dirname, '..', '..', 'public', imagePathToDelete);

    // 3. Delete physical file
    try {
      await fs.unlink(absolutePathToDelete);
      console.log(`Successfully deleted file: ${absolutePathToDelete}`);
    } catch (fileError) {
      if (fileError.code === 'ENOENT') {
        // File not found, proceed to update DB as it might have been deleted manually
        console.warn(`File not found on disk, but proceeding with DB update: ${absolutePathToDelete}`);
      } else {
        console.error("Error deleting physical file:", fileError);
        return res.status(500).json({ error: "Error deleting physical image file." });
      }
    }

    // 4. Update database
    await prisma.product.update({
      where: { id: productId },
      data: { mainImage: null },
    });

    res.status(200).json({ message: "Main image deleted successfully." });

  } catch (error) {
    console.error("Error deleting main image:", error);
    return res.status(500).json({ error: "An unexpected error occurred while deleting the main image." });
  }
}

module.exports = {
    uploadMainImage,
    deleteMainImage
};