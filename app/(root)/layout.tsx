//layout for home page and all pages associated with root route
"use client";
import CategoryFilterHeader from "@/components/CategoryFilterHeader";
import Header from "@/components/Header";
import { productsContext } from "@/contexts/productsContext";
import { useState } from "react";

export default function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const [products, setProducts] = useState<Product[]>([]);
    return (
          <>
          <productsContext.Provider value={{products, setProducts}}>
            <Header />
            <CategoryFilterHeader />
            {children}
          </productsContext.Provider>
          </>
    );
  }