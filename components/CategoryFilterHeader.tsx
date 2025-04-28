//header component to show filter options on the basis of category
"use client";
import React, { useEffect, useState } from "react";
import { useProductsContext } from "@/contexts/productsContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";

const CategoryFilterHeader = () => {
    const {setProducts} = useProductsContext();
    const {setError} = useErrorContext();
    const [allCategories, setAllCategories] = useState<Category[]>();
    const [category, setCategory] = useState<Category>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=>{
       const fetchCategories = async ()=>{
          try{
            setLoading(true);
               //api request to backend to fetch all categories
               const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
                  method: "GET",
               });

                const data = await response.json();
                console.log(data.message);

                if(response.status !== 200){
                    setError(data.message);
                    return;
                }
                
                if(data.categories && data.categories.length){
                    //store all categories in state variable
                    setAllCategories(data.categories);
                }
          }
          catch(err: any){
            console.log(err.message);
            setError(err.message);
          }
          finally{
            setLoading(false);
          }
       }
       fetchCategories();
    }, []);

    //event handler for selecting category
    const handleCategoryClick = (categoryId: string)=>{
      //find category that matches selected category id and fetch all products in that category   
      if(allCategories){
         const category = allCategories.find((cat)=>cat.id === categoryId);
         if(category){
            const categoryProducts = category?.products;
            //store all products of a category in state variable
            setProducts(categoryProducts);
         } 
      }
    }

   //event handler for "all" button click to fetch all categories   
   const handleAllClick = async ()=>{
      try{
         setLoading(true);
         //api request to get details of all products
         const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
         method: "GET",
         });

         const data = await response.json();
         console.log(data.message);

         if(response.status !== 200){
             setError(data.message);
             return;
         }
         
         if(data.products && data.products.length){
            //store all products details in state variable
             setProducts(data.products);
         }
    }
    catch(err: any){
     console.log(err.message);
     setError(err.message);
    }
    finally{
      setLoading(false);
    }
   }

   //show loading message if data is not loaded
   if(loading){
      return (
         <div className="w-full h-screen flex flex-col justify-center items-center p-4">
         <p className="text-lg tracking-wider">Loading...</p>
         <CircularProgress />
         </div>
      )
   }

  //display category-wise list of products  
  return (allCategories && allCategories.length) && (
    <div className="w-screen h-[40px] flex justify-center items-center bg-(--brand-secondary) text-white px-8">
      <ul className="w-full h-full flex justify-center items-center space-x-6">
         {  <div className="w-full h-full flex justify-start items-center space-x-6">
            <li 
            onClick={handleAllClick}
            className="w-auto h-auto flex justify-center items-center hover:cursor-pointer hover:text-violet-300"
            >
               All
            </li>
            {allCategories.map((category)=>(
                <li 
                key={category.id}
                onClick={()=>handleCategoryClick(category.id)}
                className="w-auto h-auto flex justify-center items-center hover:cursor-pointer hover:text-violet-300"
                >
                     {category.name}
                </li>
            ))}
            </div>
         }
      </ul>
    </div>
  )
}

export default CategoryFilterHeader;
