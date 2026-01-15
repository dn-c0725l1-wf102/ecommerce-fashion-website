import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import ProductCard from '../../components/ProductCard'
import { productDetail, suggestListProduct } from '../../services/products.api'
import { GlobalContext } from '../../context/globalContext' // Import Context

import cartIcon from '../../assets/imgs/common/cart-icon.png' 
import greenStar from '../../assets/imgs/common/green-star.png' 
import returnIcon from '../../assets/imgs/common/return-icon.png' 
import shipIcon from '../../assets/imgs/common/ship-icon.png' 
import './productdetailpage.scss'

const ProductDetailPage = () => {
    const nav = useNavigate()
    const { category, id } = useParams()
    
    // Sử dụng Context để quản lý giỏ hàng
    const { cart, setCart } = useContext(GlobalContext)
    
    const [data, setData] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [prodSize, setProdSize] = useState('S')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setLoading(true)
        
        async function getData() {
            try {
                const prodData = await productDetail(id)
                const prodSuggest = await suggestListProduct(category, id)
                setData({ 
                    prodData: prodData.data, 
                    prodSuggest: prodSuggest.data 
                })
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error)
            } finally {
                setLoading(false)
            }
        }
        getData()
        setQuantity(1)
        setProdSize('S')
    }, [id, category])

    const handleChangeQuantity = (num) => {
        let newQuantity = num + quantity
        if (newQuantity <= 0 || newQuantity > data?.prodData?.warehouse) {
            alert("Số lượng không hợp lệ hoặc vượt quá kho hàng")
            return
        }
        setQuantity(newQuantity)
    }

    const handleAddToCart = () => {
        if (!data?.prodData) return;

        // Tạo bản sao của giỏ hàng hiện tại
        let currentCart = [...cart]
        
        // Kiểm tra xem sản phẩm cùng ID và cùng Size đã có chưa
        const findIndex = currentCart.findIndex(item => 
            item.id === data.prodData._id && item.size === prodSize
        )

        if (findIndex !== -1) {
            // Nếu có rồi: Tăng số lượng và cập nhật tổng tiền (count)
            currentCart[findIndex].quantity += Number(quantity)
            currentCart[findIndex].count = currentCart[findIndex].quantity * Number(data.prodData.price)
        } else {
            // Nếu chưa có: Thêm sản phẩm mới vào đầu mảng
            const newProd = {
                "id": data.prodData._id,
                "img": Array.isArray(data.prodData.img) ? data.prodData.img[0] : data.prodData.img,
                "title": data.prodData.title,
                "size": prodSize,
                "quantity": Number(quantity),
                "price": Number(data.prodData.price),
                "count": Number(quantity) * Number(data.prodData.price)
            }
            currentCart.unshift(newProd)
        }

        // Cập nhật lên GlobalContext (Tự động cập nhật UI và localStorage)
        setCart(currentCart)
        alert(`Đã thêm "${data.prodData.title}" (Size ${prodSize}) vào giỏ hàng!`)
    }

    const handleClickBuy = () => {
        handleAddToCart()
        nav('/checkout')
    }

    // Hiển thị giao diện Loading khi chưa có dữ liệu
    if (loading || !data) {
        return (
            <main className="productpage">
                <div className="api-loading" style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    Đang tải sản phẩm...
                </div>
            </main>
        )
    }

    return (
        <main className="productpage">
            <section className="productpage_path">
                <p>{`Trang chủ / Sản phẩm / ${data?.prodData?.title}`}</p>
            </section>

            <section className="productpage_prod-detail">
                <div className="prod-img unselect">
                    <div className="img-list">
                        {/* Render danh sách ảnh nếu có */}
                        {Array.isArray(data?.prodData?.img) ? data.prodData.img.map((img, i) => (
                            <img key={i} src={img} alt="hal boutique" className='img' />
                        )) : <img src={data?.prodData?.img} alt="hal boutique" className='img' />}
                    </div>
                    <div className="main-img">
                        <img src={Array.isArray(data?.prodData?.img) ? data.prodData.img[0] : data.prodData.img} alt="hal boutique" />
                    </div>
                </div>

                <div className="prod-infor">
                    <h3 className='title'>{data?.prodData?.title}</h3>
                    <h4 className='id'>Mã sản phẩm: {id}</h4>
                    <p className="price">
                        {data?.prodData?.price?.toLocaleString('vi-VN')} đ
                    </p>

                    <div className="size unselect">
                        <p>Chọn size: </p>
                        {data?.prodData?.size?.map((size, index) => (
                            <div key={index} style={{ display: 'inline-block', marginRight: '10px' }}>
                                <input 
                                    id={'size' + index} 
                                    name='size' 
                                    type="radio" 
                                    onChange={() => setProdSize(size)} 
                                    checked={prodSize === size} 
                                />
                                <label htmlFor={'size' + index}>{size}</label>
                            </div>
                        ))}
                    </div>

                    <p className="warehouse unselect">Số lượng trong kho: <b>{data?.prodData?.warehouse}</b></p>

                    <div className="set-quantity-cart unselect">
                        <p className="setquantity">
                            <span className='btn pointer' onClick={() => handleChangeQuantity(-1)}> - </span>
                            <span className='num'> {quantity} </span>
                            <span className='btn pointer' onClick={() => handleChangeQuantity(1)}> + </span>
                        </p>
                        <div className="set-btn set-cart pointer unselect" onClick={handleAddToCart} title="Thêm vào giỏ">
                            <img src={cartIcon} alt="Add to cart" />
                        </div>
                        <div className="set-btn set-buy pointer unselect" onClick={handleClickBuy}>Mua Ngay</div>
                    </div>

                    <div className="services">
                        <div className="services_child">
                            <img src={greenStar} alt="hal boutique" />
                            <p>
                                <b>Miễn phí vận chuyển</b>
                                <span>Đơn hàng từ 299k</span>
                            </p>
                        </div>
                        <div className="services_child">
                            <img src={shipIcon} alt="hal boutique" />
                            <p>
                                <b>Giao hàng nhanh</b>
                                <span>Từ 2 - 5 ngày</span>
                            </p>
                        </div>
                        <div className="services_child">
                            <img src={returnIcon} alt="hal boutique" />
                            <p>
                                <b>Đổi trả linh hoạt</b>
                                <span>Trong vòng 7 ngày</span>
                            </p>
                        </div>
                    </div>

                    <p className="policy unselect">
                        - Hàng mua Online được đổi ở tất cả các chi nhánh thuộc hệ thống Hal Boutique...<br />
                        - Hàng đổi phải còn nguyên tem mác, chưa qua sử dụng...
                    </p>
                </div>
            </section>

            <section className="productpage_list">
                <h3 className="title">Sản phẩm liên quan</h3>
                <div className="list">
                    {data?.prodSuggest?.map((prod, index) => (
                        <ProductCard id={prod._id || prod} key={index} />
                    ))}
                </div>
            </section>
        </main>
    )
}

export default ProductDetailPage;