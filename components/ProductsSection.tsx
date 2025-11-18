'use client';

import React, { useState, useEffect } from "react";
import ProductItem, { Product } from "./ProductItem"; // Import Product type
import Heading from "./Heading";
import apiClient from "@/lib/api";

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/api/products');

        if (!response.ok) {
          console.error(
            'Failed to fetch products:',
            response.status,
            response.statusText,
          );
          setProducts([]);
        } else {
          try {
            const result = await response.json();
            setProducts(Array.isArray(result) ? result : []);
          } catch (jsonError) {
            console.error(
              'Error parsing JSON response from /api/products:',
              jsonError,
            );
            setProducts([]);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg text-gray-900 dark:text-white">
        Loading featured products...
      </div>
    );
  }

  return (
    <div
      id="featured-products" // Added ID for scrolling
      className="relative bg-cover bg-center bg-white dark:bg-gray-800"
      style={{ backgroundImage: "url('/footer-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>
      {/* Decorative Images */}
      <img src="/assets/shape-1.png" alt="Decorative Shape 1" className="absolute top-1/4 left-0 w-80 h-80 object-contain opacity-40 animate-float-slow z-0 max-md:hidden" />
      <img src="/assets/shape-2.png" alt="Decorative Shape 2" className="absolute bottom-1/4 right-20 w-[400px] h-[400px] object-contain opacity-30 animate-float-slow delay-500 z-0 max-md:hidden" />

      <div className="relative max-w-screen-2xl mx-auto pt-20">
        <Heading
          title="FEATURED PRODUCTS"
          className="text-black dark:text-white transform translate-y-[-120px] font-bold drop-shadow-sm"
        />
        <div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-x-2 px-10 gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 transform translate-y-[-80px]">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductItem key={product.id} product={product} color="white" />
            ))
          ) : (
            <div className="col-span-full text-center text-black dark:text-white py-10">
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
      {/* Smooth transition gradient to the footer */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent z-20"></div>
    </div>
  );
};

export default ProductsSection;
