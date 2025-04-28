//search bar component for product search
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";

const SearchBar = () => {

    const [query, setQuery] = useState<string>("");
    const {setError} = useErrorContext();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    
    //submit event handler for product search
    const handleSubmit = async (e: React.FormEvent)=>{
        try{
            e.preventDefault();
            //return if no search query 
            if(!query.trim()){
                return;
            }
            setLoading(true);
            //api to fetch product details for the given search query
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/searchProducts?query=${encodeURIComponent(query.trim())}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            });
    
            const data = await response.json();
            console.log(data.searchResults);

            if(response.status !== 200){
               setError(data.message);
               return;
            }

            if(data.searchResults && data.searchResults.length){
                //redirect to search results page with the product ids of all products returned from backend
                router.push(`/search/products?q=${encodeURIComponent(data.searchResults.map((product: Product)=>product.id).join(",").trim())}`); 
            }
            
        }
        catch(err: any){
            console.log(err);
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

    //display search form
    return (
            <form onSubmit={handleSubmit} className="w-full h-full flex justify-between items-center">
                <input 
                type="text" 
                name="searchProduct"
                placeholder="Search Shopmore..."
                onChange={(e)=>setQuery(e.target.value)}
                className="w-full h-full flex justify-start items-center p-2 rounded-lg text-black focus:outline-none"
                />
                <button 
                type="submit"
                className="w-[45px] h-full flex flex-col justify-center items-center bg-white rounded-r-lg hover:cursor-pointer hover:bg-gray-200">
                    <Image 
                    src="/assets/search.svg"
                    alt="search"
                    width={30}
                    height={30}
                    />
                </button>
            </form>
    )
}

export default SearchBar;
