import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    imageUrl: string;
}

const ProductsList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);  // Thêm trạng thái loading
    const [error, setError] = useState<string | null>(null);  // Thêm trạng thái error
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';  // Lấy giá trị từ query string

    // Lấy dữ liệu sản phẩm từ file JSON
    useEffect(() => {
         const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/supercars');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            setError('Không thể tải sản phẩm từ máy chủ.');
        } finally {
            setLoading(false);
        }
    };

    fetchProducts();
}, []);
    // Lọc sản phẩm theo từ khóa tìm kiếm
    const filteredProducts = query
        ? products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        )
        : products;

    // Nếu đang tải hoặc có lỗi
    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Kết quả tìm kiếm cho: {query}</h1>
            <div className="product-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="product-item">
                            <img src={product.imageUrl} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{Number(product.price).toLocaleString('vi-VN')}đ</p>
                        </div>
                    ))
                ) : (
                    <p>Không có sản phẩm nào phù hợp.</p>
                )}
            </div>
        </div>
    );
};

export default ProductsList;
