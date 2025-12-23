'use client';

import React, { useState, useEffect } from 'react';
import ProductItem, { Product } from './ProductItem';
import Image from 'next/image';
import apiClient from '@/lib/api';


const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/api/products?featured=true'); // Assuming an endpoint for featured products
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setProducts(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div
      id="featured-products"
      className="relative py-24 bg-white dark:bg-dark-bg isolate overflow-hidden"
    >
      {/* Subtle background glow for light mode */}
      <div className="absolute inset-0 overflow-hidden -z-10 dark:hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-brand/5 rounded-full blur-3xl"
          style={{ opacity: '0.03' }}
        ></div>
      </div>


      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-gray-800 to-brand text-transparent bg-clip-text dark:from-white dark:to-brand">
          Our Featured Products
        </h2>

        {loading ? (
          <div className="text-center text-lg text-gray-500 dark:text-gray-400">
            Loading featured products...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {products.length > 0 ? (
              products.map((product: Product) => (
                <ProductItem key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
                <p>No featured products available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsSection;
