// *********************
// IN DEVELOPMENT
// *********************

import React from "react";
import { FaArrowUp } from "react-icons/fa6";


const StatsElement = () => {
  return (
    <div className="w-80 h-32 flex flex-col justify-center items-center rounded-lg p-4
                bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white
                dark:bg-black/20 dark:border-gray-700 max-md:w-full">
      <h4 className="text-xl text-white">New Products</h4>
      <p className="text-2xl font-bold text-white">2,230</p>
      <p className="text-green-300 flex gap-x-1 items-center"><FaArrowUp />12.5% Since last month</p>
    </div>
  );
};

export default StatsElement;
