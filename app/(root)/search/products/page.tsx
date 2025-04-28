//search results page for searched products
"use client";
import React, { Suspense } from "react";
import ProductsSearch from "@/components/ProductsSearch";

const SearchProductsPage = () => {
  <Suspense fallback={<div>Loading search results...</div>}>
        <ProductsSearch />
  </Suspense>
}

export default SearchProductsPage;
