'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProductStore } from '../_zustand/store';
import { useAuth } from '@/hooks/useAuth';
import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCheck, FaArrowLeft, FaArrowRight, FaTruck } from 'react-icons/fa';

// Components
import CheckoutStepper from '@/components/CheckoutStepper';
import StickyOrderSummary from '@/components/StickyOrderSummary';
import ValidatedInput from '@/components/ValidatedInput';
import OrderSuccessModal from '@/components/OrderSuccessModal';

// Validation
import {
    createValidationRules,
    validatePhoneIndonesia,
    validatePostalCodeIndonesia,
    validateEmail,
} from '@/lib/validation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface CheckoutFormData {
    name: string;
    lastname: string;
    phone: string;
    email: string;
    company: string; // Kecamatan
    adress: string; // Main address
    apartment: string; // Detail address
    city: string; // City Name
    cityId: string; // RajaOngkir City ID
    province: string; // Province Name
    provinceId: string; // RajaOngkir Province ID
    country: string;
    postalCode: string;
    orderNotice: string;
}

const CheckoutContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useAuth();
    const { products: allProducts, total: cartTotal, clearCart, calculateTotals, selectedItems } = useProductStore();

    // Filter products to only show selected items
    const products = useMemo(() => {
        return allProducts.filter(p => selectedItems.includes(p.id));
    }, [allProducts, selectedItems]);

    // Shipping State
    const [provinces, setProvinces] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [shippingZone, setShippingZone] = useState<string | null>(null);
    const [isShippingEstimated, setIsShippingEstimated] = useState<boolean>(true);
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [isLoadingShipping, setIsLoadingShipping] = useState(false);

    // Initial Form State
    const { formData, updateField, clearSaved, isSaving, setFormData } = useAutoSaveForm<CheckoutFormData>(
        {
            name: '',
            lastname: '',
            phone: '',
            email: session?.user?.email || '',
            company: '',
            adress: '',
            apartment: '',
            city: '',
            cityId: '',
            province: '',
            provinceId: '',
            country: 'Indonesia',
            postalCode: '',
            orderNotice: '',
        },
        {
            key: 'eloco-checkout-form-v2', // Changed key to reset legacy data
            debounceMs: 2000,
            enabled: true,
        }
    );

    // Step State
    const [currentStep, setCurrentStep] = useState<number>(
        parseInt(searchParams.get('step') || '1')
    );
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderData, setOrderData] = useState({ orderNumber: '', customerName: '' });

    // Calculate totals on mount
    useEffect(() => {
        calculateTotals();
    }, [calculateTotals]);

    // Fetch Provinces on Mount
    useEffect(() => {
        const fetchProvinces = async () => {
            setIsLoadingProvinces(true);
            try {
                const res = await fetch('/api/location/provinces');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProvinces(data);
                }
            } catch (error) {
                console.error('Failed to fetch provinces', error);
                toast.error('Gagal memuat data provinsi');
            } finally {
                setIsLoadingProvinces(false);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch Cities when Province Changes
    useEffect(() => {
        const fetchCities = async () => {
            if (!formData.provinceId) {
                setCities([]);
                return;
            }
            setIsLoadingCities(true);
            try {
                const res = await fetch(`/api/location/cities?province=${formData.provinceId}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setCities(data);
                }
            } catch (error) {
                console.error('Failed to fetch cities', error);
                toast.error('Gagal memuat data kota');
            } finally {
                setIsLoadingCities(false);
            }
        };

        if (formData.provinceId) {
            fetchCities();
        }
    }, [formData.provinceId]);

    // Calculate Shipping when Location Changes
    useEffect(() => {
        const calculateShipping = async () => {
            if (!formData.cityId || !formData.provinceId) {
                setShippingCost(0);
                setShippingZone(null);
                return;
            }

            setIsLoadingShipping(true);
            try {
                const res = await fetch('/api/shipping/estimate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cityId: formData.cityId,
                        provinceId: formData.provinceId
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    setShippingCost(data.cost);
                    setShippingZone(data.zone);
                    setIsShippingEstimated(data.isEstimated);
                }
            } catch (error) {
                console.error('Shipping calculation failed', error);
            } finally {
                setIsLoadingShipping(false);
            }
        };

        // Debounce calculation
        const timer = setTimeout(() => {
            calculateShipping();
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.cityId, formData.provinceId]);


    // Auth check
    useEffect(() => {
        if (status === 'unauthenticated') {
            toast.error('Silakan login untuk checkout');
            router.push('/login?callbackUrl=/checkout');
        }
    }, [status, router]);

    // Redirect to cart if empty
    useEffect(() => {
        if (status === 'loading') return;
        const timer = setTimeout(() => {
            if (products.length === 0 && !showSuccessModal) {
                router.push('/cart');
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [products.length, showSuccessModal, router, status]);

    // Update URL when step changes
    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.set('step', currentStep.toString());
        window.history.replaceState({}, '', url.toString());
    }, [currentStep]);

    // Pre-fill email from session
    useEffect(() => {
        if (session?.user?.email && !formData.email) {
            updateField('email', session.user.email);
        }
    }, [session, formData.email, updateField]);


    // Handlers for Select changes
    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceId = e.target.value;
        const provinceName = e.target.options[e.target.selectedIndex].text;

        // Batch updates to avoid inconsistent state (though useAutoSaveForm updates individually)
        // We need to clear city when province changes
        setFormData(prev => ({
            ...prev,
            provinceId,
            province: provinceName,
            cityId: '',
            city: ''
        }));
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityId = e.target.value;
        const cityName = e.target.options[e.target.selectedIndex].text;

        setFormData(prev => ({
            ...prev,
            cityId,
            city: cityName
        }));
    };

    // Derived Totals
    const finalTotal = cartTotal + shippingCost;

    // Transform products for StickyOrderSummary
    const cartItems = useMemo(() => {
        return products.map((product) => ({
            id: product.id,
            title: product.title,
            mainImage: product.image?.startsWith('http')
                ? product.image
                : `/${product.image?.replace(/^\//, '') || 'product_placeholder.jpg'}`,
            price: product.price ? Number(product.price) : 0,
            quantity: product.amount,
        }));
    }, [products]);

    // Validate Step 2
    const validateStep2 = (): boolean => {
        const errors: string[] = [];
        if (!formData.name.trim() || formData.name.length < 2) errors.push('Nama Depan minimal 2 karakter');
        if (!formData.lastname.trim() || formData.lastname.length < 2) errors.push('Nama Belakang minimal 2 karakter');
        if (!validateEmail(formData.email)) errors.push('Email tidak valid');
        if (!validatePhoneIndonesia(formData.phone)) errors.push('Nomor HP tidak valid');
        if (!formData.adress.trim() || formData.adress.length < 10) errors.push('Alamat minimal 10 karakter');

        if (!formData.provinceId) errors.push('Silakan pilih Provinsi');
        if (!formData.cityId) errors.push('Silakan pilih Kota/Kabupaten');
        if (!formData.company.trim()) errors.push('Silakan isi Kecamatan');

        if (!validatePostalCodeIndonesia(formData.postalCode)) errors.push('Kode Pos harus 5 digit');

        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error));
            return false;
        }
        return true;
    };

    // Navigation and Submit Handlers (mostly same as before logic, updated for shipping)
    const handleStepClick = (step: number) => {
        if (step === 1) setCurrentStep(1);
        else if (step === 2 && products.length > 0) setCurrentStep(2);
        else if (step === 3 && (completedSteps.includes(2) || validateStep2())) setCurrentStep(3);
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (products.length === 0) { toast.error('Keranjang kosong'); return; }
            setCompletedSteps((prev) => [...new Set([...prev, 1])]);
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (validateStep2()) {
                setCompletedSteps((prev) => [...new Set([...prev, 2])]);
                setCurrentStep(3);
            }
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmitOrder = async () => {
        if (!validateStep2()) return;
        if (products.length === 0) { toast.error('Keranjang kosong'); return; }

        setIsSubmitting(true);

        try {
            // Get user ID logic...
            let userId = null;
            if (session?.user?.email) {
                try {
                    const userResponse = await apiClient.get(`/api/users/email/${session.user.email}`);
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        userId = userData.id;
                    }
                } catch (error) { console.error('Error fetching user ID:', error); }
            }

            const orderPayload = {
                name: formData.name.trim(),
                lastname: formData.lastname.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                company: formData.company.trim(), // Kecamatan
                adress: formData.adress.trim(),
                apartment: formData.apartment.trim(),
                city: formData.city.trim(),
                country: formData.country || 'Indonesia',
                postalCode: formData.postalCode.trim(),
                status: 'pending',
                total: Math.round(finalTotal), // Includes Shipping
                shippingCost: shippingCost,
                shippingZone: shippingZone,
                isShippingEstimated: isShippingEstimated,
                orderNotice: formData.orderNotice.trim(),
                userId: userId,
            };

            const orderResponse = await apiClient.post('/api/orders', orderPayload);

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.details || 'Gagal membuat pesanan');
            }

            const createdOrder = await orderResponse.json();
            const orderId = createdOrder.id || createdOrder.orderNumber;

            for (const product of products) {
                await apiClient.post('/api/order-product', {
                    customerOrderId: orderId,
                    productId: product.id,
                    quantity: product.amount,
                });
            }

            setOrderData({
                orderNumber: orderId,
                customerName: `${formData.name} ${formData.lastname}`,
            });
            setShowSuccessModal(true);
            clearCart();
            clearSaved();
            // Reset local shipping state
            setShippingCost(0);

            setTimeout(() => { router.push('/'); }, 5000);
        } catch (error: any) {
            console.error('Order submission error:', error);
            toast.error(error.message || 'Gagal membuat pesanan');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Component Render
    if (status === 'loading' || (products.length === 0 && !showSuccessModal)) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-grilli-gold mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <CheckoutStepper currentStep={currentStep} onStepClick={handleStepClick} completedSteps={completedSteps} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8">
                        {/* STEP 1: REVIEW CART */}
                        {currentStep === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Keranjang</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {products.map((product) => (
                                        <div key={product.id} className="flex gap-4 items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                            <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={product.image?.startsWith('http') ? product.image : `/${product.image?.replace(/^\//, '') || 'product_placeholder.jpg'}`}
                                                    alt={product.title}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white">{product.title}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Qty: {product.amount} × {formatPrice(Number(product.price || 0))}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-grilli-gold">{formatPrice(Number(product.price || 0) * product.amount)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
                                    <button onClick={handleNextStep} className="w-full py-4 px-6 bg-gradient-to-r from-grilli-gold to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                                        Lanjut ke Alamat Pengiriman <FaArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: ADDRESS */}
                        {currentStep === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Alamat Pengiriman</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Masukkan data pengiriman Anda {isSaving && <span className="ml-2 text-grilli-gold">• Data tersimpan otomatis</span>}
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Personal Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ValidatedInput label="Nama Depan" name="name" value={formData.name} onChange={(value) => updateField('name', value)} required validationRules={[createValidationRules.minLength(2, 'Nama')]} />
                                        <ValidatedInput label="Nama Belakang" name="lastname" value={formData.lastname} onChange={(value) => updateField('lastname', value)} required validationRules={[createValidationRules.minLength(2, 'Nama Belakang')]} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ValidatedInput label="Email" name="email" type="email" value={formData.email} onChange={(value) => updateField('email', value)} required validationRules={[createValidationRules.email()]} />
                                        <ValidatedInput label="Nomor HP / WhatsApp" name="phone" type="tel" value={formData.phone} onChange={(value) => updateField('phone', value)} required validationRules={[createValidationRules.phoneIndonesia()]} hint="Contoh: 08123456789" />
                                    </div>

                                    {/* Province & City Dropdowns */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Province Select */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Provinsi <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.provinceId}
                                                onChange={handleProvinceChange}
                                                disabled={isLoadingProvinces}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-grilli-gold focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            >
                                                <option value="">-- Pilih Provinsi --</option>
                                                {provinces.map(p => (
                                                    <option key={p.province_id} value={p.province_id}>{p.province}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* City Select */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Kota/Kabupaten <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.cityId}
                                                onChange={handleCityChange}
                                                disabled={isLoadingCities || !formData.provinceId}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-grilli-gold focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                                            >
                                                <option value="">-- Pilih Kota --</option>
                                                {cities.map(c => (
                                                    <option key={c.city_id} value={c.city_id}>{c.type} {c.city_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Address Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Using Company field for Kecamatan as per existing schema comments */}
                                        <ValidatedInput label="Kecamatan" name="company" value={formData.company} onChange={(value) => updateField('company', value)} required validationRules={[createValidationRules.minLength(3, 'Kecamatan')]} />
                                        <ValidatedInput label="Kode Pos" name="postalCode" value={formData.postalCode} onChange={(value) => updateField('postalCode', value)} required validationRules={[createValidationRules.postalCodeIndonesia()]} />
                                    </div>

                                    <ValidatedInput label="Alamat Lengkap" name="adress" type="textarea" value={formData.adress} onChange={(value) => updateField('adress', value)} required validationRules={[createValidationRules.minLength(10, 'Alamat')]} rows={3} hint="Jalan, nomor rumah, RT/RW" />
                                    <ValidatedInput label="Detail Alamat" name="apartment" value={formData.apartment} onChange={(value) => updateField('apartment', value)} hint="Gedung, lantai, unit (opsional)" />

                                    <ValidatedInput label="Catatan Pesanan" name="orderNotice" type="textarea" value={formData.orderNotice} onChange={(value) => updateField('orderNotice', value)} rows={2} hint="Informasi tambahan (opsional)" />

                                    {/* Shipping Cost Display in Form */}
                                    {shippingCost > 0 && (
                                        <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center text-grilli-gold">
                                                    <FaTruck />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">Estimasi Ongkir</p>
                                                    <p className="text-xs text-gray-500">Berdasarkan zona: {shippingZone?.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                            <span className="text-lg font-bold text-grilli-gold">{formatPrice(shippingCost)}</span>
                                        </div>
                                    )}
                                    {/* DISCLAIMER */}
                                    <p className="text-xs text-gray-500 text-center italic">
                                        Biaya kirim dihitung berdasarkan zona pengiriman. Estimasi akhir akan dikonfirmasi jika diperlukan.
                                    </p>

                                </div>

                                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex gap-4">
                                    <button onClick={handlePrevStep} className="flex-1 py-4 px-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                        <FaArrowLeft /> Kembali
                                    </button>
                                    <button onClick={handleNextStep} className="flex-1 py-4 px-6 bg-gradient-to-r from-grilli-gold to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                                        Lanjut ke Review <FaArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: CONFIRM */}
                        {currentStep === 3 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review & Konfirmasi</h2>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Address & Shipping Summary */}
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Pengiriman</h3>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl space-y-2 text-sm">
                                            <p className="font-bold text-gray-900 dark:text-white">{formData.name} {formData.lastname}</p>
                                            <p className="text-gray-600 dark:text-gray-400">{formData.phone}</p>
                                            <p className="text-gray-600 dark:text-gray-400">{formData.adress}</p>
                                            <p className="text-gray-600 dark:text-gray-400">{formData.company} (Kec), {formData.city}, {formData.province}</p>
                                            <p className="text-gray-600 dark:text-gray-400">{formData.postalCode}, {formData.country}</p>

                                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Biaya Pengiriman</span>
                                                <span className="font-bold text-grilli-gold">{formatPrice(shippingCost)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex gap-4">
                                        <button onClick={handlePrevStep} disabled={isSubmitting} className="flex-1 py-4 px-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                            <FaArrowLeft /> Kembali
                                        </button>
                                        <button onClick={handleSubmitOrder} disabled={isSubmitting} className="flex-1 py-4 px-6 bg-gradient-to-r from-grilli-gold to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50">
                                            {isSubmitting ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Memproses...</>) : (<><FaCheck /> Konfirmasi Pesanan</>)}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* RIGHT COLUMN - SUMMARY */}
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <StickyOrderSummary
                            items={cartItems}
                            subtotal={cartTotal}
                            shipping={shippingCost}
                            tax={0}
                            total={finalTotal}
                            showWhatsApp={true}
                        />
                    </div>
                </div>
            </div>

            {showSuccessModal && (
                <OrderSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} orderNumber={orderData.orderNumber} customerName={orderData.customerName} />
            )}
        </div>
    );
};

const CheckoutLoading = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-grilli-gold mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Memuat checkout...</p>
        </div>
    </div>
);

const CheckoutPage = () => {
    return (
        <Suspense fallback={<CheckoutLoading />}>
            <CheckoutContent />
        </Suspense>
    );
};

export default CheckoutPage;