import { useState, useEffect } from 'react'
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels
} from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import { HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { ADD_TO_CART } from '@/utilities/constants'
import toast, { Toaster } from 'react-hot-toast'
import { useCart } from '@/context/CartContext'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const ProductDetailPage = () => {
    const { id } = useParams() // Get productId from URL parameters
    const [product, setProduct] = useState(null) // Set the product state
    const [selectedColor, setSelectedColor] = useState(null) // Set the color state
    const [loading, setLoading] = useState(true) // Loading state
    const { updateCartCount } = useCart()

    // Default product details in case the API does not return them
    const defaultDetails = [
        {
            name: 'Features',
            items: ['Delivery to your door', '1 year warranty', 'Easy returns']
        }
    ]

    // Fetch product data from API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/products/show/${id}`
                )
                const fetchedProduct = response.data
                setProduct(fetchedProduct) // Set the fetched product data
                setSelectedColor(fetchedProduct.colors?.[0] || null) // Set default color
                setLoading(false) // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching product:', error)
                setLoading(false) // Ensure loading is set to false in case of error
            }
        }

        fetchProduct()
    }, [id])

    // If loading or no product data, show a loading message or placeholder
    if (loading || !product) {
        return <div>Loading...</div>
    }

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
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                {/* Set the position of the Toaster to bottom-right */}
                <Toaster position="bottom-right" reverseOrder={false} />
                <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                    {/* Image gallery */}
                    <TabGroup className="flex flex-col-reverse">
                        {/* Image selector */}
                        <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                            <TabList className="grid grid-cols-4 gap-6">
                                {product.images.map((image) => (
                                    <Tab
                                        key={image.id}
                                        className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                                    >
                                        <span className="sr-only">
                                            {image.altText}
                                        </span>
                                        <span className="absolute inset-0 overflow-hidden rounded-md">
                                            <img
                                                alt={image.altText}
                                                src={`http://localhost:8080/images/products/${image.path}`}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-teal-500"
                                        />
                                    </Tab>
                                ))}
                            </TabList>
                        </div>

                        <TabPanels className="aspect-h-1 aspect-w-1 w-full">
                            {product.images.map((image) => (
                                <TabPanel key={image.id}>
                                    <img
                                        alt={image.altText}
                                        src={`http://localhost:8080/images/products/${image.path}`}
                                        className="h-full w-full object-cover object-center sm:rounded-lg"
                                    />
                                </TabPanel>
                            ))}
                        </TabPanels>
                    </TabGroup>

                    {/* Product info */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            {product.name}
                        </h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl tracking-tight text-gray-900">
                                ${product.price}
                            </p>
                        </div>

                        {/* Reviews */}
                        {/* <div className="mt-3">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <StarIcon
                                            key={rating}
                                            aria-hidden="true"
                                            className={classNames(
                                                product.rating > rating
                                                    ? 'text-teal-500'
                                                    : 'text-gray-300',
                                                'h-5 w-5 flex-shrink-0'
                                            )}
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">
                                    {product.rating} out of 5 stars
                                </p>
                            </div>
                        </div> */}

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>

                            <div
                                dangerouslySetInnerHTML={{
                                    __html: product.description
                                }}
                                className="space-y-6 text-base text-gray-700"
                            />
                        </div>

                        <div className="mt-6">
                            <div className="mt-10 flex">
                                <button
                                    onClick={() => handleAddToCart(product.id)}
                                    className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-teal-600 px-8 py-3 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                                >
                                    Add to bag
                                </button>

                                <button
                                    type="button"
                                    className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                >
                                    <HeartIcon
                                        aria-hidden="true"
                                        className="h-6 w-6 flex-shrink-0"
                                    />
                                    <span className="sr-only">
                                        Add to favorites
                                    </span>
                                </button>
                            </div>
                        </div>

                        <section
                            aria-labelledby="details-heading"
                            className="mt-12"
                        >
                            <h2 id="details-heading" className="sr-only">
                                Additional details
                            </h2>

                            <div className="divide-y divide-gray-200 border-t">
                                {/* Use hardcoded details if product.details is undefined */}
                                {(product.details || defaultDetails).map(
                                    (detail) => (
                                        <Disclosure key={detail.name} as="div">
                                            <h3>
                                                <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                                                    <span className="text-sm font-medium text-gray-900 group-data-[open]:text-teal-600">
                                                        {detail.name}
                                                    </span>
                                                    <span className="ml-6 flex items-center">
                                                        <PlusIcon
                                                            aria-hidden="true"
                                                            className="block h-6 w-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden"
                                                        />
                                                        <MinusIcon
                                                            aria-hidden="true"
                                                            className="hidden h-6 w-6 text-teal-400 group-hover:text-teal-500 group-data-[open]:block"
                                                        />
                                                    </span>
                                                </DisclosureButton>
                                            </h3>
                                            <DisclosurePanel className="prose prose-sm pb-6">
                                                <ul
                                                    role="list"
                                                    className="space-y-2"
                                                >
                                                    {detail.items.map(
                                                        (item) => (
                                                            <li
                                                                key={item}
                                                                className="text-sm"
                                                            >
                                                                {item}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </DisclosurePanel>
                                        </Disclosure>
                                    )
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage
