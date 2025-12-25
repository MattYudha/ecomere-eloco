// *********************
// Role of the component: Buy Now button that adds product to the cart and redirects to the checkout page
// Name of the component: BuyNowSingleProductBtn.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <BuyNowSingleProductBtn product={product} quantityCount={quantityCount} />
// Input parameters: SingleProductBtnProps interface
// Output: Button with buy now functionality
// *********************

'use client';
import { useProductStore } from '@/app/_zustand/store';
import React, { useState } from 'react';
import { showCartToast, showInfoToast } from '@/lib/toast-config';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingButton from './LoadingButton';

const BuyNowSingleProductBtn = ({
  product,
  quantityCount,
}: SingleProductBtnProps) => {
  const router = useRouter();
  const { data: session } = useAuth();
  const { buyNow, calculateTotals } = useProductStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuyNow = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setIsProcessing(true);

    try {
      buyNow({
        id: product?.id.toString(),
        title: product?.title,
        price: product?.price,
        image: product?.mainImage,
        amount: quantityCount,
      });
      calculateTotals();

      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 400));

      showInfoToast('Proceeding to checkout...');
      router.push('/checkout');
    } catch (error) {
      setIsProcessing(false);
    }
  };
  return (
    <LoadingButton
      loading={isProcessing}
      onClick={handleBuyNow}
      variant="primary"
      size="lg"
      className="w-[200px] uppercase max-[500px]:w-full"
    >
      Buy Now
    </LoadingButton>
  );
};

export default BuyNowSingleProductBtn;
