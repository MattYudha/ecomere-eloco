"use client";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";

interface Merchant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  status: string;
  product: any[]; // Changed from products to product
}

export default function MerchantPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/merchants");
      if (!response.ok) {
        throw new Error("Failed to fetch merchants");
      }
      const data = await response.json();
      setMerchants(data);
    } catch (error) {
      console.error("Error fetching merchants:", error);
      toast.error("Failed to load merchants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  return (
    <div className="flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col max-xl:h-fit max-xl:gap-y-4 relative z-10">
      <DashboardSidebar />
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Merchants</h1>
          <Link
            href="/admin/merchant/new"
            className="bg-white/20 backdrop-blur-md border border-white/30 shadow-lg text-white px-6 py-2 rounded-full hover:bg-white/30 hover:border-white/50 transition-all duration-300"
          >
            Add Merchant
          </Link>
        </div>

        <div className="rounded-lg shadow-md p-6
                    bg-white/10 backdrop-blur-md border border-white/20 text-white
                    dark:bg-black/20 dark:border-gray-700">
          {loading ? (
            <div className="text-center py-10 text-white">Loading merchants...</div>
          ) : merchants.length > 0 ? (
            <table className="w-full bg-transparent text-white">
              <thead>
                <tr className="border-b border-white/20 bg-white/20 dark:bg-black/30">
                  <th className="py-3 text-left">Name</th>
                  <th className="py-3 text-left">Email</th>
                  <th className="py-3 text-left">Status</th>
                  <th className="py-3 text-left">Products</th>
                  <th className="py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {merchants.map((merchant) => (
                  <tr key={merchant.id} className="border-b border-white/10 hover:bg-white/10 dark:hover:bg-black/20">
                    <td className="py-4">{merchant.name}</td>
                    <td className="py-4">{merchant.email || "N/A"}</td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          merchant.status === "ACTIVE"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {merchant.status}
                      </span>
                    </td>
                    <td className="py-4">{merchant.product.length}</td>
                    <td className="py-4">
                      <Link
                        href={`/admin/merchant/${merchant.id}`}
                        className="text-blue-400 hover:underline mr-3"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/merchant/${merchant.id}`}
                        className="text-blue-400 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-white">No merchants found</div>
          )}
        </div>
      </div>
    </div>
  );
}