import React, { useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'

const ReviewPage = () => {
    const { productId, orderItemId } = useParams() // Get productId and orderItemId from the URL or props
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(0)

    // Handle review submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        if (!token) {
            toast.error('You must be logged in to submit a review.')
            return
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/api/reviews/store',
                {
                    comment,
                    rating,
                    productId,
                    orderItemId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            toast.success('Review submitted successfully!')
            setTimeout(() => {
                window.location.href = `/products/${productId}`
            }, 4000) // Redirect to product page after 4 seconds
        } catch (error) {
            toast.error('Failed to submit review.')
        }
    }

    return (
        <div className="bg-white min-h-[36rem] p-6 rounded-md mx-auto mt-8 w-2/5">
            <Toaster position="bottom-right" reverseOrder={false} />
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Write a Review
            </h2>
            <form onSubmit={handleSubmit}>
                {/* Rating */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating (1 to 5) <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    >
                        <option value="0" disabled>
                            Select a rating
                        </option>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Comment */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        placeholder="Write your review..."
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                >
                    Submit Review
                </button>
            </form>
        </div>
    )
}

export default ReviewPage
