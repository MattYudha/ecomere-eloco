'use client';
import { CustomButton, SectionTitle } from '@/components';
import { isValidEmailAddressFormat } from '@/lib/utils';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    const expired = searchParams.get('expired');
    if (expired === 'true') {
      setError('Your session has expired. Please log in again.');
      toast.error('Your session has expired. Please log in again.');
    }

    if (sessionStatus === 'authenticated') {
      router.replace('/');
    }
  }, [sessionStatus, router, searchParams]);

  const handleSubmit = async (e: any) => {
    console.log('Form submitted!');
    e.preventDefault();

    if (!isValidEmailAddressFormat(email)) {
      setError('Email is invalid');
      toast.error('Email is invalid');
      return;
    }

    if (!password || password.length < 8) {
      setError('Password is invalid');
      toast.error('Password is invalid');
      return;
    }

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    console.log('Sign In Response:', res);

    if (res?.error) {
      setError('Invalid email or password');
      toast.error('Invalid email or password');
      // The original code had a router.replace('/') here, which seems incorrect for an error.
      // Removing it as it would redirect on error.
    } else {
      setError('');
      toast.success('Successful login');
      router.replace('/'); // Redirect to dashboard on successful login
    }
  };

  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <SectionTitle title="Login" path="Home | Login" />

      <div className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold font-['Forum']">
              <span className="text-yellow-500">Welcome</span>{' '}
              <span className="text-gray-600 dark:text-gray-400">Back</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Sign in to continue your journey
            </p>
          </div>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px] px-4">
          {/* Glassmorphism Card */}
          <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 px-6 py-10 shadow-2xl sm:rounded-3xl sm:px-12 border border-white/20 dark:border-gray-700/20 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 dark:from-gray-700/50 to-transparent pointer-events-none rounded-3xl"></div>

            <div className="relative z-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="group">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-indigo-600"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-xl border-0 py-3.5 pl-12 pr-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white/90 dark:focus:bg-gray-700/90"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-indigo-600"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-xl border-0 py-3.5 pl-12 pr-12 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white/90 dark:focus:bg-gray-700/90"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center group">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-600 cursor-pointer transition-all"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 block text-sm leading-6 text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm leading-6">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 animate-shake">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400 dark:text-red-300"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800 dark:text-red-300">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <CustomButton
                    buttonType="submit"
                    paddingX={3}
                    paddingY={3}
                    customWidth="full"
                    textSize="lg"
                    className="relative overflow-hidden group bg-yellow-500/30 dark:bg-yellow-700/30 backdrop-blur-md border border-yellow-400/50 dark:border-yellow-600/50 text-white hover:bg-yellow-500/50 dark:hover:bg-yellow-700/50 transition-all duration-300 rounded-full"
                  >
                    <span className="text-yellow-500 group-hover:text-white transition-colors duration-300">Sign</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors duration-300">In</span>
                  </CustomButton>
                </div>
              </form>

              {/* Divider */}
              <div className="relative mt-10">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-300/50 dark:border-gray-600/50" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 px-6 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm px-3 py-3 text-gray-700 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300/50 dark:ring-gray-600/50 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
                  onClick={() => {
                    signIn('google');
                  }}
                >
                  <FcGoogle className="h-5 w-5" />
                  <span className="text-sm font-semibold leading-6">
                    Google
                  </span>
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 px-3 py-3 text-white shadow-sm hover:from-gray-800 hover:to-gray-600 hover:shadow-md hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-all duration-200"
                  onClick={() => {
                    signIn('github');
                  }}
                >
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-semibold leading-6">
                    GitHub
                  </span>
                </button>
              </div>

              {/* Sign Up Link */}
              <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{' '}
                <a
                  href="/register"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                >
                  Sign up now
                </a>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-full px-4 py-2 inline-block">
            Protected by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;