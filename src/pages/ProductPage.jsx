import { useRef, useEffect, useState } from 'react'
import {
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { PRODUCTS, ADD_TO_CART } from '@/utilities/constants'
import toast, { Toaster } from 'react-hot-toast'
import { useCart } from '@/context/CartContext'
import axiosInstance from '@/api/axiosInstance'

const PRODUCTS_PER_PAGE = parseInt(import.meta.env.VITE_PRODUCTS_PER_PAGE) || 8

export default function ProductPage() {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1) // Track the current page
    const productsRef = useRef(null)
    const { updateCartCount } = useCart()

    const scrollToProducts = () => {
        productsRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    // Fetch products
    useEffect(() => {
        const url = `${import.meta.env.VITE_BACKEND_URL}${PRODUCTS}`

        axiosInstance
            .get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                const sortedProducts = response.data.sort((a, b) => {
                    return new Date(b.created_at) - new Date(a.created_at)
                })
                setProducts(sortedProducts)
                setFilteredProducts(sortedProducts)
            })
            .catch((error) => {
                console.error('Error fetching products:', error)
            })
    }, [])

    // Handle search input changes
    useEffect(() => {
        if (searchQuery) {
            // Filter products based on search query
            const filtered = products.filter(
                (product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    product.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            )
            setFilteredProducts(filtered)
        } else {
            // If search query is empty, show all products
            setFilteredProducts(products)
        }
        setCurrentPage(1) // Reset to the first page when search query changes
    }, [searchQuery, products])

    // Add product to cart
    const handleAddToCart = async (productId) => {
        const token = localStorage.getItem('token')
        if (!token) {
            window.location.href = '/login'
            return
        }

        // Create the URL with query parameters
        const url = `${
            import.meta.env.VITE_BACKEND_URL
        }${ADD_TO_CART}?productId=${productId}&quantity=1`

        try {
            await axiosInstance.post(
                url,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            updateCartCount() // Increment cart count
            // Success toast
            toast.success('Product added to cart successfully!', {
                duration: 3000 // Show for 3 seconds
            })
        } catch (error) {
            console.error('Error adding product to cart:', error)

            // Error toast
            toast.error('Failed to add product to cart.', {
                duration: 3000 // Show for 3 seconds
            })
        }
    }

    // Calculate the number of pages required
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)

    // Get the products to display for the current page
    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    )

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
        scrollToProducts()
    }

    // Create page numbers with '...' logic
    const renderPageNumbers = () => {
        const pageNumbers = []

        // Always show the first 3 and last 3 pages
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            if (currentPage <= 3) {
                pageNumbers.push(
                    1,
                    2,
                    3,
                    '...',
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                )
            } else if (currentPage > 3 && currentPage < totalPages - 2) {
                pageNumbers.push(
                    1,
                    '...',
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    '...',
                    totalPages
                )
            } else {
                pageNumbers.push(
                    1,
                    '...',
                    totalPages - 4,
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                )
            }
        }

        return pageNumbers.map((pageNumber, index) =>
            pageNumber === '...' ? (
                <span key={index} className="px-2 py-2">
                    ...
                </span>
            ) : (
                <button
                    key={index}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded-md ${
                        currentPage === pageNumber
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {pageNumber}
                </button>
            )
        )
    }

    // Handle next and previous page
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
            scrollToProducts()
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            scrollToProducts()
        }
    }

    return (
        <main>
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
                {/* Set the position of the Toaster to bottom-right */}
                <Toaster position="bottom-right" reverseOrder={false} />
                <div className="relative w-full mb-16">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                        className="w-full py-2 px-4 pr-12 text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Search Product . . ."
                    />
                    <button
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
                        type="submit"
                    >
                        <MagnifyingGlassIcon className="size-5" />
                    </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900">Products</h2>

                <div
                    id="products"
                    ref={productsRef}
                    className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                >
                    {currentProducts.map((product) => (
                        <div key={product.id}>
                            <div>
                                <div className="relative">
                                    <div className="relative h-72 w-full overflow-hidden rounded-lg">
                                        {/* Check if product has images and use the first one */}
                                        <Link to={`/products/${product.id}`}>
                                            {product.images &&
                                            product.images.length > 0 ? (
                                                <img
                                                    alt={
                                                        product.images[0]
                                                            .altText
                                                    }
                                                    src={`${
                                                        import.meta.env
                                                            .VITE_IMAGE_URL
                                                    }/${
                                                        product.images[0].path
                                                    }`} // Use the image path from API response
                                                    className="h-full w-full object-contain object-center"
                                                />
                                            ) : (
                                                <img
                                                    alt="Placeholder"
                                                    src="https://tailwindui.com/plus/img/ecommerce-images/product-page-03-related-product-01.jpg" // Fallback placeholder image
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            )}
                                        </Link>
                                    </div>
                                    <div className="relative mt-4">
                                        <h3 className="text-sm font-medium text-gray-900">
                                            {/* Wrap product name in Link to the product detail page */}
                                            <Link
                                                to={`/products/${product.id}`}
                                            >
                                                {product.name}
                                            </Link>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500 h-40 text-clip overflow-hidden">
                                            {product.description}
                                        </p>
                                    </div>
                                    <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                                        <div
                                            aria-hidden="true"
                                            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                                        />
                                        <p className="relative text-lg font-semibold text-white">
                                            S${product.price}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 space-y-4">
                                    <button className="w-full">
                                        <Link
                                            to={`/products/${product.id}`}
                                            className="relative w-full flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-8 py-2 text-sm font-medium text-white hover:bg-teal-500"
                                        >
                                            View Product
                                        </Link>
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleAddToCart(product.id)
                                        }
                                        className="relative w-full flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                                    >
                                        Add to bag
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center space-x-2">
                        {/* Prev Button */}
                        <button
                            onClick={handlePrevPage}
                            className={`flex items-center px-4 py-2 rounded-md ${
                                currentPage === 1
                                    ? 'cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                            <span>Prev</span>
                        </button>

                        {/* Page numbers */}
                        {renderPageNumbers()}

                        {/* Next Button */}
                        <button
                            onClick={handleNextPage}
                            className={`flex items-center px-4 py-2 rounded-md ${
                                currentPage === totalPages
                                    ? 'cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                            disabled={currentPage === totalPages}
                        >
                            <span>Next</span>
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}
