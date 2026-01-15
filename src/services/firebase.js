import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Thêm dòng này

// Cấu hình của bạn giữ nguyên
const firebaseConfig = {
  apiKey: "AIzaSyDiNpmmMkMRbYySUAj11UdD71CYeS0DyPI",
  authDomain: "banquanao-3b0a8.firebaseapp.com",
  projectId: "banquanao-3b0a8",
  storageBucket: "banquanao-3b0a8.firebasestorage.app",
  messagingSenderId: "811512208709",
  appId: "1:811512208709:web:f3ead2374e50e1a0bef22c",
  measurementId: "G-S2TFZ8NMMY"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// --- PHẦN QUAN TRỌNG ĐỂ HẾT LỖI ---
// Xuất các biến này để AuthPage.jsx có thể import vào sử dụng
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup };