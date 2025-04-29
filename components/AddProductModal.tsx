//add product modal component to display form to add new product (only accessed by admin)
"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";
import { useInfoContext } from "@/contexts/infoContext";
import { useAuth } from "@clerk/nextjs";
import { useUpdatedProductsContext } from "@/contexts/updatedProductsContext";

//define zod schema for add product form 
const addProductSchema = z.object({
    productName: z
                 .string()
                 .min(3, "Product name must be atleast 3 characters")
                 .max(20, "Product name must not be more than 20 characters"),
    productCategory: z
                     .string(),
    productDescription: z
                        .string()
                        .min(5, "Product description must be atleast 3 characters")
                        .max(100, "Product description must not be more than 100 characters"),
    productPrice: z
                  .coerce
                  .number()
                  .min(1, "Product price must be more than 0"),
    productStock: z
                  .coerce
                  .number()
                  .min(1, "Product stock must be atleast 1"),
    productImageFiles:  z
                        .any()
                        .refine((files) => files instanceof FileList && files.length > 0, {
                            message: 'File is required',
                        }),
});

//define schema type for zod schema
type AddProductSchema = z.infer<typeof addProductSchema>;

const AddProductModal = ({open, onOpenChange}: {open: boolean, onOpenChange: React.Dispatch<React.SetStateAction<boolean>>}) => {
      const {setError} = useErrorContext();
      const {setInfo} = useInfoContext();
      const [loading, setLoading] = useState<boolean>(false);
      const [categories, setCategories] = useState<Category[]>();
      const {getToken} = useAuth();
      const {updatedProducts, setUpdatedProducts} = useUpdatedProductsContext();

      //initialize react-hook-form with zod resolver
      const {
          register,
          handleSubmit,
          watch,
          formState: { errors },
        } = useForm<AddProductSchema>({
          resolver: zodResolver(addProductSchema),
        });

      //store images uploaded by admin in array
      const fileList = watch("productImageFiles");
      //store the names of image file in a string variable and display message if no file chosen
      const fileNames = fileList ? Array.from(fileList).map((file: any) => file.name).join(", ") : "No files chosen";

      useEffect(()=>{
          try{
            const fetchAllCategories = async ()=>{
                setLoading(true);
                //api to fetch all categories from backend
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
                  setCategories(data.categories);
                }
            };
            fetchAllCategories();
          }
          catch(err){
            console.log(err);
         }
         finally{
          setLoading(false);
        }
          
      }, []);

       //submit handler for form submit event
      const onSubmit: SubmitHandler<AddProductSchema> = async (data) => {
        const formData = new FormData();

        //append field values to formData to be sent to backend
        formData.append("productName", data.productName);
        formData.append("productCategory", data.productCategory);
        formData.append("productDescription", data.productDescription);
        formData.append("productPrice", String(data.productPrice));
        formData.append("productStock", String(data.productStock));

        //iterate over the image files and add them to formData
        for(let i=0; i<data.productImageFiles.length; i++){
            formData.append("productImages", data.productImageFiles[i]);
        }

        try{
          setLoading(true);
           const token = await getToken();
          //api request to backend to post form and add product
           const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products`, {
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
          //close add product modal when product added successfully
           onOpenChange(false);

           if(data.updatedProducts){
            setUpdatedProducts(data.updatedProducts);
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

    //display add product form  
    return open && (
        <div className="add-product-modal">
          <div className="add-product-container">
            <h3 className="text-lg font-semibold">Add Product</h3>
        <form 
         onSubmit={handleSubmit(onSubmit)}
         className="w-full h-full flex flex-col justify-start items-start p-8 overflow-y-auto bg-gray-50">
        
        <div className="add-product-form-element">
          <label htmlFor="productName" className="hover:cursor-pointer">Product Name</label>
          <input 
           type="text"
           id="productName"
           placeholder="Product Name"
           className="add-product-input" 
           {...register("productName")} 
           />
           <p className="text-red-500">{errors.productName?.message}</p>
        </div>

        <div className="add-product-form-element">
          <label htmlFor="productCategory" className="hover:cursor-pointer">Product Category</label>
          <select
           id="productCategory" 
           className="add-product-input"
           {...register("productCategory")}>
            {categories && categories.length && categories.map((category, index)=>(
              <option key={index} value={category.id}>{category.name}</option>
            ))}
          </select>
          <p className="text-red-500">{errors.productCategory?.message}</p>
        </div>
        <div className="add-product-form-element">
          <label htmlFor="productDescription" className="hover:cursor-pointer">Product Description</label>
          <textarea
          placeholder="Product Description"
          id="productDescription"
          className="w-full h-auto flex justify-start items-center p-2 border border-gray-300 rounded-md overflow-y-auto bg-white" 
          {...register("productDescription")} 
          />
          <p className="text-red-500">{errors.productDescription?.message}</p>
        </div>
        <div className="add-product-form-element">
          <label htmlFor="productPrice" className="hover:cursor-pointer">Product Price</label>
          <input 
           type="text" 
           id="productPrice"
           placeholder="Product Price"
           className="add-product-input"
           {...register("productPrice")} 
           />
           <p className="text-red-500">{errors.productPrice?.message}</p>
        </div>
        <div className="add-product-form-element">
          <label htmlFor="productStock" className="hover:cursor-pointer">Product Stock</label>
          <input 
           type="text" 
           id="productStock"
           placeholder="Product Stock"
           className="add-product-input"
           {...register("productStock")} 
           />
           <p className="text-red-500">{errors.productStock?.message}</p>
        </div>
        <div className="add-product-form-element">
          <label className="hover:cursor-pointer">Product Images</label>
          <input type= "file"
          id="productImages"
          multiple 
          className="hidden"
          {...register("productImageFiles")} 
          />
          <label 
          htmlFor="productImages" 
          className="cursor-pointer flex bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded hover:bg-amber-600 transition">
            Choose file
          </label>
          <span className="text-sm text-gray-500">{fileNames}</span>
          <p className="text-red-500">{errors.productImageFiles?.message as string}</p>
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

export default AddProductModal;
