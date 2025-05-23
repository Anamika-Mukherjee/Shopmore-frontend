//context to store cart details to immediately update cart item count
"use client";
import {createContext, useContext, useEffect, useState} from "react";

interface CartContextType{
    cartDetails: Cart;
    setCartDetails: (value: Cart)=>void;
}

export const CartContext = createContext<CartContextType | null>(null);

export const useCartContext = ()=>{
    const context = useContext(CartContext);

    if(!context){
        throw new Error("useCartContext can only be used within useCartContextProvider");
    }

    return context;
}

export const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartDetails = {
        id: 0,
        userId: "",
        createdAt: "",
        updatedAt: "",
        items: [],
    }, setCartDetails] = useState<Cart>();
  
    // get cart from local storage on first load
    useEffect(() => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCartDetails(JSON.parse(storedCart));
      }
    }, []);
  
    // save to localStorage on update
    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cartDetails));
    }, [cartDetails]);
  
    return (
      <CartContext.Provider value={{ cartDetails, setCartDetails }}>
        {children}
      </CartContext.Provider>
    );
  };