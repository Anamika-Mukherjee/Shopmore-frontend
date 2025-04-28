//user page to view individual order details
"use client";
import { convertToDateTime } from "@/utils/functions";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";

const page = () => {
    //fetch order id from params
    const {orderId} = useParams();
    const {user} = useUser();
    const {setError} = useErrorContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [order, setOrder] = useState<Order>();
    const [product, setProduct] = useState<Product>();

    useEffect(()=>{
        if(user && orderId){
            try{
                const fetchOrderData = async ()=>{
                    //api to fetch order details by order id
                    setLoading(true);
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getOrder`, {
                        method: "POST",
                        body: JSON.stringify({
                            userClerkId: user.id,
                            orderId,
                        }),
                        headers: {"Content-Type": "application/json"}
                    });

                    const data = await response.json();
                    console.log(data.message);

                    if(response.status !== 200){
                        setError(data.message);
                        return;
                    }
              
                    if(data.order){
                        //store order details fetched from server in state variable
                        setOrder(data.order);
                        //api to fetch product details associated with the given order
                        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getProductDetails`, {
                            method: "POST",
                            body: JSON.stringify({
                                productId: data.order.productId
                            }),
                            headers: {"Content-Type": "application/json"}
                        });
                        
                        const productData = await res.json();
                        console.log(productData.message);

                        if(res.status !== 200){
                            setError(productData.message);
                            return;
                        }

                        if(productData.productDetails){
                            //store product details in state variables
                            setProduct(productData.productDetails);
                        }
                    }
                }
                fetchOrderData();
            }
            
            catch(err: any){
              console.log(err);
              setError(err.message);
            }
            finally{
                setLoading(false);
            }
        }

    }, [user, orderId]);

    //show loading message if data is not loaded
    if(loading){
              return (
                <div className="w-full h-screen flex flex-col justify-center items-center p-4">
                  <p className="text-lg tracking-wider">Loading...</p>
                  <CircularProgress />
                </div>
              )
    }

  //display order details and product details if available  
  return user && order && product && (
    <div className="w-screen h-[670px] flex flex-col justify-center items-center p-8 space-y-10">
        <div className="w-full lg:w-1/3 h-auto flex flex-col justify-start items-center space-y-6 p-4 bg-gray-100 shadow-lg rounded-lg">
            <p className="text-lg font-semibold tracking-wider">
                Order Details
            </p>
            <div className="w-full h-auto flex flex-col justify-start items-start space-y-2 tracking-wider text-sm">
                <div className="w-full h-auto flex justify-start items-start space-x-15">
                    <p>Order Id:</p>
                    <p className="text-blue-800 font-font-medium">{order.id}</p>
                </div>
                <div className="w-full h-auto flex justify-start items-start space-x-5">
                    <p>Product Name:</p>
                    <p className="text-blue-800 font-font-medium">{product.name}</p>
                </div>
                <div className="w-full h-auto flex justify-start items-start space-x-15">
                    <p>Quantity:</p>
                    <p className="text-blue-800 font-font-medium">{order.quantity}</p>
                </div>
                <div className="w-full h-auto flex justify-start items-start space-x-10 ">
                    <p>Order Date:</p>
                    <p className="text-blue-800 font-font-medium">{convertToDateTime(order.createdAt)}</p>
                </div>
                <div className="w-full h-auto flex justify-start items-start space-x-2">
                    <p>Payment Status:</p>
                    <p className="text-blue-800 font-font-medium">Success</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default page;
