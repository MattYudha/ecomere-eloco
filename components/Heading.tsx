// *********************
// Role of the component: Simple H2 heading component
// Name of the component: Heading.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Heading title={title} />
// Input parameters: { title: string }
// Output: h2 heading title with some styles
// *********************

import React from 'react';

interface HeadingProps {
  title: string;
  className?: string; // Allow external classNames
}

const Heading = ({ title, className = '' }: HeadingProps) => {
  return (
    <h2 className={`text-white text-7xl font-forum text-center mt-20 max-lg:text-5xl uppercase ${className}`}>
      {title}
    </h2>
  );
};

export default Heading;
