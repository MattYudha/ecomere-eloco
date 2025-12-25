'use client';
import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

type ValidationRule = {
    validate: (value: string) => boolean;
    message: string;
};

interface ValidatedInputProps {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'tel' | 'number' | 'textarea';
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    required?: boolean;
    validationRules?: ValidationRule[];
    hint?: string;
    disabled?: boolean;
    rows?: number; // for textarea
    className?: string;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    required = false,
    validationRules = [],
    hint,
    disabled = false,
    rows = 4,
    className = '',
}) => {
    const [isTouched, setIsTouched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);

    // Validate on value change (but only show error if touched)
    useEffect(() => {
        if (!isTouched) return;

        // Required validation
        if (required && !value.trim()) {
            setError('Field ini wajib diisi');
            setIsValid(false);
            return;
        }

        // Custom validation rules
        for (const rule of validationRules) {
            if (!rule.validate(value)) {
                setError(rule.message);
                setIsValid(false);
                return;
            }
        }

        // All validations passed
        setError(null);
        setIsValid(value.trim().length > 0);
    }, [value, isTouched, required, validationRules]);

    const handleBlur = () => {
        setIsTouched(true);
        onBlur?.();
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        onChange(e.target.value);
    };

    const getBorderColor = () => {
        if (!isTouched) return 'border-gray-200 dark:border-gray-600';
        if (error) return 'border-red-500 dark:border-red-400';
        if (isValid) return 'border-green-500 dark:border-green-400';
        return 'border-gray-200 dark:border-gray-600';
    };

    const getFocusRingColor = () => {
        if (error) return 'focus:ring-red-500/50';
        if (isValid) return 'focus:ring-green-500/50';
        return 'focus:ring-grilli-gold/50';
    };

    const inputBaseClasses = `
    w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-white
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    disabled:bg-gray-100 dark:disabled:bg-gray-700
    disabled:cursor-not-allowed disabled:opacity-60
    focus:outline-none focus:ring-2
    ${getBorderColor()}
    ${getFocusRingColor()}
    ${className}
  `;

    return (
        <div className="w-full">
            {/* Label */}
            <label
                htmlFor={name}
                className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Input Field */}
            <div className="relative">
                {type === 'textarea' ? (
                    <textarea
                        id={name}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                        rows={rows}
                        className={inputBaseClasses}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
                    />
                ) : (
                    <input
                        id={name}
                        name={name}
                        type={type}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                        className={inputBaseClasses}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
                    />
                )}

                {/* Status Icon */}
                {isTouched && !disabled && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <AnimatePresence mode="wait">
                            {error ? (
                                <motion.div
                                    key="error"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                >
                                    <FaExclamationCircle className="text-red-500" size={20} />
                                </motion.div>
                            ) : isValid ? (
                                <motion.div
                                    key="success"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                >
                                    <FaCheckCircle className="text-green-500" size={20} />
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {isTouched && error && (
                    <motion.div
                        id={`${name}-error`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
                        role="alert"
                    >
                        <FaExclamationCircle size={14} />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hint Text */}
            {hint && !error && (
                <div
                    id={`${name}-hint`}
                    className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                >
                    <FaInfoCircle size={12} />
                    <span>{hint}</span>
                </div>
            )}

            {/* Success Message (optional) */}
            <AnimatePresence>
                {isTouched && isValid && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
                    >
                        <FaCheckCircle size={14} />
                        <span>Valid</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ValidatedInput;
