import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OrderItem from './OrderItem'
import { GlobalContext } from '../../context/globalContext' 
import { getInfor, updateInfor, getOrder } from '../../services/Auth.api'
import { auth } from '../../services/firebase' 
import { onAuthStateChanged, signOut } from "firebase/auth"
import './userpage.scss'

const UserPage = () => {
    const nav = useNavigate()
    const { feature } = useParams()
    
    const [board, setBoard] = useState('profile')
    const [orderList, setOrderList] = useState([])
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isGoogleUser, setIsGoogleUser] = useState(false)
    
    // Lấy ID từ session ngay từ đầu
    const currentLocalID = sessionStorage.getItem("userID") || localStorage.getItem("userId");

    useEffect(() => {
        setBoard(feature || 'profile')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        
        // Theo dõi trạng thái đăng nhập
        const unsubscribe = onAuthStateChanged(auth, async (googleUser) => {
            if (currentLocalID) {
                // TRƯỜNG HỢP 1: Đăng nhập bằng tài khoản thường (ƯU TIÊN)
                setIsGoogleUser(false)
                if (feature === 'profile') fetchProfile(currentLocalID)
            } else if (googleUser) {
                // TRƯỜNG HỢP 2: Đăng nhập bằng Google
                setIsGoogleUser(true)
                if (feature === 'profile') fetchProfile(googleUser.uid, googleUser)
            } else {
                // TRƯỜNG HỢP 3: Không có ai đăng nhập
                nav('/login')
            }
        })

        if (feature === 'order') {
            getOrderList()
        }

        return () => unsubscribe()
    }, [feature, nav, currentLocalID])

    // Hàm lấy thông tin hồ sơ
    async function fetchProfile(uid, googleObj = null) {
        setLoading(true)
        try {
            // Luôn ưu tiên lấy dữ liệu từ db.json trước
            const response = await getInfor(uid)
            
            if (response && response.data) {
                setUserData(response.data)
            } else if (googleObj) {
                // Nếu là Google User mới chưa có trong db.json
                setUserData({
                    username: googleObj.displayName || "Google User",
                    name: googleObj.displayName,
                    email: googleObj.email,
                    avatar: googleObj.photoURL,
                    phoneNumber: "",
                    birthday: "",
                    sex: null
                })
            }
        } catch (error) {
            console.error("Lỗi khi tải profile:", error)
        } finally {
            setLoading(false)
        }
    }

    async function getOrderList() {
        setLoading(true);
        try {
            const res = await getOrder();
            // Lọc đơn hàng chỉ của User hiện tại
            const uid = currentLocalID || auth.currentUser?.uid;
            const allOrders = Array.isArray(res) ? res : [];
            const userOrders = allOrders.filter(order => order.userId === uid);
            
            setOrderList([...userOrders].reverse());
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
            setOrderList([]);
        } finally {
            setLoading(false);
        }
    }

    const handleChangeUserData = (key, value) => {
        if (key === 'avatar') {
            const reader = new FileReader();
            reader.onloadend = () => setUserData({ ...userData, avatar: reader.result })
            reader.readAsDataURL(value);
            return
        }
        setUserData({ ...userData, [key]: value })
    }

    async function handleSaveInfor(e) {
        e.preventDefault()
        setLoading(true)
        try {
            const uid = currentLocalID || auth.currentUser?.uid;
            await updateInfor(uid, userData)
            alert("Cập nhật thông tin thành công!")
        } catch (error) {
            alert("Lỗi khi lưu thông tin!")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await signOut(auth); // Thoát Google
        sessionStorage.clear();
        localStorage.removeItem("userId");
        nav('/login');
    }

    const goToPath = (url) => nav(url)

    return (
        <main className="userpage">
            <aside className="sidebar">
                <div className="sidebar_avt">
                    <img src={userData?.avatar || 'https://placehold.co/150'} alt="avt" className="sidebar_avt_img" />
                    <div className="sidebar_avt_username">
                        <p>{userData?.name || userData?.username || "Thành viên"}</p>
                        <p onClick={() => goToPath('/user/profile')} className="edit-link">Sửa hồ sơ</p>
                    </div>
                </div>
                <nav className="sidebar_nav">
                    <ul>
                        <li className={board === 'profile' ? 'active' : ''} onClick={() => goToPath('/user/profile')}>
                             Tài khoản của tôi
                        </li>
                        <ul className="sidebar_nav_list">
                            <li onClick={() => goToPath('/user/profile')} style={{color: board === 'profile' ? '#ee4d2d' : ''}}>Hồ sơ</li>
                            <li style={{cursor: 'pointer'}}>Ngân Hàng</li>
                            <li style={{cursor: 'pointer'}}>Địa Chỉ</li>
                        </ul>
                        <li className={board === 'order' ? 'active' : ''} onClick={() => goToPath('/user/order')}>Đơn Mua</li>
                        <li onClick={handleLogout} style={{color: 'red', cursor: 'pointer', marginTop: '20px'}}>Đăng xuất</li>
                    </ul>
                </nav>
            </aside>

            <section className="board">
                {loading && <div className="loading-overlay">Đang tải...</div>}
                
                {board === 'profile' && (
                    <div className="profile">
                        <div className="profile_header">
                            <p className='title'>Hồ Sơ Của Tôi</p>
                            <p className='subtitle'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                        </div>
                        <form className="profile_form" onSubmit={handleSaveInfor}>
                            <div className="input-group">
                                <div className="label-list">
                                    <label>Tên đăng nhập</label>
                                    <label>Tên</label>
                                    <label>Email</label>
                                    <label>Số điện thoại</label>
                                    <label>Ngày sinh</label>
                                    <label>Giới tính</label>
                                </div>
                                <div className="input-list">
                                    <p className="username-display">{userData?.username || "N/A"}</p>
                                    <input type="text" value={userData?.name || ""} onChange={(e) => handleChangeUserData('name', e.target.value)} />
                                    <input type="email" value={userData?.email || ""} readOnly style={{backgroundColor: '#f5f5f5'}} />
                                    <input type="tel" value={userData?.phoneNumber || ""} onChange={(e) => handleChangeUserData('phoneNumber', e.target.value)} />
                                    <input type="date" value={userData?.birthday || ""} onChange={(e) => handleChangeUserData('birthday', e.target.value)} />
                                    <div className="sex-options">
                                        <label><input type="radio" name="sex" checked={userData?.sex === "male"} onChange={() => handleChangeUserData('sex', 'male')} /> Nam</label>
                                        <label><input type="radio" name="sex" checked={userData?.sex === "female"} onChange={() => handleChangeUserData('sex', 'female')} /> Nữ</label>
                                    </div>
                                    <button className="btn-save pointer" type="submit" disabled={loading}>Lưu thay đổi</button>
                                </div>
                            </div>
                            <div className="infor_avt">
                                <div className="avt-preview" style={{ backgroundImage: `url(${userData?.avatar || 'https://placehold.co/150'})` }}></div>
                                <input type="file" id="avt-upload" hidden onChange={(e) => handleChangeUserData('avatar', e.target.files[0])} />
                                <label htmlFor="avt-upload" className="btn-upload pointer">Chọn Ảnh</label>
                            </div>
                        </form>
                    </div>
                )}

                {board === 'order' && (
                    <div className="order">
                        <p className="order_title">Danh sách đơn mua</p>
                        <div className="order_list">
                            {orderList.length > 0 ? (
                                orderList.map((order, index) => (
                                    <div className="order_list_item" key={order.id || index} style={{ marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '4px', border: '1px solid #eee' }}>
                                        <div className="order_list_item_header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '10px' }}>
                                            <p className="order-id" style={{fontWeight: 'bold'}}>Mã đơn: #{String(order.id).slice(-6).toUpperCase()}</p>
                                            <span className="order-status" style={{color: '#26aa99'}}>{order.orderStatus?.toUpperCase() || "HOÀN THÀNH"}</span>
                                        </div>
                                        <div className="order_list_item_list">
                                            {order.orderList?.map((product, idx) => (
                                                <OrderItem item={product} key={idx} />
                                            ))}
                                        </div>
                                        <div className="order_list_item_footer" style={{ textAlign: 'right', marginTop: '15px', borderTop: '1px solid #f0f0f0', paddingTop: '10px' }}>
                                            <p style={{fontSize: '16px'}}>Tổng số tiền: <span className='price' style={{color: '#ee4d2d', fontWeight: 'bold', fontSize: '22px'}}>
                                                {(Number(order.totalOrder || order.totalPrice) || 0).toLocaleString('vi-VN')}đ
                                            </span></p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state" style={{ textAlign: 'center', padding: '80px 0', backgroundColor: '#fff' }}>
                                    <p style={{color: '#888'}}>Bạn chưa có đơn hàng nào.</p>
                                    <button onClick={() => nav('/')} style={{marginTop: '15px', padding: '10px 20px', backgroundColor: '#ee4d2d', color: '#fff', border: 'none', cursor: 'pointer'}}>Mua sắm ngay</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}

export default UserPage;