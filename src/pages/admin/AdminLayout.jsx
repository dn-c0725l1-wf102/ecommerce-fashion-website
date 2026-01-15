// src/pages/admin/AdminLayout.jsx
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './admin.scss';

const AdminLayout = () => {
    const nav = useNavigate();

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
            <aside className="admin-sidebar" style={{ width: '250px', background: '#1a1a2e', color: '#fff', padding: '20px' }}>
                <h2 style={{ color: '#e94560', marginBottom: '30px' }}>HAL ADMIN</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ padding: '12px 0' }}><Link to="/admin/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>📊 Tổng quan</Link></li>
                    <li style={{ padding: '12px 0' }}><Link to="/admin/products" style={{ color: '#fff', textDecoration: 'none' }}>📦 Sản phẩm</Link></li>
                    <li style={{ padding: '12px 0' }}><Link to="/admin/orders" style={{ color: '#fff', textDecoration: 'none' }}>🧾 Đơn hàng</Link></li>
                    <li style={{ padding: '12px 0' }}><Link to="/admin/users" style={{ color: '#fff', textDecoration: 'none' }}>👥 Người dùng</Link></li>
                    <li style={{ padding: '12px 0', marginTop: '40px', borderTop: '1px solid #333' }}>
                        <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>🏠 Về trang web</Link>
                    </li>
                </ul>
            </aside>
            
            <main className="admin-main" style={{ flex: 1, background: '#f4f7fe', padding: '30px' }}>
                <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Bảng điều khiển</h2>
                    <div className="admin-user">Admin 👤</div>
                </header>
                <div className="admin-content">
                    <Outlet /> {/* NƠI HIỂN THỊ CÁC TRANG CON */}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;