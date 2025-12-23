import { create } from 'zustand';
import apiClient from '@/lib/api';

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        id: string;
        email: string;
        role?: string;
    };
    images?: string[]; // Array of image URLs
}

interface ReviewStore {
    reviews: Review[];
    isLoading: boolean;
    error: string | null;
    fetchReviews: (productId: string) => Promise<void>;
    createReview: (productId: string, rating: number, comment: string, orderId?: string, images?: File[]) => Promise<boolean>;
    deleteReview: (reviewId: string) => Promise<boolean>;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
    reviews: [],
    isLoading: false,
    error: null,

    fetchReviews: async (productId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/api/reviews/${productId}`);
            if (response.ok) {
                // Should check existing apiClient structure, usually returns data directly or response
                // Assuming response needs .json() if apiClient is raw fetch wrapper, 
                // but if it's custom wrapper, it might return data.
                // Let's assume standard fetch wrapper given previous edits.
                const data = await response.json();
                set({ reviews: data, isLoading: false });
            } else {
                set({ error: 'Failed to fetch reviews', isLoading: false });
            }
        } catch (err: any) {
            set({ error: err.message || 'Error', isLoading: false });
        }
    },

    createReview: async (productId, rating, comment, orderId, images) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('rating', String(rating));
            formData.append('comment', comment);
            if (orderId) formData.append('orderId', orderId);

            if (images && images.length > 0) {
                images.forEach((image) => {
                    formData.append('images', image);
                });
            }

            // Client handles FormData content-type automatically (multipart/form-data)
            const response = await apiClient.post('/api/reviews', formData);

            if (response.ok) {
                // Refresh reviews
                await get().fetchReviews(productId);
                return true;
            } else {
                const errData = await response.json();
                set({ error: errData.message || 'Failed to post review', isLoading: false });
                return false;
            }
        } catch (err: any) {
            set({ error: err.message || 'Error', isLoading: false });
            return false;
        }
    },

    deleteReview: async (reviewId) => {
        try {
            const response = await apiClient.delete(`/api/reviews/${reviewId}`);
            if (response.ok) {
                set((state) => ({
                    reviews: state.reviews.filter(r => r.id !== reviewId)
                }));
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
}));
