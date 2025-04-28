//client layout component for using context providers
"use client";
import React, {useState} from "react";
import { CartContextProvider } from "@/contexts/cartContext";
import { ProductsContextProvider } from "@/contexts/productsContext";
import { ErrorContextProvider } from "@/contexts/errorContext";
import { InfoContextProvider } from "@/contexts/infoContext";

export default function ClientLayout({children}: Readonly<{children: React.ReactNode}>){
  const [products, setProducts] = useState<Product[]>([]);
    return(
        <>
           <InfoContextProvider>
              <ErrorContextProvider>
                    <ProductsContextProvider>
                        <CartContextProvider>
                          {children}
                        </CartContextProvider>
                    </ProductsContextProvider>
              </ErrorContextProvider>
          </InfoContextProvider>
        </>
    )
}
