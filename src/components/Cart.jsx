import { useNavigate } from 'react-router-dom'
import { useContext } from 'react' // Dùng useContext thay vì useState reload
import { GlobalContext } from '../context/globalContext' // Import context
import trashIcon from '../assets/imgs/common/trash.png'
import './componentStyle/Cart.scss'

const Cart = ({ setCartControl }) => {
    const nav = useNavigate()
    
    // Lấy cart và hàm setCart từ Context để quản lý tập trung
    const { cart, setCart } = useContext(GlobalContext)

    const handlRemoveItem = (index) => {
        // Tạo một bản sao mới của giỏ hàng
        const newCart = [...cart]
        // Xóa phần tử tại vị trí index
        newCart.splice(index, 1)
        // Cập nhật lại Context (Context sẽ tự động lưu vào localStorage cho bạn)
        setCart(newCart)
    }

    // Tính tổng tiền an toàn
    const totalAmount = cart ? cart.reduce((total, item) => {
        // Lưu ý: Kiểm tra xem biến giá là item.price hay item.count
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 1;
        return total + (price * qty);
    }, 0) : 0;

    return (
        <section className="cart">
            <div className="coating pointer" onClick={() => setCartControl(false)} />
            {
                (!cart || cart.length === 0)
                ? 
                <div className="cart-detail">Giỏ hàng trống</div>
                :
                <div className="cart-detail">
                    <h2 className="cart-title">Đơn hàng của bạn</h2>
                    <div className="prod-list">
                        {
                            cart.map((data, index) => {
                                return (
                                    <div className="card" key={index}>
                                        <div className="card-img">
                                            <img src={data.img} alt="product" />
                                        </div>
                                        <div className="infor">
                                            <div className="title">
                                                <h4>{data.name || data.title}</h4>
                                            </div>
                                            <div className="des">
                                                <p className="size">
                                                    Size: <span>{data.size}</span>
                                                </p>
                                                <p className="quantity">
                                                    Số lượng: <span>{data.quantity}</span>
                                                </p>
                                            </div>
                                            <div className="icon-recycle-bin">
                                                <img 
                                                    src={trashIcon} 
                                                    alt="delete" 
                                                    className='pointer' 
                                                    onClick={() => handlRemoveItem(index)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="pay">
                        <p className="total">
                            Tổng tiền: <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
                        </p>
                        <div 
                            className="btn pointer unselect" 
                            onClick={() => {
                                setCartControl(false); 
                                nav('/checkout');
                            }}
                        >
                            Mua hàng
                        </div>
                    </div>
                </div>
            }
        </section>
    )
}

export default Cart;