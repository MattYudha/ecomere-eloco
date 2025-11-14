// *********************
// Role of the component: Component that displays current page location in the application 
// Name of the component: Breadcrumb.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Breadcrumb />
// Input parameters: No input parameters
// Output: Page location in the application
// *********************

import Link from "next/link";
import React from "react";
import { FaHouse } from "react-icons/fa6";

const Breadcrumb = () => {
  return (
    <div className="text-lg breadcrumbs pb-10 py-5 max-sm:text-base text-gray-800 dark:text-gray-200"> {/* Added dark mode text color */}
      <ul>
        <li>
          <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"> {/* Added dark mode text color and hover */}
            <FaHouse className="mr-2" />
            Home
          </Link>
        </li>
        <li>
          <Link href="/shop" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Shop</Link> {/* Added dark mode text color and hover */}
        </li>
        <li>
          <Link href="/shop" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">All products</Link> {/* Added dark mode text color and hover */}
        </li>
      </ul>
    </div>
  );
};

export default Breadcrumb;
