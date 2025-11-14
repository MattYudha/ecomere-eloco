"use client";

import {
  Breadcrumb,
  Filters,
  Pagination,
  SortBy,
} from "@/components";
import Products from "@/components/Products";
import React from "react";
import { sanitize } from "@/lib/sanitize";

// improve readabillity of category text, for example category text "smart-watches" will be "smart watches"
const improveCategoryText = (text: string): string => {
  if (text.indexOf("-") !== -1) {
    let textArray = text.split("-");

    return textArray.join(" ");
  } else {
    return text;
  }
};

export type ShopPageProps = {
  params: any;
  searchParams: any;
};

const ShopPage = ({ params, searchParams }: ShopPageProps) => {
  return (
    <div className="bg-white text-black dark:bg-gray-800 dark:text-white min-h-screen"> {/* Added dark mode classes */}
      <div className=" max-w-screen-2xl mx-auto px-10 max-sm:px-5">
        <Breadcrumb />
        <div className="grid grid-cols-[200px_1fr] gap-x-10 max-md:grid-cols-1 max-md:gap-y-5">
          <Filters />
          <div>
            <div className="flex justify-between items-center max-lg:flex-col max-lg:gap-y-5">
              <h2 className="text-2xl font-bold max-sm:text-xl max-[400px]:text-lg uppercase text-black dark:text-white"> {/* Added dark mode classes */}
                {params?.slug?.[0]
                  ? sanitize(improveCategoryText(params.slug[0]))
                  : "All products"}
              </h2>

              <SortBy />
            </div>
            <div className="divider"></div> {/* DaisyUI divider might need global dark mode styling or specific dark: class */}
            <Products params={params} />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
