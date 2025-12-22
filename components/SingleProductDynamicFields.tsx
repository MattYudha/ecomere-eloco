// *********************
// Role of the component: Helper component for seperating dynamic client component from server component on the single product page with the intention to preserve SEO benefits of Next.js
// Name of the component: SingleProductDynamicFields.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SingleProductDynamicFields product={product} />
// Input parameters: { product: Product }
// Output: Quantity, add to cart and buy now component on the single product page
// *********************

'use client';
import React, { useState } from 'react';
import QuantityInput from './QuantityInput';
import AddToCartSingleProductBtn from './AddToCartSingleProductBtn';
import BuyNowSingleProductBtn from './BuyNowSingleProductBtn';

const SingleProductDynamicFields = ({ product }: { product: Product }) => {
    const [quantityCount, setQuantityCount] = useState<number>(1);

    if (product.inStock !== 1) {
        return (
            <div className="w-full">
                <button
                    onClick={() => {
                        // In the future this could open a modal or subscribe user
                        // For now just a toast
                    }}
                    className="w-full py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-semibold text-sm uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                    <span>Notify Me When Available</span>
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">
                    We&apos;ll email you when this item is back in stock.
                </p>
            </div>
        );
    }

    return (
        <>
            <QuantityInput
                quantityCount={quantityCount}
                setQuantityCount={setQuantityCount}
            />
            <div className="flex gap-x-0 max-[500px]:flex-col max-[500px]:items-center max-[500px]:gap-y-2">
                <AddToCartSingleProductBtn
                    quantityCount={quantityCount}
                    product={product}
                />
                <BuyNowSingleProductBtn
                    quantityCount={quantityCount}
                    product={product}
                />
            </div>
        </>
    );
};

export default SingleProductDynamicFields;