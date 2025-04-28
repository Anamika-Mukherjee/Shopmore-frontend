//context to store product data when category filter is applied
"use client";
import {createContext, useContext, useState} from "react";

interface ProductsContext{
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

export const productsContext = createContext<ProductsContext | null>(null);

export const useProductsContext = ()=>{
     const context = useContext(productsContext);

     if(!context){
        throw new Error("useProductsContext can only be used within useProductsContextProvider");
     }

     return context;
}

export const ProductsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
  
    return (
      <productsContext.Provider value={{ products, setProducts }}>
        {children}
      </productsContext.Provider>
    );
  };
