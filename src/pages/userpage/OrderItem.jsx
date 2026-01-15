import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productDetail } from '../../services/products.api';
import { menu } from '../../components/headerData';

function OrderItem({ item, index }) {
    const nav = useNavigate();
    const [data, setData] = useState(null);

    // 1. Hàm lấy dữ liệu bổ sung (Chỉ chạy nếu dữ liệu trong đơn hàng bị thiếu)
    useEffect(() => {
        async function getData() {
            try {
                // Nếu item không có đủ thông tin (name/img) thì mới gọi API
                if (!item.name || !item.img) {
                    const res = await productDetail(item.id || item._id);
                    if (res && res.data) {
                        setData(res.data);
                    }
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin sản phẩm đơn hàng:", error);
            }
        }
        getData();
    }, [item.id, item._id]);

    // 2. Xác định các trường dữ liệu hiển thị (Ưu tiên item > data)
    const displayTitle = item.name || item.title || data?.title || "Sản phẩm";
    const displayImg = item.img || item.image || data?.img || data?.image;
    const displayPrice = Number(item.price) || Number(data?.price) || 0;
    const quantity = Number(item.quantity) || 1;

    // 3. Xử lý điều hướng thông minh dựa trên file menu
    const goToProduct = () => {
        // Tìm danh mục từ dữ liệu menu
        let categoryPath = 'all'; 
        
        // Nếu item có category, tìm path tương ứng trong menu
        if (item.category) {
            const found = menu.find(m => m.category.toLowerCase() === item.category.toLowerCase());
            if (found) categoryPath = found.path;
        } else if (data?.category) {
            const found = menu.find(m => m.category.toLowerCase() === data.category.toLowerCase());
            if (found) categoryPath = found.path;
        }

        nav(`/productdetail/${categoryPath}/${item.id || item._id}`);
    };

    // 4. Xử lý ảnh lỗi
    const handleImageError = (e) => {
        e.target.src = "https://placehold.co/100x100?text=HAL+Boutique";
    };

    return (
        <div className='item' key={index} onClick={goToProduct} style={{ 
            cursor: 'pointer',
            display: 'flex',
            padding: '12px 0',
            borderBottom: '1px solid #f0f0f0',
            alignItems: 'center'
        }}>
            <div className="item_left">
                <img 
                    src={Array.isArray(displayImg) ? displayImg[0] : displayImg} 
                    onError={handleImageError}
                    alt={displayTitle} 
                    style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        border: '1px solid #eee'
                    }}
                />
            </div>
            
            <div className="infor" style={{ flex: 1, paddingLeft: '15px' }}>
                <p className="infor_name" style={{ 
                    fontWeight: '500', 
                    fontSize: '14px',
                    marginBottom: '4px',
                    color: '#333'
                }}>
                    {displayTitle}
                </p>
                <div className="infor_detail" style={{ color: '#888', fontSize: '12px' }}>
                    <span>Phân loại: {item?.size || 'Free Size'}</span>
                    <br />
                    <span>Số lượng: x{quantity}</span>
                </div>
                <div className="infor_badge" style={{ marginTop: '6px' }}>
                    <span style={{ 
                        border: '1px solid #26aa99', 
                        color: '#26aa99', 
                        padding: '1px 4px', 
                        fontSize: '10px',
                        borderRadius: '2px'
                    }}>
                        15 ngày trả hàng
                    </span>
                </div>
            </div>

            <div className='item_right' style={{ textAlign: 'right', minWidth: '100px' }}>
                <p className='price' style={{ color: '#ee4d2d', fontWeight: '500' }}>
                    {displayPrice.toLocaleString('vi-VN')}đ
                </p>
                {quantity > 1 && (
                    <p style={{ fontSize: '11px', color: '#999', textDecoration: 'none' }}>
                        Tổng: {(displayPrice * quantity).toLocaleString('vi-VN')}đ
                    </p>
                )}
            </div>
        </div>
    );
}

export default OrderItem;