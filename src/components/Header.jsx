import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Dialog,
    DialogPanel
} from '@headlessui/react'
import {
    ChevronDownIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/20/solid'
import { UserIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { USER_FROM_TOKEN } from '@/utilities/constants'
import { useCart } from '@/context/CartContext'
import { Link } from 'react-router-dom'

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [user, setUser] = useState(null)
    const { cartCount, updateCartCount } = useCart() // Use cart count from context

    // Fetch user info
    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            const url = `${import.meta.env.VITE_BACKEND_URL}${USER_FROM_TOKEN}`

            axios
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((response) => {
                    setUser(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error)
                })
        }
    }, [])

    // Fetch cart count (on component load or after any change in cart)
    useEffect(() => {
        updateCartCount() // Trigger cart count update
    }, [updateCartCount])

    const handleLogout = async (e) => {
        // Prevent the default form submission
        e.preventDefault()

        // Remove the token from localStorage
        localStorage.removeItem('token')

        // Redirect to the login page
        window.location.href = '/login'
    }

    return (
        <header className="sticky top-0 z-50 bg-teal-600 text-white shadow-md">
            {' '}
            {/* Sticky navbar with shadow */}
            <nav
                aria-label="Global"
                className="flex items-center justify-between p-6 lg:px-16 py-0"
            >
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Pixel Tech</span>
                        <img
                            alt="Pixel Tech"
                            src="/logo.svg"
                            className="max-h-24 w-auto"
                        />
                    </a>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <div className="flex items-center space-x-8">
                        {user ? (
                            <Menu
                                as="div"
                                className="relative inline-block text-left"
                            >
                                <MenuButton className="inline-flex items-center">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
                                        alt="User Avatar"
                                        className="size-8 rounded-full"
                                    />
                                    <span className="ml-2 font-semibold">
                                        {user.firstName} {user.lastName}
                                    </span>
                                    <ChevronDownIcon
                                        aria-hidden="true"
                                        className="ml-1 size-6 text-gray-400"
                                    />
                                </MenuButton>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                >
                                    <div className="py-1">
                                        <MenuItem>
                                            <a
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Profile
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="/order-history"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Order History
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                onClick={handleLogout}
                                                type="submit"
                                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                        ) : (
                            <a href="/login">
                                <div className="flex items-center space-x-3">
                                    <UserIcon className="h-6 w-6" />
                                    <span className="font-semibold">
                                        Account
                                    </span>
                                </div>
                            </a>
                        )}

                        <a href="/cart" className="relative">
                            <ShoppingCartIcon className="size-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-4 -right-4 bg-teal-500 text-white text-xs rounded-full size-6 flex items-center justify-center">
                                    {cartCount > 99 ? '∞' : cartCount}
                                </span>
                            )}
                        </a>
                    </div>
                </div>

                <div className="lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                    </button>
                </div>
            </nav>
            {/* Mobile Menu */}
            <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className="lg:hidden"
            >
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="/" className="-m-1.5 p-1.5">
                            <img
                                alt="Pixel Tech"
                                src="/logo.svg"
                                className="h-16 w-auto"
                            />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Link
                                    to="/profile"
                                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/"
                                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Products
                                </Link>
                                <Link
                                    to="/cart"
                                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Cart
                                </Link>
                                <Link
                                    to="/order-history"
                                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Order History
                                </Link>
                            </div>
                            <div className="py-6">
                                {user ? (
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <a
                                        href="/login"
                                        className="block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        Log in
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}

export default Header
