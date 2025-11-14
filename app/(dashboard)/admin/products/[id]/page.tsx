"use client";
import { CustomButton, DashboardSidebar, SectionTitle } from "@/components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, use, useCallback } from "react";
import toast from "react-hot-toast";
import {
  convertCategoryNameToURLFriendly as convertSlugToURLFriendly,
  formatCategoryName,
} from "../../../../../utils/categoryFormating";
import { nanoid } from "nanoid";
import apiClient from "@/lib/api";

interface DashboardProductDetailsProps {
  params: Promise<{ id: string }>;
}

const DashboardProductDetails = ({ params }: DashboardProductDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [product, setProduct] = useState<Product>();
  const [categories, setCategories] = useState<Category[]>();
  const [otherImages, setOtherImages] = useState<OtherImages[]>([]);
  const router = useRouter();

  // functionality for deleting product
  const deleteProduct = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    try {
      const response = await apiClient.delete(`/api/products/${id}`);
      if (response.status !== 204) {
        if (response.status === 400) {
          toast.error(
            "Cannot delete the product because of foreign key constraint"
          );
        } else {
          throw Error("There was an error while deleting product");
        }
      } else {
        toast.success("Product deleted successfully");
        router.push("/admin/products");
      }
    } catch (error) {
      toast.error("There was an error while deleting product");
    }
  };

  // functionality for deleting main image
  const deleteMainImage = async () => {
    if (!product?.mainImage) {
      toast.error("No main image to delete.");
      return;
    }
    if (!confirm("Are you sure you want to delete the main image?")) {
      return;
    }
    try {
      // Use fetch directly to send body with DELETE request
      const response = await fetch(`${apiClient.baseUrl}/api/main-image/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagePath: product.mainImage }), // Send the image path
      });

      if (response.ok) {
        toast.success("Main image deleted successfully!");
        setProduct((prevProduct) => ({ ...prevProduct!, mainImage: null })); // Clear main image from state
      } else {
        let errorMessage = 'Unknown error';
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          errorMessage = await response.text();
        }
        toast.error(`Failed to delete main image: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error deleting main image:", error);
      toast.error("An error occurred while deleting the main image.");
    }
  };

  // functionality for updating product
  const updateProduct = async () => {
    if (
      product?.title === "" ||
      product?.slug === "" ||
      product?.price.toString() === "" ||
      product?.manufacturer === "" ||
      product?.description === ""
    ) {
      toast.error("You need to enter values in input fields");
      return;
    }

    try {
      const response = await apiClient.put(`/api/products/${id}`, product);

      if (response.status === 200) {
        await response.json();
        toast.success("Product successfully updated");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error || "There was an error while updating product"
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("There was an error while updating product");
    }
  };

  // functionality for uploading main image file
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);
    formData.append("productID", id); // Ensure product ID is sent

    try {
      const response = await apiClient.post("/api/main-image", formData); // apiClient handles method and body
      if (response.ok) {
        const data = await response.json();
        toast.success("Main image uploaded successfully!");
        setProduct((prevProduct) => ({ ...prevProduct!, mainImage: data.imagePath })); // Update with server-returned path
      } else {
        const errorData = await response.json();
        toast.error(`File upload unsuccessful: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error during image upload:", error);
      toast.error("There was an error during image upload.");
    }
  };

  // fetching main product data including other product images
  const fetchProductData = useCallback(async () => {
    apiClient
      .get(`/api/products/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProduct(data);
      });

    const imagesData = await apiClient.get(`/api/images/${id}`, {
      cache: "no-store",
    });
    const images = await imagesData.json();
    setOtherImages((currentImages) => images);
  }, [id]);

  // fetching all product categories. It will be used for displaying categories in select category input
  const fetchCategories = useCallback(async () => {
    apiClient
      .get(`/api/categories`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      });
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [fetchCategories, fetchProductData]);

  return (
    <div className="flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5 relative z-10">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:ml-5 w-full max-xl:px-5 p-4 rounded-lg
                  bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white
                  dark:bg-black/20 dark:border-gray-700">
        <h1 className="text-3xl font-semibold text-white">Product details</h1>
        {/* Product name input div - start */}
        
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-white">Product name:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs bg-white/10 border-white/20 text-white placeholder-gray-300 focus:ring-blue-500 dark:bg-black/20 dark:border-gray-700"
              value={product?.title || ""}
              onChange={(e) =>
                setProduct({ ...product!, title: e.target.value })
              }
            />
          </label>
        </div>
        {/* Product name input div - end */}
        {/* Product price input div - start */}

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-white">Product price:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs bg-white/10 border-white/20 text-white placeholder-gray-300 focus:ring-blue-500 dark:bg-black/20 dark:border-gray-700"
              value={product?.price || ""}
              onChange={(e) =>
                setProduct({ ...product!, price: Number(e.target.value) })
              }
            />
          </label>
        </div>
        {/* Product price input div - end */}
        {/* Product manufacturer input div - start */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-white">Manufacturer:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs bg-white/10 border-white/20 text-white placeholder-gray-300 focus:ring-blue-500 dark:bg-black/20 dark:border-gray-700"
              value={product?.manufacturer || ""}
              onChange={(e) =>
                setProduct({ ...product!, manufacturer: e.target.value })
              }
            />
          </label>
        </div>
        {/* Product manufacturer input div - end */}
        {/* Product slug input div - start */}

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-white">Slug:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs bg-white/10 border-white/20 text-white placeholder-gray-300 focus:ring-blue-500 dark:bg-black/20 dark:border-gray-700"
              value={
                product?.slug ? convertSlugToURLFriendly(product?.slug) : ""
              }
              onChange={(e) =>
                setProduct({
                  ...product!,
                  slug: convertSlugToURLFriendly(e.target.value),
                })
              }
            />
          </label>
        </div>
        {/* Product slug input div - end */}
        {/* Product inStock select input div - start */}

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-white">Is product in stock?</span>
            </div>
            <select
              className="select select-bordered bg-white/10 border-white/20 text-white focus:ring-blue-500 dark:bg-black/20 dark:border-gray-700"
              value={product?.inStock ?? 1}
              onChange={(e) => {
                setProduct({ ...product!, inStock: Number(e.target.value) });
              }}
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </label>
        </div>
        {/* Product inStock select input div - end */}
        {/* Product category select input div - start */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-white">Category:</span>
            </div>
            <select
              className="select select-bordered bg-white/10 border-white/20 text-white focus:ring-blue-500 dark:bg-black/20 dark:border-gray-700"
              value={product?.categoryId || ""}
              onChange={(e) =>
                setProduct({
                  ...product!,
                  categoryId: e.target.value,
                })
              }
            >
              {categories &&
                categories.map((category: Category) => (
                  <option key={category?.id} value={category?.id}>
                    {formatCategoryName(category?.name)}
                  </option>
                ))}
            </select>
          </label>
        </div>
        {/* Product category select input div - end */}

        {/* Main image file upload div - start */}
        <div>
          <label className="form-control w-full max-w-sm">
            <div className="label">
              <span className="label-text text-white">Main Image:</span>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-sm bg-white/10 border-white/20 text-white focus:ring-blue-500 dark:bg-black/20 dark:border-gray-700"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0]; // Use optional chaining and File type

                if (selectedFile) {
                  uploadFile(selectedFile);
                }
              }}
            />
          </label>
          {product?.mainImage && (
            <div className="flex items-center gap-2 mt-2">
              <Image
                src={`/${product.mainImage.replace(/^\//, '')}`}
                alt={product?.title}
                className="w-auto h-auto rounded-lg border border-white/20 shadow-lg"
                width={100}
                height={100}
              />
              <CustomButton
                buttonType="button"
                onClick={deleteMainImage}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
              >
                Delete
              </CustomButton>
            </div>
          )}
        </div>
        {/* Main image file upload div - end */}
        {/* Other images file upload div - start */}
        <div className="flex gap-x-1">
          {otherImages &&
            otherImages.map((image) => (
              <Image
                src={`/${image.image.replace(/^\//, '')}`}
                key={nanoid()}
                alt="product image"
                width={100}
                height={100}
                className="w-auto h-auto rounded-lg border border-white/20 shadow-lg"
              />
            ))}
        </div>
        {/* Other images file upload div - end */}
        {/* Product description div - start */}
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text text-white">Product description:</span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24 bg-white/10 border-white/20 text-white placeholder-gray-300 focus:ring-blue-500 dark:bg-black/20 dark:border-gray-700"
              value={product?.description || ""}
              onChange={(e) =>
                setProduct({ ...product!, description: e.target.value })
              }
            ></textarea>
          </label>
        </div>
        {/* Product description div - end */}
        {/* Action buttons div - start */}
        <div className="flex gap-x-2 max-sm:flex-col">
          <button
            type="button"
            onClick={updateProduct}
            className="uppercase px-10 py-5 text-lg font-bold shadow-sm focus:outline-none focus:ring-2
                       bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-white hover:bg-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
          >
            Update product
          </button>
          <button
            type="button"
            className="uppercase px-10 py-5 text-lg font-bold shadow-sm focus:outline-none focus:ring-2
                       bg-red-500/20 backdrop-blur-md border border-red-500/30 text-white hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300"
            onClick={deleteProduct}
          >
            Delete product
          </button>
        </div>
        {/* Action buttons div - end */}
        <p className="text-xl max-sm:text-lg text-red-400">
          To delete the product you first need to delete all its records in
          orders (customer_order_product table).
        </p>
      </div>
    </div>
  );
};

export default DashboardProductDetails;
