//delete product modal component to delete products (only accessed by admins)
"use client"
import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";
import { useInfoContext } from "@/contexts/infoContext";
import { useAuth } from "@clerk/nextjs";

interface DeleteProductModalProps{
  product: Product;
  openModal: boolean;
  onOpenModalChange: React.Dispatch<React.SetStateAction<boolean>>;
  openDropdown: boolean;
  onOpenDropdownChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteProductModal = ({product, openModal, onOpenModalChange, openDropdown, onOpenDropdownChange}: DeleteProductModalProps) => {
    const {setError} = useErrorContext();
    const {setInfo} = useInfoContext();
    const [loading, setLoading] = useState<boolean>(false);
    const {getToken} = useAuth();

    //event handler to handle delete event for product
    const handleDeleteClick = async ()=>{
        try{
           setLoading(true);
            const token = await getToken();
            //api request to backend to delete selected product from database
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/${product.id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });

            const data = await response.json();
            console.log(data.message);
    
            if(response.status !== 200){
              setError(data.message);
              return;
            }
            
            setInfo(data.message);
            //close delete product modal and product actions dropdown menu when item is deleted
            onOpenModalChange(false);
            onOpenDropdownChange(false);
        }
        catch(err){
         console.log(err);
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
   
  //display delete product modal  
  return (
    <div className="w-full h-full flex flex-col justify-start items-center space-y-6">
      <p>Do you really want to delete this product?</p>
      <div className="w-full h-full flex justify-center items-start space-x-6">
        <button
         type="button"
         onClick={handleDeleteClick}
         className="w-[100px] h-[35px] flex justify-center items-center bg-(--brand-secondary-dark) text-white rounded-md p-4 hover:cursor-pointer hover:bg-(--brand-secondary-light)"
        >
            Delete
        </button>
        <button
        type="button"
        onClick={()=>{
            onOpenModalChange(false);
            onOpenDropdownChange(false);
        }}
        className="w-[100px] h-[35px] flex justify-center items-center bg-black text-white rounded-md p-4 hover:cursor-pointer hover:bg-gray-800">
            Cancel
        </button>
      </div>
    </div>
  )
}

export default DeleteProductModal
