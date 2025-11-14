// *********************
// Role of the component: Single product tabs on the single product page containing product description, main product info and reviews
// Name of the component: ProductTabs.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 3.1 - Dark Mode Support
// Component call: <ProductTabs product={product} />
// Input parameters: { product: Product }
// Output: Single product tabs containing product description, main product info and reviews
// *********************

'use client';

import React, { useState } from 'react';
import { formatCategoryName } from '@/utils/categoryFormating';
import { sanitize, sanitizeHtml } from '@/lib/sanitize';
import { BookOpen, Info } from 'lucide-react';

const ProductTabs = ({ product }: { product: Product }) => {
  const [currentProductTab, setCurrentProductTab] = useState<number>(0);

  const tabs = [
    { id: 0, label: 'Description', icon: BookOpen },
    {
      id: 1,
      label: 'Additional Info',
      icon: Info,
    },
  ];

  return (
    <div className="w-full">
      {/* Tabs Navigation - Modern & Bold */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentProductTab(tab.id)}
              className={`
                flex items-center gap-x-2 px-1 py-4 text-base text-black dark:text-white transition-colors duration-300
                focus:outline-none
                ${
                  currentProductTab === tab.id
                    ? 'font-semibold border-b-[3px] border-blue-600'
                    : 'font-normal'
                }
              `}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content - Premium Card */}
      <div className="mt-6 bg-white shadow-md rounded-xl dark:bg-gray-900/50 dark:border dark:border-gray-700/50">
        <div className="p-6 md:p-8">
          {/* Description Tab */}
          {currentProductTab === 0 && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Product Description
              </h3>

              <div
                className="prose prose-slate max-w-none text-base leading-relaxed text-gray-700 dark:text-gray-300 dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(product?.description),
                }}
              />
            </div>
          )}

          {/* Additional Info Tab */}
          {currentProductTab === 1 && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Additional Information
              </h3>

              <div className="space-y-4">
                {/* Manufacturer Row */}
                <div
                  className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200/80 dark:border-gray-700/60"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    Manufacturer
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {sanitize(product?.manufacturer)}
                  </span>
                </div>

                {/* Category Row */}
                <div
                  className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200/80 dark:border-gray-700/60"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    Category
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {product?.category?.name
                      ? sanitize(formatCategoryName(product?.category?.name))
                      : 'No category'}
                  </span>
                </div>

                {/* Color Row */}
                <div
                  className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200/80 dark:border-gray-700/60"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    Color
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    Silver, LightSlateGray, Blue
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductTabs;
