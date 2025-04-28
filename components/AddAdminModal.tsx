//add admin modal component to display form to add new admin (only accessed by admin)
"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import { useAuth } from "@clerk/nextjs";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";
import { useInfoContext } from "@/contexts/infoContext";

//define zod schema for add admin form 
const addAdminSchema = z.object({
    adminEmail: z
                 .string()
                 .email(),             
    adminName:  z
                .string()
                .min(3, "Name should be atleast 3 characters")
                .max(50, "Name cannot be more than 50 characters"),
    adminContactNumber: z
                .string()
                .min(10, "Contact number must be atleast 10 characters")
                .regex(/^\+?[0-9]+$/, "Must be a valid phone number"),
});

//define schema type for zod schema
type AddAdminSchema = z.infer<typeof addAdminSchema>;

const AddAdminModal = ({open, onOpenChange}: {open: boolean, onOpenChange: React.Dispatch<React.SetStateAction<boolean>>}) => {
      const {getToken} = useAuth();
      const {setError} = useErrorContext();
      const {setInfo} = useInfoContext();
      const [loading, setLoading] = useState<boolean>(false);
    
      //initialize react-hook-form with zod resolver
      const {
          register,
          handleSubmit,
          watch,
          formState: { errors },
        } = useForm<AddAdminSchema>({
          resolver: zodResolver(addAdminSchema),
        });

      //submit handler for form submit event
      const onSubmit: SubmitHandler<AddAdminSchema> = async (values) => {
        const {adminName, adminEmail, adminContactNumber} = values;
        try{
            setLoading(true);
            //fetch session token from clerk
            const token = await getToken();
            //api to add new admin to the server database
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/createAdmin`, {
                method: "POST",
                body: JSON.stringify({
                  adminName,
                  adminEmail, 
                  adminContactNumber,
                }),
                headers: {
                    "Content-Type": "application/json",
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
           //close add admin modal when admin created
           onOpenChange(false);

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

    //display add admin form   
    return open && (
        <div className="add-product-modal">
          <div className="add-product-container">
            <h3 className="text-lg font-semibold">Add Admin</h3>
        <form 
         onSubmit={handleSubmit(onSubmit)}
         className="w-full h-full flex flex-col justify-start items-start p-8 overflow-y-auto bg-gray-50">
        
        <div className="add-product-form-element">
          <label htmlFor="adminName" className="hover:cursor-pointer">Admin Name</label>
          <input 
           type="text"
           id="adminName"
           placeholder="Admin Name"
           className="add-product-input" 
           {...register("adminName")} 
           />
           <p className="text-red-500">{errors.adminName?.message}</p>
        </div>
        <div className="add-product-form-element">
          <label htmlFor="adminEmail" className="hover:cursor-pointer">Admin Email</label>
          <input 
           type="text" 
           id="adminEmail"
           placeholder="Admin Email"
           className="add-product-input"
           {...register("adminEmail")} 
           />
           <p className="text-red-500">{errors.adminEmail?.message}</p>
        </div>
        <div className="add-product-form-element">
          <label htmlFor="adminContactNumber" className="hover:cursor-pointer">Admin Contact Number</label>
          <input 
           type="text" 
           id="adminContactNumber"
           placeholder="Admin Contact Number"
           className="add-product-input"
           {...register("adminContactNumber")} 
           />
           <p className="text-red-500">{errors.adminContactNumber?.message}</p>
        </div>
        <div className="add-product-form-element">
          <button
           type="submit"
           className="w-full h-[40px] flex justify-center items-center p-4 bg-black text-white rounded-md hover:cursor-pointer hover:bg-gray-800">
            Add
          </button>
        </div>
        </form>
       
        </div>
        <div className="w-[20px] h-[20px] flex justify-center items-center relative -top-[30px] left-[20px]">
          <button
           type="button"
           onClick={()=>onOpenChange(false)}
           className="w-full h-full flex justify-center items-center rounded-sm active:bg-gray-300 focus:outline-1 focus:outline-gray-300  hover:cursor-pointer"
           >
            <p className="text-xl flex justify-center items-center">&times;</p>
          </button>
        </div>
        </div>
    )
}

export default AddAdminModal;
