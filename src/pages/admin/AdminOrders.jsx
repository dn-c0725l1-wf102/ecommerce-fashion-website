// src/pages/admin/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const res = await axios.get("http://localhost:3005/orders");
        setOrders(res.data.reverse()); // Đơn mới nhất lên đầu
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:3005/orders/${orderId}`, {
                orderStatus: newStatus
            });
            alert("Cập nhật trạng thái thành công!");
            fetchOrders();
        } catch (error) {
            alert("Lỗi cập nhật!");
        }
    };

    return (
        <div className="admin-box" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
            <h3>Quản lý đơn hàng</h3>
            <table width="100%" style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                        <th style={{ padding: '10px' }}>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Sản phẩm</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px 10px' }}>#{order.id}</td>
                            <td>
                                <strong>{order.customerName}</strong><br/>
                                <small>{order.phone}</small>
                            </td>
                            <td>{order.orderList?.length} món</td>
                            <td style={{ color: '#ee4d2d', fontWeight: 'bold' }}>
                                {(order.totalOrder || 0).toLocaleString()}đ
                            </td>
                            <td>
                                <span style={{ 
                                    padding: '4px 8px', 
                                    borderRadius: '4px', 
                                    fontSize: '12px',
                                    background: order.orderStatus === 'complete' ? '#e6fffb' : '#fff7e6',
                                    color: order.orderStatus === 'complete' ? '#08979c' : '#d46b08'
                                }}>
                                    {order.orderStatus}
                                </span>
                            </td>
                            <td>
                                <select 
                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                    value={order.orderStatus}
                                    style={{ padding: '5px', borderRadius: '4px' }}
                                >
                                    <option value="pending">Đang xử lý</option>
                                    <option value="shipping">Đang giao</option>
                                    <option value="complete">Hoàn thành</option>
                                    <option value="cancel">Hủy đơn</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;