'use client';
import { CustomButton, SectionTitle } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const router = useRouter();
  const { data: session, status: sessionStatus } = useAuth();

  useEffect(() => {
    // checking if user has already registered redirect to home page
    if (sessionStatus === 'authenticated') {
      router.replace('/');
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  // Password Validation Logic
  const validations = [
    {
      check: (pass: string) => pass.length >= 8,
      label: 'Minimum 8 characters',
    },
    {
      check: (pass: string) => /[A-Z]/.test(pass),
      label: 'Minimum 1 capital letter A-Z',
    },
    {
      check: (pass: string) => /[a-z]/.test(pass),
      label: 'Minimum 1 lowercase letter a-z',
    },
    {
      check: (pass: string) => /[0-9]/.test(pass),
      label: 'Minimum 1 digit 0-9',
    },
    {
      check: (pass: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      label: 'Minimum 1 of the following symbols: ~ ! @ # $ ...',
    },
  ];

  const allValid = validations.every((v) => v.check(password));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const lastname = formData.get('lastname') as string;
    const email = formData.get('email') as string;
    // Password already in state
    const confirmPassword = formData.get('confirmpassword') as string;

    if (!isValidEmail(email)) {
      setError('Email is invalid');
      toast.error('Email is invalid');
      return;
    }

    if (!allValid) {
      setError('Password does not meet all requirements');
      toast.error('Password does not meet all requirements');
      return;
    }

    if (confirmPassword !== password) {
      setError('Passwords are not equal');
      toast.error('Passwords are not equal');
      return;
    }

    try {
      // sending API request for registering user
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          lastname, // Sending name/lastname as well, assuming API can handle or ignore them
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setError('');
        toast.success('Registration successful');
        router.push('/login');
      } else {
        // Handle different types of errors
        if (data.details && Array.isArray(data.details)) {
          // Validation errors
          const errorMessage = data.details
            .map((err: any) => err.message)
            .join(', ');
          setError(errorMessage);
          toast.error(errorMessage);
        } else if (data.error) {
          // General errors
          setError(data.error);
          toast.error(data.error);
        } else {
          setError('Registration failed');
          toast.error('Registration failed');
        }
      }
    } catch (error) {
      toast.error('Error, try again');
      setError('Error, try again');
      console.error(error);
    }
  };

  if (sessionStatus === 'loading') {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="bg-white">
      <SectionTitle title="Register" path="Home | Register" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold font-['Forum']">
              <span className="text-yellow-500">Create an</span>{' '}
              <span className="text-gray-600 dark:text-gray-400">Account</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get started with your new account
            </p>
          </div>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Lastname
                </label>
                <div className="mt-2">
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2 text-black">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                {/* Password Validation Tooltip */}
                {isPasswordFocused && (
                  <div className="absolute left-0 bottom-full mb-2 w-full bg-white p-4 rounded-lg shadow-xl border border-gray-100 z-10 animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-2">
                      {validations.map((val, index) => {
                        const isValid = val.check(password);
                        return (
                          <div key={index} className="flex items-start gap-2 text-xs transition-colors duration-200">
                            <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${isValid ? 'bg-green-500' : 'bg-gray-200'}`}>
                              {isValid && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={isValid ? 'text-gray-700 font-medium' : 'text-gray-500'}>
                              {val.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-100"></div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmpassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmpassword"
                    name="confirmpassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Accept our terms and privacy policy
                  </label>
                </div>
              </div>

              <div>
                <CustomButton
                  buttonType="submit"
                  paddingX={3}
                  paddingY={3}
                  customWidth="full"
                  textSize="lg"
                  className="relative overflow-hidden group bg-yellow-500/30 dark:bg-yellow-700/30 backdrop-blur-md border border-yellow-400/50 dark:border-yellow-600/50 text-white hover:bg-yellow-500/50 dark:hover:bg-yellow-700/50 transition-all duration-300 rounded-full"
                >
                  <span className="text-yellow-500 group-hover:text-white transition-colors duration-300">
                    Register
                  </span>{' '}
                  <span className="text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors duration-300">
                    Now
                  </span>
                </CustomButton>

                <p className="text-red-600 text-center text-[16px] my-4">
                  {error && error}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
