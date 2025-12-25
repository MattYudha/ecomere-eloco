import { Loader } from '@/components/Loader';
import { CartModule } from '@/components/modules/cart';
import { Suspense } from 'react';

const CartPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<Loader />}>
        <CartModule />
      </Suspense>
    </div>
  );
};

export default CartPage;
