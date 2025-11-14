// *********************
// Role of the component: Product table component on admin dashboard page
// Name of the component: DashboardProductTable.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0 - Modern Liquid Glass Design
// Component call: <DashboardProductTable />
// Input parameters: no input parameters
// Output: products table
// *********************

'use client';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import CustomButton from './CustomButton';
import apiClient from '@/lib/api';
import { sanitize } from '@/lib/sanitize';

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get('/api/products?mode=admin', { cache: 'no-store' })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full p-8">
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/40 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-12">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
            }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200/60"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-slate-800 animate-spin"></div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xl font-semibold text-slate-800 tracking-tight">
                Loading Products
              </p>
              <p className="text-sm text-slate-500">
                Fetching your inventory...
              </p>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      {/* Header Section with Liquid Glass */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-slate-50/20 pointer-events-none" />

        <div className="relative z-10 p-8 flex items-center justify-between max-md:flex-col max-md:gap-6">
          {/* Title Section */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/50 backdrop-blur-sm flex items-center justify-center border border-white/60 shadow-inner">
              <svg
                className="w-7 h-7 text-slate-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 max-md:text-2xl">
                All Products
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Manage your product inventory
              </p>
            </div>
          </div>

          {/* Add Button */}
          <Link href="/admin/products/new">
            <button
              className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-slate-900 px-6 py-3 border border-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
            >
              <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"
                style={{ transition: 'transform 0.8s, opacity 0.5s' }}
              />

              <div className="relative flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="font-semibold text-white">Add Product</span>
              </div>
            </button>
          </Link>
        </div>
      </div>

      {/* Table Section with Liquid Glass */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/40 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-slate-50/20 pointer-events-none" />

        <div className="relative z-10 overflow-auto max-h-[75vh]">
          <table className="w-full">
            {/* Table Head */}
            <thead className="sticky top-0 z-20">
              <tr className="backdrop-blur-xl bg-white/60 border-b border-white/60">
                <th className="px-6 py-4 text-left">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-lg border-2 border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-400 focus:ring-offset-0 transition-all duration-200 cursor-pointer"
                    />
                  </label>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Product
                  </span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Stock
                  </span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Price
                  </span>
                </th>
                <th className="px-6 py-4 text-right">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {products && products.length > 0 ? (
                products.map((product, index) => (
                  <tr
                    key={nanoid()}
                    className="group border-b border-white/30 hover:bg-white/40 transition-all duration-200"
                    style={{
                      animation: `fadeInUp 0.4s ease-out ${index * 0.05}s backwards`,
                    }}
                  >
                    {/* Checkbox */}
                    <td className="px-6 py-5">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded-lg border-2 border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-400 focus:ring-offset-0 transition-all duration-200 cursor-pointer"
                        />
                      </label>
                    </td>

                    {/* Product Info */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden backdrop-blur-sm bg-white/60 border border-white/60 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                          <Image
                            width={56}
                            height={56}
                            src={
                              product?.mainImage
                                ? `/${product.mainImage.replace(/^\//, '')}`
                                : '/product_placeholder.jpg'
                            }
                            alt={sanitize(product?.title) || 'Product image'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-base group-hover:text-slate-700 transition-colors">
                            {sanitize(product?.title)}
                          </span>
                          <span className="text-sm text-slate-600 mt-0.5">
                            {sanitize(product?.manufacturer)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Stock Status */}
                    <td className="px-6 py-5">
                      {product?.inStock ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100/80 backdrop-blur-sm border border-emerald-200/60 text-emerald-800 text-sm font-medium"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          In Stock
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100/80 backdrop-blur-sm border border-red-200/60 text-red-800 text-sm font-medium"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Out of Stock
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-5">
                      <span className="text-slate-900 font-semibold text-base">
                        ${product?.price?.toFixed(2)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 text-right">
                      <Link href={`/admin/products/${product.id}`}>
                        <button
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm bg-white/60 border border-white/60 hover:bg-white/80 hover:shadow-md text-slate-700 hover:text-slate-900 font-medium text-sm transition-all duration-200"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200/50 backdrop-blur-sm flex items-center justify-center border border-white/60 shadow-inner">
                        <svg
                          className="w-10 h-10 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">
                          No Products Yet
                        </h3>
                        <p className="text-slate-500 text-sm">
                          Start by adding your first product to the inventory
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

            {/* Table Footer */}
            {products && products.length > 0 && (
              <tfoot className="sticky bottom-0 z-20">
                <tr className="backdrop-blur-xl bg-white/60 border-t border-white/60">
                  <th className="px-6 py-4"></th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Product
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Stock
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Price
                    </span>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardProductTable;
