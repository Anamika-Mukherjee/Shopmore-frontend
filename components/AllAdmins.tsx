//component to show admin details (only accessed by admins)
"use client";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import AdminCard from "./AdminCard";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorContext } from "@/contexts/errorContext";

const AllAdmins = () => {
  const {getToken} = useAuth();
      const [allAdmins, setAllAdmins] = useState<Admin[]>();
      const {setError} = useErrorContext();
      const [loading, setLoading] = useState<boolean>(false);
  
      useEffect(()=>{
        const fetchOrders = async ()=>{
          
          try{
              setLoading(true);
              const token = await getToken();
              //api request to fetch all admin information from database
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/getAllAdmins`, {
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
              
              if(data.allAdmins && data.allAdmins.length){
                //store admin details in a state variable
                setAllAdmins(data.allAdmins);
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

      //display all admins information 
      return (allAdmins && allAdmins.length) &&(
        <div className="w-full lg:w-3/5 h-full flex flex-col justify-start items-start bg-gray-200 rounded-md space-y-6 p-8">
          {allAdmins.map((admin, index)=>(
            <div 
            key={index}
            className="w-full h-auto flex flex-col justify-center items-start"
            >
               <AdminCard admin={admin} />
            </div> 
          ))}
        </div>
      )
}

export default AllAdmins;
