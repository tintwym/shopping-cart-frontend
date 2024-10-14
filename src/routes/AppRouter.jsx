import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/layouts/Layout'
import LoginPage from '@/pages/LoginPage'
import ProductPage from '@/pages/ProductPage'
import CartPage from '@/pages/CartPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import OrderHistoryPage from '@/pages/OrderHistoryPage'
import NotFoundPage from '@/pages/NotFoundPage'
import RegisterPage from '@/pages/RegisterPage'
import UserProfilePage from '@/pages/UserProfilePage'

// Check if the user is authenticated by checking for a token in localStorage
const isAuthenticated = () => {
    return !!localStorage.getItem('token')
}

// Protected route for authenticated users only
const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />
}

// Guest route for unauthenticated users only
const GuestRoute = ({ children }) => {
    return !isAuthenticated() ? children : <Navigate to="/" replace />
}

const AppRouter = () => {
    return (
        <Routes>
            {/* Guest Routes: Login and Register are accessible only if not authenticated */}
            <Route
                path="/login"
                element={
                    <GuestRoute>
                        <LoginPage />
                    </GuestRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <GuestRoute>
                        <RegisterPage />
                    </GuestRoute>
                }
            />

            {/* Protected Routes: Require authentication to access */}
            <Route
                path="/order-history"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <OrderHistoryPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* Public Routes */}
            <Route
                path="/"
                element={
                    <Layout>
                        <ProductPage />
                    </Layout>
                }
            />
            <Route
                path="/products/:id"
                element={
                    <Layout>
                        <ProductDetailPage />
                    </Layout>
                }
            />
            <Route
                path="/cart"
                element={
                    <Layout>
                        <CartPage />
                    </Layout>
                }
            />
            <Route
                path="/profile"
                element={
                    <Layout>
                        <UserProfilePage />
                    </Layout>
                }
            />

            {/* Catch-all for Not Found */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default AppRouter
