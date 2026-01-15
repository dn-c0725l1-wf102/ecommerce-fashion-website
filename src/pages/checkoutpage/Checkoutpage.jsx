import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from "../../context/globalContext";
import { checkoutAPI } from '../../services/Auth.api'; // Import hàm đã chuẩn hóa

const CheckoutPage = () => {
    const nav = useNavigate();
    const { cart, clearCart } = useContext(GlobalContext);
    
    const [customer, setCustomer] = useState({
        fullName: '',
        phone: '',
        address: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);

    // 1. TÍNH TỔNG TIỀN
    const calculateTotal = () => {
        if (!cart || !Array.isArray(cart)) return 0;
        return cart.reduce((total, item) => {
            const itemTotal = Number(item.count) || (Number(item.price) * Number(item.quantity)) || 0;
            return total + itemTotal;
        }, 0);
    };

    const totalOrderValue = calculateTotal();

    const handleInputChange = (e) => {
        setCustomer({
            ...customer,
            [e.target.name]: e.target.value
        });
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        // Kiểm tra đầu vào
        if (!customer.fullName || !customer.phone || !customer.address) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng!");
            return;
        }

        if (!cart || cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }

        setLoading(true);

        // Chuẩn bị dữ liệu gửi đi (Payload)
        // Lưu ý: userId phải khớp với ID trong db.json/users
        const orderPayload = {
            userId: sessionStorage.getItem("userID") || localStorage.getItem('userId'),
            customerName: customer.fullName,
            phone: customer.phone,
            address: customer.address,
            email: customer.email,
            orderList: cart.map(item => ({
                id: item.id,
                name: item.title, 
                price: Number(item.price),
                quantity: Number(item.quantity),
                size: item.size,
                img: item.img 
            })),
            // Đồng bộ tên trường với UserPage (Dùng cả hai để tránh lỗi)
            totalOrder: totalOrderValue,
            totalPrice: totalOrderValue,
            orderStatus: "complete", 
            orderDate: new Date().toISOString()
        };

        try {
            // GỌI HÀM checkoutAPI TỪ Auth.api.js ĐỂ LƯU VÀO LOCALHOST:3005
            const response = await checkoutAPI(orderPayload);

            if (response) {
                alert("Chúc mừng! Bạn đã đặt hàng thành công.");
                clearCart(); 
                nav('/user/order'); // Chuyển hướng về trang danh sách đơn hàng
            } else {
                alert("Không thể lưu đơn hàng. Vui lòng kiểm tra lại kết nối Server!");
            }
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            alert("Lỗi hệ thống khi đặt hàng. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 'bold' }}>THANH TOÁN ĐƠN HÀNG</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
                
                {/* BÊN TRÁI: FORM NHẬP THÔNG TIN */}
                <form onSubmit={handleConfirmOrder} className="checkout-form">
                    <h3 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Thông tin nhận hàng</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="form-item">
                            <label style={{ display: 'block', marginBottom: '5px' }}>Họ và tên *</label>
                            <input 
                                style={{ padding: '12px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                                name="fullName" 
                                placeholder="Nhập họ tên người nhận" 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div className="form-item">
                            <label style={{ display: 'block', marginBottom: '5px' }}>Số điện thoại *</label>
                            <input 
                                style={{ padding: '12px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                                name="phone" 
                                type="tel"
                                placeholder="Số điện thoại liên lạc" 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div className="form-item">
                            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                            <input 
                                style={{ padding: '12px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                                name="email" 
                                type="email"
                                placeholder="Email nhận thông báo (nếu có)" 
                                onChange={handleInputChange} 
                            />
                        </div>
                        <div className="form-item">
                            <label style={{ display: 'block', marginBottom: '5px' }}>Địa chỉ giao hàng *</label>
                            <textarea 
                                style={{ padding: '12px', width: '100%', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px' }}
                                name="address" 
                                placeholder="Số nhà, tên đường, phường/xã, quận/huyện..." 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={{ 
                            marginTop: '30px', 
                            padding: '15px', 
                            width: '100%', 
                            backgroundColor: '#000', 
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.3s'
                        }}
                    >
                        {loading ? "ĐANG XỬ LÝ ĐƠN HÀNG..." : "XÁC NHẬN ĐẶT HÀNG"}
                    </button>
                </form>

                {/* BÊN PHẢI: TÓM TẮT ĐƠN HÀNG */}
                <div className="order-summary" style={{ padding: '25px', backgroundColor: '#fdfdfd', borderRadius: '8px', border: '1px solid #eee', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Đơn hàng của bạn</h3>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                        {cart && cart.map((item, index) => (
                            <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dotted #eee' }}>
                                <img 
                                    src={Array.isArray(item.img) ? item.img[0] : item.img} 
                                    alt={item.title} 
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>{item.title}</p>
                                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#888' }}>Size: {item.size} | SL: {item.quantity}</p>
                                    <p style={{ margin: 0, color: '#ee4d2d', fontWeight: 'bold' }}>
                                        {(Number(item.price) * item.quantity).toLocaleString('vi-VN')}đ
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div style={{ borderTop: '2px solid #333', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Tạm tính:</span>
                            <span>{totalOrderValue.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Phí vận chuyển:</span>
                            <span style={{ color: '#26aa99' }}>Miễn phí</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '20px', marginTop: '10px' }}>
                            <span>Tổng cộng:</span>
                            <span style={{ color: '#ee4d2d' }}>{totalOrderValue.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;