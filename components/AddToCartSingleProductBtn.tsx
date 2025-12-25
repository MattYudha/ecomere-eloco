// *********************
// Role of the component: Button for adding product to the cart on the single product page
// Name of the component: AddToCartSingleProductBtn.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <AddToCartSingleProductBtn product={product} quantityCount={quantityCount}  />
// Input parameters: SingleProductBtnProps interface
// Output: Button with adding to cart functionality
// *********************
'use client';

import React, { useState } from 'react';
import { useProductStore } from '@/app/_zustand/store';
import { showCartToast, showErrorToast } from '@/lib/toast-config';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import LoadingButton from './LoadingButton';

const AddToCartSingleProductBtn = ({
  product,
  quantityCount,
}: SingleProductBtnProps) => {
  const { addToCart, calculateTotals } = useProductStore();
  const { data: session } = useAuth();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setIsAdding(true);

    try {
      // Optimistic update
      addToCart({
        id: product?.id.toString(),
        title: product?.title,
        price: product?.price,
        image: product?.mainImage,
        amount: quantityCount,
      });
      calculateTotals();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      showCartToast('Product added to cart!', 'add');
    } catch (error) {
      showErrorToast('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <LoadingButton
      loading={isAdding}
      onClick={handleAddToCart}
      variant="ghost"
      size="lg"
      className="w-[200px] text-lg border-gray-300 text-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 uppercase max-[500px]:w-full"
    >
      Add to cart
    </LoadingButton>
  );
};

export default AddToCartSingleProductBtn;
