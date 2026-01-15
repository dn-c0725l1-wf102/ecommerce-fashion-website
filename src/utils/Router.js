// Import các trang người dùng
import Homepage from '../pages/homepage/Homepage'
import ProductPage from '../pages/productpage/Productpage'
import ProductDetailPage from '../pages/productdetailpage/ProductDetailPage'
import NewsPage from '../pages/newspage/NewsPage'
import ContactsPage from '../pages/contactspage/ContactsPage'
import StoreAddressPage from '../pages/storeaddresspage/StoreAddressPage'
import Checkoutpage from '../pages/checkoutpage/Checkoutpage'
import { LoginPage, RegisterPage } from '../pages/authpage/AuthPage'
import UserPage from '../pages/userpage/UserPage'
import ChatAI from "../components/ChatAI"

// Import các trang Admin
import AdminLayout from '../pages/admin/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminProducts from '../pages/admin/AdminProducts'
import AdminOrders from '../pages/admin/AdminOrders'
import AdminUsers from '../pages/admin/AdminUsers'

const router = [
    // --- KHỐI NGƯỜI DÙNG (USER) ---
    {
        path: "/",
        element: <Homepage />
    },
    {
        path: "/shop/:category",
        element: <ProductPage />
    },
    {
        path: "/productdetail/:category/:id",
        element: <ProductDetailPage />
    },
    {
        path: "/news",
        element: <NewsPage />
    },
    {
        path: "/address",
        element: <StoreAddressPage />
    },
    {
        path: "/contacts",
        element: <ContactsPage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        path: "/checkout",
        element: <Checkoutpage />
    },
    {
        path: "/user/:feature",
        element: <UserPage />
    },
    {
        path: "/chat",
        element: <ChatAI />
    },

    // --- KHỐI QUẢN TRỊ (ADMIN) ---
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                path: "dashboard",
                element: <AdminDashboard />
            },
            {
                path: "products",
                element: <AdminProducts />
            },
            {
                path: "orders",
                element: <AdminOrders />
            },
            {
                path: "users",
                element: <AdminUsers />
            }
        ]
    }
]

export { router }