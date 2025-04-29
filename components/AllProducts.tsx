//component to show all products details (only accessed by admins)
"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";
import { useUpdatedProductsContext } from "@/contexts/updatedProductsContext";

const AllProducts = () => {

    const [allProducts, setAllProducts] = useState<Product[]>();
    const {setError} = useErrorContext();
    const [loading, setLoading] = useState<boolean>(false);
    const {updatedProducts} = useUpdatedProductsContext();

    useEffect(()=>{
      const fetchProducts = async ()=>{
        try{
          setLoading(true);
          //api request to fetch all products information from database
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
        catch(err){
         console.log(err);
        }
        finally{
          setLoading(false);
        }
      };
      fetchProducts();
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

    if(updatedProducts && updatedProducts.length){
      return (
        <div className="w-[90%] lg:w-3/5 h-full flex lg:flex-row flex-col justify-start items-center lg:items-start bg-gray-200 rounded-md space-x-0 space-y-6 lg:space-x-4 p-8 lg:flex-wrap">
          {updatedProducts.map((product, index)=>(
        <div 
        key={index}
        >
           <ProductCard product={product} />
        </div> 
      ))}
    </div>
      )
    }

   else{
      //display all products information 
      return (allProducts && allProducts.length) &&(
        <div className="w-[90%] lg:w-3/5 h-full flex lg:flex-row flex-col justify-start items-center lg:items-start bg-gray-200 rounded-md space-x-0 space-y-6 lg:space-x-4 p-8 lg:flex-wrap">
          {allProducts.map((product, index)=>(
            <div 
            key={index}
            >
              <ProductCard product={product} />
            </div> 
          ))}
        </div>
      )
   } 
  
}

export default AllProducts;
