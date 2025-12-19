import {
  StockAvailabillity,
  UrgencyText,
  ProductTabs,
  SingleProductDynamicFields,
} from '@/components';
import apiClient from '@/lib/api';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';
import { FaSquareFacebook } from 'react-icons/fa6';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { FaSquarePinterest } from 'react-icons/fa6';
import { sanitize } from '@/lib/sanitize';
import { formatPrice } from '@/lib/utils';


interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: { productSlug: string; id: string };
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const { productSlug, id } = params;



  // sending API request for a single product with a given product slug
  const data = await apiClient.get(`/api/slugs/${productSlug}`);
  const product = await data.json();

  // sending API request for more than 1 product image if it exists
  const imagesData = await apiClient.get(`/api/images/${id}`);
  const images: ImageItem[] = (await imagesData.json()) || [];

  if (!product || product.error) {
    notFound();
  }

  // Helper function to create a consistent, root-relative image path
  const getImageUrl = (path: string | null | undefined) => {
    if (!path) {
      return '/product_placeholder.jpg';
    }
    if (path.startsWith('http')) return path;
    // Ensures a single leading slash for a consistent root-relative path
    return `/${path.replace(/^\//, '')}`;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Glass Container */}
        <div className="relative rounded-[2rem] backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-transparent border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />

          <div className="relative p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

              {/* Left Column - Product Images */}
              <div className="space-y-6">
                {/* Main Product Image - Floating Glass Card */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#cb6112]/20 via-transparent to-[#cb6112]/10 rounded-[1.75rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative rounded-3xl backdrop-blur-xl bg-white/25 dark:bg-white/10 border border-white/40 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 overflow-hidden">
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

                    <div className="relative aspect-square flex items-center justify-center">
                      <Image
                        src={getImageUrl(product?.mainImage)}
                        width={500}
                        height={500}
                        alt={sanitize(product?.title)}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery Thumbnails - Floating Glass Tiles */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {Array.isArray(images) && images.map((imageItem: ImageItem, key: number) => (
                    <div
                      key={imageItem.imageID + key}
                      className="relative group cursor-pointer"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-[#cb6112]/40 to-[#cb6112]/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                      <div className="relative rounded-2xl backdrop-blur-xl bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:border-[#cb6112]/50 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.25)] p-2 transition-all duration-300 hover:scale-105 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <Image
                          src={getImageUrl(imageItem.image)}
                          width={100}
                          height={100}
                          alt={sanitize(product?.title)}
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Product Details */}
              <div className="space-y-8">

                {/* Title & Price - Premium Typography */}
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#cb6112] via-[#e07d2e] to-[#cb6112] leading-tight tracking-tight">
                    {sanitize(product?.title)}
                  </h1>

                  <div className="inline-flex items-baseline gap-2 px-6 py-3 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#cb6112]/15 via-[#cb6112]/10 to-transparent border border-[#cb6112]/30 shadow-[0_4px_24px_rgba(203,97,18,0.15)]">
                    <span className="text-4xl font-bold text-[#cb6112]">
                      {formatPrice(product?.price)}
                    </span>
                  </div>
                </div>

                {/* Stock Status - Glass Capsule */}
                <div className="inline-block">
                  <StockAvailabillity stock={94} inStock={product?.inStock} />
                </div>

                {/* Dynamic Fields */}
                <div className="space-y-4">
                  <SingleProductDynamicFields product={product} />
                </div>

                {/* Product Meta - Glass Capsules */}
                <div className="space-y-4">
                  {/* SKU */}
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/15 dark:bg-white/10 border border-white/30 dark:border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">SKU:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">abccd-18</span>
                  </div>

                  {/* Social Share - Glass Strip */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl backdrop-blur-xl bg-white/15 dark:bg-white/10 border border-white/30 dark:border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Share:</span>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl backdrop-blur-xl bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:border-[#cb6112]/50 hover:bg-[#cb6112]/10 transition-all duration-300 cursor-pointer group">
                        <FaSquareFacebook className="text-xl text-gray-600 dark:text-gray-300 group-hover:text-[#cb6112] transition-colors duration-300" />
                      </div>
                      <div className="p-2 rounded-xl backdrop-blur-xl bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:border-[#cb6112]/50 hover:bg-[#cb6112]/10 transition-all duration-300 cursor-pointer group">
                        <FaSquareXTwitter className="text-xl text-gray-600 dark:text-gray-300 group-hover:text-[#cb6112] transition-colors duration-300" />
                      </div>
                      <div className="p-2 rounded-xl backdrop-blur-xl bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:border-[#cb6112]/50 hover:bg-[#cb6112]/10 transition-all duration-300 cursor-pointer group">
                        <FaSquarePinterest className="text-xl text-gray-600 dark:text-gray-300 group-hover:text-[#cb6112] transition-colors duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods - Premium Glass Strip */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#cb6112]/20 via-transparent to-[#cb6112]/20 rounded-2xl blur opacity-50" />
                    <div className="relative flex items-center gap-3 p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/25 via-white/15 to-white/10 dark:from-white/15 dark:via-white/10 dark:to-white/5 border border-white/40 dark:border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)] overflow-hidden">
                      {/* Embossed light effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

                      <div className="relative flex items-center gap-3 flex-wrap">
                        {['bca', 'bri', 'dana', 'gopay', 'mandiri'].map((payment) => (
                          <div
                            key={payment}
                            className="p-2 rounded-xl backdrop-blur-sm bg-white/30 dark:bg-white/15 border border-white/40 dark:border-white/25 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:scale-105 transition-transform duration-300"
                          >
                            <Image
                              src={`/uploads/${payment}.svg`}
                              width={50}
                              height={32}
                              alt={`${payment.toUpperCase()} icon`}
                              className="h-7 w-auto opacity-90"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs Section - Separate Glass Panel */}
        <div className="mt-12 relative rounded-[2rem] backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-transparent border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />
          <div className="relative p-8 lg:p-12">
            <ProductTabs product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;