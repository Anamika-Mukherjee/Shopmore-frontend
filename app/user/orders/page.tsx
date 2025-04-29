//user page to view order history 
"use client";
import UserOrderCard from "@/components/UserOrderCard";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";

const OrdersPage = () => {
    const {user} = useUser();
    const {setError} = useErrorContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [orderDetails, setOrderDetails] = useState<Order[]>([]);

  useEffect(()=>{
      if(user && user.id){
        try{
           const fetchOrderDetails = async ()=>{
                setLoading(true);
               //api to get all orders associated with user from server
               const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getOrderDetails`, {
                      method: "POST",
                      body: JSON.stringify({
                          userClerkId: user.id,
                      }),
                      headers: {"Content-Type": "application/json"}
              });
              
              const data = await response.json();
              console.log(data.message);

              if(response.status !== 200){
                setError(data.message);
                return;
              }

              if(data.orderDetails){
                //store orders in array state
                setOrderDetails(data.orderDetails);
              }
           };
           fetchOrderDetails();
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

  //display list of orders
  return (user && orderDetails && orderDetails.length) ? (
    <div className="w-screen min-h-[670px] h-auto flex flex-col justify-start items-center p-8 space-y-6">
         <p className="text-lg font-semibold tracking-wider">Your Orders</p>
         
         <div className="w-4/5 min-h-[500px] h-auto flex flex-col justify-start items-start p-8 space-y-6 bg-amber-50 rounded-lg">
          {
            orderDetails.map((order, index)=>(
              <div 
                key={index}
                className="w-full h-auto flex flex-col justify-start items-start space-y-4 p-4 bg-white rounded-lg shadow-lg"
              >
                 <UserOrderCard order = {order}/>
              </div>
            ))
          }
         </div>

    </div>
  ):(
    <div className="w-screen min-h-[670px] h-auto flex flex-col justify-center items-center p-8 space-y-6">
      <p className="text-lg font-semibold tracking-wider">You don't have any orders yet</p>
    </div>
  )
}

export default OrdersPage;
