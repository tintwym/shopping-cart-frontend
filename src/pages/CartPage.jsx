import {
    CheckIcon,
    ClockIcon,
    ShoppingBagIcon,
    XMarkIcon
} from '@heroicons/react/20/solid'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { CART, REMOVE_FROM_CART, UPDATE_CART } from '@/utilities/constants' // Add UPDATE_CART constant
import { useCart } from '@/context/CartContext' // Import the useCart hook

const CartPage = () => {
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const { updateCartCount } = useCart() // Destructure updateCartCount

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                window.location.href = '/login'
                return
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}${CART}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                setCartItems(response.data?.cartItems || [])
            } catch (error) {
                console.error('Error fetching cart items:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCartItems()
    }, [])

    // Function to handle removing an item from the cart
    const handleRemoveItem = async (productId) => {
        const token = localStorage.getItem('token')
        if (!token) {
            window.location.href = '/login'
            return
        }

        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}${REMOVE_FROM_CART}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        productId: productId
                    }
                }
            )

            // After deleting, remove the item from the local state
            setCartItems((prevItems) =>
                prevItems.filter((item) => item.product.id !== productId)
            )

            updateCartCount() // Trigger cart count update after removing item
        } catch (error) {
            console.error('Error removing item from cart:', error)
        }
    }

    // Function to handle quantity changes
    const handleQuantityChange = async (productId, newQuantity) => {
        // Update quantity in the local state
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        )

        // Update cart item in the database
        try {
            const token = localStorage.getItem('token')
            if (token) {
                await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}${UPDATE_CART}`,
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        params: {
                            productId: productId,
                            quantity: newQuantity
                        }
                    }
                )
                updateCartCount() // Trigger cart count update after changing quantity
            }
        } catch (error) {
            console.error('Error updating cart item:', error)
        }
    }

    const handleCheckout = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            window.location.href = '/login'
            return
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/checkout`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            // Optionally: Redirect to order confirmation page after successful checkout
            window.location.href = '/order-history'
        } catch (error) {
            console.error('Error during checkout:', error)
        }
    }

    if (loading) {
        return (
            <div className="h-[44rem] flex items-center justify-center">
                Loading . . .
            </div>
        )
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
                {cartItems.length === 0 ? (
                    <div className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                        <div className="text-center space-y-12">
                            <ShoppingBagIcon className="size-12 mx-auto text-teal-600" />
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                Your cart is empty.
                            </h1>
                            <div>
                                <a
                                    href="/"
                                    className="rounded-md bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                                >
                                    Go Shopping
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Shopping Cart
                        </h1>
                        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                            <section
                                aria-labelledby="cart-heading"
                                className="lg:col-span-7"
                            >
                                <h2 id="cart-heading" className="sr-only">
                                    Items in your shopping cart
                                </h2>

                                <ul
                                    role="list"
                                    className="divide-y divide-gray-200 border-b border-t border-gray-200"
                                >
                                    {cartItems.map((item, idx) => (
                                        <li
                                            key={item.product.id}
                                            className="flex py-6 sm:py-10"
                                        >
                                            <div className="flex-shrink-0">
                                                <img
                                                    alt={item.product.name}
                                                    src={`http://localhost:8080/images/products/${item.product.images[0].path}`}
                                                    className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                                                />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <h3 className="text-sm">
                                                                <a
                                                                    href={`/products/${item.product.id}`}
                                                                    className="font-medium text-gray-700 hover:text-gray-800"
                                                                >
                                                                    {
                                                                        item
                                                                            .product
                                                                            .name
                                                                    }
                                                                </a>
                                                            </h3>
                                                        </div>
                                                        <p className="mt-1 text-sm font-medium text-gray-900">
                                                            S$
                                                            {item.price}
                                                        </p>
                                                    </div>

                                                    <div className="mt-4 sm:mt-0 sm:pr-9">
                                                        <label
                                                            htmlFor={`quantity-${idx}`}
                                                            className="sr-only"
                                                        >
                                                            Quantity,{' '}
                                                            {item.product.name}
                                                        </label>
                                                        <input
                                                            id={`quantity-${idx}`}
                                                            name={`quantity-${idx}`}
                                                            type="number"
                                                            min="1"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(e) =>
                                                                handleQuantityChange(
                                                                    item.product
                                                                        .id,
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    ),
                                                                    item.product
                                                                        .stock
                                                                )
                                                            }
                                                            className="w-1/2 rounded-md border border-gray-300 py-1.5 px-4 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                                                        />

                                                        <div className="absolute right-0 top-0">
                                                            <button
                                                                type="button"
                                                                className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                                                                onClick={() =>
                                                                    handleRemoveItem(
                                                                        item
                                                                            .product
                                                                            .id
                                                                    )
                                                                }
                                                            >
                                                                <span className="sr-only">
                                                                    Remove
                                                                </span>
                                                                <div className="rounded-md bg-gray-50 hover:bg-gray-200 p-2">
                                                                    <XMarkIcon
                                                                        aria-hidden="true"
                                                                        className="size-5 text-red-500"
                                                                    />
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                                                    {item.product.stock > 0 ? (
                                                        <CheckIcon
                                                            aria-hidden="true"
                                                            className="h-5 w-5 flex-shrink-0 text-green-500"
                                                        />
                                                    ) : (
                                                        <ClockIcon
                                                            aria-hidden="true"
                                                            className="h-5 w-5 flex-shrink-0 text-gray-300"
                                                        />
                                                    )}

                                                    <span>
                                                        {item.product.stock > 0
                                                            ? 'In stock'
                                                            : 'Out of stock'}
                                                    </span>
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Order summary */}
                            <section
                                aria-labelledby="summary-heading"
                                className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
                            >
                                <h2
                                    id="summary-heading"
                                    className="text-lg font-medium text-gray-900"
                                >
                                    Order summary
                                </h2>

                                <dl className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-600">
                                            Subtotal
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            S$
                                            {cartItems
                                                .reduce(
                                                    (acc, item) =>
                                                        acc +
                                                        item.price *
                                                            item.quantity,
                                                    0
                                                )
                                                .toFixed(2)}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                        <dt className="text-sm text-gray-600">
                                            Delivery Fee
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            S$5.00
                                        </dd>
                                    </div>

                                    {/* Calculate tax as 9% on the subtotal + shipping */}
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                        <dt className="text-sm text-gray-600">
                                            Tax (GST - 9%)
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            S$
                                            {(
                                                (cartItems.reduce(
                                                    (acc, item) =>
                                                        acc +
                                                        item.price *
                                                            item.quantity,
                                                    0
                                                ) +
                                                    5) *
                                                0.09
                                            ).toFixed(2)}
                                        </dd>
                                    </div>

                                    {/* Calculate the total, including tax */}
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                        <dt className="text-base font-medium text-gray-900">
                                            Order total
                                        </dt>
                                        <dd className="text-base font-medium text-gray-900">
                                            S$
                                            {(
                                                cartItems.reduce(
                                                    (acc, item) =>
                                                        acc +
                                                        item.price *
                                                            item.quantity,
                                                    0
                                                ) +
                                                5 +
                                                (cartItems.reduce(
                                                    (acc, item) =>
                                                        acc +
                                                        item.price *
                                                            item.quantity,
                                                    0
                                                ) +
                                                    5) *
                                                    0.09
                                            ).toFixed(2)}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="mt-6">
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full rounded-md border border-transparent bg-teal-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CartPage
