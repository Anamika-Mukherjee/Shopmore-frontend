//add category modal component to display form to add new category (only accessed by admin)
"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";
import { useInfoContext } from "@/contexts/infoContext";
import { useAuth } from "@clerk/nextjs";
import { useUpdatedCategoriesContext } from "@/contexts/updatedCategoriesContext";

//define zod schema for add category form 
const addCategorySchema = z.object({
    categoryName: z
                 .string()
                 .min(3, "Category name must be atleast 3 characters")
                 .max(20, "Category name must not be more than 20 characters"),
    categoryDescription: z
                        .string()
                        .min(5, "Category description must be atleast 3 characters")
                        .max(500, "Category description must not be more than 500 characters"),
    categoryImageFiles:  z
                        .any()
                        .refine((files) => files instanceof FileList && files.length > 0, {
                            message: 'File is required',
                        }),
});

//define schema type for zod schema
type AddCategorySchema = z.infer<typeof addCategorySchema>;

const AddCategoryModal = ({open, onOpenChange}: {open: boolean, onOpenChange: React.Dispatch<React.SetStateAction<boolean>>}) => {
      const {setError} = useErrorContext();
      const {setInfo} = useInfoContext();
      const [loading, setLoading] = useState<boolean>(false);
      const {getToken} = useAuth();
      const {setUpdatedCategories} = useUpdatedCategoriesContext();

      //initialize react-hook-form with zod resolver
      const {
          register,
          handleSubmit,
          watch,
          formState: { errors },
        } = useForm<AddCategorySchema>({
          resolver: zodResolver(addCategorySchema),
        });

      //store image uploaded by admin in array
      const fileList = watch("categoryImageFiles");

      //store the name of image file in a variable and display message if no file chosen
      const fileName = fileList?.[0]?.name ?? "No file Chosen";

      //submit handler for form submit event
      const onSubmit: SubmitHandler<AddCategorySchema> = async (data) => {
        const formData = new FormData();

        //append field values to formData to be sent to backend
        formData.append("categoryName", data.categoryName);
        formData.append("categoryDescription", data.categoryDescription);

        //iterate over the image files and add them to formData
        for(let i=0; i<data.categoryImageFiles.length; i++){
            formData.append("categoryImages", data.categoryImageFiles[i]);
        }

        try{
          setLoading(true);
          const token = await getToken();
          //api request to backend to post form and add category
           const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/categories`, {
            method: "POST",
            body: formData,
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
           //close add category modal when category added successfully
           onOpenChange(false);

           //store updated categories in context variable to immediately update categories list
           if(data.updatedCategories && data.updatedCategories.length){
            setUpdatedCategories(data.updatedCategories);
           }

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

    //display add category form  
    return open && (
        <div className="add-product-modal">
          <div className="add-product-container">
            <h3 className="text-lg font-semibold">Add Category</h3>
        <form 
         onSubmit={handleSubmit(onSubmit)}
         className="w-full h-full flex flex-col justify-start items-start p-8 overflow-y-auto bg-gray-50">
        
        <div className="add-product-form-element">
          <label htmlFor="categoryName" className="hover:cursor-pointer">Category Name</label>
          <input 
           type="text"
           id="categoryName"
           placeholder="Category Name"
           className="add-product-input" 
           {...register("categoryName")} 
           />
           <p className="text-red-500">{errors.categoryName?.message}</p>
        </div>

        <div className="add-product-form-element">
          <label htmlFor="categoryDescription" className="hover:cursor-pointer">Category Description</label>
          <textarea
          placeholder="Category Description"
          id="categoryDescription"
          className="w-full h-auto flex justify-start items-center p-2 border border-gray-300 rounded-md overflow-y-auto bg-white" 
          {...register("categoryDescription")} 
          />
          <p className="text-red-500">{errors.categoryDescription?.message}</p>
        </div>
        <div className="add-product-form-element">
          <label className="hover:cursor-pointer">Category Images</label>
          <input type= "file"
          id="categoryImage" 
          className="hidden"
          {...register("categoryImageFiles")} 
          />
          <label 
          htmlFor="categoryImage" 
          className="cursor-pointer flex bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded hover:bg-amber-600 transition">
            Choose file
          </label>
          <span className="text-sm text-gray-500">{fileName}</span>
          <p className="text-red-500">{errors.categoryImageFiles?.message as string}</p>
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

export default AddCategoryModal;
