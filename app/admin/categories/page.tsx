//page to show product categories for admin
"use client";
import AddCategoryModal from "@/components/AddCategoryModal";
import AllCategories from "@/components/AllCategories";
import React, { useState } from "react";

const page = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    
    return (
      <div className="admin-products-page">
          <h2 className="text-2xl font-bold tracking-wider">Categories</h2>
        <div className="w-full h-[40px] flex justify-end items-center p-4">
          <button
           type="button"
           onClick={()=>setOpenModal(true)}
           className="w-[150px] h-[40px] flex justify-evenly items-center bg-black text-white rounded-md hover:bg-gray-800 hover:cursor-pointer"
           >
              <span>&#43;</span>
              <p>Add Category</p>
          </button>
        </div>
        <div className="w-full min-h-[500px] h-auto flex lg:flex-row flex-col lg:justify-center justify-start items-center lg:items-start lg:flex-wrap lg:pl-10">
         <AllCategories />
      </div>
        <div className="w-full lg:w-auto h-auto flex justify-center items-center absolute top-[50px] left-[0px] lg:top-[200px] lg:left-[600px]">
        {openModal && (
          <AddCategoryModal open={openModal} onOpenChange={setOpenModal}/>
        )}
        </div>
        
      </div>
    )
}

export default page
