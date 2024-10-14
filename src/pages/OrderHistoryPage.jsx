import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ORDER_HISTORY } from '@/utilities/constants' // You can define this constant as `/api/orders/history`

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]) // State to hold orders
    const [loading, setLoading] = useState(true) // Loading state

    useEffect(() => {
        const fetchOrderHistory = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                window.location.href = '/login'
                return
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}${ORDER_HISTORY}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                setOrders(response.data) // Set the orders data from the API
            } catch (error) {
                console.error('Error fetching order history:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrderHistory()
    }, [])

    if (loading) {
        return (
            <div className="h-[44rem] flex items-center justify-center">
                Loading . . .
            </div>
        )
    }

    return (
        <div className="bg-white">
            <div className="py-16 sm:py-24">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                    <div className="mx-auto max-w-2xl px-4 lg:max-w-5xl lg:px-0">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Order history
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Check the status of recent orders, manage returns,
                            and discover similar products.
                        </p>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="sr-only">Recent orders</h2>
                    <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                        <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                                >
                                    <div className="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
                                        <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                                            <div>
                                                <dt className="font-medium text-gray-900">
                                                    Order number
                                                </dt>
                                                <dd className="mt-1 text-gray-500">
                                                    {order.id}
                                                </dd>
                                            </div>
                                            <div className="hidden sm:block">
                                                <dt className="font-medium text-gray-900">
                                                    Date placed
                                                </dt>
                                                <dd className="mt-1 text-gray-500">
                                                    <time
                                                        dateTime={
                                                            order.createdAt
                                                        }
                                                    >
                                                        {new Date(
                                                            order.createdAt
                                                        ).toLocaleDateString()}
                                                    </time>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="font-medium text-gray-900">
                                                    Total amount
                                                </dt>
                                                <dd className="mt-1 font-medium text-gray-900">
                                                    S${order.totalPrice}
                                                </dd>
                                            </div>
                                        </dl>

                                        <Menu
                                            as="div"
                                            className="relative flex justify-end lg:hidden"
                                        >
                                            <div className="flex items-center">
                                                <MenuButton className="-m-2 flex items-center p-2 text-gray-400 hover:text-gray-500">
                                                    <span className="sr-only">
                                                        Options for order{' '}
                                                        {order.id}
                                                    </span>
                                                    <EllipsisVerticalIcon
                                                        aria-hidden="true"
                                                        className="h-6 w-6"
                                                    />
                                                </MenuButton>
                                            </div>

                                            <MenuItems
                                                transition
                                                className="absolute right-0 z-10 mt-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                            >
                                                <div className="py-1">
                                                    <MenuItem>
                                                        <a
                                                            href="#"
                                                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                                        >
                                                            View
                                                        </a>
                                                    </MenuItem>
                                                    <MenuItem>
                                                        <a
                                                            href="#"
                                                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                                        >
                                                            Invoice
                                                        </a>
                                                    </MenuItem>
                                                </div>
                                            </MenuItems>
                                        </Menu>
                                    </div>

                                    {/* Products */}
                                    <ul
                                        role="list"
                                        className="divide-y divide-gray-200"
                                    >
                                        {order.orderItems.map((product) => (
                                            <li
                                                key={product.id}
                                                className="p-4 sm:p-6"
                                            >
                                                <div className="flex items-center sm:items-start">
                                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                                                        <img
                                                            alt={
                                                                product.product
                                                                    .name
                                                            }
                                                            src={`http://localhost:8080/images/products/${product.product.images[0].path}`}
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <div className="ml-6 flex-1 text-sm">
                                                        <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                                            <h5>
                                                                {
                                                                    product
                                                                        .product
                                                                        .name
                                                                }
                                                            </h5>
                                                            <p className="text-sm font-medium text-gray-500">
                                                                Quantity:{' '}
                                                                {
                                                                    product.quantity
                                                                }
                                                            </p>
                                                            <p className="mt-2 sm:mt-0">
                                                                S$
                                                                {
                                                                    product
                                                                        .product
                                                                        .price
                                                                }
                                                            </p>
                                                        </div>
                                                        <p className="hidden text-gray-500 sm:mt-2 sm:block">
                                                            {
                                                                product.product
                                                                    .description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 sm:flex sm:justify-between">
                                                    <div className="flex items-center">
                                                        <CheckCircleIcon
                                                            aria-hidden="true"
                                                            className="h-5 w-5 text-green-500"
                                                        />
                                                        <p className="ml-2 text-sm font-medium text-gray-500">
                                                            Ordered on{' '}
                                                            <time
                                                                dateTime={
                                                                    order.updatedAt
                                                                }
                                                            >
                                                                {new Date(
                                                                    order.updatedAt
                                                                ).toLocaleDateString()}
                                                            </time>
                                                        </p>
                                                    </div>

                                                    <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
                                                        <div className="flex flex-1 justify-center">
                                                            <Link
                                                                to={`/products/${product.product.id}`}
                                                                className="whitespace-nowrap text-teal-600 hover:text-teal-500"
                                                            >
                                                                View Product
                                                            </Link>
                                                        </div>
                                                        {/* <div className="flex flex-1 justify-center pl-4">
                                                            <a
                                                                href="#"
                                                                className="whitespace-nowrap text-teal-600 hover:text-teal-500"
                                                            >
                                                                Buy again
                                                            </a>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderHistoryPage
