'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

interface Step {
    number: number;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
}

interface CheckoutStepperProps {
    currentStep: number;
    onStepClick?: (step: number) => void;
    completedSteps?: number[];
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
    currentStep,
    onStepClick,
    completedSteps = [],
}) => {
    const steps: Step[] = [
        {
            number: 1,
            title: 'Keranjang',
            subtitle: 'Review Pesanan',
            icon: <FaShoppingCart size={20} />,
        },
        {
            number: 2,
            title: 'Alamat',
            subtitle: 'Data Pengiriman',
            icon: <FaMapMarkerAlt size={20} />,
        },
        {
            number: 3,
            title: 'Konfirmasi',
            subtitle: 'Review & Order',
            icon: <FaCheckCircle size={20} />,
        },
    ];

    const handleStepClick = (stepNumber: number) => {
        // Only allow navigation to completed steps or the next step
        if (
            completedSteps.includes(stepNumber) ||
            stepNumber <= currentStep + 1
        ) {
            onStepClick?.(stepNumber);
        }
    };

    const isStepCompleted = (stepNumber: number) =>
        completedSteps.includes(stepNumber);
    const isStepActive = (stepNumber: number) => currentStep === stepNumber;
    const isStepClickable = (stepNumber: number) =>
        completedSteps.includes(stepNumber) || stepNumber <= currentStep + 1;

    return (
        <div className="w-full py-6 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            {/* Desktop View */}
            <div className="hidden md:flex items-center justify-center max-w-4xl mx-auto">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        {/* Step Circle */}
                        <div className="flex flex-col items-center">
                            <button
                                onClick={() => handleStepClick(step.number)}
                                disabled={!isStepClickable(step.number)}
                                className={`
                  relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-300
                  ${isStepCompleted(step.number)
                                        ? 'bg-gradient-to-br from-grilli-gold to-orange-500 border-grilli-gold text-white shadow-lg shadow-grilli-gold/30'
                                        : isStepActive(step.number)
                                            ? 'bg-white dark:bg-gray-800 border-grilli-gold text-grilli-gold shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                                    }
                  ${isStepClickable(step.number)
                                        ? 'cursor-pointer hover:scale-105'
                                        : 'cursor-not-allowed opacity-50'
                                    }
                `}
                            >
                                {isStepCompleted(step.number) ? (
                                    <FaCheckCircle size={24} />
                                ) : (
                                    step.icon
                                )}

                                {/* Active ring animation */}
                                {isStepActive(step.number) && (
                                    <motion.div
                                        initial={{ scale: 1, opacity: 0.5 }}
                                        animate={{ scale: 1.3, opacity: 0 }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: 'easeOut',
                                        }}
                                        className="absolute inset-0 rounded-full border-2 border-grilli-gold"
                                    />
                                )}
                            </button>

                            {/* Step Label */}
                            <div className="mt-3 text-center">
                                <p
                                    className={`text-sm font-bold ${isStepActive(step.number) || isStepCompleted(step.number)
                                            ? 'text-gray-900 dark:text-white'
                                            : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                >
                                    {step.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {step.subtitle}
                                </p>
                            </div>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-0.5 mx-4 mb-12">
                                <div
                                    className={`h-full transition-all duration-500 ${isStepCompleted(step.number)
                                            ? 'bg-gradient-to-r from-grilli-gold to-orange-500'
                                            : 'bg-gray-200 dark:bg-gray-600'
                                        }`}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Mobile View - Horizontal Scrollable */}
            <div className="md:hidden overflow-x-auto scrollbar-hide">
                <div className="flex items-center justify-start min-w-max px-4 gap-4">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={() => handleStepClick(step.number)}
                                    disabled={!isStepClickable(step.number)}
                                    className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                    ${isStepCompleted(step.number)
                                            ? 'bg-gradient-to-br from-grilli-gold to-orange-500 border-grilli-gold text-white shadow-lg shadow-grilli-gold/30'
                                            : isStepActive(step.number)
                                                ? 'bg-white dark:bg-gray-800 border-grilli-gold text-grilli-gold shadow-md'
                                                : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                                        }
                    ${isStepClickable(step.number)
                                            ? 'cursor-pointer active:scale-95'
                                            : 'cursor-not-allowed opacity-50'
                                        }
                  `}
                                >
                                    {isStepCompleted(step.number) ? (
                                        <FaCheckCircle size={18} />
                                    ) : (
                                        React.cloneElement(step.icon as React.ReactElement, {
                                            size: 16,
                                        })
                                    )}

                                    {isStepActive(step.number) && (
                                        <motion.div
                                            initial={{ scale: 1, opacity: 0.5 }}
                                            animate={{ scale: 1.3, opacity: 0 }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: 'easeOut',
                                            }}
                                            className="absolute inset-0 rounded-full border-2 border-grilli-gold"
                                        />
                                    )}
                                </button>

                                <div className="mt-2 text-center">
                                    <p
                                        className={`text-xs font-bold whitespace-nowrap ${isStepActive(step.number) ||
                                                isStepCompleted(step.number)
                                                ? 'text-gray-900 dark:text-white'
                                                : 'text-gray-400 dark:text-gray-500'
                                            }`}
                                    >
                                        {step.title}
                                    </p>
                                </div>
                            </div>

                            {index < steps.length - 1 && (
                                <div className="w-16 h-0.5 mb-6">
                                    <div
                                        className={`h-full transition-all duration-500 ${isStepCompleted(step.number)
                                                ? 'bg-gradient-to-r from-grilli-gold to-orange-500'
                                                : 'bg-gray-200 dark:bg-gray-600'
                                            }`}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CheckoutStepper;
