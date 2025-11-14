"use client";

import { ProductItem, SectionTitle } from "@/components";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import { use, useState, useEffect, useCallback } from "react";



type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const SearchPage = ({ searchParams }: SearchPageProps) => {
  const resolvedSearchParams = use(searchParams);
  const searchQuery = resolvedSearchParams?.search || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async (query: string | string[] | undefined) => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiClient.get(`/api/search?query=${query}`);
      if (!data.ok) {
        console.error("Failed to fetch search results:", data.statusText);
        setProducts([]);
      } else {
        const result = await data.json();
        setProducts(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(searchQuery);
  }, [searchQuery, fetchProducts]);

  if (loading) {
    return (
      <div>
        <SectionTitle title="Search Page" path="Home | Search" />
        <div className="max-w-screen-2xl mx-auto text-center py-10">
          <h3 className="text-3xl">Loading...</h3>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle title="Search Page" path="Home | Search" />
      <div className="max-w-screen-2xl mx-auto">
        {searchQuery && (
          <h3 className="text-4xl text-center py-10 max-sm:text-3xl">
            Showing results for {sanitize(searchQuery as string)}
          </h3>
        )}
        <div className="grid grid-cols-4 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
          {products.length > 0 ? (
            products.map((product: Product) => (
              <ProductItem key={product.id} product={product} color="black" />
            ))
          ) : (
            <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
              No products found for specified query
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;