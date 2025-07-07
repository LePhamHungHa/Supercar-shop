import React, { useEffect, useState } from 'react';
import '../style/OrderTracking.css';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    qty: number;
    imgUrl: string;
}

interface OrderDetails {
    orderCode: string;
    name: string;
    phone: string;
    address: string;
    gender: string;
    totalPrice: number;
    items: OrderItem[];
    status: string;
    note: string;
}

const OrderTracking = () => {
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null); // Lưu thông tin đơn hàng
    const [orderCode, setOrderCode] = useState<string>(''); // Lưu trữ mã đơn hàng nhập vào
    const [error, setError] = useState<string>(''); // Lưu trữ thông báo lỗi nếu không tìm thấy đơn hàng

    const handleSearch = () => {
        const storedOrderDetails = localStorage.getItem('orderDetails');
        if (storedOrderDetails) {
            const parsedOrderDetails = JSON.parse(storedOrderDetails);
            if (parsedOrderDetails.orderCode === orderCode) {
                setOrderDetails(parsedOrderDetails);
                setError('');
            } else {
                setError('Không tìm thấy thông tin đơn hàng với mã này.');
            }
        } else {
            setError('Không tìm thấy thông tin đơn hàng.');
        }
    };

    // Hiển thị thông tin đơn hàng hoặc thanh tìm kiếm
    if (!orderDetails) {
        return (
            <div className="order-tracking-container">
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Nhập mã đơn hàng"
                        value={orderCode}
                        onChange={(e) => setOrderCode(e.target.value)}
                    />
                    <button onClick={handleSearch}>Tìm kiếm</button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>
        );
    }

    return (
        <div className="order-tracking-container">
            <div className="order-details">
                <h3>Chi tiết đơn hàng</h3>
                <p><strong>Mã đơn hàng:</strong> {orderDetails.orderCode}</p>
                <p><strong>Giới tính:</strong> {orderDetails.gender}</p>
                <p><strong>Họ tên:</strong> {orderDetails.name}</p>
                <p><strong>Số điện thoại:</strong> {orderDetails.phone}</p>
                <p><strong>Địa chỉ:</strong> {orderDetails.address}</p>
                <p><strong>Tổng tiền:</strong> {Number(orderDetails.totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                <p><strong>Trạng thái:</strong> {orderDetails.status}</p>
                <p><strong>Ghi chú:</strong> {orderDetails.note}</p>
            </div>

            <div className="order-items">
                <h3>Sản phẩm mà bạn đã mua</h3>
                <ul>
                    {orderDetails.items.map((item: OrderItem) => (
                        <li key={item.id}>
                            <div className="order-item">
                                <img src={item.imgUrl} alt={item.name} className="item-image" />
                                <div className="product_bar">
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-qty">Số lượng: {item.qty}</div>
                                    <div className="item-price">Giá: {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <button className="back-to-home" onClick={() => window.location.href = '/'}>Trở về trang chủ</button>
        </div>
    );
};

export default OrderTracking;
