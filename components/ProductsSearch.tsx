"use client";
import UserProductCard from "@/components/UserProductCard";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";

const ProductsSearch = () => {
    const searchParams = useSearchParams();
    const q = searchParams.get("q");
    const [products, setProducts] = useState<Product[]>([]);
    const {setError} = useErrorContext();
    const [loading, setLoading] = useState<boolean>(false);
    
    useEffect(()=>{
       if(q){
        //convert query string containing product ids into array
        const query = q.split(" ");
        try{
            const fetchSearchProducts = async ()=>{
              setLoading(true);
              //api to get product details for searched products through product ids
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getSearchProducts`, {
                method: "POST",
                body: JSON.stringify({
                    productIds: query,
                }),
                headers: {"Content-Type": "application/json"},
              });

              const data = await response.json();
              console.log(data.message);

              if(response.status !== 200){
                setError(data.message);
                return;
              }
              
              if(data.searchProducts){
                //store returned products into state variable
                setProducts(data.searchProducts);
              }

            }
            fetchSearchProducts();
        }
        catch(err){
            console.log(err);
        }
        finally{
          setLoading(false);
        }
       }
    }, [q]);

    //show loading message if data is not loaded
    if(loading){
          return (
            <div className="w-full h-screen flex flex-col justify-center items-center p-4">
              <p className="text-lg tracking-wider">Loading...</p>
              <CircularProgress />
            </div>
          )
    }

    return products && (
        <div className="home-container">
          <div className="product-list-container">
                {products.map((product, index)=>(
                    <UserProductCard key={index} product = {product} />
                ))}
            </div>
        </div>
    )
}

export default ProductsSearch;
