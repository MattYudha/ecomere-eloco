// Test untuk menambahkan produk
const API_BASE_URL = 'http://localhost:3001';

async function testCreateProduct(categoryId) {
  console.log('🔍 Testing create product API...\n');

  // Data produk test
  const productData = {
    title: 'Test Product dari API',
    slug: `test-product-${Date.now()}`,
    price: 999,
    manufacturer: 'Test Manufacturer',
    description: 'This is a test product',
    mainImage: 'test-product.jpg',
    categoryId: categoryId, // Menggunakan category ID yang valid
    inStock: 10,
  };

  console.log('📦 Product data:');
  console.log(JSON.stringify(productData, null, 2));
  console.log('\n');

  try {
    console.log(`📤 Sending POST request to ${API_BASE_URL}/api/products...\n`);

    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    console.log(`📥 Response status: ${res.status}`);

    const text = await res.text();
    console.log(`📥 Response body:`);

    try {
      const json = JSON.parse(text);
      console.log(JSON.stringify(json, null, 2));
    } catch {
      console.log(text);
    }

    if (res.status === 201) {
      console.log('\n✅ Product created successfully!');
    } else {
      console.log('\n❌ Failed to create product');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

// Pertama, ambil daftar kategori
async function getCategories() {
  console.log('📋 Getting categories first...\n');

  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`);
    const categories = await res.json();

    console.log('Available categories:');
    categories.forEach((cat) => {
      console.log(`  - ${cat.name} (ID: ${cat.id})`);
    });

    if (categories.length > 0) {
      console.log(`\n✅ Using category: ${categories[0].name}`);
      return categories[0].id;
    }

    return null;
  } catch (error) {
    console.error('❌ Error getting categories:', error.message);
    return null;
  }
}

// Main
(async () => {
  const categoryId = await getCategories();

  if (!categoryId) {
    console.error(
      '\n❌ No categories available. Please create a category first.',
    );
    process.exit(1);
  }

  // Update data dengan category ID yang valid
  console.log('\n' + '='.repeat(60) + '\n');
  await testCreateProduct(categoryId);
})();
