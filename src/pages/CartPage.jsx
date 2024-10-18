import {
    CheckIcon,
    ClockIcon,
    ShoppingBagIcon,
    XMarkIcon
} from '@heroicons/react/20/solid'
import { useState, useEffect } from 'react'
import { CART, REMOVE_FROM_CART, UPDATE_CART } from '@/utilities/constants'
import { useCart } from '@/context/CartContext'
import { loadStripe } from '@stripe/stripe-js'
import axiosInstance from '@/api/axiosInstance'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

// Initialize Stripe with the publishable key from your environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const CartPage = () => {
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const { updateCartCount } = useCart()
    const location = useLocation()
    const navigate = useNavigate()

    // Fetch cart items when component mounts
    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                window.location.href = '/login'
                return
            }

            try {
                const response = await axiosInstance.get(
                    `${import.meta.env.VITE_BACKEND_URL}${CART}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const updatedCartItems =
                    response.data?.cartItems.map((item) => ({
                        ...item,
                        price: item.product.price
                    })) || []

                setCartItems(updatedCartItems)
            } catch (error) {
                console.error('Error fetching cart items:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCartItems()
    }, [location])

    const handleCheckout = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            window.location.href = '/login'
            return
        }

        // Find the items where product is deleted and map their names
        const deletedProducts = cartItems
            .filter((item) => item.product.deleted === true)
            .map((item) => item.product.name)

        // Filter out items where the product is deleted
        const filteredCartItems = cartItems.filter(
            (item) => item.product.deleted === false
        )

        console.log('Filtered cart items:', filteredCartItems)
        console.log('Deleted product names:', deletedProducts)

        // If all items are deleted, show the deleted products and prevent checkout
        if (filteredCartItems.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops . . .',
                html: `Your cart contains deleted products: <span style="color: red;">${deletedProducts.join(
                    ', '
                )}</span> which cannot be checked out. Please remove them from your cart and try again.`,
                confirmButtonColor: '#14b8a6', // Customize the OK button color here
                confirmButtonText: 'Okay' // Optional: Customize the text on the button
            })

            return
        }

        // If there are deleted products but some valid ones remain, alert the user
        if (deletedProducts.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Deleted Products',
                text: `The following products are deleted and will be removed from your cart: ${deletedProducts.join(
                    ', '
                )}`
            })
        }

        try {
            const response = await axiosInstance.post(
                `${import.meta.env.VITE_BACKEND_URL}/checkout`,
                {
                    items: filteredCartItems.map((item) => ({
                        productId: item.product.id,
                        quantity: item.quantity
                    }))
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const { sessionId } = response.data
            if (sessionId) {
                const stripe = await stripePromise
                await stripe.redirectToCheckout({ sessionId })

                // After checkout, programmatically navigate back to the cart page
                navigate('/cart')
            } else {
                console.error('No sessionId received from the backend.')
            }
        } catch (error) {
            console.error('Error during checkout:', error)
        }
    }

    // Function to handle removing an item from the cart
    const handleRemoveItem = async (productId) => {
        const token = localStorage.getItem('token')
        if (!token) {
            window.location.href = '/login'
            return
        }

        try {
            await axiosInstance.delete(
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
            setCartItems((prevItems) =>
                prevItems.filter((item) => item.product.id !== productId)
            )
            updateCartCount()
        } catch (error) {
            console.error('Error removing item from cart:', error)
        }
    }

    // Function to handle quantity changes
    const handleQuantityChange = async (productId, newQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        )

        try {
            const token = localStorage.getItem('token')
            if (token) {
                await axiosInstance.put(
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
                updateCartCount()
            }
        } catch (error) {
            console.error('Error updating cart item:', error)
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
                            {/* Cart Items */}
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
                                                    className="h-24 w-24 rounded-md object-contain object-center sm:h-48 sm:w-48"
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
                                                            S${item.price}
                                                        </p>
                                                    </div>
                                                    <div className="mt-4 sm:mt-0 sm:pr-9">
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
                                                                    )
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
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                            {/* Order Summary */}
                            <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                                <h2 className="text-lg font-medium text-gray-900">
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
                                    {/* Removed Shipping Fee and Tax */}
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                        <dt className="text-base font-medium text-gray-900">
                                            Total Price
                                        </dt>
                                        <dd className="text-base font-medium text-gray-900">
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
                                </dl>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full mt-6 rounded-md border border-transparent bg-teal-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-teal-700"
                                >
                                    Checkout
                                </button>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CartPage
