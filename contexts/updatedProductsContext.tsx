//context to store product data when category filter is applied
"use client";
import {createContext, useContext, useState} from "react";

interface UpdatedProductsContextType{
    updatedProducts: Product[];
    setUpdatedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

export const UpdatedProductsContext = createContext<UpdatedProductsContextType | null>(null);

export const useUpdatedProductsContext = ()=>{
     const context = useContext(UpdatedProductsContext);

     if(!context){
        throw new Error("useUpdatedProductsContext can only be used within useUpdatedProductsContextProvider");
     }

     return context;
}

export const UpdatedProductsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [updatedProducts, setUpdatedProducts] = useState<Product[]>([]);
  
    return (
      <UpdatedProductsContext.Provider value={{ updatedProducts, setUpdatedProducts }}>
        {children}
      </UpdatedProductsContext.Provider>
    );
  };
