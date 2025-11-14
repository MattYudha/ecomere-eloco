"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import config from "@/lib/config"; // Import config
import { convertCategoryNameToURLFriendly as convertSlugToURLFriendly } from "@/utils/categoryFormating";
import { sanitizeFormData } from "@/lib/form-sanitize";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

// Define interfaces for better type safety
interface ProductState {
  merchantId?: string;
  title: string;
  price: number;
  manufacturer: string;
  inStock: number;
  mainImage: string;
  description: string;
  slug: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

interface Merchant {
  id: string;
  name: string;
}

const AddNewProduct = () => {
  const [product, setProduct] = useState<ProductState>({
    merchantId: "",
    title: "",
    price: 0,
    manufacturer: "",
    inStock: 1,
    mainImage: "",
    description: "",
    slug: "",
    categoryId: "",
  });
  
  // State to hold the selected file object
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // State to hold the preview URL for the selected image
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  // Refactored function to handle adding product and uploading image
  const addProduct = async () => {
    // --- 1. Input Validation ---
    if (
      !product.merchantId ||
      !product.title ||
      !product.manufacturer ||
      !product.description ||
      !product.slug ||
      !selectedFile // Check if a file is selected
    ) {
      toast.error("Please fill all fields and select an image.");
      return;
    }

    // --- 2. Create Product (Text Data) ---
    let newProductId = "";
    try {
      const sanitizedProduct = sanitizeFormData({ ...product, mainImage: '' }); // Don't send image path yet
      const productResponse = await apiClient.post(`/api/products`, sanitizedProduct);

      if (productResponse.status !== 201) {
        const errorData = await productResponse.json();
        toast.error(`Failed to create product: ${errorData.message || 'Unknown error'}`);
        return;
      }

      const newProduct = await productResponse.json();
      newProductId = newProduct.id; // Get the ID of the newly created product
      toast.success("Product created successfully! Now uploading image...");

    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("A network error occurred while creating the product.");
      return;
    }

    // --- 3. Upload Image ---
    if (newProductId && selectedFile) {
      const formData = new FormData();
      formData.append("uploadedFile", selectedFile);
      formData.append("productID", newProductId); // Send the new product ID

      try {
        // Use standard fetch with the correct full URL for FormData
        const imageResponse = await fetch(`${config.apiBaseUrl}/api/main-image`, {
            method: 'POST',
            body: formData,
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          console.log("Image uploaded successfully:", imageData);
          toast.success("Image uploaded and linked successfully!");
          
          // --- 4. Reset Form ---
          setProduct({
            merchantId: "",
            title: "",
            price: 0,
            manufacturer: "",
            inStock: 1,
            mainImage: "",
            description: "",
            slug: "",
            categoryId: categories[0]?.id || "",
          });
          setSelectedFile(null);
          setPreviewUrl(null);

        } else {
          const errorData = await imageResponse.json();
          toast.error(`Image upload failed: ${errorData.message || 'Server error'}`);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("A network error occurred during image upload.");
      }
    }
  };

  const fetchMerchants = useCallback(async () => {
    try {
      const res = await apiClient.get("/api/merchants");
      const data: Merchant[] = await res.json();
      setMerchants(data || []);
      if (data.length > 0) {
        setProduct((prev) => ({ ...prev, merchantId: prev.merchantId || data[0].id }));
      }
    } catch (e) {
      toast.error("Failed to load merchants");
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiClient.get(`/api/categories`);
      const data: Category[] = await res.json();
      setCategories(data);
      if (data.length > 0) {
        setProduct((prev) => ({ ...prev, categoryId: prev.categoryId || data[0].id }));
      }
    } catch (e) {
      toast.error("Failed to load categories");
    }
  }, []);

  // New handler for file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create a temporary URL for image preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMerchants();
  }, [fetchCategories, fetchMerchants]);
  
  // Clean up the object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="bg-transparent flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="p-8 rounded-3xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10 shadow-xl border border-white/20 dark:border-gray-700/20 flex flex-col gap-y-7 xl:ml-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Add new product</h1>
        
        {/* Merchant Selector */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label"><span className="label-text">Merchant Info:</span></div>
            <select
              className="select select-bordered bg-white/5 dark:bg-gray-800/5 text-gray-900 dark:text-white border border-white/20 dark:border-gray-700/20 focus:outline-none focus:border-grilli-gold rounded-lg"
              value={product.merchantId}
              onChange={(e) => setProduct({ ...product, merchantId: e.target.value })}
            >
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>{merchant.name}</option>
              ))}
            </select>
            {merchants.length === 0 && <span className="text-xs text-red-500 mt-1">Please create a merchant first.</span>}
          </label>
        </div>

        {/* Product Name */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label"><span className="label-text">Product name:</span></div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs bg-white/5 dark:bg-gray-800/5 text-gray-900 dark:text-white border border-white/20 dark:border-gray-700/20 focus:outline-none focus:border-grilli-gold rounded-lg placeholder-gray-400 dark:placeholder-gray-500"
              value={product.title}
              onChange={(e) => setProduct({ ...product, title: e.target.value, slug: convertSlugToURLFriendly(e.target.value) })}
            />
          </label>
        </div>

        {/* Product Slug (Read-only, derived from title) */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label"><span className="label-text">Product slug:</span></div>
            <input
              type="text"
              readOnly
              className="input input-bordered w-full max-w-xs bg-gray-200/5 dark:bg-gray-700/5 text-gray-500 dark:text-gray-400 border border-white/20 dark:border-gray-700/20 focus:outline-none rounded-lg"
              value={product.slug}
            />
          </label>
        </div>

        {/* Category Selector */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label"><span className="label-text">Category:</span></div>
            <select
              className="select select-bordered bg-white/5 dark:bg-gray-800/5 text-gray-900 dark:text-white border border-white/20 dark:border-gray-700/20 focus:outline-none focus:border-grilli-gold rounded-lg"
              value={product.categoryId}
              onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Price */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label"><span className="label-text">Product price:</span></div>
            <input
              type="number"
              className="input input-bordered w-full max-w-xs bg-white/5 dark:bg-gray-800/5 text-gray-900 dark:text-white border border-white/20 dark:border-gray-700/20 focus:outline-none focus:border-grilli-gold rounded-lg placeholder-gray-400 dark:placeholder-gray-500"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
            />
          </label>
        </div>

        {/* Manufacturer */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label"><span className="label-text">Manufacturer:</span></div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs bg-white/5 dark:bg-gray-800/5 text-gray-900 dark:text-white border border-white/20 dark:border-gray-700/20 focus:outline-none focus:border-grilli-gold rounded-lg placeholder-gray-400 dark:placeholder-gray-500"
              value={product.manufacturer}
              onChange={(e) => setProduct({ ...product, manufacturer: e.target.value })}
            />
          </label>
        </div>

        {/* In Stock */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label"><span className="label-text">Is product in stock?</span></div>
            <select
              className="select select-bordered bg-white/5 dark:bg-gray-800/5 text-gray-900 dark:text-white border border-white/20 dark:border-gray-700/20 focus:outline-none focus:border-grilli-gold rounded-lg"
              value={product.inStock}
              onChange={(e) => setProduct({ ...product, inStock: Number(e.target.value) })}
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </label>
        </div>

        {/* File Input */}
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label"><span className="label-text">Product Image:</span></div>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full max-w-xs bg-white/5 dark:bg-gray-800/5 text-gray-900 dark:text-white border border-white/20 dark:border-gray-700/20 focus:outline-none focus:border-grilli-gold rounded-lg"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-4">
              <p className="label-text mb-2">Image Preview:</p>
              <div className="relative w-full max-w-xs h-48 rounded-lg overflow-hidden border border-white/20 dark:border-gray-700/20">
                <Image
                  src={previewUrl}
                  alt="Image preview"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="form-control w-full">
              <div className="label"><span className="label-text">Product description:</span></div>
              <textarea
                className="textarea textarea-bordered h-24 bg-white/5 dark:bg-gray-800/5 text-gray-900 dark:text-white border border-white/20 dark:border-gray-700/20 focus:outline-none focus:border-grilli-gold rounded-lg placeholder-gray-400 dark:placeholder-gray-500"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
              ></textarea>
            </label>
          </div>

          {/* Submit Button */}
          <button
            className="btn btn-primary bg-grilli-gold/80 hover:bg-grilli-gold text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            onClick={addProduct}
          >
            Add Product
          </button>
        </div>
      </div>
    );
};

export default AddNewProduct;
          
