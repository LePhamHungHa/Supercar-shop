import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/productDetail.css';
import { useShoppingContext } from "../contexts/ShoppingContext";

const DEFAULT_IMAGE = 'https://via.placeholder.com/800x450?text=Xe+Siêu+Sang';

interface Product {
    id: string;
    name: string;
    brand: string;
    model: string;
    price: number;
    year: number;
    engine: string;
    horsepower: number;
    torque: number;
    top_speed: number;
    image_url?: string;
    image_urls?: string[] | string;
    description: string;
    source?: string;
    rating?: string;
    reviews?: string;
    discount?: string;
    acceleration?: string;
    fuel_type?: string;
    transmission?: string;
}

const ProductDetail = () => {
    const { addCartItem } = useShoppingContext();
    const { brand, id } = useParams<{ brand: string, id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [mainImage, setMainImage] = useState(DEFAULT_IMAGE);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const endpoints = [
                    'http://localhost:8080/supercars',
                    'http://localhost:8080/nissan-models',
                    'http://localhost:8080/dodge-models',
                    'http://localhost:8080/mustang-models',
                ];

                let allProducts: Product[] = [];
                for (const url of endpoints) {
                    const response = await axios.get(url);
                    const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
                    allProducts = allProducts.concat(data);
                }

                const selectedProduct = allProducts.find(
                    (product: Product) =>
                        product.id.toString() === id &&
                        product.brand.toLowerCase() === brand?.toLowerCase()
                    );
                if (!selectedProduct) {
                    setError(`Không tìm thấy sản phẩm với ID: ${id}`);
                    setLoading(false);
                    return;
                }

                let imageUrls: string[] = [];

                if (Array.isArray(selectedProduct.image_urls)) {
                    imageUrls = selectedProduct.image_urls;
                } else if (typeof selectedProduct.image_urls === 'string') {
                    try {
                        const parsed = JSON.parse(selectedProduct.image_urls);
                        if (Array.isArray(parsed)) imageUrls = parsed;
                    } catch {
                        imageUrls = [];
                    }
                }

                if (imageUrls.length === 0 && selectedProduct.image_url) {
                    imageUrls = [selectedProduct.image_url];
                }

                if (imageUrls.length === 0) {
                    imageUrls = [DEFAULT_IMAGE];
                }

                selectedProduct.image_urls = imageUrls;
                setProduct(selectedProduct);
                setMainImage(imageUrls[0]);
                setCurrentImageIndex(0);
            } catch (e) {
                setError("Lỗi khi tải dữ liệu sản phẩm. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addCartItem({
            id: product.id,
            name: product.name,
            price: product.price,
            imgUrl: mainImage,
        });
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/checkout');
    };

    const handlePrevImage = () => {
        if (!product) return;
        const images = product.image_urls as string[];
        const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
        setCurrentImageIndex(newIndex);
        setMainImage(images[newIndex]);
    };

    const handleNextImage = () => {
        if (!product) return;
        const images = product.image_urls as string[];
        const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
        setCurrentImageIndex(newIndex);
        setMainImage(images[newIndex]);
    };

    if (loading) return <div className="loading">Đang tải sản phẩm...</div>;
    if (error) return <div className="not-found">{error}</div>;
    if (!product) return null;

    const images: string[] = Array.isArray(product.image_urls)
        ? product.image_urls
        : (() => {
            try {
                const parsed = JSON.parse(product.image_urls || '[]');
                return Array.isArray(parsed) ? parsed : [DEFAULT_IMAGE];
            } catch {
                return [DEFAULT_IMAGE];
            }
        })();

    const formattedPrice = product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    return (
        <div className="productDetail">
            <div className="product-main">
                <div className="profile-product">
                    <div className="prd-galery">
                        <div className="img-prd">
                            <img src={mainImage} alt={product.name} className="main-img" />
                            {images.length > 1 && (
                                <>
                                    <button className="nav-btn prev-btn" onClick={handlePrevImage}><i className="bi bi-chevron-left"></i></button>
                                    <button className="nav-btn next-btn" onClick={handleNextImage}><i className="bi bi-chevron-right"></i></button>
                                </>
                            )}
                        </div>
                        <div className="thumbnail-gallery">
                            {images.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={mainImage === url ? 'active' : ''}
                                    onClick={() => {
                                        setMainImage(url);
                                        setCurrentImageIndex(index);
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="prd-info">
                        <h1>{product.brand} {product.name} ({product.year})</h1>
                        <div className="prd-price"><span className="price">{formattedPrice}</span></div>
                        <div className="prd-actions">
                            <button onClick={handleBuyNow}>Mua ngay</button>
                            <button onClick={handleAddToCart}>Thêm vào giỏ</button>
                        </div>
                        <h3>Thông số kỹ thuật</h3>
                        <ul>
                            <li>Model: {product.model}</li>
                            <li>Động cơ: {product.engine}</li>
                            <li>Công suất: {product.horsepower} HP</li>
                            <li>Mô-men xoắn: {product.torque} Nm</li>
                            <li>Tốc độ tối đa: {product.top_speed} km/h</li>
                        </ul>
                        <h3>Mô tả</h3>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
