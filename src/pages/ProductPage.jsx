import { useRef, useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { PRODUCTS, ADD_TO_CART } from '@/utilities/constants'
import toast, { Toaster } from 'react-hot-toast'
import { useCart } from '@/context/CartContext'

export default function ProductPage() {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const productsRef = useRef(null)
    const { updateCartCount } = useCart()

    const scrollToProducts = () => {
        productsRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    // Fetch products
    useEffect(() => {
        const url = `${import.meta.env.VITE_BACKEND_URL}${PRODUCTS}`

        axios
            .get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                setProducts(response.data)
                setFilteredProducts(response.data) // Initialize filtered products to be the same as products
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
            await axios.post(
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
                    {filteredProducts.map((product) => (
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
                                                    className="h-full w-full object-cover object-center"
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
                                        <p className="mt-1 text-sm text-gray-500">
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
            </div>
        </main>
    )
}
