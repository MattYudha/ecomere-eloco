// *********************
// Role of the component: Filters on shop page
// Name of the component: Filters.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Filters />
// Input parameters: no input parameters
// Output: stock, rating and price filter
// *********************

"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";

interface InputCategory {
  inStock: { text: string, isChecked: boolean },
  outOfStock: { text: string, isChecked: boolean },
  priceFilter: { text: string, value: number },
  ratingFilter: { text: string, value: number },
}

const Filters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [inputCategory, setInputCategory] = useState<InputCategory>({
    inStock: { text: "instock", isChecked: false },
    outOfStock: { text: "outofstock", isChecked: false },
    priceFilter: { text: "price", value: 3000 },
    ratingFilter: { text: "rating", value: 0 },
  });

  const [tempMaxPrice, setTempMaxPrice] = useState<string>("3000"); // Changed to string

  // Effect to initialize state from URL search params
  useEffect(() => {
    const currentPrice = Number(searchParams.get("price")) || 3000;
    const currentRating = Number(searchParams.get("rating")) || 0;
    const currentInStock = searchParams.get("inStock") === "true";
    const currentOutOfStock = searchParams.get("outOfStock") === "true";

    setInputCategory({
      inStock: { text: "instock", isChecked: currentInStock },
      outOfStock: { text: "outofstock", isChecked: currentOutOfStock },
      priceFilter: { text: "price", value: currentPrice },
      ratingFilter: { text: "rating", value: currentRating },
    });
    setTempMaxPrice(String(currentPrice)); // Initialize tempMaxPrice as string
  }, [searchParams]);

  // Function to update URL search params
  const updateSearchParams = (key: string, value: string | number | boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "" || value === false || value === 0) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Filters</h3>
      <div className="divider my-4 bg-gray-300 h-px dark:bg-gray-700"></div>
      <div className="flex flex-col gap-y-3">
        <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">Availability</h3>
        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.inStock.isChecked}
              onChange={() => {
                const newValue = !inputCategory.inStock.isChecked;
                setInputCategory({
                  ...inputCategory,
                  inStock: {
                    text: "instock",
                    isChecked: newValue,
                  },
                });
                updateSearchParams("inStock", newValue);
              }}
              className="checkbox checkbox-primary dark:checkbox-primary"
            />
            <span className="label-text text-lg ml-3 text-gray-700 dark:text-gray-300">In stock</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.outOfStock.isChecked}
              onChange={() => {
                const newValue = !inputCategory.outOfStock.isChecked;
                setInputCategory({
                  ...inputCategory,
                  outOfStock: {
                    text: "outofstock",
                    isChecked: newValue,
                  },
                });
                updateSearchParams("outOfStock", newValue);
              }}
              className="checkbox checkbox-primary dark:checkbox-primary"
            />
            <span className="label-text text-lg ml-3 text-gray-700 dark:text-gray-300">
              Out of stock
            </span>
          </label>
        </div>
      </div>

      <div className="divider my-4 bg-gray-300 h-px dark:bg-gray-700"></div>
      <div className="flex flex-col gap-y-3">
        <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">Price</h3>
        <div>
          <input
            type="range"
            min={0}
            max={3000}
            step={10}
            value={inputCategory.priceFilter.value}
            className="range range-primary dark:range-primary"
            onChange={(e) => {
              const newValue = Number(e.target.value);
              setInputCategory({
                ...inputCategory,
                priceFilter: {
                  text: "price",
                  value: newValue,
                },
              });
              updateSearchParams("price", newValue);
            }}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-900 dark:text-gray-300">{`Max price:`}</span>
            <input
              type="number"
              min={0}
              max={3000}
              step={10}
              value={tempMaxPrice}
              onChange={(e) => setTempMaxPrice(e.target.value)}
              onBlur={() => {
                const valueToApply = tempMaxPrice === "" ? 0 : Number(tempMaxPrice);
                setInputCategory({
                  ...inputCategory,
                  priceFilter: {
                    text: "price",
                    value: valueToApply,
                  },
                });
                updateSearchParams("price", valueToApply);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const valueToApply = tempMaxPrice === "" ? 0 : Number(tempMaxPrice);
                  setInputCategory({
                    ...inputCategory,
                    priceFilter: {
                      text: "price",
                      value: valueToApply,
                    },
                  });
                  updateSearchParams("price", valueToApply);
                }
              }}
              className="input input-bordered w-24 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="divider my-4 bg-gray-300 h-px dark:bg-gray-700"></div>

      <div className="flex flex-col gap-y-3">
        <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">Minimum Rating:</h3>
        <input
          type="range"
          min={0}
          max="5"
          value={inputCategory.ratingFilter.value}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            setInputCategory({
              ...inputCategory,
              ratingFilter: { text: "rating", value: newValue },
            });
            updateSearchParams("rating", newValue);
          }}
          className="range range-info dark:range-primary"
          step="1"
        />
        <div className="w-full flex justify-between text-xs px-2 text-gray-700 dark:text-gray-300">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
