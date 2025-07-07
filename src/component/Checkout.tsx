import React, { useState, useEffect } from 'react';
import '../style/checkout.css';
import { useShoppingContext } from '../contexts/ShoppingContext';
import {useNavigate} from "react-router-dom";



const Checkout = () => {
    const { cartItems, totalPrice } = useShoppingContext(); // Lấy thông tin giỏ hàng và tổng giá trị từ context
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const [step, setStep] = useState(0); // Bước hiện tại trong quy trình thanh toán

    // Các state lưu thông tin người mua hàng
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState("");
    const [address, setAddress] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('Thanh toán khi nhận hàng');
    const [note, setNote] = useState('');
    const [gender, setGender] = useState('');
    const [orderCode, setOrderCode] = useState('');  // State lưu mã đơn hàng ngẫu nhiên
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);  // Sau 500ms, thay đổi trạng thái loading thành false
        }, 500);
        return () => clearTimeout(timer); // Dọn dẹp khi component bị hủy
    }, []);

    // Hàm tạo mã đơn hàng ngẫu nhiên
    const generateOrderCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let orderCode = 'DHCB-';
        for (let i = 0; i < 10; i++) {
            orderCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return orderCode;
    };

    // Hàm kiểm tra độ tuổi
    const checkAge = (dob: string): boolean => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 18;
    };

    const handleNextStep = () => {

        if (step === 1) {

            const phoneWithoutSpaces = phone.replace(/\s/g, "");  // Loại bỏ tất cả khoảng trắng

            // Kiểm tra số điện thoại có đúng định dạng hay không
            const phoneRegex = /^(0[3|5|7|8|9][0-9]{8})$/;  // Định dạng số điện thoại Việt Nam

            if (!phoneRegex.test(phoneWithoutSpaces)) {
                alert("Mày nhập số điện thoại không hợp lệ, bịp bố mày à.");
                return;
            }

            if (!name || !address) {
                alert('Vui lòng nhập đầy đủ thông tin.');
                return;
            }

            // Kiểm tra độ tuổi
            if (!dob || !checkAge(dob)) {
                alert("Mày chưa đủ tuổi mua, tao đéo bán cho mày, NHÓT.");
                return;
            }
        };

        if (step < 3) {
            if (step === 2) {
                // Khi chuyển sang bước 2 (Thanh toán), tạo mã đơn hàng
                const newOrderCode = generateOrderCode();
                setOrderCode(newOrderCode); // Lưu mã đơn hàng vào state
                localStorage.setItem('orderCode', newOrderCode);

                // Lưu thông tin vào localStorage (lưu thông tin khách hàng)
                const orderDetails = {
                    orderCode: newOrderCode,
                    name: name,
                    phone: phone,
                    address: address,
                    gender: gender,
                    totalPrice: totalPrice,
                    items: cartItems,
                    status: 'Đang chờ xác nhận',
                    note: note,
                };
                localStorage.setItem('orderDetails', JSON.stringify(orderDetails));  // Lưu thông tin đơn hàng vào localStorage
            }
            setStep(step + 1);
        } else {
            alert("Đơn hàng của bạn đã hoàn tất!");
        }
    };

    const handlePreviousStep = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };
    // hàm trở về main
    const handleBackToMain = () => {
        navigate('/');
    }

    // xử lý dữ liệu nhập vào của Tên
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[^\d]*$/.test(value)) {
            setName(value);
        }
    };

    // xử lý dữ liệu nhập vào của sdt
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Loại bỏ tất cả các ký tự không phải số (bao gồm cả khoảng trắng)
        value = value.replace(/\D/g, "");

        // Đảm bảo rằng giá trị có đúng 10 chữ số (cho số điện thoại Việt Nam)
        if (value.length > 10) {
            value = value.slice(0, 10); // Cắt nếu vượt quá 10 số
        }

        setPhone(value);
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="checkout-container">
            {/* Hiển thị các bước thanh toán */}
            <div className="checkout-stepper">
                <div className={`step ${step >= 0 ? 'completed' : ''} ${step === 0 ? 'active' : ''}`}>
                    <div className="step-icon">1</div>
                    <p className="step-title">Giỏ hàng</p>
                </div>
                <div className={`step-divider ${step > 0 ? 'completed' : ''}`}></div>
                <div className={`step ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>
                    <div className="step-icon">2</div>
                    <p className="step-title">Thông tin đặt hàng</p>
                </div>
                <div className={`step-divider ${step > 1 ? 'completed' : ''}`}></div>
                <div className={`step ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>
                    <div className="step-icon">3</div>
                    <p className="step-title">Thanh toán</p>
                </div>
                <div className={`step-divider ${step > 2 ? 'completed' : ''}`}></div>
                <div className={`step ${step === 3 ? 'active' : ''}`}>
                    <div className="step-icon">4</div>
                    <p className="step-title">Hoàn tất</p>
                </div>
            </div>

            <div className="checkout-items">
                {step === 0 && cartItems.length === 0 && (
                    <p>Làm gì có món hàng nào mà coi, hãy mua hàng đi.</p>
                    )}
                {step === 0 && cartItems.length > 0 && (
                    cartItems.map((item) => (  // Hiển thị các món hàng trong giỏ
                        <div className="checkout-item" key={item.id}>
                            <img src={item.imgUrl} alt={item.name} className="item-image" />
                            <div className="item-details">
                                <h2>{item.name}</h2>
                                <p>Giá: {Number(item.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                <p>Số lượng: {item.qty}</p>
                            </div>
                        </div>
                    ))
                )}
                {step === 1 && (
                    <div className="step01">
                        <h2>Thông tin khách mua hàng</h2>
                        <div className="choose-sex">
                            <div className="gender-options">
                                <label>
                                    <input
                                        type="radio"
                                        value="Anh"
                                        checked={gender === 'Anh'}
                                        onChange={() => setGender('Anh')}
                                        onClick={() => setName('')}  // Reset tên khi chọn giới tính
                                    />
                                    Anh
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="Chị"
                                        checked={gender === 'Chị'}
                                        onChange={() => setGender('Chị')}
                                        onClick={() => setName('')}  // Reset tên khi chọn giới tính
                                    />
                                    Chị
                                </label>
                            </div>
                        </div>
                        <div className="Enterinformation">
                            <input
                                type="text"
                                placeholder="Nhập họ tên"
                                value={name}
                                onChange={handleNameChange}
                                required
                            />

                            <input
                                type="tel"
                                placeholder="Nhập số điện thoại"
                                value={phone}
                                onChange={handlePhoneChange}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={10}
                                required
                            />

                            <input
                                type="date"
                                placeholder="Chọn ngày tháng năm sinh"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}  // Cập nhật state khi người dùng chọn ngày
                                required
                            />
                        </div>
                        <div>
                            <h3>Chọn cách thanh toán</h3>
                            <label>
                                <input
                                    type="radio"
                                    value="Thanh_toan_khi_nhan_hang"
                                    checked={deliveryMethod === 'Thanh_toan_khi_nhan_hang'}
                                    onChange={() => setDeliveryMethod('Thanh_toan_khi_nhan_hang')}
                                />
                                Thanh toán khi nhận hàng
                            </label>
                        </div>
                        <input
                            type="text"
                            placeholder="Số nhà, tên đường"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}  // Cập nhật địa chỉ
                            required
                        />
                        <textarea
                            placeholder="Lưu ý, yêu cầu khác (Không bắt buộc)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}  // Cập nhật ghi chú
                        />
                        <div>
                            <h4>Dịch vụ giao hàng</h4>
                            <p>Miễn phí vận chuyển (Giao hàng tiêu chuẩn)</p>
                            <p>Phí vận chuyển: Miễn phí</p>
                            <p>
                                Tổng tiền: <strong>{Number(totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</strong>
                            </p>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="step02">
                        <h2>Xác nhận thông tin đặt hàng</h2>
                        <p><strong>Giới tính:</strong> {gender}</p>
                        <p><strong>Họ tên:</strong> {name}</p>
                        <p><strong>Số điện thoại:</strong> {phone}</p>
                        <p><strong>Địa chỉ:</strong> {address}</p>
                        <p><strong>Ghi chú:</strong> {note}</p>
                        <p><strong>Tổng tiền:</strong> {Number(totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                    </div>
                )}
                {step === 3 && (
                    <div className="step03">
                        <div className="icon-check"><i className="bi bi-check-circle-fill"></i></div>
                        <div className="tks-user">Cảm ơn bạn đã đặt hàng 🥰</div>
                        <div className="Order-codes">
                            <h4>Mã đơn hàng: </h4>
                            <h4>{orderCode}</h4>
                        </div>
                        <div className="button-back">
                            <button className="backtomain" onClick={handleBackToMain}><i
                                className="bi bi-caret-left-fill"></i> Trở về trang chủ
                            </button>

                        </div>
                    </div>
                )}
            </div>

            {step < 3 && cartItems.length > 0 && (
                <div className="back-summary">
                    <p>
                        Tổng giá trị: <span>{Number(totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                    </p>
                    <h2>Số lượng: {cartItems.reduce((total, item) => total + item.qty, 0)}</h2>
                    <div className="button-group">
                        {step > 0 && (
                            <button className="btn-back" onClick={handlePreviousStep}>
                                Trở lại
                            </button>
                        )}
                        <button
                            className="btn-pay"
                            onClick={handleNextStep}
                        >
                            {step === 2 ? "Tôi xác nhận toàn bộ thông tin ở trên" : "Đặt hàng"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
