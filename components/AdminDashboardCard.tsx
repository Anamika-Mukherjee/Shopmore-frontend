//card component to show product, category and order summary in admin dashboard (only accessed by admin)
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";

const AdminDashboardCard = ({type, pageLink}: {type: string, pageLink: string}) => {
   const {getToken} = useAuth();
   const {user} = useUser();
   const {setError} = useErrorContext();
   const [loading, setLoading] = useState<boolean>(false);
   const [quantity, setQuantity] = useState<number>(0);
   const [allProducts, setAllProducts] = useState<Product[]>([]);
   const [allCategories, setAllCategories] = useState<Category[]>([]);
   const [allOrders, setAllOrders] = useState<Order[]>([]);
   
   useEffect(()=>{
        if(user && user.id && user.publicMetadata.role === "ADMIN"){
         try{
            //condition to check if card type is "products"
            if(type === "Products"){
               const fetchAllProducts = async ()=>{
                setLoading(true);
                 //api to fetch all products details from backend
                 const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
                     method: "GET",
                     headers: {"Content-Type": "application/json"}
                 });
                 
                 const data = await response.json();
                 console.log(data.message);

                 if(response.status !== 200){
                   setError(data.message);
                   return;
                 }
                 
                if(data.products && data.products.length){
                    //store product details and product quantity in state variable
                    setAllProducts(data.products);
                    setQuantity(data.products.length);
                }
               }
               fetchAllProducts();
            }
            //check if card type is "categories"
            else if(type === "Categories"){
              const fetchAllCategories = async ()=>{
                setLoading(true);
                //api to fetch all categories details from backend
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
                   //store category details and category quantity in state variable
                   setAllCategories(data.categories);
                   setQuantity(data.categories.length);
               }
              }
              fetchAllCategories();
            }
            //check if card type is "orders"
            else if(type === "Orders"){
              const fetchAllOrders = async ()=>{
                setLoading(true);
                //fetch token from clerk to be sent with api request to protected route
                const token = await getToken();

                //api to fetch all order details from backend (send authorization token to access protected route)
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/orders`, {
                    method: "GET",
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
                
               if(data.orders && data.orders.length){
                   //store order details and order quantity in state variable
                   setAllOrders(data.orders);
                   setQuantity(data.orders.length);
               }
              }
              fetchAllOrders();
            }
         }
         catch(err){
           console.log(err);
         }
         finally{
          setLoading(false);
        }
        }
     }, [user]);

    //show loading message if data is not loaded
    if(loading){
        return (
          <div className="w-full h-screen flex flex-col justify-center items-center p-4">
            <p className="text-lg tracking-wider">Loading...</p>
            <CircularProgress />
          </div>
        )
    }
     

  //display card  
  return (
    <div className="admin-dashboard-card">
        <h2 className="text-(--brand-secondary-dark) text-2xl font-bold capitalize">{type}</h2>
        <div className="w-full h-full flex justify-center items-center">
            <p className="text-lg font-semibold text-indigo-900 tracking-wide">Total <span className="capitalize ml-1">{type}:</span></p>
            <span className="ml-2 text-lg font-semibold text-indigo-900 tracking-wide">{quantity}</span>
         </div>  
      
      <Link 
      href={`/admin/${pageLink}`}   
      className="w-auto min-w-[150px] h-auto min-h-[40px] flex flex-col justify-center items-center text-white tracking-wider p-4 bg-(--brand-secondary) rounded-md hover:bg-(--brand-secondary-dark) hover:cursor-pointer">
        View 
        <span>{type}</span>
      </Link>
    </div>
  )
}

export default AdminDashboardCard;
