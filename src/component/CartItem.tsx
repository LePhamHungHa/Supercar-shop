import React from "react";
import { useShoppingContext } from "../contexts/ShoppingContext";

type CartItemProps = {
    id: string;
    name: string;
    price: number;
    qty: number;
    imgUrl: string;
}

export const CartItem = ({ id, name, price, qty, imgUrl }: CartItemProps) => {
    const { increaseQty, decreaseQty, removeCartItem } = useShoppingContext();

    const formattedPrice = (price * qty).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    return (
        <div className="item-cart">
            <div className="img-prd">
                <img src={imgUrl} alt={name} />
            </div>
            <div className="name-prd">
                <h6>{name}</h6>
            </div>
            <div className="quantity">
                <button className="btn-up" onClick={() => increaseQty(id)}>
                    <i className="bi bi-plus-lg"></i>
                </button>
                <span>{qty}</span>
                <button className="btn-down" onClick={() => decreaseQty(id)}>
                    <i className="bi bi-dash-lg"></i>
                </button>
            </div>
            <div className="price-prd">
                {formattedPrice}
            </div>
            <div className="delete-prd">
                <button className="btn-delete" onClick={() => removeCartItem(id)}>
                    <i className="bi bi-trash3"></i>
                </button>
            </div>
        </div>
    );
};
