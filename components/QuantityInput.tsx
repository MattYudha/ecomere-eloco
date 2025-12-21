// *********************
// Role of the component: Quantity input for incrementing and decrementing product quantity on the single product page
// Name of the component: QuantityInput.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <QuantityInput quantityCount={quantityCount} setQuantityCount={setQuantityCount} />
// Input parameters: QuantityInputProps interface
// Output: one number input and two buttons
// *********************

'use client';

import React from 'react';
import { FaPlus } from 'react-icons/fa6';
import { FaMinus } from 'react-icons/fa6';

interface QuantityInputProps {
  quantityCount: number;
  setQuantityCount: React.Dispatch<React.SetStateAction<number>>;
}

const QuantityInput = ({
  quantityCount,
  setQuantityCount,
}: QuantityInputProps) => {
  const handleQuantityChange = (actionName: string): void => {
    if (actionName === 'plus') {
      setQuantityCount(quantityCount + 1);
    } else if (actionName === 'minus' && quantityCount !== 1) {
      setQuantityCount(quantityCount - 1);
    }
  };

  return (
    <div className="flex items-center gap-x-4 max-[500px]:justify-center">
      <p className="text-xl">Quantity: </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="size-10 leading-10 text-gray-600 dark:text-gray-300 transition hover:opacity-75 flex justify-center items-center border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-slate-800"
          onClick={() => handleQuantityChange('minus')}
        >
          <FaMinus />
        </button>

        <input
          type="number"
          id="Quantity"
          disabled={true}
          value={quantityCount}
          className="h-10 w-24 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 text-black dark:text-white text-center sm:text-sm"
        />

        <button
          type="button"
          className="size-10 leading-10 text-gray-600 dark:text-gray-300 transition hover:opacity-75 flex justify-center items-center border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-slate-800"
          onClick={() => handleQuantityChange('plus')}
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default QuantityInput;
