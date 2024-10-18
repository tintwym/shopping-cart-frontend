import React, { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { USER_REGISTER } from '@/utilities/constants'
import toast, { Toaster } from 'react-hot-toast'
import axiosInstance from '@/api/axiosInstance'

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordsMatch, setPasswordsMatch] = useState(true)
    const [passwordError, setPasswordError] = useState('') // To track password validation error
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    // Regex for password validation
    const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value
        setPassword(newPassword)

        // Check if password matches the regex
        if (!passwordRegex.test(newPassword)) {
            setPasswordError(
                'Password must be at least 8 characters long, contain at least 1 letter, 1 number, and 1 special character.'
            )
        } else {
            setPasswordError('') // Clear the error message if valid
        }

        checkPasswordsMatch(newPassword, confirmPassword)
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value)
        checkPasswordsMatch(password, e.target.value)
    }

    const checkPasswordsMatch = (pass, confirmPass) => {
        setPasswordsMatch(pass === confirmPass)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!passwordsMatch || passwordError) return // Prevent submission if there's an error

        const data = {
            firstName,
            lastName,
            username,
            email,
            password
        }

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}${USER_REGISTER}`

            const response = await axiosInstance.post(url, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            // If registration is successful, store the token in localStorage and redirect
            localStorage.setItem('token', response.data.token)

            // Success toast
            toast.success('User registered successfully!', {
                duration: 2000 // Show for 3 seconds
            })

            setTimeout(() => {
                navigate('/') // Redirect to home page
            }, 2000) // Wait for 4 seconds
        } catch (error) {
            console.log('Error registering user:', error)

            // Error toast
            toast.error('Failed to create user.', {
                duration: 2000 // Show for 3 seconds
            })
        }
    }

    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
            {/* Set the position of the Toaster to bottom-right */}
            <Toaster position="bottom-right" reverseOrder={false} />
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <img
                    alt="Pixel Tech"
                    src="/user_logo.svg"
                    className="mx-auto h-24 w-auto"
                />
                <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Create your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[640px]">
                <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-12 sm:gap-x-8">
                            <div className="sm:col-span-6">
                                <label
                                    htmlFor="firstName"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    First Name{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        autoComplete="given-name"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                        className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label
                                    htmlFor="lastName"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Last Name{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        autoComplete="family-name"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                        className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-12 sm:gap-x-8">
                            <div className="sm:col-span-8">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Username{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        autoComplete="username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-12 sm:gap-x-8">
                            <div className="sm:col-span-6">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Password{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-2 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        required
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className={`block w-full rounded-md border-0 py-1.5 px-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${
                                            passwordError
                                                ? 'focus:ring-red-500'
                                                : 'focus:ring-teal-600'
                                        } sm:text-sm sm:leading-6 focus:outline-none`}
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
                                {passwordError && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {passwordError}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-6">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Confirm Password{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-2 relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        required
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        className={`block w-full rounded-md border-0 py-1.5 px-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${
                                            passwordsMatch
                                                ? 'focus:ring-teal-600'
                                                : 'focus:ring-red-500'
                                        } sm:text-sm sm:leading-6 focus:outline-none`}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                        <button
                                            type="button"
                                            onClick={
                                                toggleConfirmPasswordVisibility
                                            }
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ? (
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
                                {!passwordsMatch && (
                                    <p className="mt-2 text-sm text-red-600">
                                        Passwords do not match
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                                disabled={!passwordsMatch || !!passwordError}
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <a
                        href="/login"
                        className="font-semibold leading-6 text-teal-600 hover:text-teal-500"
                    >
                        Go to Login!
                    </a>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage
