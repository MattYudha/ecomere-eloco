'use client';

import { ProductItem, SectionTitle } from '@/components';
import ProductSkeleton from '@/components/ProductSkeleton';
import { FaSearch } from 'react-icons/fa';
import apiClient from '@/lib/api';
import { sanitize } from '@/lib/sanitize';
import { useState, useEffect, useCallback } from 'react';

type SearchPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const SearchPage = ({ searchParams }: SearchPageProps) => {
  const searchQuery = searchParams?.search || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(
    async (query: string | string[] | undefined) => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await apiClient.get(`/api/search?query=${query}`);
        if (!data.ok) {
          console.error('Failed to fetch search results:', data.statusText);
          setProducts([]);
        } else {
          const result = await data.json();
          setProducts(Array.isArray(result) ? result : []);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchProducts(searchQuery);
  }, [searchQuery, fetchProducts]);

  if (loading) {
    return (
      <div>
        <SectionTitle title="Search Page" path="Home | Search" />
        <div className="max-w-screen-2xl mx-auto px-4 py-10">
          <div className="grid grid-cols-4 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle title="Search Page" path="Home | Search" />
      <div className="max-w-screen-2xl mx-auto px-4">
        {searchQuery && (
          <h3 className="text-4xl text-center py-10 max-sm:text-3xl">
            Showing results for {sanitize(searchQuery as string)}
          </h3>
        )}
        <div className="grid grid-cols-4 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
          {products.length > 0 ? (
            products.map((product: Product) => (
              <ProductItem key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10">
              <FaSearch className="text-gray-400 dark:text-gray-600 text-6xl mb-4" />
              <h3 className="text-4xl font-bold text-grilli-gold dark:text-grilli-gold mb-2 max-sm:text-3xl">
                No Results Found
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-sm:text-base">
                Try searching for something else or browse our categories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
