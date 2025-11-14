// *********************
// Role of the component: Sidebar on admin dashboard page
// Name of the component: DashboardSidebar.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <DashboardSidebar />
// Input parameters: no input parameters
// Output: sidebar for admin dashboard page
// *********************

import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaTable } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { FaStore } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

import Link from "next/link";

const DashboardSidebar = () => {
  return (
    <div className="xl:w-[400px] h-full max-xl:w-full
                bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-4
                dark:bg-black/20 dark:border-gray-700">
      <Link href="/admin">
        <div className="flex gap-x-2 w-full hover:bg-white/20 cursor-pointer items-center py-4 pl-5 text-xl text-white rounded-md transition-colors duration-200">
          <MdDashboard className="text-2xl" />{" "}
          <span className="font-normal">Dashboard</span>
        </div>
      </Link>
      <Link href="/admin/orders">
        <div className="flex gap-x-2 w-full hover:bg-white/20 cursor-pointer items-center py-4 pl-5 text-xl text-white rounded-md transition-colors duration-200">
          <FaBagShopping className="text-2xl" />{" "}
          <span className="font-normal">Orders</span>
        </div>
      </Link>
      <Link href="/admin/products">
        <div className="flex gap-x-2 w-full hover:bg-white/20 cursor-pointer items-center py-4 pl-5 text-xl text-white rounded-md transition-colors duration-200">
          <FaTable className="text-2xl" />{" "}
          <span className="font-normal">Products</span>
        </div>
      </Link>
      <Link href="/admin/bulk-upload">
        <div className="flex gap-x-2 w-full hover:bg-white/20 cursor-pointer items-center py-4 pl-5 text-xl text-white rounded-md transition-colors duration-200">
          <FaFileUpload className="text-2xl" />{" "}
          <span className="font-normal">Bulk Upload</span>
        </div>
      </Link>
      <Link href="/admin/categories">
        <div className="flex gap-x-2 w-full hover:bg-white/20 cursor-pointer items-center py-4 pl-5 text-xl text-white rounded-md transition-colors duration-200">
          <MdCategory className="text-2xl" />{" "}
          <span className="font-normal">Categories</span>
        </div>
      </Link>
      <Link href="/admin/users">
        <div className="flex gap-x-2 w-full hover:bg-white/20 cursor-pointer items-center py-4 pl-5 text-xl text-white rounded-md transition-colors duration-200">
          <FaRegUser className="text-2xl" />{" "}
          <span className="font-normal">Users</span>
        </div>
      </Link>
      <Link href="/admin/merchant">
        <div className="flex gap-x-2 w-full hover:bg-white/20 cursor-pointer items-center py-4 pl-5 text-xl text-white rounded-md transition-colors duration-200">
          <FaStore className="text-2xl" />{" "}
          <span className="font-normal">Merchant</span>
        </div>
      </Link>
        <Link href="/admin/settings">
            <div className="flex gap-x-2 w-full hover:bg-white/20 cursor-pointer items-center py-4 pl-5 text-xl text-white rounded-md transition-colors duration-200">
                <FaGear className="text-2xl" />{" "}
                <span className="font-normal">Settings</span>
            </div>
        </Link>
    </div>
  );
};

export default DashboardSidebar;
