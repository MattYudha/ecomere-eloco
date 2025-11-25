const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Assuming prisma config is here
const authMiddleware = require('../middleware/auth'); // Assuming auth middleware is here

// Controller to get all wishlist items for the authenticated user
const getAllWishlistItems = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user.id is set by authMiddleware

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            mainImage: true,
          },
        },
      },
    });

    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist items' });
  }
};

// Controller to add a product to the wishlist
const addWishlistItem = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user.id is set by authMiddleware
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if the item already exists in the wishlist
    const existingWishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingWishlistItem) {
      return res.status(409).json({ error: 'Product already in wishlist' });
    }

    const newWishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    res.status(201).json(newWishlistItem);
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    res.status(500).json({ error: 'Failed to add product to wishlist' });
  }
};

// Controller to remove a product from the wishlist
const removeWishlistItem = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user.id is set by authMiddleware
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    await prisma.wishlist.deleteMany({ // deleteMany to handle cases where there might be duplicates (though schema prevents it)
      where: {
        userId,
        productId,
      },
    });

    res.status(204).send(); // No content for successful deletion
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove product from wishlist' });
  }
};

router.route('/')
  .get(authMiddleware, getAllWishlistItems)
  .post(authMiddleware, addWishlistItem);

router.route('/:productId')
  .delete(authMiddleware, removeWishlistItem);

module.exports = router;