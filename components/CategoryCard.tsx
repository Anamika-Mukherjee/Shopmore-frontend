//card component to show category details in admin dashboard (only accessed by admins)
"use client";
import Image from "next/image"
import React from "react"

const CategoryCard = ({category}: {category: Category}) => {
  return (
     <div className="w-[250px] h-[300px]  flex flex-col justify-start items-center p-4 bg-white shadow-2xl rounded-md space-y-3">
       <div className="w-full min-h-[100px] h-auto flex justify-center items-center rounded-md">
         <Image
          src= {category.imageUrls[0]}
          alt="category image"
          width={100}
          height={100}
          className="rounded-md flex justify-center items-center"
          />
       </div>
       <div className="w-full h-auto flex flex-col justify-start items-start space-y-1 text-sm">
         <div className="w-full h-auto flex justify-start items-center space-x-10">
             <p className="text-gray-500">Name:</p>
             <span className="ml-1">{category.name}</span>
         </div>
         <div className="w-full h-auto flex justify-start items-center space-x-2">
             <p className="text-gray-500">Description:</p>
             <span className="ml-1">{category.description}</span>
         </div>
       </div>
     </div>
   )
}

export default CategoryCard;
