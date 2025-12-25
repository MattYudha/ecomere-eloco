'use client';

import { ProductItem, SectionTitle } from '@/components';
import ProductSkeleton from '@/components/ProductSkeleton';
import EmptyState from '@/components/EmptyState';
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
            <div className="col-span-full">
              <EmptyState
                variant="search"
                title="No Results Found"
                description={`We couldn't find anything for "${sanitize(searchQuery as string)}". Try different keywords or browse our categories.`}
                actionLabel="Browse All Products"
                actionHref="/shop-all"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
