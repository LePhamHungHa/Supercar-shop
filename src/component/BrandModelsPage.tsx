import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/brandmodelspage.css';

const DEFAULT_IMAGE = 'https://via.placeholder.com/300x160?text=No+Image';

interface Product {
  id: number;
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
}

export default function BrandModelsPage() {
  const { brandName } = useParams();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const brandApiMap: Record<string, string> = {
          lamborghini: 'supercars',
          nissan: 'nissan-models',
          dodge: 'dodge-models',
          mustang: 'mustang-models',
        };

        const apiEndpoint = brandApiMap[brandName?.toLowerCase() || ''] || brandName;
        const res = await fetch(`http://localhost:8080/${apiEndpoint}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error("Lỗi tải sản phẩm theo hãng:", error);
      }
    };

    fetchProducts();
  }, [brandName]);

  const getFirstImage = (urls?: string[] | string, fallback?: string): string => {
    if (!urls) return fallback || DEFAULT_IMAGE;
    if (Array.isArray(urls)) return urls[0] || fallback || DEFAULT_IMAGE;
    try {
      const parsed = JSON.parse(urls);
      if (Array.isArray(parsed)) return parsed[0] || fallback || DEFAULT_IMAGE;
    } catch (e) {}
    return fallback || DEFAULT_IMAGE;
  };

  return (
    <div className="brand-page">
      <h2>{brandName?.toUpperCase()}</h2>
      <div className="brand-content">
        <div className="brand-sidebar">
          <h3>Các dòng xe</h3>
          <ul>
            {products.map((p) => (
              <li key={p.model}>{p.model}</li>
            ))}
          </ul>
        </div>
        <div className="brand-products">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={getFirstImage(product.image_urls, product.image_url)}
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                }}
              />
              <h4>{product.name}</h4>
              <p>
                <del>{Number(product.price || 0).toLocaleString('vi-VN')}₫</del><br />
                <strong>{Number(product.price).toLocaleString('vi-VN')}₫</strong>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
