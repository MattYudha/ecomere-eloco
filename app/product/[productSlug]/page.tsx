import {
  StockAvailabillity,
  UrgencyText,

  ProductTabs,
  SingleProductDynamicFields,
  
} from "@/components";
import apiClient from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquarePinterest } from "react-icons/fa6";
import { sanitize } from "@/lib/sanitize";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{  productSlug: string, id: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;
  // sending API request for a single product with a given product slug
  const data = await apiClient.get(
    `/api/slugs/${paramsAwaited?.productSlug}`
  );
  const product = await data.json();

  // sending API request for more than 1 product image if it exists
  const imagesData = await apiClient.get(
    `/api/images/${paramsAwaited?.id}`
  );
  const images = await imagesData.json();

  if (!product || product.error) {
    notFound();
  }

  // Helper function to create a consistent, root-relative image path
  const getImageUrl = (path: string | null | undefined) => {
    if (!path) {
      return "/product_placeholder.jpg";
    }
    // Ensures a single leading slash for a consistent root-relative path
    return `/${path.replace(/^\//, '')}`;
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-8 rounded-3xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10 shadow-xl border border-white/20 dark:border-gray-700/20">
        <div className="flex justify-center gap-x-16 pt-10 max-lg:flex-col items-center gap-y-5 px-5">
          <div className="p-8 rounded-3xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10 shadow-xl border border-white/20 dark:border-gray-700/20">
              <Image
                src={getImageUrl(product?.mainImage)}
                width={240}
                height={160}
                alt="main image"
                className="w-auto h-auto object-contain mb-5 rounded-lg border border-white/20 dark:border-gray-700/20 shadow-md"
              />
            <div className="flex justify-around mt-5 flex-wrap gap-y-1 max-[500px]:justify-center max-[500px]:gap-x-1">
              {images?.map((imageItem: ImageItem, key: number) => (
                <Image
                  key={imageItem.imageID + key}
                  src={getImageUrl(imageItem.image)}
                  width={100}
                  height={100}
                  alt="laptop image"
                  className="w-auto h-auto rounded-md shadow-md border border-white/20 dark:border-gray-700/20 hover:border-grilli-gold transition-colors duration-200 cursor-pointer"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-y-5 text-gray-900 dark:text-white max-[500px]:text-center">
        
            <h1 className="text-4xl font-bold text-grilli-gold">{sanitize(product?.title)}</h1>
            <p className="text-3xl font-bold text-grilli-gold">${product?.price}</p>
            <StockAvailabillity stock={94} inStock={product?.inStock} />
            <SingleProductDynamicFields product={product} />
            <div className="flex flex-col gap-y-2 max-[500px]:items-center">
             
              <p className="text-lg">
                SKU: <span className="ml-1">abccd-18</span>
              </p>
              <div className="text-lg flex gap-x-2 items-center">
                <span className="text-gray-400 dark:text-gray-300">Share:</span>
                <div className="flex items-center gap-x-2 text-3xl">
                  <FaSquareFacebook className="text-gray-500 dark:text-gray-400 hover:text-grilli-gold transition-colors duration-200 cursor-pointer" />
                  <FaSquareXTwitter className="text-gray-500 dark:text-gray-400 hover:text-grilli-gold transition-colors duration-200 cursor-pointer" />
                  <FaSquarePinterest className="text-gray-500 dark:text-gray-400 hover:text-grilli-gold transition-colors duration-200 cursor-pointer" />
                </div>
              </div>
              <div className="flex items-center gap-x-2 p-2 rounded-md bg-white/5 dark:bg-gray-800/5 border border-white/10 dark:border-gray-700/10 shadow-sm">
                <Image
                  src="/uploads/bca.svg"
                  width={50}
                  height={32}
                  alt="BCA icon"
                  className="h-8 w-auto"
                />
                <Image
                  src="/uploads/bri.svg"
                  width={50}
                  height={32}
                  alt="BRI icon"
                  className="h-8 w-auto"
                />
                <Image
                  src="/uploads/dana.svg"
                  width={50}
                  height={32}
                  alt="DANA icon"
                  className="h-8 w-auto"
                />
                <Image
                  src="/uploads/gopay.svg"
                  width={50}
                  height={32}
                  alt="Gopay icon"
                  className="h-8 w-auto"
                />
                <Image
                  src="/uploads/mandiri.svg"
                  width={50}
                  height={32}
                  alt="Mandiri icon"
                  className="h-8 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="py-16">
          <ProductTabs product={product} />
        </div>
    </div>
  );
};

export default SingleProductPage;
