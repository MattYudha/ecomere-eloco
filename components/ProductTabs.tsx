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
import { BookOpen, Info, MessageSquare } from 'lucide-react';
import StarRatingInput from './StarRatingInput';
import ReviewList from './ReviewList';
import { useReviewStore } from '@/app/_zustand/reviewStore';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import Link from 'next/link';

const ProductTabs = ({ product }: { product: Product }) => {
  const [currentProductTab, setCurrentProductTab] = useState<number>(0);

  // Review Form State
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { createReview, isLoading } = useReviewStore();
  const { data: session } = useAuth();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a rating');
    const success = await createReview(product.id, rating, comment);
    if (success) {
      toast.success('Review submitted!');
      setRating(0);
      setComment('');
    }
  };

  const tabs = [
    { id: 0, label: 'Description', icon: BookOpen },
    { id: 1, label: 'Additional Info', icon: Info },
    { id: 2, label: 'Reviews', icon: MessageSquare },
  ];

  return (
    <div className="w-full">
      {/* Tabs Navigation - Modern & Bold */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentProductTab(tab.id)}
              className={`
                flex items-center gap-x-2 px-1 py-4 text-sm md:text-base text-black dark:text-white transition-colors duration-300
                focus:outline-none whitespace-nowrap
                ${currentProductTab === tab.id
                  ? 'font-semibold border-b-[3px] border-[#cb6112] text-[#cb6112] dark:text-[#cb6112]'
                  : 'font-normal hover:text-[#cb6112] dark:hover:text-[#cb6112]'
                }
              `}
            >
              <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content - Premium Card */}
      <div className="mt-6 bg-white shadow-sm rounded-xl dark:bg-gray-900/50 dark:border dark:border-gray-700/50">
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
                <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200/80 dark:border-gray-700/60">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    Manufacturer
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {sanitize(product?.manufacturer)}
                  </span>
                </div>

                {/* Category Row */}
                <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200/80 dark:border-gray-700/60">
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
                <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200/80 dark:border-gray-700/60">
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

          {/* Reviews Tab */}
          {currentProductTab === 2 && (
            <div className="animate-fadeIn">
              <div className="flex flex-col md:flex-row gap-8 justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                    Customer Reviews
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    Read what other customers are saying about {product.title}. Only verified purchases can supply reviews.
                  </p>
                </div>

                {/* Summary Rating Badge (Optional: Using product.rating if available) */}
                {product.rating > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-xl flex items-center gap-2 border border-orange-100 dark:border-orange-800/30">
                    <span className="text-3xl font-bold text-[#cb6112]">{product.rating.toFixed(1)}</span>
                    <div className="flex flex-col">
                      <div className="flex text-[#fbbf24] text-xs">
                        {[...Array(5)].map((_, i) => (
                          <StarRatingInput key={i} rating={product.rating} onRatingChange={() => { }} disabled />
                        ))}
                        {/* Using Input as display or FaStar directly */}
                      </div>
                      <span className="text-xs text-gray-500">{product.reviewCount || 0} reviews</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Write Review Section */}
              <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 transition-all focus-within:ring-2 focus-within:ring-[#cb6112]/20">
                {!session?.user ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      Please <Link href="/login" className="text-[#cb6112] font-semibold underline hover:text-orange-700">login</Link> to write a review.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      Write a Review
                      <span className="text-xs font-normal text-gray-400 bg-white dark:bg-black/20 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">Verified Purchase Required</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Rating</label>
                      <StarRatingInput rating={rating} onRatingChange={setRating} />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Your Review</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-900 text-sm p-4 focus:ring-2 focus:ring-[#cb6112] focus:border-transparent transition-all shadow-sm"
                        rows={4}
                        placeholder="What did you like or dislike? What did you use this product for?"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-[#cb6112] text-white rounded-xl font-bold text-sm hover:bg-orange-700 active:scale-95 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <ReviewList productId={product.id} />
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
