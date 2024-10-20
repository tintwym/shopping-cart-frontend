import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0)

    // Fetch the cart count from the backend
    const fetchCartCount = async () => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/carts/count`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                setCartCount(response.data.count)
            } catch (error) {
                console.error('Error fetching cart count:', error)
            }
        }
    }

    useEffect(() => {
        fetchCartCount() // Initial fetch of cart count
    }, [])

    // Function to directly update the cart count
    const updateCartCount = (newCount) => {
        if (typeof newCount === 'number') {
            setCartCount(newCount) // Set cart count directly if a number is provided
        } else {
            fetchCartCount() // Re-fetch the cart count from the backend if no value is provided
        }
    }

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
            {children}
        </CartContext.Provider>
    )
}
