// src/pages/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3005/users").then(res => setUsers(res.data));
    }, []);

    return (
        <div className="admin-box" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
            <h3>Danh sách thành viên</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {users.map(user => (
                    <div key={user.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img src={user.avatar || 'https://placehold.co/50'} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                        <div>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{user.name || user.username}</p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{user.email}</p>
                            <span style={{ fontSize: '10px', background: '#eee', padding: '2px 5px' }}>{user.role || 'user'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminUsers;