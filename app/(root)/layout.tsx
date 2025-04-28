//layout for home page and all pages associated with root route
"use client";
import CategoryFilterHeader from "@/components/CategoryFilterHeader";
import Header from "@/components/Header";
import { ProductsContextProvider } from "@/contexts/productsContext";
import { useState } from "react";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const [products, setProducts] = useState<Product[]>([]);
    return (
          <>
          <ProductsContextProvider>
            <Header />
            <CategoryFilterHeader />
            {children}
          </ProductsContextProvider>
          </>
    );
  }