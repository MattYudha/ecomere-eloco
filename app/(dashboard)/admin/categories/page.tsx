"use client";
import { CustomButton, DashboardSidebar } from "@/components";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatCategoryName } from "../../../../utils/categoryFormating";
import apiClient from "@/lib/api";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"; // Import icons

interface Category {
  id: string;
  name: string;
}

const DashboardCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    setLoading(true);
    apiClient.get("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => {
        console.error("Failed to fetch categories");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await apiClient.delete(`/api/categories/${categoryId}`);
        if (response.ok) {
          alert("Category deleted successfully");
          fetchCategories(); // Refresh categories list
        } else {
          const errorData = await response.json();
          alert(`Failed to delete category: ${errorData.message}`);
        }
      } catch (error) {
        alert("An error occurred while deleting the category.");
        console.error(error);
      }
    }
  };

  return (
    <div className="bg-transparent flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="p-8 rounded-3xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10 shadow-xl border border-white/20 dark:border-gray-700/20 flex flex-col gap-y-7 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Manage Categories
          </h1>
          <Link href="/admin/categories/new">
            <CustomButton
              buttonType="button"
              className="bg-grilli-gold/80 hover:bg-grilli-gold text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <FaPlus />
              Add New Category
            </CustomButton>
          </Link>
        </div>

        {loading ? (
          // Skeleton Loader
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 bg-white/5 dark:bg-gray-700/20 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-400/30 dark:border-gray-600/30 rounded-xl">
            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">No categories found.</p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">Get started by adding a new category.</p>
          </div>
        ) : (
          // Categories Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category: Category) => (
              <div
                key={category.id}
                className="group relative p-5 bg-white/5 dark:bg-gray-800/50 rounded-xl shadow-md border border-white/10 dark:border-gray-700/50 hover:shadow-xl hover:border-grilli-gold/50 transition-all duration-300"
              >
                <p className="text-lg font-bold text-gray-800 dark:text-white truncate">
                  {formatCategoryName(category.name)}
                </p>
                <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href={`/admin/categories/${category.id}`}>
                    <button className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 hover:text-white transition-colors">
                      <FaEdit />
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-white transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCategory;
