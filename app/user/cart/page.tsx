//user cart page
"use client";
import CartProductsCard from "@/components/CartProductsCard";
import { useCartContext } from "@/contexts/cartContext";
import { useUser } from "@clerk/nextjs";
import React from "react"

const CartPage = () => {
  const {user} = useUser();
  const {cartDetails} = useCartContext();

  return (user && cartDetails && cartDetails.items.length) ?(
    <div className="w-screen h-auto min-h-[670px] flex lg:flex-row flex-col justify-start items-center lg:items-start lg:space-x-6 space-y-6 py-20 px-8 ">
      <div className="w-full lg:w-4/5 h-full min-h-[300px] flex flex-col justify-center items-center lg:items-start space-y-6 bg-amber-50 p-8 rounded-lg">
       {cartDetails.items.map((item, index)=>(
        <div
         key={index} 
         className="w-4/5 h-auto flex flex-col justify-start items-start space-y-4 p-4 rounded-md shadow-lg bg-white">
           <CartProductsCard productId={item.productId} />
          </div>
       ))}
      </div>
    </div>
  ):(
    <div className="w-screen h-auto min-h-[670px] flex flex-col lg:flex-row justify-start items-center lg:items-start lg:space-x-6 py-20 lg:px-8 ">
    <div className="w-4/5 h-full min-h-[300px] flex flex-col justify-center items-center space-y-6 bg-amber-50 p-8 rounded-lg">
      <p className="text-amber-900 tracking-wider">Nothing in your cart!</p>
    </div>
    </div>
  )
}

export default CartPage;
