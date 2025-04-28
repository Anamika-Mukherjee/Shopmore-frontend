//component to show all orders details (only accessed by admins)
"use client";
import React, { useEffect, useState } from "react";
import {useAuth} from "@clerk/nextjs";
import OrderCard from "./OrderCard";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";

const AllOrders = () => {
    const {getToken} = useAuth();
    const [allOrders, setAllOrders] = useState<Order[]>();
    const {setError} = useErrorContext();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=>{
      const fetchOrders = async ()=>{
        setLoading(true);
        //fetch session token from clerk to be sent with api request to protected route
        const token = await getToken();
        try{
            //api request to fetch all orders information from database (send token with request to access protected route)
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
                //store order details in a state variable
                setAllOrders(data.orders);
            }
        }
        catch(err){
         console.log(err);
        }
        finally{
          setLoading(false);
        }
      };
      fetchOrders();
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

  //display all orders information  
  return (allOrders && allOrders.length) &&(
    <div className="w-full lg:w-3/5 h-full flex flex-col justify-start items-start bg-gray-200 rounded-md space-y-6 p-8">
      {allOrders.map((order, index)=>(
        <div 
        key={index}
        className="w-full h-auto flex flex-col justify-center items-start"
        >
           <OrderCard order={order} />
        </div> 
      ))}
    </div>
  )
}

export default AllOrders;
