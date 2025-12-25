'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProductStore } from '../_zustand/store';
import { useAuth } from '@/hooks/useAuth';
import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api';
import { formatPrice } from '@/lib/utils';

// Components
import CheckoutStepper from '@/components/CheckoutStepper';
import StickyOrderSummary from '@/components/StickyOrderSummary';
import ValidatedInput from '@/components/ValidatedInput';
import OrderSuccessModal from '@/components/OrderSuccessModal';
import EmptyState from '@/components/EmptyState';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Validation
import {
    createValidationRules,
    validatePhoneIndonesia,
    validatePostalCodeIndonesia,
    validateEmail,
} from '@/lib/validation';

interface CheckoutFormData {
    name: string;
    lastname: string;
    phone: string;
    email: string;
    company: string; // Kecamatan
    camatan: string; // District
    adress: string; // Main address
    apartment: string; // Detail address
    city: string;
    country: string;
    postalCode: string;
    orderNotice: string;
}

const CheckoutPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useAuth();
    const { products, total, clearCart, calculateTotals } = useProductStore();

    // Get step from URL or default to 1
    const [currentStep, setCurrentStep] = useState<number>(
        parseInt(searchParams.get('step') || '1')
    );
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderData, setOrderData] = useState({ orderNumber: '', customerName: '' });

    // Auto-save form hook
    const { formData, updateField, clearSaved, isSaving } = useAutoSaveForm<CheckoutFormData>(
        {
            name: '',
            lastname: '',
            phone: '',
            email: session?.user?.email || '',
            company: '',
            camatan: '',
            adress: '',
            apartment: '',
            city: '',
            country: 'Indonesia',
            postalCode: '',
            orderNotice: '',
        },
        {
            key: 'eloco-checkout-form',
            debounceMs: 2000,
            enabled: true,
        }
    );

    // Calculate totals on mount
    useEffect(() => {
        calculateTotals();
    }, [calculateTotals]);

    // Auth check
    useEffect(() => {
        if (status === 'unauthenticated') {
            toast.error('Silakan login untuk checkout');
            router.push('/login?callbackUrl=/checkout');
        }
    }, [status, router]);

    // Redirect to cart if empty
    useEffect(() => {
        if (products.length === 0 && !showSuccessModal) {
            router.push('/cart');
        }
    }, [products.length, showSuccessModal, router]);

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

    // Transform products for StickyOrderSummary
    const cartItems = useMemo(() => {
        return products.map((product) => ({
            id: product.id,
            title: product.title,
            mainImage: product.image?.startsWith('http')
                ? product.image
                : `/${product.image?.replace(/^\//, '') || 'product_placeholder.jpg'}`,
            price: product.price,
            quantity: product.amount,
        }));
    }, [products]);

    // Validate Step 2 (Address form)
    const validateStep2 = (): boolean => {
        const errors: string[] = [];

        if (!formData.name.trim() || formData.name.length < 2) {
            errors.push('Nama Dep an minimal 2 karakter');
        }
        if (!formData.lastname.trim() || formData.lastname.length < 2) {
            errors.push('Nama Belakang minimal 2 karakter');
        }
        if (!validateEmail(formData.email)) {
            errors.push('Email tidak valid');
        }
        if (!validatePhoneIndonesia(formData.phone)) {
            errors.push('Nomor HP tidak valid');
        }
        if (!formData.company.trim() || formData.company.length < 3) {
            errors.push('Kecamatan minimal 3 karakter');
        }
        if (!formData.adress.trim() || formData.adress.length < 10) {
            errors.push('Alamat minimal 10 karakter');
        }
        if (!formData.city.trim() || formData.city.length < 3) {
            errors.push('Kota minimal 3 karakter');
        }
        if (!validatePostalCodeIndonesia(formData.postalCode)) {
            errors.push('Kode Pos harus 5 digit');
        }

        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error));
            return false;
        }
        return true;
    };

    // Handle step navigation
    const handleStepClick = (step: number) => {
        if (step === 1) {
            setCurrentStep(1);
        } else if (step === 2) {
            if (products.length > 0) {
                setCurrentStep(2);
            }
        } else if (step === 3) {
            if (completedSteps.includes(2) || validateStep2()) {
                setCurrentStep(3);
            }
        }
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (products.length === 0) {
                toast.error('Keranjang kosong');
                return;
            }
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
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Handle order submission
    const handleSubmitOrder = async () => {
        if (!validateStep2()) return;

        if (products.length === 0) {
            toast.error('Keranjang kosong');
            return;
        }

        setIsSubmitting(true);

        try {
            // Get user ID
            let userId = null;
            if (session?.user?.email) {
                try {
                    const userResponse = await apiClient.get(
                        `/api/users/email/${session.user.email}`
                    );
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        userId = userData.id;
                    }
                } catch (error) {
                    console.error('Error fetching user ID:', error);
                }
            }

            // Prepare order data
            const orderPayload = {
                name: formData.name.trim(),
                lastname: formData.lastname.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                company: formData.company.trim(),
                adress: formData.adress.trim(),
                apartment: formData.apartment.trim(),
                city: formData.city.trim(),
                country: formData.country || 'Indonesia',
                postalCode: formData.postalCode.trim(),
                status: 'pending',
                total: Math.round(total),
                orderNotice: formData.orderNotice.trim(),
                userId: userId,
            };

            // Create order
            const orderResponse = await apiClient.post('/api/orders', orderPayload);

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.details || 'Gagal membuat pesanan');
            }

            const createdOrder = await orderResponse.json();
            const orderId = createdOrder.id || createdOrder.orderNumber;

            // Create order products
            for (const product of products) {
                await apiClient.post('/api/order-product', {
                    customerOrderId: orderId,
                    productId: product.id,
                    quantity: product.amount,
                });
            }

            // Success!
            setOrderData({
                orderNumber: orderId,
                customerName: `${formData.name} ${formData.lastname}`,
            });
            setShowSuccessModal(true);
            clearCart();
            clearSaved();

            // Redirect after delay
            setTimeout(() => {
                router.push('/');
            }, 5000);
        } catch (error: any) {
            console.error('Order submission error:', error);
            toast.error(error.message || 'Gagal membuat pesanan');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show empty state if no products
    if (products.length === 0 && !showSuccessModal) {
        return null; // Will redirect to cart
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Checkout Stepper */}
            <CheckoutStepper
                currentStep={currentStep}
                onStepClick={handleStepClick}
                completedSteps={completedSteps}
            />

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Column - Step Content */}
                    <div className="lg:col-span-8">
                        {/* Step 1: Review Keranjang */}
                        {currentStep === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Review Keranjang
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Periksa kembali pesanan Anda
                                    </p>
                                </div>

                                <div className="p-6 space-y-4">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex gap-4 items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl"
                                        >
                                            <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={
                                                        product.image?.startsWith('http')
                                                            ? product.image
                                                            : `/${product.image?.replace(/^\//, '') || 'product_placeholder.jpg'}`
                                                    }
                                                    alt={product.title}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white">
                                                    {product.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    Qty: {product.amount} × {formatPrice(product.price)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-grilli-gold">
                                                    {formatPrice(product.price * product.amount)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={handleNextStep}
                                        className="w-full py-4 px-6 bg-gradient-to-r from-grilli-gold to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        Lanjut ke Alamat Pengiriman
                                        <FaArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Alamat Pengiriman */}
                        {currentStep === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Alamat Pengiriman
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Masukkan data pengiriman Anda
                                        {isSaving && (
                                            <span className="ml-2 text-grilli-gold">
                                                • Data tersimpan otomatis
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ValidatedInput
                                            label="Nama Depan"
                                            name="name"
                                            value={formData.name}
                                            onChange={(value) => updateField('name', value)}
                                            required
                                            validationRules={[createValidationRules.minLength(2, 'Nama')]}
                                        />
                                        <ValidatedInput
                                            label="Nama Belakang"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={(value) => updateField('lastname', value)}
                                            required
                                            validationRules={[createValidationRules.minLength(2, 'Nama Belakang')]}
                                        />
                                    </div>

                                    {/* Contact Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ValidatedInput
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(value) => updateField('email', value)}
                                            required
                                            validationRules={[createValidationRules.email()]}
                                        />
                                        <ValidatedInput
                                            label="Nomor HP / WhatsApp"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(value) => updateField('phone', value)}
                                            required
                                            validationRules={[createValidationRules.phoneIndonesia()]}
                                            hint="Contoh: 08123456789"
                                        />
                                    </div>

                                    {/* Address Fields */}
                                    <ValidatedInput
                                        label="Alamat Lengkap"
                                        name="adress"
                                        type="textarea"
                                        value={formData.adress}
                                        onChange={(value) => updateField('adress', value)}
                                        required
                                        validationRules={[createValidationRules.minLength(10, 'Alamat')]}
                                        rows={3}
                                        hint="Jalan, nomor rumah, RT/RW"
                                    />

                                    <ValidatedInput
                                        label="Detail Alamat"
                                        name="apartment"
                                        value={formData.apartment}
                                        onChange={(value) => updateField('apartment', value)}
                                        hint="Gedung, lantai, unit (opsional)"
                                    />

                                    {/* Location Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <ValidatedInput
                                            label="Kecamatan"
                                            name="company"
                                            value={formData.company}
                                            onChange={(value) => updateField('company', value)}
                                            required
                                            validationRules={[createValidationRules.minLength(3, 'Kecamatan')]}
                                        />
                                        <ValidatedInput
                                            label="Kota/Kabupaten"
                                            name="city"
                                            value={formData.city}
                                            onChange={(value) => updateField('city', value)}
                                            required
                                            validationRules={[createValidationRules.minLength(3, 'Kota')]}
                                        />
                                        <ValidatedInput
                                            label="Kode Pos"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={(value) => updateField('postalCode', value)}
                                            required
                                            validationRules={[createValidationRules.postalCodeIndonesia()]}
                                            hint="5 digit"
                                        />
                                    </div>

                                    {/* Country (read-only) */}
                                    <ValidatedInput
                                        label="Negara"
                                        name="country"
                                        value="Indonesia"
                                        onChange={() => { }}
                                        disabled
                                    />

                                    {/* Order Notice */}
                                    <ValidatedInput
                                        label="Catatan Pesanan"
                                        name="orderNotice"
                                        type="textarea"
                                        value={formData.orderNotice}
                                        onChange={(value) => updateField('orderNotice', value)}
                                        rows={3}
                                        hint="Informasi tambahan untuk pengiriman (opsional)"
                                    />
                                </div>

                                {/* Navigation Buttons */}
                                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex gap-4">
                                    <button
                                        onClick={handlePrevStep}
                                        className="flex-1 py-4 px-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaArrowLeft />
                                        Kembali
                                    </button>
                                    <button
                                        onClick={handleNextStep}
                                        className="flex-1 py-4 px-6 bg-gradient-to-r from-grilli-gold to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        Lanjut ke Review
                                        <FaArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Review & Konfirmasi */}
                        {currentStep === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Review & Konfirmasi
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Periksa kembali detail pesanan Anda
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Order Summary */}
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                                            Pesanan Anda ({products.length} Item)
                                        </h3>
                                        <div className="space-y-3">
                                            {products.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {product.title} ({product.amount}x)
                                                    </span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {formatPrice(product.price * product.amount)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                                            Alamat Pengiriman
                                        </h3>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl space-y-2 text-sm">
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {formData.name} {formData.lastname}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {formData.phone}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {formData.email}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {formData.adress}
                                                {formData.apartment && `, ${formData.apartment}`}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {formData.company}, {formData.city}, {formData.postalCode}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {formData.country}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FaCheck className="text-white" size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                                                    Pembayaran via WhatsApp
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    Setelah Anda submit pesanan, tim kami akan{' '}
                                                    <strong>menghubungi Anda via WhatsApp</strong> untuk
                                                    konfirmasi pembayaran dan detail pengiriman.
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                                    💳 Metode: <strong>Transfer Bank</strong> (BCA, Mandiri, BNI)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex gap-4">
                                    <button
                                        onClick={handlePrevStep}
                                        disabled={isSubmitting}
                                        className="flex-1 py-4 px-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaArrowLeft />
                                        Kembali
                                    </button>
                                    <button
                                        onClick={handleSubmitOrder}
                                        disabled={isSubmitting}
                                        className="flex-1 py-4 px-6 bg-gradient-to-r from-grilli-gold to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheck />
                                                Konfirmasi Pesanan
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Sticky Order Summary */}
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <StickyOrderSummary
                            items={cartItems}
                            subtotal={total}
                            shipping={0}
                            tax={0}
                            total={total}
                            showWhatsApp={true}
                            whatsAppNumber="6281234567890"
                        />
                    </div>
                </div>
            </div>

            {/* Order Success Modal */}
            {showSuccessModal && (
                <OrderSuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    orderNumber={orderData.orderNumber}
                    customerName={orderData.customerName}
                />
            )}
        </div>
    );
};

export default CheckoutPage;