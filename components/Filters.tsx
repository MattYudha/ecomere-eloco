// *********************
// Role of the component: Filters on shop page
// Name of the component: Filters.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.1 - Modern UI Update
// Component call: <Filters />
// Input parameters: no input parameters
// Output: stock, rating and price filter
// *********************

'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Filter as FilterIcon } from 'lucide-react';

interface InputCategory {
  inStock: { text: string; isChecked: boolean };
  outOfStock: { text: string; isChecked: boolean };
  priceFilter: { text: string; value: number };
  ratingFilter: { text: string; value: number };
}

const Filters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [inputCategory, setInputCategory] = useState<InputCategory>({
    inStock: { text: 'instock', isChecked: false },
    outOfStock: { text: 'outofstock', isChecked: false },
    priceFilter: { text: 'price', value: 500000 },
    ratingFilter: { text: 'rating', value: 0 },
  });

  const [tempMaxPrice, setTempMaxPrice] = useState<string>('500000');

  // Effect to initialize state from URL search params
  useEffect(() => {
    const currentPrice = Number(searchParams.get('price')) || 500000;
    const currentRating = Number(searchParams.get('rating')) || 0;
    const currentInStock = searchParams.get('inStock') === 'true';
    const currentOutOfStock = searchParams.get('outOfStock') === 'true';

    setInputCategory({
      inStock: { text: 'instock', isChecked: currentInStock },
      outOfStock: { text: 'outofstock', isChecked: currentOutOfStock },
      priceFilter: { text: 'price', value: currentPrice },
      ratingFilter: { text: 'rating', value: currentRating },
    });
    setTempMaxPrice(String(currentPrice));
  }, [searchParams]);

  // Function to update URL search params
  const updateSearchParams = (
    key: string,
    value: string | number | boolean,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === '' || value === false || value === 0) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="sticky top-24 h-fit">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-[#cb6112]">
            <FilterIcon size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Filters
          </h3>
        </div>

        <div className="p-6 space-y-8">
          {/* Availability Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Availability
            </h3>
            <div className="space-y-3">
              <div className="form-control hover:translate-x-1 transition-transform duration-200">
                <label className="cursor-pointer flex items-center group">
                  <input
                    type="checkbox"
                    checked={inputCategory.inStock.isChecked}
                    onChange={() => {
                      const newValue = !inputCategory.inStock.isChecked;
                      setInputCategory({
                        ...inputCategory,
                        inStock: {
                          text: 'instock',
                          isChecked: newValue,
                        },
                      });
                      updateSearchParams('inStock', newValue);
                    }}
                    className="checkbox checkbox-sm checkbox-primary dark:checkbox-primary rounded-md"
                  />
                  <span className="label-text text-base ml-3 font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#cb6112] transition-colors">
                    In Stock
                  </span>
                </label>
              </div>

              <div className="form-control hover:translate-x-1 transition-transform duration-200">
                <label className="cursor-pointer flex items-center group">
                  <input
                    type="checkbox"
                    checked={inputCategory.outOfStock.isChecked}
                    onChange={() => {
                      const newValue = !inputCategory.outOfStock.isChecked;
                      setInputCategory({
                        ...inputCategory,
                        outOfStock: {
                          text: 'outofstock',
                          isChecked: newValue,
                        },
                      });
                      updateSearchParams('outOfStock', newValue);
                    }}
                    className="checkbox checkbox-sm checkbox-primary dark:checkbox-primary rounded-md"
                  />
                  <span className="label-text text-base ml-3 font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#cb6112] transition-colors">
                    Out of Stock
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-gray-700"></div>

          {/* Price Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Price Range
              </h3>
              <span className="text-xs font-bold text-[#cb6112] bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                Rp 0 - {Number(inputCategory.priceFilter.value).toLocaleString('id-ID')}
              </span>
            </div>

            <div className="px-1">
              <input
                type="range"
                min={0}
                max={500000}
                step={1000}
                value={inputCategory.priceFilter.value}
                className="range range-xs range-primary dark:range-primary w-full"
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  setInputCategory({
                    ...inputCategory,
                    priceFilter: {
                      text: 'price',
                      value: newValue,
                    },
                  });
                  updateSearchParams('price', newValue);
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">Max:</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Rp</span>
                <input
                  type="number"
                  value={tempMaxPrice}
                  onChange={(e) => setTempMaxPrice(e.target.value)}
                  onBlur={() => {
                    const valueToApply = tempMaxPrice === '' ? 0 : Number(tempMaxPrice);
                    setInputCategory({
                      ...inputCategory,
                      priceFilter: { text: 'price', value: valueToApply },
                    });
                    updateSearchParams('price', valueToApply);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const valueToApply = tempMaxPrice === '' ? 0 : Number(tempMaxPrice);
                      setInputCategory({
                        ...inputCategory,
                        priceFilter: { text: 'price', value: valueToApply },
                      });
                      updateSearchParams('price', valueToApply);
                    }
                  }}
                  className="w-full pl-8 pr-3 py-2 text-sm border-2 border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:border-[#cb6112] focus:bg-white dark:focus:bg-gray-800 transition-all font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-gray-700"></div>

          {/* Rating Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Min Rating
              </h3>
              <div className="flex items-center gap-1 text-[#cb6112]">
                <span className="font-bold text-lg">{inputCategory.ratingFilter.value}</span>
                <span className="text-xs font-semibold uppercase">+ stars</span>
              </div>
            </div>

            <div className="px-1 pt-2">
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={inputCategory.ratingFilter.value}
                className="range range-xs range-warning w-full"
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  setInputCategory({
                    ...inputCategory,
                    ratingFilter: { text: 'rating', value: newValue },
                  });
                  updateSearchParams('rating', newValue);
                }}
              />
              <div className="flex justify-between mt-2 px-1">
                {[0, 1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setInputCategory({
                        ...inputCategory,
                        ratingFilter: { text: 'rating', value: val },
                      });
                      updateSearchParams('rating', val);
                    }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${inputCategory.ratingFilter.value >= val
                        ? 'bg-orange-100 text-[#cb6112] dark:bg-orange-900/40 dark:text-orange-400 scale-110'
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
