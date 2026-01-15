import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [ctUserID, setCtUserID] = useState(sessionStorage.getItem("userID"));
    
    // Khởi tạo giỏ hàng từ localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return (savedCart && savedCart !== "undefined") ? JSON.parse(savedCart) : [];
    });

    // Tự động lưu vào máy mỗi khi giỏ hàng thay đổi
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function getUserID() {
        setCtUserID(sessionStorage.getItem("userID"));
    }

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    const value = {
        ctUserID,
        getUserID,
        cart,
        setCart,
        clearCart
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};