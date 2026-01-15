import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlobalContext } from "../../context/globalContext";
import { registerAPI, loginAPI } from "../../services/Auth.api";
import { auth, googleProvider, signInWithPopup } from "../../services/firebase"; 
import googleIcon from '../../assets/imgs/common/search.png';
import axios from "axios"; // Đảm bảo đã cài axios: npm install axios
import './authpage.scss';

const DB_URL = "http://localhost:3005/users";

const LoginPage = () => {
    const nav = useNavigate();
    const { getUserID } = useContext(GlobalContext);
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
        loading: false
    });

    // Hàm lưu/cập nhật user vào db.json
    const saveUserToDb = async (userData) => {
        try {
            // Kiểm tra xem user đã tồn tại trong db.json chưa
            const res = await axios.get(`${DB_URL}?id=${userData.id}`);
            if (res.data.length === 0) {
                // Nếu chưa có thì tạo mới
                await axios.post(DB_URL, userData);
                console.log("Đã lưu user mới vào database");
            }
        } catch (error) {
            console.error("Lỗi lưu user vào database:", error);
        }
    };

    async function login() {
        let response = await loginAPI({ username: loginData.username, password: loginData.password });
        if (response.status === 201 || response.id) { // Tùy vào API của bạn trả về status nào
            const uid = response.id || response.ObjectId;
            sessionStorage.setItem('userID', uid);
            getUserID();
            alert("Đăng nhập thành công!");
            nav('/');
        } else {
            alert(response.message || "Sai thông tin đăng nhập");
            setLoginData({ ...loginData, loading: false });
        }
    }

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Chuẩn bị dữ liệu để lưu vào db.json
            const userData = {
                id: user.uid,
                username: user.email.split('@')[0],
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                role: "user"
            };

            await saveUserToDb(userData); // Lưu vào db.json

            sessionStorage.setItem('userID', user.uid);
            getUserID();
            alert(`Chào mừng ${user.displayName}!`);
            nav('/');
        } catch (error) {
            console.error("Lỗi Google Login:", error);
            alert("Đăng nhập Google thất bại!");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoginData({ ...loginData, loading: true });
        login();
    };

    if (loginData.loading) return <div className="contain-auth"><div>Đang xử lý...</div></div>;

    return (
        <div className="contain-auth">
            <p className="title-login">HAL BOUTIQUE</p>
            <form className="login" onSubmit={handleSubmit}>
                <label>Tên đăng nhập:</label>
                <input type="text" onChange={(e) => setLoginData({...loginData, username: e.target.value})} required />
                <label>Mật khẩu:</label>
                <input type="password" onChange={(e) => setLoginData({...loginData, password: e.target.value})} required />
                <button className="btn-login pointer" type="submit">Đăng Nhập</button>
                <div className="divider"><span>Hoặc</span></div>
                <div className="login-2nd">
                    <div className="google-btn pointer" onClick={handleGoogleLogin}>
                        <img src={googleIcon} alt="gg" width="20"/>
                        <span>Tiếp tục với Google</span>
                    </div>
                </div>
                <div className="go-to-register">
                    <p>Chưa có tài khoản?</p> <Link to="/register">Đăng kí ngay</Link>
                </div>
            </form>
        </div>
    );
};

const RegisterPage = () => {
    const nav = useNavigate();
    const [regData, setRegData] = useState({
        username: "",
        password: "",
        email: "",
        name: ""
    });

    const handleRegister = async (e) => {
        e.preventDefault();
        const newUser = {
            id: Date.now().toString(), // Tạo ID giả cho JSON Server
            ...regData,
            avatar: "https://placehold.co/150",
            role: "user"
        };

        try {
            // Gửi dữ liệu đăng ký vào db.json/users
            await axios.post(DB_URL, newUser);
            alert("Đăng ký thành công! Hãy đăng nhập.");
            nav('/login');
        } catch (error) {
            alert("Lỗi đăng ký, vui lòng thử lại!");
        }
    };

    return (
        <div className="contain-auth">
            <p className="title-register">Đăng Ký Tài Khoản</p>
            <form className="login" onSubmit={handleRegister}>
                <label>Tên hiển thị:</label>
                <input type="text" onChange={(e) => setRegData({...regData, name: e.target.value})} required />
                <label>Tên đăng nhập:</label>
                <input type="text" onChange={(e) => setRegData({...regData, username: e.target.value})} required />
                <label>Email:</label>
                <input type="email" onChange={(e) => setRegData({...regData, email: e.target.value})} required />
                <label>Mật khẩu:</label>
                <input type="password" onChange={(e) => setRegData({...regData, password: e.target.value})} required />
                <button className="btn-login pointer" type="submit">Đăng Ký</button>
                <div className="go-to-login">
                    <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                </div>
            </form>
        </div>
    );
};

export { LoginPage, RegisterPage };