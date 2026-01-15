// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        orderCount: 0,
        productCount: 0,
        userCount: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            const [orders, products, users] = await Promise.all([
                axios.get("http://localhost:3005/orders"),
                axios.get("http://localhost:3005/products"),
                axios.get("http://localhost:3005/users")
            ]);

            // Tính tổng doanh thu từ các đơn hàng "complete"
            const revenue = orders.data
                .filter(o => o.orderStatus === 'complete')
                .reduce((total, o) => total + (Number(o.totalOrder) || 0), 0);

            setStats({
                totalRevenue: revenue,
                orderCount: orders.data.length,
                productCount: products.data.length,
                userCount: users.data.length
            });
        };
        fetchData();
    }, []);

    return (
        <div className="admin-dashboard">
            <h2 className="mb-4">Tổng quan hệ thống</h2>
            <div className="stats-grid">
                <div className="stat-card revenue">
                    <div className="stat-info">
                        <p>Tổng doanh thu</p>
                        <h3>{stats.totalRevenue.toLocaleString()}đ</h3>
                    </div>
                    <div className="stat-icon">💰</div>
                </div>
                <div className="stat-card orders">
                    <div className="stat-info">
                        <p>Đơn hàng</p>
                        <h3>{stats.orderCount}</h3>
                    </div>
                    <div className="stat-icon">📦</div>
                </div>
                <div className="stat-card products">
                    <div className="stat-info">
                        <p>Sản phẩm</p>
                        <h3>{stats.productCount}</h3>
                    </div>
                    <div className="stat-icon">👟</div>
                </div>
                <div className="stat-card users">
                    <div className="stat-info">
                        <p>Thành viên</p>
                        <h3>{stats.userCount}</h3>
                    </div>
                    <div className="stat-icon">👥</div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;