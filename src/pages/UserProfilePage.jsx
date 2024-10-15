import React, { useState, useEffect } from 'react'
import axiosInstance from '@/api/axiosInstance'
import toast, { Toaster } from 'react-hot-toast'

const UserProfilePage = () => {
    // State to hold form data for address and user info separately
    const [formData, setFormData] = useState({
        address1: '',
        address2: '',
        unit: '',
        floor: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
    })

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: ''
    })

    // Fetch the address data
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            toast.error('Authorization token is missing!')
            return
        }

        // Call API to get the profile (address) data
        axiosInstance
            .get('/users/profiles/show', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                const profileData = response.data
                if (profileData) {
                    setFormData({
                        address1: profileData.address1 || '',
                        address2: profileData.address2 || '',
                        unit: profileData.unit || '',
                        floor: profileData.floor || '',
                        city: profileData.city || '',
                        state: profileData.state || '',
                        country: profileData.country || '',
                        zipCode: profileData.zipCode || ''
                    })
                }
            })
            .catch((error) => {
                console.error('Error fetching profile data:', error)
                toast.error('Failed to load profile data.')
            })
    }, [])

    // Fetch the user data (separately)
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            toast.error('Authorization token is missing!')
            return
        }

        // Call API to get user details
        axiosInstance
            .get('/users/token', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                const userData = response.data
                if (userData) {
                    setUserData({
                        firstName: userData.firstName || '',
                        lastName: userData.lastName || '',
                        username: userData.username || '',
                        email: userData.email || ''
                    })
                }
            })
            .catch((error) => {
                console.error('Error fetching user data:', error)
                toast.error('Failed to load user data.')
            })
    }, [])

    // Handle form input changes for address
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // Handle form submission to save address
    const handleSave = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')

        if (!token) {
            toast.error('Authorization token is missing!')
            return
        }

        try {
            await axiosInstance.post('/users/profiles/update', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            toast.success('Profile updated successfully!')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile.')
        }
    }

    return (
        <>
            <form className="p-16" onSubmit={handleSave}>
                {/* Set the position of the Toaster to bottom-right */}
                <Toaster position="bottom-right" reverseOrder={false} />

                {/* User information section */}
                <div className="space-y-12 mb-10">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                        <div>
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                                User Information
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Personal details and contact information.
                            </p>
                        </div>

                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                            {/* First Name */}
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="firstName"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    First Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={userData.firstName}
                                        disabled
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-100 cursor-not-allowed sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Last Name */}
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="lastName"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Last Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={userData.lastName}
                                        disabled
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-100 cursor-not-allowed sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div className="sm:col-span-6">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Username
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={userData.username}
                                        disabled
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-100 cursor-not-allowed sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="sm:col-span-6">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Email
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={userData.email}
                                        disabled
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-100 cursor-not-allowed sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address section */}
                <div className="space-y-12">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                        <div>
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Address
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Provide your address information below.
                            </p>
                        </div>

                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                            {/* Address Line 1 */}
                            <div className="sm:col-span-6">
                                <label
                                    htmlFor="address1"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Address Line 1
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="address1"
                                        name="address1"
                                        type="text"
                                        autoComplete="address-line1"
                                        value={formData.address1}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Address Line 2 */}
                            <div className="sm:col-span-6">
                                <label
                                    htmlFor="address2"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Address Line 2
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="address2"
                                        name="address2"
                                        type="text"
                                        autoComplete="address-line2"
                                        value={formData.address2}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Unit */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="unit"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Unit
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="unit"
                                        name="unit"
                                        type="text"
                                        value={formData.unit}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Floor */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="floor"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Floor
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="floor"
                                        name="floor"
                                        type="text"
                                        value={formData.floor}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* City */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="city"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    City
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        autoComplete="address-level2"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* State */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="state"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    State / Province
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="state"
                                        name="state"
                                        type="text"
                                        autoComplete="address-level1"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Country */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="country"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Country
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="country"
                                        name="country"
                                        type="text"
                                        autoComplete="country-name"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* ZIP Code */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="zipCode"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    ZIP / Postal Code
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="zipCode"
                                        name="zipCode"
                                        type="text"
                                        autoComplete="postal-code"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                        type="submit"
                        className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </>
    )
}

export default UserProfilePage
