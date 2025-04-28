//component to show all categories details (only accessed by admins)
"use client";
import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";

const AllCategories = () => {
        const [allCategories, setAllCategories] = useState<Category[]>();
        const {setError} = useErrorContext();
        const [loading, setLoading] = useState<boolean>(false);
    
        useEffect(()=>{
          const fetchProducts = async ()=>{
            try{
                setLoading(true);
                //api request to fetch all category information from database
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"}
                });
                
                const data = await response.json();
                console.log(data.message);

                if(response.status !== 200){
                    setError(data.message);
                    return;
                }
                
                if(data.categories && data.categories.length){
                    //store category details in a state variable
                    setAllCategories(data.categories);
                }
            }
            catch(err){
             console.log(err);
            }
            finally{
              setLoading(false);
            }
          };
          fetchProducts();
        }, []);

        //show loading message if data is not loaded
        if(loading){
            return (
              <div className="w-full h-screen flex flex-col justify-center items-center p-4">
                <p className="text-lg tracking-wider">Loading...</p>
                <CircularProgress />
              </div>
            )
        }

        //display all categories information 
        return (allCategories && allCategories.length) &&(
            <div className="w-[90%] lg:w-3/5 h-full flex lg:flex-row flex-col justify-start items-center lg:items-start bg-gray-200 rounded-md space-y-4 lg:spacy-y-0 lg:space-x-4 p-8 lg:flex-wrap">
              {allCategories.map((category, index)=>(
                <div 
                key={index}
                
                >
                   <CategoryCard category={category} />
                </div> 
              ))}
            </div>
          )
}

export default AllCategories;
