import { useEffect } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '@/api/axiosInstance'
import { useCart } from '@/context/CartContext'

const PaymentSuccessPage = () => {
    const { updateCartCount } = useCart()
    const navigate = useNavigate() // React Router's hook for navigation

    useEffect(() => {
        const completeOrder = async () => {
            updateCartCount(0) // Reset the cart count to 0

            const token = localStorage.getItem('token')
            if (token) {
                try {
                    await axiosInstance.post('/complete-order', null, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    console.log('Order completed successfully')
                } catch (error) {
                    console.error('Error completing the order:', error)
                }
            } else {
                console.error('No token found, redirecting to login')
                window.location.href = '/login'
            }
        }

        completeOrder()

        // Set a timeout to redirect to order history page after 5 seconds
        const timer = setTimeout(() => {
            navigate('/order-history')
        }, 3000)

        // Cleanup timeout when the component unmounts
        return () => clearTimeout(timer)
    }, [navigate, updateCartCount])

    return (
        <div className="min-h-[40rem] flex items-center justify-center">
            <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon
                        aria-hidden="true"
                        className="h-6 w-6 text-green-600"
                    />
                </div>
                <div className="mt-3 text-center sm:mt-8">
                    <div className="text-2xl font-semibold leading-6 text-gray-900">
                        Payment successful
                    </div>
                    <div className="mt-2 md:mt-8">
                        <p className="text-lg text-gray-500">
                            Thank you for your purchase. Your order is being
                            processed! 🎉
                        </p>
                    </div>

                    <div className="mt-8">
                        <Link
                            to="/order-history"
                            className="rounded-md bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                        >
                            View Order History
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccessPage
