// *********************
// Role of the component: Range with labels for price intented to be on the shop page
// Name of the component: RangeWithLabels.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <RangeWithLabels />
// Input parameters: no input parameters
// Output: range input with the labels
// *********************

'use client';

import React, { useState } from 'react';
import { formatPrice } from '@/lib/utils';

const RangeWithLabels = () => {
  const [currentRangeWLabelsValue, setCurrentRangeWLabelsValue] =
    useState<number>(0);

  // function for handling range change
  const handleRangeWLabelsValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentRangeWLabelsValue(parseInt(e.target.value));
  };

  return (
    <div>
      <span className="label-text text-lg text-black">Price filter:</span>
      <input
        type="range"
        min={0}
        max="1000"
        value={currentRangeWLabelsValue}
        onChange={(e) => handleRangeWLabelsValue(e)}
        className="range range-warning"
        step="200"
      />
      <div className="w-full flex justify-between text-xs px-2">
        <span>{formatPrice(0)}</span>
        <span>{formatPrice(200)}</span>
        <span>{formatPrice(400)}</span>
        <span>{formatPrice(600)}</span>
        <span>{formatPrice(4000)}</span>
      </div>
    </div>
  );
};

export default RangeWithLabels;
