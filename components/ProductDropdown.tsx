//dropdown menu modal to show product actions like view, edit, delete (only accessed by admins)
"use client";
import Image from "next/image";
import React, { useState } from "react";
import { productActions } from "@/utils/constants";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

interface ProductAction{
    label: string;
    value: string;
    icon: string;
}

const ProductDropdown = ({open, onOpenChange, product}: {open: boolean, onOpenChange: React.Dispatch<React.SetStateAction<boolean>>, product: Product}) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [productAction, setProductAction] = useState<ProductAction>();
   
  return (
    <>
    <div className={!openModal?"w-full h-full flex flex-col justify-start items-center":"w-screen h-auto lg:w-full lg:h-full flex flex-col justify-start items-center lg:static absolute top-[0px] -left-[250px] px-4"}>
        {!openModal && (            
            <div className="w-[180px] h-[120px] bg-white p-4 rounded-lg text-sm tracking-wide leading-8">
                {productActions.map((action, index)=>(
                    <div
                     key={index} 
                     className="w-full h-auto flex justify-start items-center space-x-2 hover:cursor-pointer hover:text-gray-500">
                    <Image
                     src={action.icon}
                     alt={action.value}
                     width={25}
                     height={25}
                     />
                <button
                type="button"
                className="hover:cursor-pointer"
                onClick={()=> {
                    setOpenModal(true);
                    setProductAction(action);
                }}>
                {action.label}
                </button>
                </div>
                ))}
            </div>
        )} 
        {openModal && productAction && 
            (
            <div className="w-full lg:w-[500px] min-h-[200px] h-auto flex flex-col justify-start items-start bg-white rounded-lg space-y-4">
                <div className="w-full h-auto flex justify-start items-start">
                    <h2 className="w-full tracking-wider font-semibold text-center flex justify-center items-center pt-4">{productAction.label}</h2>
                    <button 
                    type="button"
                    onClick={()=>{
                        setOpenModal(false);
                        onOpenChange(false);
                    }}
                    className="w-[20px] h-[20px] flex justify-center items-center relative top-[5px] right-[10px] text-lg rounded-sm hover:cursor-pointer hover:border hover:border-gray-500 hover:bg-gray-200"
                    >
                        &times;
                    </button>
                </div>
                
                {(productAction.value === "view") && (
                   <div className="w-full h-4/5 flex flex-col justify-start items-start space-y-2 px-8 py-4 ">
                    <div className="w-full h-auto flex justify-start items-center space-x-20">
                        <p className="flex">
                            Product Id: 
                        </p>
                        <span className="text-gray-600 font-semibold">
                            {product.id}
                        </span>
                    </div>
                    <div className="w-full h-auto flex justify-start items-center space-x-13">
                        <p className="flex">
                            Product Name:
                        </p>
                        <span className="text-gray-600 font-semibold">
                            {product.name}
                        </span>
                    </div>
                    <div className="w-full h-auto flex justify-start items-center space-x-8">
                        <p className="flex">
                            Product Category:
                        </p>
                        <span className="text-gray-600 font-semibold">
                            {product.categoryId}
                        </span>
                    </div>
                    <div className="w-full h-auto flex justify-start items-center space-x-4">
                        <p className="flex">
                            Product Description:
                        </p>
                        <span className="text-gray-600 font-semibold">
                            {product.description}
                        </span>
                    </div>
                    <div className="w-full h-auto flex justify-start items-center space-x-15">
                        <p className="flex">
                            Product Price:
                        </p>
                        <span className="text-gray-600 font-semibold">
                            {product.price}
                        </span>
                    </div>
                    <div className="w-full h-auto flex justify-start items-center space-x-14">
                        <p className="flex">
                            Product Stock:
                        </p>
                        <span className="text-gray-600 font-semibold">
                            {product.stock}
                        </span>
                    </div>
                    <div className="w-full h-auto flex justify-start items-center space-x-20">
                        <p className="flex">
                            Created at:
                        </p>
                        <span className="text-gray-600 font-semibold">
                            {product.createdAt}
                        </span>
                    </div> 
                   </div>
                )} 
                {productAction.value === "edit" && (
                    <div className="w-full h-full flex justify-center items-center p-4">
                    <EditProductModal product = {product} onOpenModalChange={setOpenModal} onOpenDropdownChange = {onOpenChange}/>
                    </div>
                )} 
                {productAction.value === "delete" && (
                    <div className="w-full h-full flex justify-center items-center p-4">
                    <DeleteProductModal product={product} openModal={openModal} onOpenModalChange={setOpenModal} openDropdown={open} onOpenDropdownChange = {onOpenChange}/>
                    </div>
                )} 
            </div>
                )
            } 
            
        
    </div>
    
     </>
  )
}

export default ProductDropdown
