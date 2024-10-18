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
import { useParams } from 'react-router-dom'
import { ADD_TO_CART } from '@/utilities/constants'
import toast, { Toaster } from 'react-hot-toast'
import { useCart } from '@/context/CartContext'
import axiosInstance from '@/api/axiosInstance'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const ProductDetailPage = () => {
    const { id } = useParams() // Get productId from URL parameters
    const [product, setProduct] = useState(null) // Set the product state
    const [selectedColor, setSelectedColor] = useState(null) // Set the color state
    const [loading, setLoading] = useState(true) // Loading state
    const [reviews, setReviews] = useState([]) // Store reviews
    const { updateCartCount } = useCart()

    // Default product details in case the API does not return them
    const defaultDetails = [
        {
            name: 'Features',
            items: [
                '* Delivery to your door',
                '* 1 year warranty',
                '* Easy returns'
            ]
        }
    ]

    // Fetch product data and reviews from API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const [productResponse, reviewsResponse] = await Promise.all([
                    axiosInstance.get(`/products/show/${id}`),
                    axiosInstance.get(`/reviews/product/${id}`)
                ])

                setProduct(productResponse.data) // Set the fetched product data
                setSelectedColor(productResponse.data.colors?.[0] || null) // Set default color
                setReviews(reviewsResponse.data) // Set reviews data
                setLoading(false) // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching product or reviews:', error)
                setLoading(false) // Ensure loading is set to false in case of error
            }
        }

        fetchProduct()
    }, [id])

    // If loading or no product data, show a loading message or placeholder
    if (loading || !product) {
        return (
            <div className="flex items-center justify-center min-h-[40rem] text-2xl">
                Loading . . .
            </div>
        )
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
                                                className="h-full w-full object-contain object-center"
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
                                        className="h-full w-full object-contain object-center sm:rounded-lg"
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

                                {/* Reviews Section */}
                                <Disclosure as="div" defaultOpen>
                                    <h3>
                                        <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                                            <span className="text-sm font-medium text-gray-900 group-data-[open]:text-teal-600">
                                                Reviews
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
                                        {reviews.length > 0 ? (
                                            <ul
                                                role="list"
                                                className="space-y-6"
                                            >
                                                {reviews.map((review) => (
                                                    <li key={review.id}>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <p className="text-sm font-medium text-gray-500">
                                                                Review by:{' '}
                                                                {[
                                                                    review.user
                                                                        .firstName,
                                                                    review.user
                                                                        .lastName
                                                                ]
                                                                    .filter(
                                                                        Boolean
                                                                    )
                                                                    .join(' ')}
                                                            </p>

                                                            <p className="ml-3 text-sm text-gray-400">
                                                                {new Date(
                                                                    review.createdAt
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                                                            <div className="flex items-center mb-2 sm:mb-0">
                                                                <p className="text-sm font-medium text-gray-500 mr-2">
                                                                    Rating:
                                                                </p>
                                                                {[
                                                                    ...Array(5)
                                                                ].map(
                                                                    (
                                                                        star,
                                                                        index
                                                                    ) => (
                                                                        <StarIcon
                                                                            key={
                                                                                index
                                                                            }
                                                                            className={classNames(
                                                                                review.rating >
                                                                                    index
                                                                                    ? 'text-yellow-500'
                                                                                    : 'text-gray-300',
                                                                                'size-5 flex-shrink-0'
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="mt-4 text-sm font-medium text-gray-500">
                                                            Comment:{' '}
                                                            {review.comment}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                No reviews available for this
                                                product.
                                            </p>
                                        )}
                                    </DisclosurePanel>
                                </Disclosure>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage
