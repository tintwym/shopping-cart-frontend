import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'

const Layout = ({ children }) => {
    return (
        <CartProvider>
            <Header />
            {children}
            <Footer />
        </CartProvider>
    )
}

export default Layout
