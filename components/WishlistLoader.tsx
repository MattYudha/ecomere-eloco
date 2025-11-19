"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProductStore } from "../app/_zustand/store";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";

interface WishlistLoaderProps {
  children: React.ReactNode;
}

const WishlistLoader: React.FC<WishlistLoaderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const { setWishlist, clearWishlist } = useProductStore();

  useEffect(() => {
    const fetchAndSetWishlist = async () => {
      if (status === "loading") {
        // Session is still loading, do nothing
        return;
      }

      if (session?.user) {
        // User is logged in, fetch wishlist
        try {
          const response = await apiClient.get("/api/wishlist");
          if (!response.ok) {
            let errorMessage = "Failed to fetch wishlist.";
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorData.details || errorMessage;
            } catch (jsonError) {
              console.warn("Could not parse error response as JSON:", jsonError);
            }
            throw new Error(errorMessage);
          }
          const data = await response.json();
          setWishlist(data); // Set wishlist in Zustand store
        } catch (error) {
          console.error("[WISHLIST_LOADER_ERROR]", error);
          toast.error("Failed to load your wishlist.");
          clearWishlist(); // Clear wishlist if fetching fails
        }
      } else {
        // User is not logged in, clear wishlist
        clearWishlist();
      }
    };

    fetchAndSetWishlist();
  }, [session, status, setWishlist, clearWishlist]);

  return <>{children}</>;
};

export default WishlistLoader;
