// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Import các thành phần giao diện
import Header from './components/Header'
import Footer from './components/Footer'
import ChatAI from './components/ChatAI' 

// Import các cấu hình và context
import { GlobalProvider } from './context/globalContext'
import { router } from './utils/Router'

// Import CSS
import './assets/g-style/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GlobalProvider>
      {/* LƯU Ý: Header và Footer đặt ở đây sẽ xuất hiện ở TẤT CẢ các trang, 
        kể cả trang Admin. 
      */}
      <Header />
      
      <Routes>
        {
          router.map((value, index) => {
            // Trường hợp 1: Route có các trang con (Ví dụ: /admin)
            if (value.children) {
              return (
                <Route 
                  path={value.path} 
                  element={value.element} // <AdminLayout />
                  key={index}
                >
                  {value.children.map((child, childIndex) => (
                    <Route 
                      key={childIndex} 
                      path={child.path} // dashboard, products, ...
                      element={child.element} // <AdminDashboard />, ...
                    />
                  ))}
                </Route>
              )
            }

            // Trường hợp 2: Route đơn bình thường (Ví dụ: /, /login, /shop)
            return (
              <Route 
                path={value.path} 
                element={value.element} 
                key={index} 
              />
            )
          })
        }
      </Routes>

      <ChatAI />
      <Footer />
    </GlobalProvider>
  </BrowserRouter>
)