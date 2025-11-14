'use client';
import apiClient from '@/lib/api';
import { isValidEmailAddressFormat, isValidNameOrLastname } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UserCircle, MapPin, Mail, Phone, Building, Hash, Truck, Package, Edit, Trash2, Save, ArrowLeft, Info } from 'lucide-react';

interface OrderProduct {
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    title: string;
    mainImage: string;
    price: number;
    rating: number;
    description: string;
    manufacturer: string;
    inStock: number;
    categoryId: string;
  };
}

const AdminSingleOrder = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>();
  const [order, setOrder] = useState<Order>({
    id: '',
    adress: '',
    apartment: '',
    company: '',
    dateTime: '',
    email: '',
    lastname: '',
    name: '',
    phone: '',
    postalCode: '',
    city: '',
    country: '',
    orderNotice: '',
    status: 'processing',
    total: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await apiClient.get(`/api/orders/${params?.id}`);
        if (!response.ok) throw new Error('Failed to fetch order data');
        const data: Order = await response.json();
        setOrder(data);
      } catch (error) {
        toast.error('Could not load order details.');
        console.error(error);
      }
    };

    const fetchOrderProducts = async () => {
      try {
        const response = await apiClient.get(`/api/order-product/${params?.id}`);
        if (!response.ok) throw new Error('Failed to fetch order products');
        const data: OrderProduct[] = await response.json();
        setOrderProducts(data);
      } catch (error) {
        toast.error('Could not load products for this order.');
        console.error(error);
      }
    };

    if (params?.id) {
      fetchOrderData();
      fetchOrderProducts();
    }
  }, [params?.id]);

  const handleInputChange = (field: keyof Order, value: string) => {
    setOrder(prev => ({ ...prev, [field]: value }));
  };

  const updateOrder = async () => {
    if (isUpdating) return; // Prevent concurrent updates

    // Basic validation
    if (!isValidNameOrLastname(order?.name) || !isValidNameOrLastname(order?.lastname) || !isValidEmailAddressFormat(order?.email)) {
      toast.error('Please check the format of name, lastname, or email.');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await apiClient.put(`/api/orders/${order?.id}`, order);
      
      if (!response.ok) {
        // Try to parse error details from the server
        const errorData = await response.json().catch(() => null); // Avoid crash on non-JSON response

        // If parsing fails or result is empty, create a more informative error
        if (!errorData || Object.keys(errorData).length === 0) {
          throw new Error(`Update failed: ${response.status} ${response.statusText}`);
        }
        
        throw errorData; // Throw the parsed error object from the server
      }

      toast.success('Order updated successfully');

    } catch (error: any) {
      console.error("Update failed (raw error):", error); // Log the original error

      // Handle the case where the thrown error is an empty object
      if (error && typeof error === 'object' && !Object.keys(error).length && !(error instanceof Error)) {
        toast.error('An unexpected error occurred. The server may be down or sent an invalid response.');
        return;
      }

      // Check if the error has a 'details' array from our server's validation
      if (error && error.details && Array.isArray(error.details)) {
        toast.error("Please fix the following errors:");
        // Display a toast for each validation error
        error.details.forEach((detail: { field: string, message: string }) => {
          // Capitalize the field name for better readability
          const fieldName = detail.field.charAt(0).toUpperCase() + detail.field.slice(1);
          toast.error(`${fieldName}: ${detail.message}`);
        });
      } else {
        // Fallback to the general error message if 'details' is not available
        toast.error(error.message || error.error || 'An error occurred while updating.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteOrder = async () => {
    if (!confirm('Are you sure you want to delete this order permanently?')) {
      return;
    }
    try {
      await apiClient.delete(`/api/order-product/${order?.id}`);
      await apiClient.delete(`/api/orders/${order?.id}`);
      toast.success('Order deleted successfully');
      router.push('/admin/orders');
    } catch (error) {
      toast.error('Failed to delete order.');
      console.error(error);
    }
  };

  const GlassPanel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`backdrop-blur-xl bg-white/70 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );

  const InputField = ({ icon, label, value, field, isTextArea = false }: { icon: React.ReactNode, label: string, value: string | null, field: keyof Order, isTextArea?: boolean }) => (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {icon}
        {label}
      </label>
      {isTextArea ? (
        <textarea
          value={value || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full bg-gray-100/80 dark:bg-white/5 border-2 border-transparent focus:border-purple-500 focus:ring-0 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-200 transition"
          rows={4}
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full bg-gray-100/80 dark:bg-white/5 border-2 border-transparent focus:border-purple-500 focus:ring-0 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-200 transition"
        />
      )}
    </div>
  );

  return (
    <div className="w-full bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <ArrowLeft size={20} />
              Back to Orders
            </button>
            <h1 className="text-3xl font-bold mt-2">Order <span className="font-mono text-purple-700 dark:text-purple-400">#{order.id.split('-')[0]}...</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={deleteOrder} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-500/30 font-semibold transition">
              <Trash2 size={16} />
              Delete
            </button>
            <button
              onClick={updateOrder}
              disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-semibold transition shadow-md disabled:bg-purple-400 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isUpdating ? 'Updating...' : 'Update Order'}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <GlassPanel>
              <div className="p-6 border-b border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-semibold flex items-center gap-3"><UserCircle />Customer & Shipping Details</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField icon={<Edit size={16} />} label="Name" value={order.name} field="name" />
                <InputField icon={<Edit size={16} />} label="Lastname" value={order.lastname} field="lastname" />
                <InputField icon={<Mail size={16} />} label="Email" value={order.email} field="email" />
                <InputField icon={<Phone size={16} />} label="Phone" value={order.phone} field="phone" />
                <InputField icon={<Building size={16} />} label="Company" value={order.company} field="company" />
                <InputField icon={<MapPin size={16} />} label="Address" value={order.adress} field="adress" />
                <InputField icon={<MapPin size={16} />} label="Apartment" value={order.apartment} field="apartment" />
                <InputField icon={<MapPin size={16} />} label="City" value={order.city} field="city" />
                <InputField icon={<MapPin size={16} />} label="Country" value={order.country} field="country" />
                <InputField icon={<Hash size={16} />} label="Postal Code" value={order.postalCode} field="postalCode" />
              </div>
            </GlassPanel>

            <GlassPanel>
              <div className="p-6 border-b border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-semibold flex items-center gap-3"><Info />Order Notice</h2>
              </div>
              <div className="p-6">
                <InputField icon={<Edit size={16} />} label="Customer provided notes" value={order.orderNotice} field="orderNotice" isTextArea />
              </div>
            </GlassPanel>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            <GlassPanel>
              <div className="p-6 border-b border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-semibold flex items-center gap-3"><Truck />Order Status</h2>
              </div>
              <div className="p-6">
                <select
                  className="w-full bg-gray-100/80 dark:bg-white/5 border-2 border-transparent focus:border-purple-500 focus:ring-0 rounded-lg px-4 py-3 text-gray-800 dark:text-gray-200 transition"
                  value={order?.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </GlassPanel>

            <GlassPanel>
              <div className="p-6 border-b border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-semibold flex items-center gap-3"><Package />Products in Order</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {orderProducts?.map((op) => (
                  <div key={op.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-500/10">
                    <Image
                      src={op.product?.mainImage ? `/${op.product.mainImage.replace(/^\//, '')}` : '/product_placeholder.jpg'}
                      alt={op.product?.title}
                      width={64}
                      height={64}
                      className="rounded-md aspect-square object-cover"
                    />
                    <div className="flex-grow">
                      <Link href={`/product/${op.product?.slug}`} className="font-semibold hover:text-purple-500 transition">{op.product?.title}</Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{op.quantity} x ${op.product?.price.toFixed(2)}</p>
                    </div>
                    <p className="font-semibold text-lg">${(op.quantity * op.product?.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-white/10 flex flex-col gap-2 text-right">
                  <div className="text-lg">Subtotal: <span className="font-semibold">${order?.total.toFixed(2)}</span></div>
                  <div className="text-lg">Tax (20%): <span className="font-semibold">${(order?.total / 5).toFixed(2)}</span></div>
                  <div className="text-lg">Shipping: <span className="font-semibold">$5.00</span></div>
                  <div className="text-2xl font-bold mt-2">Total: <span className="text-purple-700 dark:text-purple-400">${(order?.total + order?.total / 5 + 5).toFixed(2)}</span></div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSingleOrder;
