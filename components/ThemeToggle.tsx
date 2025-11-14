// C:\Users\ACER\gemini-cli\Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS\components\ThemeToggle.tsx
"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { CiLight, CiDark } from 'react-icons/ci'; // Using icons from react-icons

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <CiDark size={24} />
      ) : (
        <CiLight size={24} />
      )}
    </button>
  );
};

export default ThemeToggle;
