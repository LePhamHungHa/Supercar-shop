import { createContext, ReactNode, useContext, useState } from "react";

type ShoppingContextProviderProps = {
    children: ReactNode;
}

type CartItem = {
    id: string;
    name: string;
    price: number;
    qty: number;
    imgUrl: string;
}

type ProductItem = {
    id: string;
    name: string;
    price: number;
    imgUrl: string;
}

interface ShoppingContextType {
    cartQty: number;
    totalPrice: number;
    cartItems: CartItem[];
    increaseQty: (id: string) => void;
    decreaseQty: (id: string) => void;
    addCartItem: (item: ProductItem) => void;
    removeCartItem: (id: string) => void;
    clearCart: () => void;
}

const ShoppingContext = createContext<ShoppingContextType>({} as ShoppingContextType);

export const useShoppingContext = () => {
    return useContext(ShoppingContext);
}

export const ShoppingContextProvider = ({ children }: ShoppingContextProviderProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const cartQty = cartItems.reduce((qty, item) => qty + item.qty, 0);
    const totalPrice = cartItems.reduce((total, item) => total + item.qty * item.price, 0);

    const increaseQty = (id: string) => {
        console.log("increaseQty =>  ", id);
        const currentCartItem = cartItems.find(item => item.id === id);
        if (currentCartItem) {
            const newItems = cartItems.map(item => {
                if (item.id === id) {
                    return { ...item, qty: item.qty + 1 };
                } else {
                    return item;
                }
            });
            setCartItems(newItems);

            localStorage.setItem('cartItems', JSON.stringify(newItems));
        }
    }

    const decreaseQty = (id: string) => {
        console.log("decreaseQty =>  ", id);
        const currentCartItem = cartItems.find(item => item.id === id);
        if (currentCartItem) {
            if (currentCartItem.qty === 1) {
                removeCartItem(id);
            } else {
                const newItems = cartItems.map(item => {
                    if (item.id === id) {
                        return { ...item, qty: item.qty - 1 };
                    } else {
                        return item;
                    }
                });
                setCartItems(newItems);

                localStorage.setItem('cartItems', JSON.stringify(newItems));
            }
        }
    }

    const addCartItem = (product: ProductItem) => {
        console.log("product => ", product);
        if (product) {
            const currentCartItem = cartItems.find(item => item.id === product.id);
            if (currentCartItem) {
                const newItems = cartItems.map(item => {
                    if (item.id === product.id) {
                        return { ...item, qty: item.qty + 1 };
                    } else {
                        return item;
                    }
                });
                setCartItems(newItems);

                localStorage.setItem('cartItems', JSON.stringify(newItems));
            } else {
                const newItem = { ...product, qty: 1 };
                const newCartItems = [...cartItems, newItem];
                setCartItems([...cartItems, newItem]);

                localStorage.setItem('cartItems', JSON.stringify(newCartItems));
            }
        }
    }

    const removeCartItem = (id: string) => {
        console.log("removeCartItem =>  ", id);
        const currentCartItemIndex = cartItems.findIndex(item => item.id === id);
        const newItems = [...cartItems];
        newItems.splice(currentCartItemIndex, 1);
        setCartItems(newItems);

        localStorage.setItem('cartItems', JSON.stringify(newItems));
    }

    const clearCart = () => {
        console.log("clearCart =>  ");
        setCartItems([]);

        localStorage.removeItem('cartItems');
    }

    return (
        <ShoppingContext.Provider value={{ cartItems, cartQty, totalPrice, increaseQty, decreaseQty, addCartItem, removeCartItem, clearCart }}>
            {children}
        </ShoppingContext.Provider>
    );
}

export default ShoppingContext;
