//order card component to display order data (only accessed by admins)
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";

const OrderCard = ({order}: {order: Order}) => {
    const [product, setProduct] = useState<Product>();
    const {setError} = useErrorContext();
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=>{
         if(order && order.productId){
            try{
                const fetchProduct = async ()=>{
                    setLoading(true);
                    //api to fetch product details associated with the order
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${order.productId}`, {
                        method: "GET",
                        headers: {"Content-Type": "application/json"}
                    });

                    const data = await response.json();
                    console.log(data.message);

                    if(response.status !== 200){
                        setError(data.message);
                        return;
                    }
                    
                    if(data.productDetails){
                        //store product details in a state variable
                        setProduct(data.productDetails);
                    }
                }

                fetchProduct();
            }
            catch(err: any){
              console.log(err);  
              setError(err.message);
            }
            finally{
                setLoading(false);
            }
         }
    }, [order]);

    useEffect(()=>{
         if(order && order.userId){
            try{
                const fetchUser = async ()=>{
                    setLoading(true);
                    //api to fetch customer details associated with the order
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getUserDetails`, {
                        method: "POST",
                        body: JSON.stringify({
                            userClerkId: order.userId,
                        }),
                        headers: {"Content-Type": "application/json"}
                    });

                    const data = await response.json();
                    console.log(data.message);

                    if(response.status !== 200){
                        setError(data.message);
                        return;
                    }
                    
                    if(data.userDetails){
                        //store user details in a state variable
                        setUser(data.userDetails);
                    }
                }

                fetchUser();
            }
            catch(err: any){
              console.log(err);  
              setError(err.message);
            }
            finally{
                setLoading(false);
            }
         }
    }, [order]);

    //show loading message if data is not loaded
    if(loading){
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center p-4">
            <p className="text-lg tracking-wider">Loading...</p>
            <CircularProgress />
            </div>
        )
    }
  
  //display order information  
  return order && product && user && (
    <div className="w-full min-h-[200px] h-auto flex flex-col justify-start items-center p-4 shadow-2xl bg-gray-100 rounded-md space-y-3">
      <div className="w-full h-full flex lg:flex-row flex-col justify-start items-center space-y-4 lg:space-y-0 lg:space-x-4">
      <div className="w-auto min-h-[100px] h-auto flex justify-start items-center">
        <Image
         src= {product.imageUrls[0]} 
         alt="product image"
         width={100}
         height={100}
         />
      </div>
      <div className="w-full h-auto flex flex-col justify-start items-start space-y-1 text-sm">
        <div className="w-full h-auto flex justify-start items-center space-x-15">
            <p className="w-1/5 lg:w-auto text-gray-500 flex">Order Id:</p>
            <span className="flex flex-wrap">{order.id}</span>
        </div>
        <div className="w-full h-auto flex justify-start items-center space-x-11">
            <p className="text-gray-500">Product Id:</p>
            <span className="ml-1">{product.id}</span>
        </div>
        <div className="w-full h-auto flex justify-start items-center space-x-5">
            <p className="text-gray-500">Product Name:</p>
            <span className="ml-1">{product.name}</span>
        </div>
        <div className="w-full h-auto flex justify-start items-center space-x-9">
            <p className="w-1/3 lg:w-auto flex text-gray-500">Customer Id:</p>
            <p className="flex justify-start items-start flex-wrap">{user.clerkId}</p>
        </div>
        <div className="w-full h-auto flex justify-start items-center space-x-2">
            <p className="text-gray-500">Customer Name:</p>
            <span className="ml-1">{user.name}</span>
        </div>
        <div className="w-full h-auto flex justify-start items-center space-x-6">
            <p className="text-gray-500">Product Price:</p>
            <span className="ml-1">&#8377;{product.price}</span>
        </div>
        </div>
      </div>
     </div>
  )
}

export default OrderCard;
