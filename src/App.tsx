import React from 'react';
import './App.css';
import Login from './component/Login';
import Register from './component/Register';
import Header from "./component/Header";
import Main from "./component/Main";
import ProductDetail from './component/ProductDetail'; 
import { Route, Routes } from 'react-router-dom';
import Bottom from "./component/Bottom";
import Checkout from "./component/Checkout";
import CartPage from "./component/CartPage";
import ProductsList from './component/ProductsList';
import OrderTracking from './component/OrderTracking';
import BrandModelsPage from './component/BrandModelsPage'

function App() {
    return (
        <>
            <div className="App">
                <Header />
                <Routes>
                    <Route path='/login' element = {<Login/>}/>
                    <Route path='/register' element = {<Register/>}/>
                    <Route path="/" element={<Main />} />
                    <Route path="/product/:brand/:id" element={<ProductDetail />} />
                    <Route path="/checkout" element={<Checkout/>}/>
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/OrderTracking" element={<OrderTracking />} />
                    <Route path="/products" element={<ProductsList />} />
                    <Route path="/brand/:brandName" element={<BrandModelsPage/>}/>
                    
                </Routes>
                <Bottom/>
            </div>
        </>
    );
}

export default App;
