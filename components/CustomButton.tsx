// *********************
// Role of the component: Custom button component
// Name of the component: CustomButton.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CustomButton paddingX={paddingX} paddingY={paddingY} text={text} buttonType={buttonType} customWidth={customWidth} textSize={textSize} />
// Input parameters: CustomButtonProps interface
// Output: custom button component
// *********************

import React from 'react';

interface CustomButtonProps {
  children: React.ReactNode; // Use children for more flexible content
  onClick?: () => void; // Optional click handler
  className?: string; // Allow external classNames
  buttonType?: 'submit' | 'reset' | 'button'; // Make optional
  paddingX?: number; // Make optional
  paddingY?: number; // Make optional
  customWidth?: string; // Make optional
  textSize?: string; // Make optional
  disabled?: boolean; // Added disabled prop
}

const CustomButton = ({
  children,
  onClick,
  className = '', // Default to empty string
  buttonType = 'button', // Default to 'button'
  paddingX = 4, // Default padding
  paddingY = 2, // Default padding
  customWidth = 'no', // Default width
  textSize = 'base', // Default text size
  disabled = false, // Default to false
}: CustomButtonProps) => {
  const baseClasses = `${customWidth !== 'no' && `w-${customWidth}`} uppercase px-${paddingX} py-${paddingY} text-${textSize} font-bold shadow-sm focus:outline-none focus:ring-2`;

  return (
    <button
      type={buttonType}
      onClick={onClick}
      className={`${baseClasses} ${className}`} // Apply external className
      disabled={disabled} // Pass disabled prop to button
    >
      {children}
    </button>
  );
};

export default CustomButton;
