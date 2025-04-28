//product list component to display product list in home page and user dashboard
"use client";
import React, { useEffect, useState } from "react";
import UserProductCard from "./UserProductCard";
import { useProductsContext } from "@/contexts/productsContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";

const UserProductList = () => {
    const {products} = useProductsContext();
    const [allProducts, setAllProducts] = useState<Product[]>();
    const {setError} = useErrorContext();
    const [loading, setLoading] = useState<boolean>(false);
    
    useEffect(()=>{
        if(!products.length){
        const fetchProducts = async ()=>{
            try{
                setLoading(true);
                   //api to fetch all product details
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
                        method: "GET",
                        headers: {"Content-Type": "application/json"}
                    });
                    
                    const data = await response.json();
                    console.log(data.message);

                    if(response.status !== 200){
                        setError(data.message);
                        return;
                    }
                    
                    if(data.products && data.products.length){
                        //store product details in a state variable
                        setAllProducts(data.products);
                    }               
            }
            catch(err: any){
             console.log(err);
             setError(err.message);
            }
            finally{
                setLoading(false);
            }
          };
          fetchProducts();
        }
    }, []);

    //show loading message if data is not loaded
        if(loading){
            return (
                <div className="w-full h-screen flex flex-col justify-center items-center p-4">
                <p className="text-lg tracking-wider">Loading...</p>
                <CircularProgress />
                </div>
            )
        }
    

    //if products context set by category filter component (i.e. if category filter applied), then display products based on category
    if(products && products.length){
        return (
            <div className="product-list-container">
                {products.map((product, index)=>(
                    <UserProductCard key={index} product = {product} />
                ))}
            </div>
        )
    }
    //if no category selected from filter, display all products
    else{
        return allProducts && allProducts.length && (
            <div className="product-list-container">
                {allProducts.map((product, index)=>(
                    <UserProductCard key={index} product = {product} />
                ))}
            </div>
        )
    }
    
}

export default UserProductList;
