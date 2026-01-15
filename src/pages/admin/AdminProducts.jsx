import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge } from 'react-bootstrap';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // API URL trỏ đến cổng 3005 và Endpoint products
    const API_URL = "http://localhost:3005/products";
    
    const placeholderImg = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22150%22%20height%3D%22150%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20150%20150%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23eeeeee%22%3E%3C%2Frect%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%23aaaaaa%22%20dy%3D%22.3em%22%20text-anchor%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

    // Lấy dữ liệu khi vào trang
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Lỗi kết nối cổng 3005:", err));
    }, []);

    // Xử lý Lưu (Thêm/Sửa) trực tiếp vào db.json
    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const productData = {
            title: formData.get('title'),
            price: Number(formData.get('price')),
            warehouse: Number(formData.get('warehouse')),
            category: formData.get('category') || "general",
            img: formData.get('imgUrl') ? [formData.get('imgUrl')] : (currentProduct?.img || [placeholderImg])
        };

        try {
            let response;
            if (currentProduct) {
                // SỬA (PUT)
                response = await fetch(`${API_URL}/${currentProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            } else {
                // THÊM MỚI (POST) - ID sẽ được JSON Server tự tạo
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            }

            if (response.ok) {
                const result = await response.json();
                // Cập nhật lại giao diện ngay lập tức
                if (currentProduct) {
                    setProducts(products.map(p => p.id === currentProduct.id ? result : p));
                } else {
                    setProducts([...products, result]);
                }
                setShowModal(false);
            }
        } catch (error) {
            alert("Không thể ghi vào file db.json!");
        }
    };

    // Xử lý Xóa khỏi db.json
    const handleDelete = async (id) => {
        if (window.confirm("Xóa vĩnh viễn khỏi db.json?")) {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            setProducts(products.filter(p => p.id !== id));
        }
    };

    return (
        <div className="container p-4">
            <div className="d-flex justify-content-between mb-4 shadow-sm p-3 bg-white rounded">
                <h3 className="fw-bold">Quản Lý Sản Phẩm (JSON Server 3005)</h3>
                <Button variant="success" onClick={() => { setCurrentProduct(null); setShowModal(true); }}>
                    + Thêm mới
                </Button>
            </div>

            <Table striped bordered hover className="bg-white">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Ảnh</th>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th>Kho</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><img src={item.img[0]} alt="" width="50" height="50" style={{objectFit:'cover'}} /></td>
                            <td>{item.title}</td>
                            <td className="text-danger fw-bold">{Number(item.price).toLocaleString()}đ</td>
                            <td><Badge bg="info">{item.warehouse}</Badge></td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => { setCurrentProduct(item); setShowModal(true); }}>Sửa</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>Xóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Form onSubmit={handleSave}>
                    <Modal.Header closeButton>
                        <Modal.Title>{currentProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>Tên sản phẩm</Form.Label>
                            <Form.Control name="title" defaultValue={currentProduct?.title} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Giá bán</Form.Label>
                            <Form.Control name="price" type="number" defaultValue={currentProduct?.price} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Số lượng kho</Form.Label>
                            <Form.Control name="warehouse" type="number" defaultValue={currentProduct?.warehouse} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>URL Hình ảnh</Form.Label>
                            <Form.Control name="imgUrl" defaultValue={currentProduct?.img?.[0]} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">Lưu vào db.json</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminProducts;