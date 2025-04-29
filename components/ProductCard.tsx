//product card component to display product data (only accessed by admins)
"use client";
import Image from "next/image";
import React, { useState } from "react";
import ProductDropdown from "./ProductDropdown";

const ProductCard = ({product}: {product: Product}) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const handleClick = ()=>{
    if(!openDropdown){
      setOpenDropdown(true);
    }
    else{
      setOpenDropdown(false);
    }
  }
  
  return (
    <div className="w-auto h-auto flex justify-start items-start space-x-4 relative">
    <div className="w-[300px] min-h-[350px] h-auto flex flex-col justify-start items-center relative p-4 shadow-2xl bg-gray-100 rounded-md space-y-6 z-0">
      <button 
       type="button"
       onClick={handleClick}
      className="w-full h-[20px] flex justify-end items-center relative left-[10px] hover:cursor-pointer">
        <Image 
         src="/assets/dots.svg"
         alt="menu"
         width={20}
         height={20}
         />
      </button>
      <div className="w-full min-h-[100px] h-auto flex justify-center items-center">
        <Image
         src= {product.imageUrls[0]} 
         alt="product image"
         width={100}
         height={100}
         />
      </div>
     
      <div className="w-full h-auto flex flex-col justify-start items-start space-y-1 text-sm">
        <div className="w-full h-auto flex justify-start items-center space-x-10 flex-wrap">
            <p className="text-gray-500">Name:</p>
            <span className="ml-1">{product.name}</span>
        </div>
        <div className="w-full h-auto flex justify-start items-center space-x-2 flex-wrap">
            <p className="text-gray-500">Description:</p>
            <span className="ml-1">{product.description}</span>
        </div>
        <div className="w-full h-auto flex justify-start items-center space-x-5">
            <p className="text-gray-500">Category:</p>
            <span className="ml-1">{product.categoryId}</span>
        </div>
        <div className="w-full h-auto flex justify-start items-center space-x-11">
            <p className="text-gray-500">Price:</p>
            <span className="ml-1">&#8377;{product.price}</span>
        </div>
        <div className="w-full h-auto flex justify-start items-center space-x-10">
            <p className="text-gray-500">Stock:</p>
            <span className="ml-1">{product.stock}</span>
        </div>
      </div>
    </div>
    {openDropdown && 
      <div className="w-auto h-auto flex flex-col justify-center items-start p-4 rounded-md z-50 absolute top-1/7 left-1/2 lg:top-0 lg:left-full shadow-xl bg-white">
         <ProductDropdown open={openDropdown} onOpenChange={setOpenDropdown} product={product}/>
          </div>
      }
    </div>
  )
}

export default ProductCard;
