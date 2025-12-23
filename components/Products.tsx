'use client';

import React, { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import ProductSkeleton from './ProductSkeleton';
import apiClient from '@/lib/api';
import { useSortStore } from '@/app/_zustand/sortStore';
import { usePaginationStore } from '@/app/_zustand/paginationStore';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

import { Product } from './ProductItem'; // Import Product type

export default function Products({ params }: { params?: { slug?: string[] } }) {
  const { sortBy } = useSortStore();
  const { page } = usePaginationStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParamsHook = useSearchParams(); // Get searchParams using hook

  const inStock = searchParamsHook.get('inStock');
  const outOfStock = searchParamsHook.get('outOfStock');
  const price = searchParamsHook.get('price');
  const rating = searchParamsHook.get('rating');
  const pageParam = searchParamsHook.get('page');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      // getting all data from URL slug and preparing everything for sending GET request
      const inStockNum = inStock === 'true' ? 1 : 0;
      const outOfStockNum = outOfStock === 'true' ? 1 : 0;
      const currentPage = pageParam ? Number(pageParam) : page;

      let stockFilter = '';
      if (inStock === 'true' && outOfStock === 'true') {
        stockFilter = ''; // Show all, no specific stock filter needed
      } else if (inStock === 'true') {
        stockFilter = `filters[inStock][$equals]=1`;
      } else if (outOfStock === 'true') {
        stockFilter = `filters[inStock][$equals]=0`;
      }

      try {
        // Outer try block starts here
        const apiUrl = `/api/products?filters[price][$lte]=${price || 500000
          }&filters[rating][$gte]=${Number(rating) || 0
          }&${stockFilter ? stockFilter + '&' : ''}${(params?.slug?.length ?? 0) > 0
            ? `filters[category][$equals]=${params?.slug ? params.slug[0] : ''}&`
            : ''
          }sort=${sortBy}&page=${currentPage}`;

        console.log('Fetching products with URL:', apiUrl); // DEBUG LOG
        const response = await apiClient.get(apiUrl);

        if (!response.ok) {
          // If response is NOT ok (i.e., there was an error)
          console.error(
            'Failed to fetch products:',
            response.status,
            response.statusText,
          );
          setProducts([]);
        } else {
          // If response IS ok (i.e., successful response)
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
        // Outer catch block
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params, sortBy, page, inStock, outOfStock, price, rating, pageParam]);

  if (loading) {
    return (
      <div className="grid grid-cols-4 justify-items-center gap-x-2 gap-y-3 sm:gap-x-3 sm:gap-y-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="w-full h-full">
            <ProductSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 justify-items-center gap-x-2 gap-y-3 sm:gap-x-3 sm:gap-y-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 grid-cols-2">
      {products.length > 0 ? (
        products.map((product: any) => (
          <ProductItem key={product.id} product={product} />
        ))
      ) : (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg text-gray-900 dark:text-white">
          {' '}
          {/* Added dark mode text color */}
          No products found for specified query
        </h3>
      )}
    </div>
  );
}
