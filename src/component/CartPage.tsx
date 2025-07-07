import React from 'react';
import { useShoppingContext } from "../contexts/ShoppingContext";
import { CartItem } from "./CartItem";
import { Link } from "react-router-dom";
import '../style/CartPage.css'

const CartPage = () => {
    const { cartItems, totalPrice } = useShoppingContext();

    return (
        <div className="cart-page">
            <h1>Giỏ Hàng Của Bạn</h1>
            {cartItems.length === 0 ? (
                <p>Giỏ hàng của bạn đang trống. Hãy thêm sản phẩm để xem ở đây.</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <CartItem key={item.id} {...item} />
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>Tổng cộng: {Number(totalPrice).toLocaleString('vi-VN')}đ</h2>
                        <Link to="/checkout" className="btn-checkout">Thanh toán</Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
