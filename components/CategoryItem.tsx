import Link from 'next/link';
import React, { type ReactNode } from 'react';

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const CategoryItem = ({ title, children, href }: CategoryItemProps) => {
  return (
    <Link href={href}>
      <div className="group w-full rounded-2xl overflow-hidden bg-cream border-2 border-transparent hover:border-grilli-gold hover:shadow-lg transition-all duration-300 cursor-pointer p-6 h-full flex flex-col items-center justify-center gap-4 text-center">
        
        {/* Icon Section */}
        <div className="group-hover:scale-110 transition-transform duration-500">
          {children}
        </div>

        {/* Title Section */}
        <h3 className="text-xl font-forum text-eerie-black-1 group-hover:text-grilli-gold transition-colors duration-200">
          {title}
        </h3>
        
      </div>
    </Link>
  );
};

export default CategoryItem;