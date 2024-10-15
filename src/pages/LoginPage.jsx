import React, { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import axiosInstance from '@/api/axiosInstance'
import { USER_LOGIN } from '@/utilities/constants'

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleSubmit = async (e) => {
        // Prevent the form from submitting
        e.preventDefault()

        try {
            const response = await axiosInstance.post(
                `${import.meta.env.VITE_BACKEND_URL}${USER_LOGIN}`,
                {
                    username,
                    password
                },
                {
                    headers: {
                        'Content-Type': 'application/json' // Ensure data is sent as JSON
                    }
                }
            )

            // Get the token from the response
            const token = response.data.token

            // Store the token in localStorage
            localStorage.setItem('token', token)

            window.location.href = '/'
        } catch (error) {
            // Handle login errors
            setErrorMessage('Uesrname or password is incorrect!')
        }
    }

    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                    alt="Pixel Tech"
                    src="/user_logo.svg"
                    className="mx-auto h-24 w-auto"
                />
                <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Login to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    {errorMessage && (
                        <p className="text-red-500 mb-8">
                            Error: {errorMessage}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Username <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    autoComplete="username"
                                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 focus:outline-none"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 py-1.5 px-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 focus:outline-none"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <EyeSlashIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <a
                        href="/register"
                        className="font-semibold leading-6 text-teal-600 hover:text-teal-500"
                    >
                        Register Now!
                    </a>
                </p>
            </div>
        </div>
    )
}

export default LoginPage
