const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ✅ Sanitize search query
const sanitizeQuery = (query) => {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .slice(0, 50); // Max 50 characters
};

async function searchProducts(request, response) {
  try {
    const { query } = request.query;
    if (!query) {
      return response
        .status(400)
        .json({ error: 'Query parameter is required' });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
        ],
      },
    });

    return response.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    return response.status(500).json({ error: 'Error searching products' });
  }
}

// ✅ NEW: Autocomplete endpoint with minimal payload
async function autocomplete(request, response) {
  try {
    const { q, limit = 5 } = request.query;

    // ✅ Validate query
    if (!q || q.trim().length < 2) {
      return response.json([]);
    }

    // ✅ Sanitize query
    const sanitizedQuery = sanitizeQuery(q);

    // ✅ Minimal select for performance
    const suggestions = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: sanitizedQuery, mode: 'insensitive' } },
          { description: { contains: sanitizedQuery, mode: 'insensitive' } }
        ],
        inStock: 1 // Only in-stock products
      },
      select: {
        id: true,
        slug: true,
        title: true
        // ✅ No image, price, etc. for performance
      },
      take: Number(limit),
      orderBy: {
        rating: 'desc' // Show best-rated first
      }
    });

    return response.json(suggestions);
  } catch (error) {
    console.error('Autocomplete error:', error);
    return response.status(500).json([]);
  }
}

module.exports = { searchProducts, autocomplete };
