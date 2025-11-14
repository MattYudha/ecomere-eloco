"use client";
import { DashboardSidebar, CustomButton } from "@/components";
import React, { useState } from "react";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Link from "next/link";

const DashboardNewCategoryPage = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addNewCategory = async () => {
    if (name.trim().length === 0) {
      toast.error("Category name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(`/api/categories`, {
        name: name, // Send the raw name
      });

      if (response.status === 201) {
        toast.success("Category added successfully!");
        setName("");
        router.push("/admin/categories"); // Redirect back to the list
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "There was an error creating the category.");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="p-8 rounded-3xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10 shadow-xl border border-white/20 dark:border-gray-700/20 flex flex-col gap-y-7 w-full">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Add New Category
          </h1>
          <Link href="/admin/categories">
            <CustomButton
              buttonType="button"
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center gap-2"
            >
              <FaArrowLeft />
              Back to Categories
            </CustomButton>
          </Link>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-y-4 max-w-md">
          <div>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text text-gray-700 dark:text-gray-300">Category Name:</span>
              </div>
              <input
                type="text"
                placeholder="e.g., Laptops"
                className="input input-bordered w-full bg-white/5 dark:bg-gray-800/5 text-gray-900 dark:text-white border border-white/20 dark:border-gray-700/20 focus:outline-none focus:border-grilli-gold rounded-lg placeholder-gray-400 dark:placeholder-gray-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </label>
          </div>

          <div className="flex justify-start mt-4">
            <CustomButton
              buttonType="button"
              onClick={addNewCategory}
              disabled={loading}
              className="bg-grilli-gold/80 hover:bg-grilli-gold text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
            >
              <FaPlus />
              {loading ? "Creating..." : "Create Category"}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNewCategoryPage;
