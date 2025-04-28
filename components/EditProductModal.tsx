//edit product modal component to edit product details (only accessed by admins)
"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";
import { useInfoContext } from "@/contexts/infoContext";

interface EditProductModalProps{
  product: Product;
  openModal: boolean;
  onOpenModalChange: React.Dispatch<React.SetStateAction<boolean>>;
  openDropdown: boolean;
  onOpenDropdownChange: React.Dispatch<React.SetStateAction<boolean>>;
}

//define zod schema for edit product form 
const editProductSchema = z.object({
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
});

//define schema type for zod schema
type EditProductSchema = z.infer<typeof editProductSchema>;

const EditProductModal = ({product, openModal, onOpenModalChange, openDropdown, onOpenDropdownChange}: EditProductModalProps) => {
        const {setError} = useErrorContext();
        const {setInfo} = useInfoContext();
        const [loading, setLoading] = useState<boolean>(false);
        const [categories, setCategories] = useState<Category[]>();
    
        //initialize react-hook-form with zod resolver
        const {
            register,
            handleSubmit,
            watch,
            formState: { errors },
          } = useForm<EditProductSchema>({
            resolver: zodResolver(editProductSchema),
            defaultValues: {
                productName: product.name,
                productCategory: product.category.name,
                productDescription: product.description,
                productPrice: product.price,
                productStock: product.stock,
              },
          });
    
          //store images uploaded by admin in array
          const fileList = watch("productImageFiles");
          //store the image file names in a variable and display message if no file chosen
          const fileNames = fileList ? Array.from(fileList).map((file: any) => file.name).join(", ") : "No files chosen";
          useEffect(()=>{
                    try{
                      const fetchAllCategories = async ()=>{
                          setLoading(true);
                          //api request to fetch all categories from backend
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
                    catch(err: any){
                      console.log(err);
                      setError(err.message);
                   }
                   finally{
                    setLoading(false);
                  }
                    
                }, []);
    
          //submit handler for form submit event
          const onSubmit: SubmitHandler<EditProductSchema> = async (data) => {
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
              //api request to backend to post form and edit product
               const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${product.id}`, {
                method: "PUT",
                body: formData,
               });
    

               const data = await response.json();
               console.log(data.message);
    
               if(response.status !== 200){
                setError(data.message);
                return;
               }
               
               setInfo(data.message);
               //close edit product modal and product actions dropdown menu when product edited successfully
               onOpenModalChange(false);
               onOpenDropdownChange(false);
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
    
        //display edit product form  
        return (
                  <form 
                   onSubmit={handleSubmit(onSubmit)}
                   className="w-full h-[300px] flex flex-col justify-start items-start p-8 overflow-y-auto"
                   >
                  
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
                      Edit
                    </button>
                  </div>
                  </form>         
          )
}

export default EditProductModal;
