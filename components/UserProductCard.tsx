//product card component to display product data in home page and user dashboard
"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const UserProductCard = ({product}: {product: Product}) => {
  return (
    
      <Link
      href={`/productDetails/${product.id}`} 
      className="w-[300px] min-h-[300px] h-auto flex flex-col justify-start items-center shadow-2xl bg-gray-100 rounded-md space-y-10 z-0">
            <div className="w-full h-[200px] flex justify-center items-center rounded-md">
              <Image
               src= {product.imageUrls[0]} 
               alt="product image"
               width={200}
               height={200}
               className="w-full h-full rounded-t-md"
               />
            </div>
           
            <div className="w-full h-auto flex flex-col justify-start items-start space-y-1 text-sm px-4 pb-4">
              <div className="w-full h-auto flex justify-start items-center space-x-10">
                  <span className="font-semibold tracking-wide">{product.name}, {product.description}</span>
              </div>
              <div className="w-full h-auto flex justify-start items-center space-x-10">
                  <span className="text-lg font-semibold">&#8377;{product.price}</span>
              </div>
              <div className="w-full h-auto flex justify-start items-center space-x-10">
                  
                  <span className="text-base font-semibold">{product.stock>0?"In stock":"Not in stock"}</span>
              </div>
            </div>
        </Link>
  )
}

export default UserProductCard;
