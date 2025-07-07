import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/main.css";
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE = 'https://via.placeholder.com/800x450?text=Xe+Siêu+Sang';

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

export default function Main() {
  const [supercars, setSupercars] = useState<Product[]>([]);
  const [nissans, setNissans] = useState<Product[]>([]);
  const [dodges, setDodges] = useState<Product[]>([]);
  const [mustangs, setMustangs] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supercarRes, nissanRes, dodgeRes, mustangRes] = await Promise.all([
          axios.get("http://localhost:8080/supercars"),
          axios.get("http://localhost:8080/nissan-models"),
          axios.get("http://localhost:8080/dodge-models"),
          axios.get("http://localhost:8080/mustang-models"),
        ]);

        const safeData = (res: any) => (Array.isArray(res.data) ? res.data : res.data?.data || []);

        setSupercars(safeData(supercarRes));
        setNissans(safeData(nissanRes));
        setDodges(safeData(dodgeRes));
        setMustangs(safeData(mustangRes));
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  const getFirstImage = (urls?: string[] | string, fallback?: string): string => {
    if (!urls) return fallback || DEFAULT_IMAGE;
    if (Array.isArray(urls)) return urls[0] || fallback || DEFAULT_IMAGE;
    try {
      const parsed = JSON.parse(urls);
      if (Array.isArray(parsed)) return parsed[0] || fallback || DEFAULT_IMAGE;
    } catch (e) {}
    return fallback || DEFAULT_IMAGE;
  };

  const renderCarList = (cars: Product[]) => (
    <div className="product-list">
      {cars.map((car) => (
        <Link to={`/product/${car.brand.toLowerCase()}/${car.id}`} className="product-card" key={`${car.brand}-${car.id}`}>
          <img src={getFirstImage(car.image_urls, car.image_url)} alt={car.name} className="product-image" />
          <h3>{car.brand} {car.name} {car.year}</h3>
          <p>Model: {car.model}</p>
          <p>Giá: {Number(car.price).toLocaleString("vi-VN")}đ</p>
          <p>Động cơ: {car.engine}</p>
          <p>Sức mạnh: {car.horsepower} HP</p>
          <p>Mô-men xoắn: {car.torque} Nm</p>
          <p>Tốc độ tối đa: {car.top_speed} km/h</p>
          <p>Mô tả: {car.description}</p>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="main">
      <div><h1>Lamborghini</h1>{supercars.length ? renderCarList(supercars) : <p>Không có siêu xe nào.</p>}</div>
      <div style={{ marginTop: "40px" }}><h1>Nissan</h1>{nissans.length ? renderCarList(nissans) : <p>Không có Nissan nào.</p>}</div>
      <div style={{ marginTop: "40px" }}><h1>Dodge</h1>{dodges.length ? renderCarList(dodges) : <p>Không có Dodge nào.</p>}</div>
      <div style={{ marginTop: "40px" }}><h1>Mustang</h1>{mustangs.length ? renderCarList(mustangs) : <p>Không có Mustang nào.</p>}</div>
    </div>
  );
}