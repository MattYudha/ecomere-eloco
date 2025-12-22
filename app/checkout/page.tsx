'use client';
import { SectionTitle } from '@/components';
import { useProductStore } from '../_zustand/store';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { formatPrice } from '@/lib/utils';

const CheckoutPage = () => {
    const { data: session, status } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            toast.error('Please login to checkout');
            router.push('/login?callbackUrl=/checkout');
        }
    }, [status, router]);

    const [checkoutForm, setCheckoutForm] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        company: '',
        adress: '',
        apartment: '',
        city: '',
        country: '',
        postalCode: '',
        orderNotice: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { products, total, clearCart } = useProductStore();
    // The router declaration is already above, so no need to redeclare here.

    // Add validation functions that match server requirements
    const validateForm = () => {
        const errors: string[] = [];

        // Name validation
        if (!checkoutForm.name.trim() || checkoutForm.name.trim().length < 2) {
            errors.push('Nama Depan minimal 2 karakter');
        }

        // Lastname validation
        if (
            !checkoutForm.lastname.trim() ||
            checkoutForm.lastname.trim().length < 2
        ) {
            errors.push('Nama Belakang minimal 2 karakter');
        }

        // Email validation
        const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (
            !checkoutForm.email.trim() ||
            !emailRegex.test(checkoutForm.email.trim())
        ) {
            errors.push('Mohon masukkan alamat email yang valid');
        }

        // Phone validation (must be at least 10 digits)
        const phoneDigits = checkoutForm.phone.replace(/[^0-9]/g, '');
        if (!checkoutForm.phone.trim() || phoneDigits.length < 10) {
            errors.push('Nomor HP/WA minimal 10 digit');
        }

        // Company validation (Kecamatan)
        if (
            !checkoutForm.company.trim() ||
            checkoutForm.company.trim().length < 3
        ) {
            errors.push('Kecamatan minimal 3 karakter');
        }

        // Address validation
        if (!checkoutForm.adress.trim() || checkoutForm.adress.trim().length < 5) {
            errors.push('Alamat Lengkap minimal 5 karakter');
        }

        // Apartment validation (updated to 1 character minimum)
        if (
            !checkoutForm.apartment.trim() ||
            checkoutForm.apartment.trim().length < 1
        ) {
            errors.push('Apartment is required');
        }

        // City validation
        if (!checkoutForm.city.trim() || checkoutForm.city.trim().length < 3) {
            errors.push('Kota/Kabupaten minimal 3 karakter');
        }

        // Country validation (Provinsi)
        if (
            !checkoutForm.country.trim() ||
            checkoutForm.country.trim().length < 3
        ) {
            errors.push('Provinsi minimal 3 karakter');
        }

        // Postal code validation
        if (
            !checkoutForm.postalCode.trim() ||
            checkoutForm.postalCode.trim().length < 3
        ) {
            errors.push('Kode Pos minimal 3 karakter');
        }

        return errors;
    };

    const makePurchase = async () => {
        // Client-side validation first
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            validationErrors.forEach((error) => {
                toast.error(error);
            });
            return;
        }

        // Basic client-side checks for required fields (UX only)
        const requiredFields = [
            'name',
            'lastname',
            'phone',
            'email',
            'company',
            'adress',
            'apartment',
            'city',
            'country',
            'postalCode',
        ];

        const missingFields = requiredFields.filter(
            (field) => !checkoutForm[field as keyof typeof checkoutForm]?.trim(),
        );

        if (missingFields.length > 0) {
            toast.error('Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        if (products.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        if (total <= 0) {
            toast.error('Invalid order total');
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('🚀 Starting order creation...');

            // Get user ID if logged in
            let userId = null;
            if (session?.user?.email) {
                try {
                    console.log(
                        '🔍 Getting user ID for logged-in user:',
                        session.user.email,
                    );
                    const userResponse = await apiClient.get(
                        `/api/users/email/${session.user.email}`,
                    );
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        userId = userData.id;
                        console.log('✅ Found user ID:', userId);
                    } else {
                        console.log(
                            '❌ Could not find user with email:',
                            session.user.email,
                        );
                    }
                } catch (userError) {
                    console.log('⚠️  Error getting user ID:', userError);
                }
            }

            // Prepare the order data
            const orderData = {
                name: checkoutForm.name.trim(),
                lastname: checkoutForm.lastname.trim(),
                phone: checkoutForm.phone.trim(),
                email: checkoutForm.email.trim().toLowerCase(),
                company: checkoutForm.company.trim(),
                adress: checkoutForm.adress.trim(),
                apartment: checkoutForm.apartment.trim(),
                postalCode: checkoutForm.postalCode.trim(),
                status: 'pending',
                total: total,
                city: checkoutForm.city.trim(),
                country: checkoutForm.country.trim(),
                orderNotice: checkoutForm.orderNotice.trim(),
                userId: userId, // Add user ID for notifications
            };

            console.log('📋 Order data being sent:', orderData);

            // Send order data to server for validation and processing
            const response = await apiClient.post('/api/orders', orderData);

            console.log('📡 API Response received:');
            console.log('  Status:', response.status);
            console.log('  Status Text:', response.statusText);
            console.log('  Response OK:', response.ok);

            // Check if response is ok before parsing
            if (!response.ok) {
                console.error(
                    '❌ Response not OK:',
                    response.status,
                    response.statusText,
                );

                // --- START DEBUGGING BLOCK ---
                // Clone the response to be able to read it twice
                const clonedResponse = response.clone();
                try {
                    const rawErrorText = await clonedResponse.text();
                    console.log('📄 RAW SERVER ERROR RESPONSE:', rawErrorText);
                } catch (e) {
                    console.error('Could not get raw text from error response.');
                }
                // --- END DEBUGGING BLOCK ---

                let errorData = {
                    error: 'Order creation failed',
                    details: 'Please try again.',
                };
                try {
                    // Try to get detailed error information from the server
                    errorData = await response.json();
                } catch (jsonError) {
                    console.error('Could not parse error as JSON:', jsonError);
                }

                console.error('Parsed error data:', errorData);

                // Handle different error types
                if (response.status === 409) {
                    toast.error(errorData.details || errorData.error);
                } else if (errorData.details && Array.isArray(errorData.details)) {
                    errorData.details.forEach((detail: any) => {
                        toast.error(`${detail.field}: ${detail.message}`);
                    });
                } else {
                    toast.error(errorData.error || 'An unexpected error occurred.');
                }
                return; // Stop execution
            }

            const data = await response.json();
            console.log('✅ Parsed response data:', data);

            const orderId: string = data.id;
            console.log('🆔 Extracted order ID:', orderId);

            if (!orderId) {
                console.error('❌ Order ID is missing or falsy!');
                console.error('Full response data:', JSON.stringify(data, null, 2));
                throw new Error('Order ID not received from server');
            }

            console.log(
                '✅ Order ID validation passed, proceeding with product addition...',
            );

            // Add products to order
            for (let i = 0; i < products.length; i++) {
                console.log(`🛍️ Adding product ${i + 1}/${products.length}:`, {
                    orderId,
                    productId: products[i].id,
                    quantity: products[i].amount,
                });

                await addOrderProduct(orderId, products[i].id, products[i].amount);
                console.log(`✅ Product ${i + 1} added successfully`);
            }

            console.log(' All products added successfully!');

            setIsSuccess(true); // Mark as success to prevent empty cart error

            // Clear form and cart
            setCheckoutForm({
                name: '',
                lastname: '',
                phone: '',
                email: '',
                company: '',
                adress: '',
                apartment: '',
                city: '',
                country: '',
                postalCode: '',
                orderNotice: '',
            });
            clearCart();

            // Refresh notification count if user is logged in
            try {
                // This will trigger a refresh of notifications in the background
                window.dispatchEvent(new CustomEvent('orderCompleted'));
            } catch (error) {
                console.log('Note: Could not trigger notification refresh');
            }

            toast.success(
                'Pesanan berhasil dibuat! Kami akan menghubungi Anda untuk pembayaran.',
            );
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } catch (error: any) {
            console.error('💥 Error in makePurchase:', error);

            // Handle server validation errors
            if (error.response?.status === 400) {
                console.log(' Handling 400 error...');
                try {
                    const errorData = await error.response.json();
                    console.log('Error data:', errorData);
                    if (errorData.details && Array.isArray(errorData.details)) {
                        // Show specific validation errors
                        errorData.details.forEach((detail: any) => {
                            toast.error(`${detail.field}: ${detail.message}`);
                        });
                    } else {
                        toast.error(errorData.error || 'Validation failed');
                    }
                } catch (parseError) {
                    console.error('Failed to parse error response:', parseError);
                    toast.error('Validation failed');
                }
            } else if (error.response?.status === 409) {
                toast.error(
                    'Duplicate order detected. Please wait before creating another order.',
                );
            } else {
                console.log('🔍 Handling generic error...');
                toast.error('Failed to create order. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const addOrderProduct = async (
        orderId: string,
        productId: string,
        productQuantity: number,
    ) => {
        try {
            console.log('️ Adding product to order:', {
                customerOrderId: orderId,
                productId,
                quantity: productQuantity,
            });

            const response = await apiClient.post('/api/order-product', {
                customerOrderId: orderId,
                productId: productId,
                quantity: productQuantity,
            });

            console.log('📡 Product order response:', response);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Product order failed:', response.status, errorText);
                throw new Error(`Product order failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Product order successful:', data);
        } catch (error) {
            console.error('💥 Error creating product order:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (products.length === 0 && !isSuccess) {
            toast.error("You don't have items in your cart");
            router.push('/cart');
        }
    }, [products.length, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300 dark:bg-orange-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-300 dark:bg-amber-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ animationDelay: '1s' }}
                ></div>
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-300 dark:bg-yellow-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ animationDelay: '2s' }}
                ></div>
            </div>

            <SectionTitle title="Checkout" path="Home | Cart | Checkout" />

            <main className="relative z-10 mx-auto max-w-screen-2xl grid grid-cols-1 lg:grid-cols-2 gap-x-16 lg:px-8 xl:gap-x-48 py-12 sm:py-16">
                <h1 className="sr-only">Informasi Pemesanan</h1>

                {/* Order Summary */}
                <section
                    aria-labelledby="summary-heading"
                    className="lg:col-start-2 lg:row-start-1 px-4 sm:px-6 lg:px-0 pb-10 lg:pb-16"
                >
                    <div className="mx-auto max-w-lg lg:max-w-none backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 px-6 py-8 shadow-2xl sm:rounded-3xl sm:px-12 border border-white/20 dark:border-gray-700/20 relative overflow-hidden">
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 dark:from-gray-700/50 to-transparent pointer-events-none rounded-3xl"></div>
                        <div className="relative z-10">
                            <h2
                                id="summary-heading"
                                className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
                            >
                                Ringkasan Pesanan
                            </h2>

                            <ul
                                role="list"
                                className="divide-y divide-gray-200 dark:divide-gray-700 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                {products.map((product) => (
                                    <li
                                        key={product?.id}
                                        className="flex items-start space-x-4 py-4"
                                    >
                                        <Image
                                            src={
                                                product?.image
                                                    ? `/${product.image.replace(/^\//, '')}`
                                                    : '/product_placeholder.jpg'
                                            }
                                            alt={product?.title}
                                            width={80}
                                            height={80}
                                            className="h-20 w-20 flex-none rounded-md object-cover object-center border border-gray-200 dark:border-gray-600"
                                        />
                                        <div className="flex-auto space-y-1">
                                            <h3 className="text-base font-semibold">
                                                {product?.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Jumlah: {product?.amount}
                                            </p>
                                        </div>
                                        <p className="flex-none text-base font-bold">{formatPrice(product?.price)}</p>
                                    </li>
                                ))}
                            </ul>

                            <dl className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm font-medium text-gray-900 dark:text-white mt-6">
                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-600 dark:text-gray-400">Subtotal</dt>
                                    <dd>{formatPrice(total)}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-600 dark:text-gray-400">Pajak</dt>
                                    <dd>{formatPrice(0)}</dd>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 text-base font-bold">
                                    <dt>Total Pesanan</dt>
                                    <dd>{formatPrice(total === 0 ? 0 : Math.round(total))}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>

                {/* Checkout Form */}
                <form className="lg:col-start-1 lg:row-start-1 px-4 sm:px-6 lg:px-0 pt-10 sm:pt-16 lg:pt-0">
                    <div className="mx-auto max-w-lg lg:max-w-none backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 px-6 py-8 shadow-2xl sm:rounded-3xl sm:px-12 border border-white/20 dark:border-gray-700/20 relative overflow-hidden">
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 dark:from-gray-700/50 to-transparent pointer-events-none rounded-3xl"></div>
                        <div className="relative z-10">
                            {/* Contact Information */}
                            <section aria-labelledby="contact-info-heading">
                                <h2
                                    id="contact-info-heading"
                                    className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
                                >
                                    Penerima
                                </h2>

                                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div>
                                        <label
                                            htmlFor="name-input"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Nama Depan *
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                value={checkoutForm.name}
                                                onChange={(e) =>
                                                    setCheckoutForm({
                                                        ...checkoutForm,
                                                        name: e.target.value,
                                                    })
                                                }
                                                type="text"
                                                id="name-input"
                                                name="name-input"
                                                autoComplete="given-name"
                                                required
                                                disabled={isSubmitting}
                                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white/90 dark:focus:bg-gray-700/90 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="lastname-input"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Nama Belakang *
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                value={checkoutForm.lastname}
                                                onChange={(e) =>
                                                    setCheckoutForm({
                                                        ...checkoutForm,
                                                        lastname: e.target.value,
                                                    })
                                                }
                                                type="text"
                                                id="lastname-input"
                                                name="lastname-input"
                                                autoComplete="family-name"
                                                required
                                                disabled={isSubmitting}
                                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white/90 dark:focus:bg-gray-700/90 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="phone-input"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Nomor WhatsApp / HP *
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                value={checkoutForm.phone}
                                                onChange={(e) =>
                                                    setCheckoutForm({
                                                        ...checkoutForm,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                type="tel"
                                                id="phone-input"
                                                name="phone-input"
                                                autoComplete="tel"
                                                required
                                                disabled={isSubmitting}
                                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white/90 dark:focus:bg-gray-700/90 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="email-address"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Alamat Email *
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                value={checkoutForm.email}
                                                onChange={(e) =>
                                                    setCheckoutForm({
                                                        ...checkoutForm,
                                                        email: e.target.value,
                                                    })
                                                }
                                                type="email"
                                                id="email-address"
                                                name="email-address"
                                                autoComplete="email"
                                                required
                                                disabled={isSubmitting}
                                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white/90 dark:focus:bg-gray-700/90 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Payment Notice */}
                            <section className="mt-10">
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-orange-400 dark:text-orange-300"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300">
                                                Informasi Pembayaran
                                            </h3>
                                            <div className="mt-2 text-sm text-orange-700 dark:text-orange-400">
                                                <p>
                                                    Pembayaran akan diproses setelah konfirmasi pesanan.
                                                    Kami akan menghubungi Anda untuk detail pembayaran.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Address */}
                            <section aria-labelledby="shipping-heading" className="mt-10">
                                <h2
                                    id="shipping-heading"
                                    className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
                                >
                                    Lokasi Pengiriman & Alamat
                                </h2>

                                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="company"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Kecamatan *
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                required
                                                disabled={isSubmitting}
                                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white/90 dark:focus:bg-gray-700/90 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                                                value={checkoutForm.company}
                                                onChange={(e) =>
                                                    setCheckoutForm({
                                                        ...checkoutForm,
                                                        company: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="address"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Alamat Lengkap *
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="address"
                                                name="address"
                                                autoComplete="street-address"
                                                required
                                                disabled={isSubmitting}
                                                rows={3}
                                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white/90 dark:focus:bg-gray-700/90 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                                                placeholder="Contoh: Jl. Merdeka No. 10, RT 01/RW 02 (Samping Toko Berkah)"
                                                value={checkoutForm.adress}
                                                onChange={(e) =>
                                                    setCheckoutForm({
                                                        ...checkoutForm,
                                                        adress: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="apartment"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Detail Lainnya / Patokan Tambahan *
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="apartment"
                                                name="apartment"
                                                required
                                                disabled={isSubmitting}
                                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white/90 dark:focus:bg-gray-700/90 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                                                value={checkoutForm.apartment}
                                                onChange={(e) =>
                                                    setCheckoutForm({
                                                        ...checkoutForm,
                                                        apartment: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="city"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Kota / Kabupaten *
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                autoComplete="address-level2"
                                                required
                                                disabled={isSubmitting}
                                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white/90 dark:focus:bg-gray-700/90 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                                                value={checkoutForm.city}
                                                onChange={(e) =>
                                                    setCheckoutForm({
                                                        ...checkoutForm,
                                                        city: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="region"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Provinsi *
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="region"
                                                name="region"
                                                autoComplete="address-level1"
                                                required
                                                disabled={isSubmitting}
                                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white/90 dark:focus:bg-gray-700/90 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                                                value={checkoutForm.country}
                                                onChange={(e) =>
                                                    setCheckoutForm({
                                                        ...checkoutForm,
                                                        country: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="postal-code"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Kode Pos *
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="postal-code"
                                                name="postal-code"
                                                autoComplete="postal-code"
                                                required
                                                disabled={isSubmitting}
                                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white/90 dark:focus:bg-gray-700/90 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                                                value={checkoutForm.postalCode}
                                                onChange={(e) =>
                                                    setCheckoutForm({
                                                        ...checkoutForm,
                                                        postalCode: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="order-notice"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Order Notice
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white/90 dark:focus:bg-gray-700/90 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                                                id="order-notice"
                                                name="order-notice"
                                                autoComplete="order-notice"
                                                disabled={isSubmitting}
                                                value={checkoutForm.orderNotice}
                                                onChange={(e) =>
                                                    setCheckoutForm({
                                                        ...checkoutForm,
                                                        orderNotice: e.target.value,
                                                    })
                                                }
                                                rows={3}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="mt-10 pt-6">
                                <button
                                    type="button"
                                    onClick={makePurchase}
                                    disabled={isSubmitting}
                                    className="w-full rounded-md border border-transparent bg-orange-600 px-20 py-3 text-lg font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {isSubmitting ? 'Memproses Pesanan...' : 'Buat Pesanan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CheckoutPage;