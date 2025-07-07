import React, { useEffect, useState, useMemo } from 'react';
import '../style/header.css';
import logo from '../img/logo_gear.jpg';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from "react-router-dom";
import { useShoppingContext } from "../contexts/ShoppingContext";
import { CartItem } from "./CartItem";
import { Prev } from 'react-bootstrap/esm/PageItem';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
}

export default function Header() {
  const [products, setProducts] = useState<Product[]>([]);
  const { cartItems, cartQty, totalPrice } = useShoppingContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showCarMenu, setShowCarMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUserInfo = () => {
      const storedUsername = localStorage.getItem("username");
      const storedAvatar = localStorage.getItem("avatar_url");
      setUsername(storedUsername);
      setAvatarUrl(storedAvatar);
    };

    updateUserInfo();
    window.addEventListener("storage", updateUserInfo);

    return () => {
      window.removeEventListener("storage", updateUserInfo);
    };
  }, []);

  useEffect(() => {
  const fetchAllProducts = async () => {
    const endpoints = [
      'http://localhost:8080/supercars',
      'http://localhost:8080/nissan-models',
      'http://localhost:8080/dodge-models',
      'http://localhost:8080/mustang-models',
    ];

    let allProducts: Product[] = [];

    try {
      for (const url of endpoints) {
        const response = await fetch(url);
        const data = await response.json();
        if (Array.isArray(data)) {
          allProducts = allProducts.concat(data);
        }
      }

      setProducts(allProducts);
    } catch (error) {
      console.error("Lỗi khi lấy tất cả sản phẩm:", error);
    }
  };

  fetchAllProducts();
}, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    setDropdownVisible(searchValue.length > 0);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?query=${searchTerm}`);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("avatar_url");
    setUsername(null);
    setAvatarUrl(null);
    navigate("/");
  };

  // Hàm hiện thị menu dropdown các dòng xe
  const toggleCarMenu = () => {
    setShowCarMenu(Prev => !Prev)
  };

  return (
    <header>
      <div className="header_top">
        <div className="container">
          <div className="row-header">
            <div className="left-header">
              <a href="/" className="header_logo">
                <img src={logo} alt="logo" />
              </a>
              <div className="header-item menu" onClick={toggleCarMenu} style={{position: "relative"}}>
                <div className="header-text">
                  <a className="header_link">
                    <span className="box-icon"><i className="bi bi-list"></i></span>
                    <span className="box-text">Các dòng xe</span>
                  </a>
                </div>
                {showCarMenu && (
                  <div className="car-dropdown">
                    <Link to = "/brand/supercars" onClick={() => setShowCarMenu(false)}>Lamborghini</Link>
                    <Link to = "/brand/nissan" onClick={() => setShowCarMenu(false)}>Nissan</Link>
                    <Link to = "/brand/dodge" onClick={() => setShowCarMenu(false)}>Dodge</Link>
                    <Link to = "/brand/mustang" onClick={() => setShowCarMenu(false)}>Ford (Mustang)</Link>
                  </div>
                )}
              </div>
            </div>

            <div className="right-header">
              <div className="header-item search">
                <div className="search-box">
                  <form onSubmit={handleSearchSubmit} className="search_product" id="search_product">
                    <div className="search-inner">
                      <input
                        required
                        id="inputSearchAuto"
                        className="inputSearch"
                        maxLength={40}
                        autoComplete="off"
                        type="text"
                        size={20}
                        placeholder="Bạn cần tìm gì?"
                        value={searchTerm}
                        onChange={handleInputChange}
                      />
                    </div>
                  </form>
                  {isDropdownVisible && (
                    <div className="search-dropdown">
                      <div className="resultsContent">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <Link
                              key={product.id}
                              to={`/product/${product.id}`}
                              className="item-ult"
                              onClick={() => setDropdownVisible(false)}
                            >
                              <div className="title">
                                {product.name}
                                <p>
                                  <span>{Number(product.price).toLocaleString('vi-VN')}đ</span>
                                  <del>{Number(product.originalPrice).toLocaleString('vi-VN')}đ</del>
                                </p>
                              </div>
                              <div className="thumbs">
                                <img alt={product.name} src={product.imageUrl} />
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="no-results">
                            <span>Không có sản phẩm nào phù hợp.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="header-item hotline">
                <div className="header-text">
                  <a className="header_link" href="tel:0708811203">
                    <span className="box-icon"><i className="bi bi-headset"></i></span>
                    <span className="box-text">Hotline <br /> 0708811203</span>
                  </a>
                </div>
              </div>

              <div className="header-item showroom">
                <div className="header-text">
                  <a className="header_link" href="/">
                    <span className="box-icon"><i className="bi bi-geo-alt"></i></span>
                    <span className="box-text">Hệ thống <br /> Showroom</span>
                  </a>
                </div>
              </div>

              <div className="header-item ordertracking">
                <div className="header-text">
                  <a className="header_link" href="/OrderTracking">
                    <span className="box-icon"><i className="bi bi-clipboard2-data"></i></span>
                    <span className="box-text">Tra cứu <br /> đơn hàng</span>
                  </a>
                </div>
              </div>

              <div className="header-item cart">
                <div className="header-text">
                  <Link className="header_link" to="/cart">
                    <span className="box-icon">
                      <i className="bi bi-cart"></i>
                      <span className="count-holder">
                        <span className="count">{cartQty}</span>
                      </span>
                    </span>
                    <span className="box-text">Giỏ <br /> hàng</span>
                  </Link>
                </div>
                <div className="dropdown-cart">
                  <div className="your-cart">
                    <div className="cart-title"><h3>Giỏ hàng của bạn</h3></div>
                    <div className="cart-content">
                      {cartItems.length === 0 ? (
                        <div><span>Làm gì có món hàng nào mà coi, hãy mua hàng đi.</span></div>
                      ) : (
                        cartItems.map(item => <CartItem key={item.id} {...item} />)
                      )}
                    </div>
                    <div className="cart-total">
                      <span>Tổng: {Number(totalPrice).toLocaleString('vi-VN')}đ</span>
                      <Link to="/checkout" className="btn-pay">Đặt hàng</Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="header-item account">
                <div className="header-text">
                  {username ? (
                    <>
                      {avatarUrl && (
                        <img className="avatar-img" src={avatarUrl} alt="avatar" />
                      )}
                      <span className="box-text">Xin chào <br /> {username}</span>
                      <button className="btn btn-danger btn-sm" onClick={handleLogout}>Đăng xuất</button>
                    </>
                  ) : (
                    <>
                      <Link className="login_link" to="/login">
                        <span className="box-icon"><i className="bi bi-box-arrow-in-right"></i></span>
                        <span className="box-text">Đăng nhập</span>
                      </Link>
                      <Link className="register_link" to="/register">
                        <span className="box-icon"><i className="bi bi-person-plus"></i></span>
                        <span className="box-text">Đăng ký</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
