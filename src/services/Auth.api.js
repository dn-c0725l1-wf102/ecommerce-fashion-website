// src/services/Auth.api.js

const url = "http://localhost:3005";

/**
 * Hàm hỗ trợ lấy Header chứa Token và UserID
 */
const getAuthHeaders = (customId = null) => {
    const id = customId || sessionStorage.getItem("userID") || localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "user-id": id 
    };
};

/**
 * Hàm xử lý Response chung
 */
async function handleResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Lỗi API (${response.status}):`, errorText);
        // Trả về null để phía Frontend biết là không thành công
        return null; 
    }
    return await response.json();
}

// 1. Đăng ký
async function registerAPI(data) {
    const res = await fetch(`${url}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return handleResponse(res);
}

// 2. Đăng nhập
async function loginAPI(data) {
    try {
        const res = await fetch(`${url}/users`);
        const users = await res.json();

        const user = users.find(u => u.username === data.username && u.password === data.password);

        if (user) {
            return {
                status: 201,
                message: "Đăng nhập thành công!",
                ObjectId: user.id
            };
        } else {
            return { status: 401, message: "Sai tên đăng nhập hoặc mật khẩu" };
        }
    } catch (error) {
        return { status: 500, message: "Lỗi hệ thống" };
    }
}

// 3. Lấy thông tin người dùng
async function getInfor(id) {
    try {
        const res = await fetch(`${url}/users/${id}`);
        if (res.ok) {
            const data = await res.json();
            return { data };
        }
        return null;
    } catch (error) {
        return null;
    }
}

// 4. CẬP NHẬT THÔNG TIN (ĐÃ SỬA LỖI 404)
async function updateInfor(id, data) {
    // PHẢI GỬI TỚI: /users/id thay vì /update
    const res = await fetch(`${url}/users/${id}`, {
        method: "PUT", // Sử dụng PUT để ghi đè hoặc PATCH để cập nhật một phần
        headers: getAuthHeaders(id),
        body: JSON.stringify(data)
    });
    
    const result = await handleResponse(res);
    if (result) {
        console.log("Cập nhật server thành công:", result);
    }
    return result;
}

// 5. LẤY DANH SÁCH ĐƠN HÀNG
async function getOrder() {
    const id = sessionStorage.getItem("userID") || localStorage.getItem("userId");
    try {
        const res = await fetch(`${url}/orders`);
        const allOrders = await res.json();
        
        // Lọc đúng đơn hàng của User đang đăng nhập
        const filtered = allOrders.filter(order => String(order.userId) === String(id));
        return filtered;
    } catch (error) {
        console.error("Lỗi getOrder:", error);
        return [];
    }
}

// 6. LƯU ĐƠN HÀNG
async function checkoutAPI(orderData) {
    const id = sessionStorage.getItem("userID") || localStorage.getItem("userId");
    
    const finalOrder = {
        ...orderData,
        id: Date.now().toString(),
        userId: id,
        orderDay: new Date().toISOString().split('T')[0],
        orderStatus: "complete",
        totalOrder: orderData.totalPrice || orderData.totalOrder
    };

    try {
        const res = await fetch(`${url}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalOrder)
        });
        
        if (res.ok) return await res.json();
    } catch (error) {
        console.error("Lỗi checkout:", error);
        return null;
    }
}

export { registerAPI, loginAPI, getInfor, updateInfor, checkoutAPI, getOrder };