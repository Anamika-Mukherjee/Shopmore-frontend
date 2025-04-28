//order card component to display order data in user order history page
"use client";
import { convertToDateTime } from "@/utils/functions";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";

const UserOrderCard = ({order}: {order: Order}) => {
   const {user} = useUser();
   const {setError} = useErrorContext();
   const[product, setProduct] = useState<Product>();
   const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=>{
        if(user && order && order.productId){
          try{
             const fetchProductDetails = async ()=>{
                setLoading(true);
                //api to fetch product details associated with the order
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getProductDetails`, {
                    method: "POST",
                    body: JSON.stringify({
                        productId: order.productId
                    }),
                    headers: {"Content-Type": "application/json"}
                });

                const productData = await response.json();
                console.log(productData.message);

                if(response.status !== 200){
                    setError(productData.message);
                    return;
                }

                if(productData.productDetails){
                    //store product details in a state variable
                    setProduct(productData.productDetails);
                }
             }
             fetchProductDetails();
          }
          catch(err: any){
            console.log(err);
            setError(err.message);
          }
          finally{
            setLoading(false);
        }
        }

    }, [user, order]);

    //show loading message if data is not loaded
    if(loading){
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center p-4">
            <p className="text-lg tracking-wider">Loading...</p>
            <CircularProgress />
            </div>
        )
    }

  //display order details   
  return (user && product && order) &&(
    <>
      <Link
      href={`/user/orders/${order.id}`} 
      className="w-full h-auto flex lg:flex-row flex-col justify-start items-center space-y-6 lg:space-y-0 lg:space-x-4">
        <div className="w-[100px] h-auto flex justify-center items-center rounded-md">
            <Image
            src={product.imageUrls[0]}
            alt="product image"
            width={100}
            height={100}
            className="w-full h-full flex justify-center items-center rounded-md"
            />
        </div>
        <div className="w-full h-auto flex flex-col justify-start items-start space-y-1">
            <div >
                <p className="text-lg font-semibold">{product.name}</p>
            </div>
            <div className="w-full h-auto flex justify-start items-start space-x-2 flex-wrap">
                <p>Order Id:</p>
                <p className="font-semibold">{order.id}</p>
            </div>
            <div className="w-full h-auto flex justify-start items-start space-x-2">
                <p>Order quantity:</p>
                <p className="font-semibold">{order.quantity}</p>
            </div>
            <div className="w-full h-auto flex justify-start items-start space-x-2">
                <p>Payment status:</p>
                <p className="font-semibold">Success</p>
            </div>
            <div className="w-full h-auto flex justify-start items-start space-x-2">
                <p>Paid amount:</p>
                <p className="font-semibold">&#8377;{order.amount}</p>
            </div>
            <div className="w-full h-auto flex justify-start items-start space-x-2">
                <p>Order Date:</p>
                <p className="font-semibold">{convertToDateTime(order.createdAt)}</p>
            </div>
        </div>
       </Link>
    </>
  )
}

export default UserOrderCard;
